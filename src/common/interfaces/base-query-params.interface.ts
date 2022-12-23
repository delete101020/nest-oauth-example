export interface BaseQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  sort?: {
    [key: string]: 'asc' | 'desc' | 'ascending' | 'descending' | 1 | -1;
  };
}
