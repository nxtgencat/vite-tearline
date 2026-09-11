import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import Breadcrumbs from "./Breadcrumbs";

export default function AppLayout() {
  const [open, setOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-paper text-ink font-sans">
      <Sidebar open={open} onClose={() => setOpen(false)} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Topbar onMenu={() => setOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 max-w-[1200px] w-full mx-auto">
          <div className="mb-5">
            <Breadcrumbs />
          </div>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
