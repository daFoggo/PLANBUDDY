import { cn } from "@/lib/utils";
import { IMobileLinkProps } from "@/types/navbar";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const MobileLink = ({
  href,
  className,
  children,
  ...props
}: IMobileLinkProps) => {
  return (
    <Link
      href={href}
      {...props}
      className={`flex justify-between w-full items-center ${cn(className)} hover:bg-primary/10 rounded-lg p-2`}
    >
      {children}
      <ChevronRight />
    </Link>
  );
};
export default MobileLink;
