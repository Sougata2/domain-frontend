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
import { Link } from "react-router";

export default function RecursiveSidebarMenu({ menu }) {
  return (
    <SidebarGroupContent key={menu.id}>
      <SidebarMenu>
        {menu.pageLink === null || menu.pageLink === "" ? (
          <Collapsible>
            <SidebarMenuItem>
              <CollapsibleTrigger asChild>
                <SidebarMenuButton className="group">
                  <span>{capitalize(menu.menuItemName)}</span>
                  <ChevronDown
                    className="ms-auto transition-transform group-data-[state=closed]:rotate-270 group-data-[state=open]:rotate-360"
                    size={16}
                  />
                </SidebarMenuButton>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    {menu.menuItems.map((sm) => (
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
            <Link to={menu.pageLink}>{capitalize(menu.menuItemName)}</Link>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroupContent>
  );
}
