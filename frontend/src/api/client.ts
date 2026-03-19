import axios from "axios";
import type {
  Category,
  CategoryFormData,
  Expense,
  ExpenseFormData,
  PaginatedResponse,
  Summary,
} from "@/types";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ── Categories ────────────────────────────────────────────────
export const getCategories = () =>
  api.get<PaginatedResponse<Category>>("/categories/").then((r) => r.data);

export const createCategory = (data: CategoryFormData) =>
  api.post<Category>("/categories/", data).then((r) => r.data);

export const updateCategory = (id: number, data: Partial<CategoryFormData>) =>
  api.patch<Category>(`/categories/${id}/`, data).then((r) => r.data);

export const deleteCategory = (id: number) =>
  api.delete(`/categories/${id}/`).then((r) => r.data);

// ── Expenses ──────────────────────────────────────────────────
export interface ExpenseFilters {
  category?: number;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
}

export const getExpenses = (filters: ExpenseFilters = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
  return api
    .get<PaginatedResponse<Expense>>("/expenses/", { params })
    .then((r) => r.data);
};

export const createExpense = (data: ExpenseFormData) =>
  api.post<Expense>("/expenses/", data).then((r) => r.data);

export const updateExpense = (id: number, data: Partial<ExpenseFormData>) =>
  api.patch<Expense>(`/expenses/${id}/`, data).then((r) => r.data);

export const deleteExpense = (id: number) =>
  api.delete(`/expenses/${id}/`).then((r) => r.data);

// ── Summary ───────────────────────────────────────────────────
export const getSummary = (filters: Omit<ExpenseFilters, "page"> = {}) => {
  const params = Object.fromEntries(
    Object.entries(filters).filter(([, v]) => v !== undefined && v !== "")
  );
  return api.get<Summary>("/expenses/summary/", { params }).then((r) => r.data);
};
