import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "@/components/Navbar";
import DashboardPage from "@/pages/DashboardPage";
import ExpensesPage from "@/pages/ExpensesPage";
import CategoriesPage from "@/pages/CategoriesPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={styles.root}>
        <Navbar />
        <main style={styles.main}>
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

const styles: Record<string, React.CSSProperties> = {
  root: { minHeight: "100vh", background: "#11111b", display: "flex", flexDirection: "column" },
  main: { flex: 1 },
};
