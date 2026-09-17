export type ApiSuccess<T> = {
  success: true;
  statusCode: number;
  message: string;
  data: T;
};

export type ApiFailure = {
  success: false;
  statusCode: number;
  message: string;
  errors?: unknown[];
};

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};
