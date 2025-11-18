export interface User {
  id: number;
  name: string;
  email: string;
  age: number | null;
  role: string;
  status: string;
  deleted_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  age?: number;
  role: string;
  status?: string;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  age?: number;
  role?: string;
  status?: string;
}

export interface UserFilters {
  role?: string;
  status?: string;
  minAge?: number;
  maxAge?: number;
  includeDeleted?: boolean;
  sortBy?:
    | "id"
    | "name"
    | "email"
    | "age"
    | "role"
    | "created_at"
    | "updated_at";
  sortOrder?: "ASC" | "DESC";
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
  filters?: Partial<UserFilters>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
