"use client";
import * as React from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import MobileLink from "./mobile-link";
import { IMobileNavProps } from "@/types/navbar";
import Logo from "../Logo";

const MobileNav = ({ items }: IMobileNavProps) => {
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
   <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetTitle>
          <Logo />
        </SheetTitle>
        <nav className="flex flex-col space-y-3 mt-4">
          {items.map((item) => (
            <MobileLink
              key={item.title}
              href={item.href}
              onClick={handleLinkClick}
              className="transition-colors hover:text-foreground/80"
            >
              {item.title}
            </MobileLink>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
