import Logo from "@/components/common/Logo";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList
} from "@/components/ui/navigation-menu";
import { IMainNavProps } from "@/types/navbar";
import Link from "next/link";

const MainNav = ({ items }: IMainNavProps) => {
  return (
    <div className="mr-4 hidden md:flex">
      <Link href="/" className="mr-6 flex items-center space-x-2">
        <Logo />
      </Link>
      <NavigationMenu>
        <NavigationMenuList className="space-x-3">
          {items.map((item) => (
            <NavigationMenuItem key={item.title} className="hover:bg-muted py-2 px-3 rounded-md transition-colors">
              <Link href={item.href} legacyBehavior passHref>
                <NavigationMenuLink>
                  <p>{item.title}</p>
                </NavigationMenuLink>
              </Link>
            </NavigationMenuItem>
          ))}
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export default MainNav;
