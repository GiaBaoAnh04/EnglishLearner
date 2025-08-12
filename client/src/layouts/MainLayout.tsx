// Updated MainLayout.tsx
import { Outlet } from "react-router-dom";
import { Navbar } from "../component/nav-bar/Navbar";

const MainLayout = () => {
  // Không cần lấy từ localStorage nữa, dùng context
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar /> {/* Không cần truyền currentUser prop nữa */}
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
