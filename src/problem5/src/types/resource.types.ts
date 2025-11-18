export interface Resource {
  id: number;
  name: string;
  description: string;
  quantity: number;
  price: number;
  category: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateResourceDTO {
  name: string;
  description?: string;
  quantity: number;
  price: number;
  category: string;
}

export interface UpdateResourceDTO {
  name?: string;
  description?: string;
  quantity?: number;
  price?: number;
  category?: string;
}

export interface ResourceFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
