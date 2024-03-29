import LeftSidebar from "@/components/shared/LeftSidebar";
import MobileNav from "@/components/shared/MobileNav";
import MobileTopbar from "@/components/shared/MobileTopbar";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div className="w-full md:flex">
      <MobileTopbar />
      <LeftSidebar />
      <section className="flex flex-1 h-full">
        <Outlet />
      </section>
      <MobileNav />
    </div>
  );
};

export default RootLayout;
