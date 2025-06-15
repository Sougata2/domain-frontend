import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import RecursiveSidebarMenu from "./RecursiveSidebarMenu";
import { ModeToggle } from "@/components/mode-toggle";
import { NavUser } from "@/components/nav-user";
import { Link } from "react-router";
import { MdDomain } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { capitalize } from "@/utility/helpers";
import { useEffect } from "react";
import { fetchDefaultRole } from "@/state/userSlice";
import profileImage from "../assets/images/profile-image.jfif";

export function AppSidebar() {
  const { id, name, username, menus } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(fetchDefaultRole(id));
    }
  }, [dispatch, id]);

  return (
    <Sidebar>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to={"/home"}>
                <MdDomain />
                <span className="text-base font-semibold">Domain</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
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
            name: capitalize(name),
            email: username,
            avatar: profileImage,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
