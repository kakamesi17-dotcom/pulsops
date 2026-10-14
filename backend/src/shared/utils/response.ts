import { Response } from 'express';

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  meta?: ApiResponse<T>['meta']
): Response => {
  const response: ApiResponse<T> = { success: true };
  if (message) response.message = message;
  if (data !== undefined && data !== null) response.data = data;
  if (meta) response.meta = meta;
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, data: T, message?: string): Response =>
  sendSuccess(res, data, message, 201);

export const sendNoContent = (res: Response): Response => res.status(204).send();

export const paginate = (page: number, limit: number, total: number) => ({
  page,
  limit,
  total,
  totalPages: Math.ceil(total / limit),
});
