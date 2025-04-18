import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import RecursiveSidebarMenu from "./RecursiveSidebarMenu";

export function AppSidebar() {
  const [menus, setMenus] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await axios.get(
        "http://localhost:8080/domain/menu-item"
      );
      setMenus(response.data);
    })();
  }, []);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          {menus.map((menu) => (
            <RecursiveSidebarMenu menu={menu} key={menu.id} />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
