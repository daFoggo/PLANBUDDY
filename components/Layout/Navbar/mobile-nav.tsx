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

const MobileNav = ({ items }: IMobileNavProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="pr-0">
        <SheetTitle></SheetTitle>
        <MobileLink
          href="/"
          className="flex items-center"
          onOpenChange={() => {}}
        >
          <span className="font-bold font-clash text-xl">Let's Meat</span>
        </MobileLink>
        <div className="my-4 h-[calc(100vh-8rem)] mr-6">
          <div className="flex flex-col space-y-3">
            {items.map((item) => (
              <MobileLink
                key={item.href}
                href={item.href}
                onOpenChange={() => {}}
              >
                {item.title}
              </MobileLink>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
