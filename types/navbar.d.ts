export interface IMainNavProps {
  items: { title: string; href: string }[];
}

export interface IMobileNavProps {
  items: { title: string; href: string }[];
}

interface IMobileLinkProps extends React.ComponentPropsWithoutRef<"a"> {
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
  href: string;
}
