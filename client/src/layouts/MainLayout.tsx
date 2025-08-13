import { Outlet } from "react-router-dom";
import { Navbar } from "../component/nav-bar/Navbar";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 px-6 py-4">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
