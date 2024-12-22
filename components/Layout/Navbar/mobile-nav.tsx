"use client";
import Logo from "@/components/common/Logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { IMobileNavProps } from "@/types/navbar";
import { Menu } from "lucide-react";
import * as React from "react";
import MobileLink from "./mobile-link";
import { useAuth } from "@/hooks/use-auth";

const MobileNav = ({ items }: IMobileNavProps) => {
  const { status } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleLinkClick = React.useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="size-4" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetTitle>
          <Logo />
        </SheetTitle>
        <SheetDescription></SheetDescription>
        {status === "authenticated" && (
          <nav className="flex flex-col mt-4">
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
        )}
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
