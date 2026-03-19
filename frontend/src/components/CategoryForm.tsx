import { useState } from "react";
import type { Category, CategoryFormData } from "@/types";

interface Props {
  initial?: Category;
  onSubmit: (data: CategoryFormData) => Promise<void>;
  onCancel: () => void;
}

const PRESET_COLORS = [
  "#89b4fa", "#a6e3a1", "#fab387", "#f38ba8",
  "#cba6f7", "#f9e2af", "#94e2d5", "#89dceb",
];

export default function CategoryForm({ initial, onSubmit, onCancel }: Props) {
  const [form, setForm] = useState<CategoryFormData>({
    name: initial?.name ?? "",
    color: initial?.color ?? "#89b4fa",
    icon: initial?.icon ?? "tag",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onSubmit(form);
    } catch {
      setError("Failed to save category.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.title}>{initial ? "Edit Category" : "New Category"}</h2>
      {error && <p style={styles.error}>{error}</p>}

      <label style={styles.label}>
        Name *
        <input
          style={styles.input}
          name="name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          required
          placeholder="e.g. Food & Dining"
        />
      </label>

      <div style={styles.label}>
        Color
        <div style={styles.colorRow}>
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setForm((p) => ({ ...p, color: c }))}
              style={{
                ...styles.colorSwatch,
                background: c,
                outline: form.color === c ? `3px solid #cdd6f4` : "none",
              }}
            />
          ))}
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm((p) => ({ ...p, color: e.target.value }))}
            style={styles.colorPicker}
            title="Custom color"
          />
        </div>
      </div>

      <label style={styles.label}>
        Icon hint
        <input
          style={styles.input}
          name="icon"
          value={form.icon}
          onChange={(e) => setForm((p) => ({ ...p, icon: e.target.value }))}
          placeholder="e.g. food, car, home"
        />
      </label>

      <div style={styles.actions}>
        <button type="button" onClick={onCancel} style={styles.cancelBtn} disabled={loading}>
          Cancel
        </button>
        <button type="submit" style={styles.submitBtn} disabled={loading}>
          {loading ? "Saving…" : initial ? "Update" : "Create"}
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
    minWidth: 320,
  },
  title: { margin: 0, fontSize: 18, fontWeight: 600, color: "#cdd6f4" },
  label: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, color: "#a6adc8" },
  input: {
    padding: "8px 10px",
    borderRadius: 8,
    border: "1px solid #313244",
    background: "#181825",
    color: "#cdd6f4",
    fontSize: 14,
    outline: "none",
  },
  colorRow: { display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" },
  colorSwatch: {
    width: 28,
    height: 28,
    borderRadius: "50%",
    border: "none",
    cursor: "pointer",
    outlineOffset: 2,
  },
  colorPicker: { width: 28, height: 28, borderRadius: "50%", border: "none", cursor: "pointer", padding: 0 },
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
    background: "#a6e3a1",
    color: "#1e1e2e",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 14,
  },
};
