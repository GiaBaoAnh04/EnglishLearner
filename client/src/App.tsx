// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";
// import Login from "./pages/Login";
// import SignUp from "./pages/SignUp";
// import { useAuth } from "./hooks/useAuth";
// import MainLayout from "./layouts/MainLayout";
// import Home from "./pages/Home";
// import IdiomDetail from "./pages/IdiomDetail";
// import Personal from "./pages/Personal";

// export function App() {
//   const { isAuthenticated } = useAuth();

//   return (
//     <Router>
//       <Routes>
//         {/* Routes có layout chung */}
//         <Route element={<MainLayout />}>
//           <Route path="/" element={<Home />} />
//           <Route path="/personal" element={<Personal />} />

//           <Route
//             path="/idiom-detail/:id"
//             element={
//               isAuthenticated ? (
//                 <IdiomDetail />
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             }
//           />
//         </Route>

//         {/* Routes không dùng layout */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/sign-up" element={<SignUp />} />
//       </Routes>
//     </Router>
//   );
// }

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
  const { isAuthenticated, loading } = useAuth();

  // Hiển thị loading spinner khi đang check auth
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-100"></div>
      </div>
    );
  }

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
