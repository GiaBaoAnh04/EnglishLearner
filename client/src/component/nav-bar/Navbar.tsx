import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

interface User {
  avatar?: string;
  fullName?: string;
}

interface NavbarProps {
  currentUser?: User | null;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-primary-100">
        Community Idioms
      </Link>

      <div className="space-x-4 text-light-500 flex items-center relative">
        {!currentUser ? (
          <Link to="/login" className="hover:underline">
            Login
          </Link>
        ) : (
          <div className="relative">
            {/* Avatar */}
            <img
              src={currentUser.avatar || "/assets/image/avatar.jpg"}
              alt={currentUser.fullName || "User Avatar"}
              className="w-8 h-8 rounded-full object-cover border border-gray-300 cursor-pointer"
              onClick={() => setMenuOpen((prev) => !prev)}
            />

            {/* Dropdown menu */}
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
