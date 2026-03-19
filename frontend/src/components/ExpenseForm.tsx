import { useState, useEffect } from "react";
import type { Category, Expense, ExpenseFormData } from "@/types";

interface Props {
  categories: Category[];
  initial?: Expense;
  onSubmit: (data: ExpenseFormData) => Promise<void>;
  onCancel: () => void;
}

const today = () => new Date().toISOString().split("T")[0];

export default function ExpenseForm({ categories, initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<ExpenseFormData>({
    description: initial?.description ?? "",
    amount: initial?.amount ?? "",
    category: initial?.category ?? null,
    date: initial?.date ?? today(),
    notes: initial?.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (initial) {
      setForm({
        description: initial.description,
        amount: initial.amount,
        category: initial.category,
        date: initial.date,
        notes: initial.notes,
      });
    }
  }, [initial]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "category" ? (value === "" ? null : Number(value)) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch {
      setError("Failed to save expense. Please check your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>{initial ? "Edit Expense" : "New Expense"}</h2>

      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>
        Description *
        <input
          style={styles.input}
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          placeholder="e.g. Grocery shopping"
        />
      </label>

      <label style={styles.label}>
        Amount (KES) *
        <input
          style={styles.input}
          name="amount"
          type="number"
          step="0.01"
          min="0.01"
          value={form.amount}
          onChange={handleChange}
          required
          placeholder="0.00"
        />
      </label>

      <label style={styles.label}>
        Date *
        <input
          style={styles.input}
          name="date"
          type="date"
          value={form.date}
          onChange={handleChange}
          required
        />
      </label>

      <label style={styles.label}>
        Category
        <select style={styles.input} name="category" value={form.category ?? ""} onChange={handleChange}>
          <option value="">— Uncategorized —</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </label>

      <label style={styles.label}>
        Notes
        <textarea
          style={{ ...styles.input, height: 80, resize: "vertical" }}
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Optional notes…"
        />
      </label>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={loading}>
          Cancel
        </button>
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Saving…" : initial ? "Update" : "Add Expense"}
        </button>
      </div>
    </form>
  );
}

const styles: Record<string, React.CSSProperties> = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 14,
    padding: 24,
    background: "#1e1e2e",
    borderRadius: 12,
    minWidth: 340,
  },
  title: { margin: 0, fontSize: 18, fontWeight: 600, color: "#cdd6f4" },
  label: { display: "flex", flexDirection: "column", gap: 4, fontSize: 13, color: "#a6adc8" },
  input: {
    marginTop: 4,
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #313244",
    background: "#181825",
    color: "#cdd6f4",
    fontSize: 14,
    outline: "none",
  },
  error: { color: "#f38ba8", fontSize: 13, margin: 0 },
  actions: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 4 },
  cancelBtn: {
    padding: "8px 16px",
    borderRadius: 8,
    border: "1px solid #313244",
    background: "transparent",
    color: "#a6adc8",
    cursor: "pointer",
    fontSize: 14,
  },
  submitBtn: {
    padding: "8px 20px",
    borderRadius: 8,
    border: "none",
    background: "#89b4fa",
    color: "#1e1e2e",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
};
