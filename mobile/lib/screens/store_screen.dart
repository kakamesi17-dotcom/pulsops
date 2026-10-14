import 'package:flutter/material.dart';
import '../core/constants/colors.dart';

class StoreScreen extends StatefulWidget {
  const StoreScreen({super.key});

  @override
  State<StoreScreen> createState() => _StoreScreenState();
}

class _StoreScreenState extends State<StoreScreen> {
  final Map<String, int> cart = {};

  final List<Map<String, dynamic>> products = const [
    {
      'id': 'p-1',
      'name': 'أوبتيموم جولد واي بروتين 5 باوند',
      'cat': 'بروتين نقي',
      'price': 3950,
      'image': 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=400&auto=format&fit=crop&q=80',
      'desc': 'بروتين مصل اللبن عالي النقاء 24g بروتين لكل سكوب لدعم الضخامة والاستشفاء',
    },
    {
      'id': 'p-2',
      'name': 'كرياتين ميكرونايزد نقي 500 جرام',
      'cat': 'قوة واستشفاء',
      'price': 1750,
      'image': 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=400&auto=format&fit=crop&q=80',
      'desc': 'كرياتين أحادي الهيدرات نقي 100% لزيادة القوة الانفجارية وحجم الخلايا العضلية',
    },
    {
      'id': 'p-3',
      'name': 'طاقة وتمرين C4 بنكهة الفواكه',
      'cat': 'طاقة وبومب',
      'price': 2250,
      'image': 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?w=400&auto=format&fit=crop&q=80',
      'desc': 'مشروب طاقة قبل التمرين يمنح تركيزاً حاداً وضخ دم عضلي مكثف بدون هبوط',
    },
    {
      'id': 'p-4',
      'name': 'أحزمة رفع أثقال تيتان الأصلية',
      'cat': 'مستلزمات رياضية',
      'price': 900,
      'image': 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=400&auto=format&fit=crop&q=80',
      'desc': 'حزام جلد طبيعي سميك 10mm لدعم أسفل الظهر في تمارين السكوات والديدلفت الثقيلة',
    },
  ];

  int get cartCount => cart.values.fold(0, (sum, qty) => sum + qty);

  int get cartTotal => products.fold(0, (sum, p) {
        final qty = cart[p['id']] ?? 0;
        return sum + (p['price'] as int) * qty;
      });

  void _addToCart(String id) {
    setState(() {
      cart[id] = (cart[id] ?? 0) + 1;
    });
  }

  void _removeFromCart(String id) {
    if (!cart.containsKey(id)) return;
    setState(() {
      if (cart[id]! > 1) {
        cart[id] = cart[id]! - 1;
      } else {
        cart.remove(id);
      }
    });
  }

  void _showCheckoutDialog() {
    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surfaceDark,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        return Padding(
          padding: EdgeInsets.only(
            left: 20,
            right: 20,
            top: 20,
            bottom: MediaQuery.of(ctx).viewInsets.bottom + 20,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'سلة المشتريات وإتمام الطلب',
                    style: TextStyle(color: AppColors.textWhite, fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(ctx),
                    icon: const Icon(Icons.close, color: AppColors.textMuted),
                  ),
                ],
              ),
              const Divider(color: AppColors.cardBorder),
              const SizedBox(height: 10),

              // Cart Items
              ...products.where((p) => (cart[p['id']] ?? 0) > 0).map((p) {
                final qty = cart[p['id']]!;
                return Padding(
                  padding: const EdgeInsets.only(bottom: 10),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(p['name'], style: const TextStyle(color: AppColors.textWhite, fontSize: 12, fontWeight: FontWeight.bold)),
                          Text('${p['price']} ج.م × $qty', style: const TextStyle(color: AppColors.neonGreen, fontSize: 11, fontFamily: 'monospace')),
                        ],
                      ),
                      Row(
                        children: [
                          IconButton(
                            onPressed: () {
                              _removeFromCart(p['id']);
                              Navigator.pop(ctx);
                              if (cartCount > 0) _showCheckoutDialog();
                            },
                            icon: const Icon(Icons.remove_circle_outline, color: AppColors.textMuted, size: 20),
                          ),
                          Text('$qty', style: const TextStyle(color: AppColors.textWhite, fontWeight: FontWeight.bold, fontFamily: 'monospace')),
                          IconButton(
                            onPressed: () {
                              _addToCart(p['id']);
                              Navigator.pop(ctx);
                              _showCheckoutDialog();
                            },
                            icon: const Icon(Icons.add_circle, color: AppColors.neonGreen, size: 20),
                          ),
                        ],
                      ),
                    ],
                  ),
                );
              }),

              const SizedBox(height: 10),
              const Divider(color: AppColors.cardBorder),
              const SizedBox(height: 8),

              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text('الإجمالي المستحق:', style: TextStyle(color: AppColors.textWhite, fontSize: 14, fontWeight: FontWeight.bold)),
                  Text(
                    '${cartTotal.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} ج.م',
                    style: const TextStyle(color: AppColors.neonGreen, fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  onPressed: () {
                    Navigator.pop(ctx);
                    setState(() => cart.clear());
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        backgroundColor: AppColors.cardDark,
                        content: Text(
                          '🎉 تم استلام طلبك بنجاح! يمكنك استلام المكملات من ريسبشن النادي فوراً مع إضافة 200 نقطة ولاء لحسابك.',
                          style: TextStyle(color: AppColors.neonGreen, fontWeight: FontWeight.bold),
                        ),
                      ),
                    );
                  },
                  icon: const Icon(Icons.check_circle_outline, size: 18),
                  label: const Text('تأكيد الطلب والاستلام من ريسبشن الصالة', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.neonGreen,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.pitchBlack,
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        title: const Text(
          'متجر نادي PulsOps للمكملات',
          style: TextStyle(
            color: AppColors.textWhite,
            fontWeight: FontWeight.bold,
            fontSize: 18,
          ),
        ),
        centerTitle: true,
        actions: [
          if (cartCount > 0)
            Padding(
              padding: const EdgeInsets.only(left: 12.0),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  IconButton(
                    onPressed: _showCheckoutDialog,
                    icon: const Icon(Icons.shopping_cart_outlined, color: AppColors.neonGreen),
                  ),
                  Positioned(
                    top: 8,
                    right: 8,
                    child: Container(
                      padding: const EdgeInsets.all(4),
                      decoration: const BoxDecoration(
                        color: AppColors.neonGreen,
                        shape: BoxShape.circle,
                      ),
                      child: Text(
                        '$cartCount',
                        style: const TextStyle(color: Colors.black, fontSize: 10, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                      ),
                    ),
                  ),
                ],
              ),
            ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
        itemCount: products.length,
        itemBuilder: (context, idx) {
          final p = products[idx];
          final int qty = cart[p['id']] ?? 0;

          return Container(
            margin: const EdgeInsets.only(bottom: 14),
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: AppColors.cardDark,
              borderRadius: BorderRadius.circular(18),
              border: Border.all(color: qty > 0 ? AppColors.neonGreen.withOpacity(0.4) : AppColors.cardBorder),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Product Thumbnail
                ClipRRect(
                  borderRadius: BorderRadius.circular(12),
                  child: Container(
                    width: 75,
                    height: 75,
                    color: AppColors.surfaceDark,
                    child: Image.network(
                      p['image'],
                      fit: BoxFit.cover,
                      errorBuilder: (context, error, stackTrace) => const Icon(Icons.fitness_center, color: AppColors.neonGreen),
                    ),
                  ),
                ),

                const SizedBox(width: 14),

                // Details
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 2),
                        decoration: BoxDecoration(
                          color: AppColors.neonGreen.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Text(
                          p['cat'],
                          style: const TextStyle(color: AppColors.neonGreen, fontSize: 9, fontWeight: FontWeight.bold),
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        p['name'],
                        style: const TextStyle(color: AppColors.textWhite, fontSize: 13, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        p['desc'],
                        style: const TextStyle(color: AppColors.textMuted, fontSize: 10, height: 1.3),
                        maxLines: 2,
                        overflow: TextOverflow.ellipsis,
                      ),
                      const SizedBox(height: 8),

                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            '${p['price']} ج.م',
                            style: const TextStyle(
                              color: AppColors.textWhite,
                              fontSize: 14,
                              fontWeight: FontWeight.bold,
                              fontFamily: 'monospace',
                            ),
                          ),

                          qty > 0
                              ? Row(
                                  children: [
                                    InkWell(
                                      onTap: () => _removeFromCart(p['id']),
                                      child: const Icon(Icons.remove_circle, color: AppColors.textMuted, size: 22),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 8),
                                      child: Text(
                                        '$qty',
                                        style: const TextStyle(color: AppColors.neonGreen, fontWeight: FontWeight.bold, fontFamily: 'monospace'),
                                      ),
                                    ),
                                    InkWell(
                                      onTap: () => _addToCart(p['id']),
                                      child: const Icon(Icons.add_circle, color: AppColors.neonGreen, size: 22),
                                    ),
                                  ],
                                )
                              : ElevatedButton.icon(
                                  onPressed: () => _addToCart(p['id']),
                                  icon: const Icon(Icons.add_shopping_cart, size: 14),
                                  label: const Text('إضافة للسلة', style: TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                                  style: ElevatedButton.styleFrom(
                                    backgroundColor: AppColors.neonGreen,
                                    foregroundColor: Colors.black,
                                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                                    elevation: 0,
                                  ),
                                ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        },
      ),
      bottomNavigationBar: cartCount > 0
          ? Container(
              padding: const EdgeInsets.all(16),
              decoration: const BoxDecoration(
                color: AppColors.surfaceDark,
                border: Border(top: BorderSide(color: AppColors.cardBorder)),
              ),
              child: SafeArea(
                child: ElevatedButton(
                  onPressed: _showCheckoutDialog,
                  style: ElevatedButton.styleFrom(
                    backgroundColor: AppColors.neonGreen,
                    foregroundColor: Colors.black,
                    padding: const EdgeInsets.symmetric(vertical: 14),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        'إتمام الطلب ($cartCount منتجات)',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                      ),
                      Text(
                        '${cartTotal.toString().replaceAllMapped(RegExp(r'(\d{1,3})(?=(\d{3})+(?!\d))'), (m) => '${m[1]},')} ج.م',
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 14, fontFamily: 'monospace'),
                      ),
                    ],
                  ),
                ),
              ),
            )
          : null,
    );
  }
}
