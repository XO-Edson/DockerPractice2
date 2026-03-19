import { useEffect, useState, useCallback } from "react";
import { getCategories, createCategory, updateCategory, deleteCategory } from "@/api/client";
import type { Category, CategoryFormData } from "@/types";
import CategoryForm from "@/components/CategoryForm";
import Modal from "@/components/Modal";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | undefined>();

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getCategories();
    setCategories(data.results);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openAdd = () => { setEditing(undefined); setModalOpen(true); };
  const openEdit = (c: Category) => { setEditing(c); setModalOpen(true); };

  const handleSubmit = async (data: CategoryFormData) => {
    if (editing) await updateCategory(editing.id, data);
    else await createCategory(data);
    setModalOpen(false);
    load();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this category? Expenses will become uncategorized.")) return;
    await deleteCategory(id);
    load();
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.heading}>Categories</h1>
        <button style={styles.addBtn} onClick={openAdd}>+ New Category</button>
      </div>

      {loading ? (
        <p style={styles.muted}>Loading…</p>
      ) : categories.length === 0 ? (
        <p style={styles.muted}>No categories yet. Create one to get started.</p>
      ) : (
        <div style={styles.grid}>
          {categories.map((cat) => (
            <div key={cat.id} style={styles.card}>
              <div style={{ ...styles.colorBar, background: cat.color }} />
              <div style={styles.cardBody}>
                <p style={styles.catName}>{cat.name}</p>
                <p style={styles.catStats}>
                  {cat.expense_count ?? 0} expense{cat.expense_count !== 1 ? "s" : ""}
                  {cat.total_spent
                    ? ` · KES ${Number(cat.total_spent).toLocaleString()}`
                    : ""}
                </p>
              </div>
              <div style={styles.cardActions}>
                <button style={styles.editBtn} onClick={() => openEdit(cat)}>Edit</button>
                <button style={styles.delBtn} onClick={() => handleDelete(cat.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <CategoryForm
          initial={editing}
          onSubmit={handleSubmit}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "28px 32px", maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 },
  heading: { margin: 0, fontSize: 24, fontWeight: 700, color: "#cdd6f4" },
  addBtn: { padding: "8px 18px", borderRadius: 8, border: "none", background: "#a6e3a1", color: "#1e1e2e", fontWeight: 600, cursor: "pointer", fontSize: 14 },
  muted: { color: "#6c7086", fontSize: 14 },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 },
  card: { background: "#1e1e2e", borderRadius: 12, overflow: "hidden", border: "1px solid #313244", display: "flex", flexDirection: "column" },
  colorBar: { height: 5 },
  cardBody: { padding: "16px 18px", flex: 1 },
  catName: { margin: "0 0 4px", fontWeight: 600, fontSize: 15, color: "#cdd6f4" },
  catStats: { margin: 0, fontSize: 12, color: "#6c7086" },
  cardActions: { display: "flex", gap: 8, padding: "10px 18px", borderTop: "1px solid #313244" },
  editBtn: { flex: 1, padding: "5px", borderRadius: 6, border: "1px solid #313244", background: "transparent", color: "#89b4fa", cursor: "pointer", fontSize: 12 },
  delBtn: { flex: 1, padding: "5px", borderRadius: 6, border: "1px solid #313244", background: "transparent", color: "#f38ba8", cursor: "pointer", fontSize: 12 },
};
