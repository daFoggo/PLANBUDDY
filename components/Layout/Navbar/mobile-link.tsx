import { cn } from "@/lib/utils";
import { IMobileLinkProps } from "@/types/navbar";
import Link from "next/link";

const MobileLink = ({
  href,
  className,
  children,
  ...props
}: IMobileLinkProps) => {
  return (
    <Link href={href} className={cn(className)} {...props}>
      {children}
    </Link>
  );
};
export default MobileLink;
