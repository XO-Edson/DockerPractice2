import { NavLink } from "react-router-dom";

export default function Navbar() {
  const linkStyle = ({ isActive }: { isActive: boolean }): React.CSSProperties => ({
    color: isActive ? "#89b4fa" : "#a6adc8",
    textDecoration: "none",
    fontWeight: isActive ? 600 : 400,
    fontSize: 15,
    padding: "6px 12px",
    borderRadius: 8,
    background: isActive ? "rgba(137,180,250,0.1)" : "transparent",
    transition: "all 0.15s",
  });

  return (
    <nav style={styles.nav}>
      <span style={styles.logo}>💸 ExpenseTracker</span>
      <div style={styles.links}>
        <NavLink to="/" end style={linkStyle}>Dashboard</NavLink>
        <NavLink to="/expenses" style={linkStyle}>Expenses</NavLink>
        <NavLink to="/categories" style={linkStyle}>Categories</NavLink>
      </div>
    </nav>
  );
}

const styles: Record<string, React.CSSProperties> = {
  nav: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 28px",
    height: 56,
    background: "#181825",
    borderBottom: "1px solid #313244",
    position: "sticky",
    top: 0,
    zIndex: 50,
  },
  logo: { fontWeight: 700, fontSize: 17, color: "#cdd6f4", letterSpacing: "-0.3px" },
  links: { display: "flex", gap: 4 },
};
