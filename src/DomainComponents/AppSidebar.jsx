import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import RecursiveSidebarMenu from "./RecursiveSidebarMenu";
import useMenu from "@/hooks/use-menu";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";

export function AppSidebar() {
  const { data: menus } = useMenu(1);

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
      <SidebarFooter>
        <ModeToggle />
        <NavUser
          user={{
            name: "john doe",
            email: "john.doe@gmail.com",
            avatar: "https://github.com/shadcn.png",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
