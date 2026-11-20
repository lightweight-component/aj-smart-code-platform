export interface TableListConfig {
  columns: unknown[];
  data: unknown[];
  total: number;
  start: number;
  limit: number;
  pageNo: number;
  pageSize: number;
  loading: boolean;
  search: Record<string, string>;
}
