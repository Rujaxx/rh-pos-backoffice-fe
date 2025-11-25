// Image Library type definitions

export interface ImageLibraryItem {
  _id: string;
  code: string;
  dishName: Record<string, string>; // { en: string, ar?: string }
  url: string;
  tags?: string[];
}

export interface Paginated<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
