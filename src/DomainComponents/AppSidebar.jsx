import {
  Calendar,
  ChevronDown,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { capitalize } from "@/utility/helpers";
import RecursiveSidebarMenu from "./RecursiveSidebarMenu";

// Menu items.
const items = [
  {
    title: "Home",
    url: "#",
    icon: Home,
  },
  {
    title: "Inbox",
    url: "#",
    icon: Inbox,
  },
  {
    title: "Calendar",
    url: "#",
    icon: Calendar,
  },
  {
    title: "Search",
    url: "#",
    icon: Search,
  },
  {
    title: "Settings",
    url: "#",
    icon: Settings,
  },
];

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
          {/* <SidebarGroupContent>
            <SidebarMenu>
              {menu.map((m) => {
                return (
                  <Collapsible className="group/collapsible" key={m.id}>
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton>
                          <Home />
                          <span>{capitalize(m.menuItemName)}</span>
                          <ChevronDown
                            className="ms-auto transition-transform group-data-[state=closed]/collapsible:rotate-270 group-data-[state=open]/collapsible:rotate-360"
                            size={16}
                          />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        {m.menuItems.map((sm) => {
                          return (
                            <SidebarMenuSub key={sm.id}>
                              <SidebarMenuSubItem>
                                <span>{capitalize(sm.menuItemName)}</span>
                              </SidebarMenuSubItem>
                            </SidebarMenuSub>
                          );
                        })}
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent> */}
          {menus.map((menu) => (
            <RecursiveSidebarMenu menu={menu} key={menu.id} />
          ))}
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
