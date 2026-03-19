import { useEffect, useState } from "react";
import { getSummary } from "@/api/client";
import type { Summary } from "@/types";

export default function DashboardPage() {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSummary()
      .then(setSummary)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={styles.muted}>Loading dashboard…</p>;
  if (!summary) return <p style={styles.muted}>Could not load summary.</p>;

  const maxMonth = Math.max(...summary.by_month.map((m) => Number(m.total)), 1);

  return (
    <div style={styles.page}>
      <h1 style={styles.heading}>Dashboard</h1>

      {/* ── Stat cards ── */}
      <div style={styles.cards}>
        <StatCard label="Total Spent" value={`KES ${Number(summary.total).toLocaleString()}`} accent="#89b4fa" />
        <StatCard label="Transactions" value={String(summary.count)} accent="#a6e3a1" />
        <StatCard label="Categories" value={String(summary.by_category.length)} accent="#fab387" />
      </div>

      {/* ── Spending by month ── */}
      <section style={styles.section}>
        <h2 style={styles.subheading}>Spending by Month</h2>
        {summary.by_month.length === 0 ? (
          <p style={styles.muted}>No data yet.</p>
        ) : (
          <div style={styles.barChart}>
            {summary.by_month.map((m) => (
              <div key={m.month} style={styles.barGroup}>
                <span style={styles.barAmount}>
                  {Number(m.total) >= 1000
                    ? `${(Number(m.total) / 1000).toFixed(1)}k`
                    : Number(m.total).toFixed(0)}
                </span>
                <div
                  style={{
                    ...styles.bar,
                    height: `${(Number(m.total) / maxMonth) * 120}px`,
                  }}
                />
                <span style={styles.barLabel}>{m.month.slice(0, 7)}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── By category ── */}
      <section style={styles.section}>
        <h2 style={styles.subheading}>By Category</h2>
        {summary.by_category.length === 0 ? (
          <p style={styles.muted}>No data yet.</p>
        ) : (
          <div style={styles.catList}>
            {summary.by_category.map((c) => {
              const pct = summary.total
                ? ((Number(c.total) / Number(summary.total)) * 100).toFixed(1)
                : "0";
              return (
                <div key={c.category__id} style={styles.catRow}>
                  <span
                    style={{ ...styles.dot, background: c.category__color ?? "#6366f1" }}
                  />
                  <span style={styles.catName}>{c.category__name ?? "Uncategorized"}</span>
                  <div style={styles.catBarWrap}>
                    <div
                      style={{
                        ...styles.catBar,
                        width: `${pct}%`,
                        background: c.category__color ?? "#6366f1",
                      }}
                    />
                  </div>
                  <span style={styles.catPct}>{pct}%</span>
                  <span style={styles.catTotal}>KES {Number(c.total).toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function StatCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{ ...styles.card, borderTop: `3px solid ${accent}` }}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={{ ...styles.cardValue, color: accent }}>{value}</p>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { padding: "28px 32px", maxWidth: 900, margin: "0 auto" },
  heading: { margin: "0 0 24px", fontSize: 24, fontWeight: 700, color: "#cdd6f4" },
  subheading: { margin: "0 0 16px", fontSize: 16, fontWeight: 600, color: "#cdd6f4" },
  muted: { color: "#6c7086", fontSize: 14 },
  cards: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 },
  card: { background: "#1e1e2e", borderRadius: 12, padding: "20px 22px" },
  cardLabel: { margin: "0 0 6px", fontSize: 12, color: "#6c7086", textTransform: "uppercase", letterSpacing: "0.05em" },
  cardValue: { margin: 0, fontSize: 26, fontWeight: 700 },
  section: { background: "#1e1e2e", borderRadius: 12, padding: "22px 24px", marginBottom: 24 },
  barChart: { display: "flex", alignItems: "flex-end", gap: 12, height: 150, paddingTop: 20 },
  barGroup: { display: "flex", flexDirection: "column", alignItems: "center", gap: 4, flex: 1 },
  bar: { width: "100%", background: "#89b4fa", borderRadius: "4px 4px 0 0", minHeight: 4, transition: "height 0.3s" },
  barLabel: { fontSize: 11, color: "#6c7086" },
  barAmount: { fontSize: 11, color: "#a6adc8" },
  catList: { display: "flex", flexDirection: "column", gap: 10 },
  catRow: { display: "flex", alignItems: "center", gap: 10 },
  dot: { width: 10, height: 10, borderRadius: "50%", flexShrink: 0 },
  catName: { width: 130, fontSize: 13, color: "#cdd6f4", flexShrink: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" },
  catBarWrap: { flex: 1, height: 8, background: "#313244", borderRadius: 4, overflow: "hidden" },
  catBar: { height: "100%", borderRadius: 4, transition: "width 0.3s" },
  catPct: { width: 40, fontSize: 12, color: "#6c7086", textAlign: "right", flexShrink: 0 },
  catTotal: { width: 100, fontSize: 12, color: "#a6adc8", textAlign: "right", flexShrink: 0 },
};
