export interface Category {
  id: number;
  name: string;
  color: string;
  icon: string;
  created_at: string;
  expense_count?: number;
  total_spent?: string | null;
}

export interface Expense {
  id: number;
  description: string;
  amount: string;
  category: number | null;
  category_detail: Category | null;
  date: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface ExpenseFormData {
  description: string;
  amount: string;
  category: number | null;
  date: string;
  notes: string;
}

export interface CategoryFormData {
  name: string;
  color: string;
  icon: string;
}

export interface Summary {
  total: string;
  count: number;
  by_category: {
    category__id: number;
    category__name: string;
    category__color: string;
    total: string;
    count: number;
  }[];
  by_month: {
    month: string;
    total: string;
    count: number;
  }[];
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
