import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Outlet } from "react-router";
import { AppSidebar } from "./AppSidebar";
import AlertBox from "./AlertBox";

export default function Layout() {
  return (
    <>
      <AlertBox />
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full pb-4">
          <SidebarTrigger />
          <Outlet />
        </main>
      </SidebarProvider>
    </>
  );
}
