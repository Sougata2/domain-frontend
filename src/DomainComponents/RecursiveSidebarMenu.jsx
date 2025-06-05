import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { capitalize } from "@/utility/helpers";
import { ChevronDown, LinkIcon } from "lucide-react";
import { Link, NavLink } from "react-router";

export default function RecursiveSidebarMenu({ menu }) {
  return (
    <SidebarGroupContent key={menu.id}>
      <SidebarMenu>
        {menu.url === null || menu.url === "" ? (
          <Collapsible>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="group">
                  <span>{capitalize(menu.name)}</span>
                  <ChevronDown
                    className="ms-auto transition-transform group-data-[state=closed]:rotate-270 group-data-[state=open]:rotate-360"
                    size={16}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    {menu.subMenus.map((sm) => (
                      <RecursiveSidebarMenu key={sm.id} menu={sm} />
                    ))}
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              </CollapsibleContent>
            </SidebarMenuItem>
          </Collapsible>
        ) : (
          <div className="flex gap-1 justify-start items-center py-1">
            <LinkIcon size={15} className="text-blue-400" />
            <NavLink to={menu.url}>{capitalize(menu.name)}</NavLink>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
