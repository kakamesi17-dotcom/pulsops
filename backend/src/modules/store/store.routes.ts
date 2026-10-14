import { Router } from 'express';
import { authenticate, authorize, tenantGuard } from '../../middleware/auth.middleware';
import { UserRole } from '@prisma/client';
import prisma from '../../config/database';
import { upload, uploadToCloudinary } from '../../config/cloudinary';
import { sendSuccess, sendCreated, sendNoContent, paginate } from '../../shared/utils/response';
import { NotFoundError } from '../../shared/errors/AppError';

const router = Router({ mergeParams: true });
const gymAdminOrSuper = [authenticate, authorize(UserRole.SUPER_ADMIN, UserRole.GYM_ADMIN), tenantGuard];
const authenticated = [authenticate, tenantGuard];

// GET /api/gyms/:gymId/store/products
router.get('/products', ...authenticated, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const category = req.query.category as string | undefined;

    const where: any = { gymId, isActive: true };
    if (category) where.category = category;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where, skip: (page - 1) * limit, take: limit,
        orderBy: { createdAt: 'desc' },
        include: { images: { orderBy: { order: 'asc' } } },
      }),
      prisma.product.count({ where }),
    ]);
    sendSuccess(res, products, undefined, 200, paginate(page, limit, total));
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/store/products
router.post('/products', ...gymAdminOrSuper,
  upload.fields([{ name: 'images', maxCount: 2 }]),
  async (req, res, next) => {
    try {
      const { gymId } = req.params;
      const imageFiles = (req.files as Record<string, Express.Multer.File[]>)?.images || [];

      const product = await prisma.product.create({
        data: { gymId, ...req.body, price: parseFloat(req.body.price), salePrice: req.body.salePrice ? parseFloat(req.body.salePrice) : null, stock: parseInt(req.body.stock) || 0 },
      });

      // Upload images
      for (let i = 0; i < imageFiles.length; i++) {
        const { url } = await uploadToCloudinary(imageFiles[i].buffer, `gyms/${gymId}/products`);
        await prisma.productImage.create({ data: { productId: product.id, url, order: i } });
      }

      const full = await prisma.product.findUnique({ where: { id: product.id }, include: { images: true } });
      sendCreated(res, full, 'Product created');
    } catch (err) { next(err); }
  }
);

// PATCH /api/gyms/:gymId/store/products/:productId
router.patch('/products/:productId', ...gymAdminOrSuper,
  upload.fields([{ name: 'images', maxCount: 2 }]),
  async (req, res, next) => {
    try {
      const { gymId, productId } = req.params;
      const imageFiles = (req.files as Record<string, Express.Multer.File[]>)?.images || [];
      const product = await prisma.product.update({
        where: { id: productId },
        data: { ...req.body, price: req.body.price ? parseFloat(req.body.price) : undefined },
      });

      if (imageFiles.length > 0) {
        await prisma.productImage.deleteMany({ where: { productId } });
        for (let i = 0; i < imageFiles.length; i++) {
          const { url } = await uploadToCloudinary(imageFiles[i].buffer, `gyms/${gymId}/products`, productId);
          await prisma.productImage.create({ data: { productId, url, order: i } });
        }
      }
      sendSuccess(res, product, 'Product updated');
    } catch (err) { next(err); }
  }
);

// DELETE /api/gyms/:gymId/store/products/:productId
router.delete('/products/:productId', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    await prisma.product.update({ where: { id: req.params.productId }, data: { isActive: false } });
    sendNoContent(res);
  } catch (err) { next(err); }
});

// ── Cart ──────────────────────────────────────────────────────────────────────

// GET /api/gyms/:gymId/store/cart
router.get('/cart', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const items = await prisma.cartItem.findMany({
      where: { userId: req.user!.userId },
      include: { product: { include: { images: { take: 1 } } } },
    });
    sendSuccess(res, items);
  } catch (err) { next(err); }
});

// POST /api/gyms/:gymId/store/cart
router.post('/cart', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    const item = await prisma.cartItem.upsert({
      where: { userId_productId: { userId: req.user!.userId, productId } },
      create: { userId: req.user!.userId, productId, quantity: quantity || 1 },
      update: { quantity },
    });
    sendSuccess(res, item);
  } catch (err) { next(err); }
});

// DELETE /api/gyms/:gymId/store/cart/:productId
router.delete('/cart/:productId', authenticate, tenantGuard, async (req, res, next) => {
  try {
    await prisma.cartItem.deleteMany({
      where: { userId: req.user!.userId, productId: req.params.productId },
    });
    sendNoContent(res);
  } catch (err) { next(err); }
});

// ── Orders ────────────────────────────────────────────────────────────────────

// POST /api/gyms/:gymId/store/checkout
router.post('/checkout', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const { gymId } = req.params;
    const userId = req.user!.userId;

    const cartItems = await prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });
    if (cartItems.length === 0) throw new NotFoundError('Cart items');

    const total = cartItems.reduce((sum, item) => {
      const price = item.product.salePrice ?? item.product.price;
      return sum + Number(price) * item.quantity;
    }, 0);

    const order = await prisma.$transaction(async (tx) => {
      const o = await tx.order.create({
        data: {
          gymId, userId, totalAmount: total,
          deliveryAddr: req.body.deliveryAddr,
          notes: req.body.notes,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              unitPrice: item.product.salePrice ?? item.product.price,
            })),
          },
        },
        include: { items: { include: { product: { include: { images: { take: 1 } } } } } },
      });
      // Clear cart
      await tx.cartItem.deleteMany({ where: { userId } });
      return o;
    });

    sendCreated(res, order, 'Order placed successfully');
  } catch (err) { next(err); }
});

// GET /api/gyms/:gymId/store/orders
router.get('/orders', authenticate, tenantGuard, async (req, res, next) => {
  try {
    const user = req.user!;
    const where: any = { gymId: req.params.gymId };
    if (user.role === UserRole.MEMBER) where.userId = user.userId;
    const orders = await prisma.order.findMany({
      where, orderBy: { placedAt: 'desc' },
      include: { items: { include: { product: { include: { images: { take: 1 } } } } }, user: { select: { firstName: true, lastName: true } } },
    });
    sendSuccess(res, orders);
  } catch (err) { next(err); }
});

// PATCH /api/gyms/:gymId/store/orders/:orderId/status
router.patch('/orders/:orderId/status', ...gymAdminOrSuper, async (req, res, next) => {
  try {
    const order = await prisma.order.update({
      where: { id: req.params.orderId },
      data: { status: req.body.status },
    });
    sendSuccess(res, order, 'Order status updated');
  } catch (err) { next(err); }
});

export default router;
