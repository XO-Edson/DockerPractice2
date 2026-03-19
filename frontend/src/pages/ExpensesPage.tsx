import { useEffect, useState, useCallback } from "react";
import {
  getExpenses,
  getCategories,
  createExpense,
  updateExpense,
  deleteExpense,
} from "@/api/client";
import type { Category, Expense, ExpenseFormData } from "@/types";
import ExpenseForm from "@/components/ExpenseForm";
import Modal from "@/components/Modal";

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterFrom, setFilterFrom] = useState("");
  const [filterTo, setFilterTo] = useState("");
  const [search, setSearch] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Expense | undefined>();

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getExpenses({
        category: filterCategory ? Number(filterCategory) : undefined,
        date_from: filterFrom || undefined,
        date_to: filterTo || undefined,
        search: search || undefined,
        page,
      });
      setExpenses(data.results);
      setTotal(data.count);
      setHasNext(!!data.next);
    } finally {
      setLoading(false);
    }
  }, [filterCategory, filterFrom, filterTo, search, page]);

  useEffect(() => { loadExpenses(); }, [loadExpenses]);
  useEffect(() => { getCategories().then((d) => setCategories(d.results)); }, []);

  const openAdd = () => { setEditing(undefined); setModalOpen(true); };
  const openEdit = (e: Expense) => { setEditing(e); setModalOpen(true); };
  const closeModal = () => setModalOpen(false);

  const handleSubmit = async (data: ExpenseFormData) => {
    if (editing) await updateExpense(editing.id, data);
    else await createExpense(data);
    setModalOpen(false);
    loadExpenses();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this expense?")) return;
    await deleteExpense(id);
    loadExpenses();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Expenses</h1>
        <button style={styles.addBtn} onClick={openAdd}>+ Add Expense</button>
      </div>

      {/* ── Filters ── */}
      <div style={styles.filters}>
        <input
          style={styles.filterInput}
          placeholder="Search…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
        <select
          style={styles.filterInput}
          value={filterCategory}
          onChange={(e) => { setFilterCategory(e.target.value); setPage(1); }}
        >
          <option value="">All categories</option>
          {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input
          style={styles.filterInput}
          type="date"
          value={filterFrom}
          onChange={(e) => { setFilterFrom(e.target.value); setPage(1); }}
        />
        <input
          style={styles.filterInput}
          type="date"
          value={filterTo}
          onChange={(e) => { setFilterTo(e.target.value); setPage(1); }}
        />
      </div>

      <p style={styles.meta}>{total} expense{total !== 1 ? "s" : ""}</p>

      {/* ── Table ── */}
      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : expenses.length === 0 ? (
        <p style={styles.muted}>No expenses found.</p>
      ) : (
        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                {["Date", "Description", "Category", "Amount", ""].map((h) => (
                  <th key={h} style={styles.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr key={exp.id} style={styles.tr}>
                  <td style={styles.td}>{exp.date}</td>
                  <td style={styles.td}>
                    <div style={{ fontWeight: 500, color: "#cdd6f4" }}>{exp.description}</div>
                    {exp.notes && <div style={{ fontSize: 12, color: "#6c7086" }}>{exp.notes}</div>}
                  </td>
                  <td style={styles.td}>
                    {exp.category_detail ? (
                      <span style={{ ...styles.badge, background: exp.category_detail.color + "22", color: exp.category_detail.color }}>
                        {exp.category_detail.name}
                      </span>
                    ) : (
                      <span style={styles.nocat}>—</span>
                    )}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right", fontWeight: 600, color: "#f38ba8" }}>
                    KES {Number(exp.amount).toLocaleString()}
                  </td>
                  <td style={{ ...styles.td, textAlign: "right" }}>
                    <button style={styles.editBtn} onClick={() => openEdit(exp)}>Edit</button>
                    <button style={styles.delBtn} onClick={() => handleDelete(exp.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Pagination ── */}
      <div style={styles.pagination}>
        <button style={styles.pageBtn} disabled={page === 1} onClick={() => setPage((p) => p - 1)}>← Prev</button>
        <span style={styles.muted}>Page {page}</span>
        <button style={styles.pageBtn} disabled={!hasNext} onClick={() => setPage((p) => p + 1)}>Next →</button>
      </div>

      <Modal open={modalOpen} onClose={closeModal}>
        <ExpenseForm
          categories={categories}
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "28px 32px", maxWidth: 960, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 },
  heading: { margin: 0, fontSize: 24, fontWeight: 700, color: "#cdd6f4" },
  addBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#89b4fa", color: "#1e1e2e", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  filters: { display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 14 },
  filterInput: { padding: "7px 10px", borderRadius: 8, border: "1px solid #313244", background: "#1e1e2e", color: "#cdd6f4", fontSize: 13, outline: "none" },
  meta: { fontSize: 13, color: "#6c7086", margin: "0 0 12px" },
  muted: { color: "#6c7086", fontSize: 14 },
  tableWrap: { overflowX: "auto", borderRadius: 12, border: "1px solid #313244" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { padding: "10px 14px", textAlign: "left", fontSize: 12, color: "#6c7086", background: "#181825", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" },
  tr: { borderTop: "1px solid #313244" },
  td: { padding: "12px 14px", fontSize: 14, color: "#a6adc8", verticalAlign: "middle" },
  badge: { display: "inline-block", padding: "2px 10px", borderRadius: 99, fontSize: 12, fontWeight: 500 },
  nocat: { color: "#45475a" },
  editBtn: { marginRight: 6, padding: "4px 12px", borderRadius: 6, border: "1px solid #313244", background: "transparent", color: "#89b4fa", cursor: "pointer", fontSize: 12 },
  delBtn: { padding: "4px 12px", borderRadius: 6, border: "1px solid #313244", background: "transparent", color: "#f38ba8", cursor: "pointer", fontSize: 12 },
  pagination: { display: "flex", gap: 12, alignItems: "center", justifyContent: "center", marginTop: 20 },
  pageBtn: { padding: "6px 14px", borderRadius: 8, border: "1px solid #313244", background: "transparent", color: "#a6adc8", cursor: "pointer", fontSize: 13 },
};
