import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import { useAuth } from "./hooks/useAuth";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import IdiomDetail from "./pages/IdiomDetail";
import Personal from "./pages/Personal";

export function App() {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Routes có layout chung */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/personal" element={<Personal />} />

          <Route
            path="/idiom-detail/:id"
            element={
              isAuthenticated ? (
                <IdiomDetail />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        {/* Routes không dùng layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<SignUp />} />
      </Routes>
    </Router>
  );
}
