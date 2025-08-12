// Updated Navbar.tsx - sử dụng useUser
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../../context/userContext";
export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  // Sử dụng useUser để lấy user và logout từ context
  const { user, logout } = useUser();
  console.log(user, "user");
  const isAuthenticated = !!user; // Kiểm tra xem có user hay không để xác định trạng thái đăng nhập
  const handleLogout = () => {
    logout(); // Gọi hàm logout từ context
    navigate("/login");
  };
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-primary-100">
        Community Idioms
      </Link>
      <div className="space-x-4 text-light-500 flex items-center relative">
        {!isAuthenticated || !user ? (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <div className="relative">
            <img
              src={user.avatar || "/assets/image/avatar.jpg"}
              alt={user.fullName || "User Avatar"}
              className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <Link
                  to="/personal"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setMenuOpen(false)}
                >
                  Personal Page
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};
export default Navbar;
