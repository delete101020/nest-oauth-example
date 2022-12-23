export interface PaginateResponseInput<T> {
  page: number;
  limit: number;
  count: number;
  data: T[];
}

export interface PaginateResponse<T> {
  page: number;
  limit: number;
  totalRow: number;
  totalPage: number;
  data: T[];
}

export function paginateResponse<T>(
  input: PaginateResponseInput<T>,
): PaginateResponse<T> {
  const { page, limit, count, data } = input;

  return {
    page,
    limit,
    totalRow: count,
    totalPage: Math.ceil(count / limit),
    data,
  };
}
