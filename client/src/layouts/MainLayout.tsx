import { Outlet } from "react-router-dom";
import Navbar from "../component/nav-bar/Navbar";

const MainLayout = () => {
  // Lấy thông tin user đã lưu khi đăng nhập
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentUser={currentUser} />
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
