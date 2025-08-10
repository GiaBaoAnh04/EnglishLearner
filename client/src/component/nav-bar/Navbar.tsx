import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-primary-100">
        Community Idioms
      </Link>
      <div className="space-x-4 text-light-500">
        <Link to="/login" className="hover:underline">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
