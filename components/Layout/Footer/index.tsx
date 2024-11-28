import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="border-t bg-muted">
      <div className="p-4 flex justify-between items-center w-full">
        <p className="font-semibold text-xs">Developed by Foggo © 2024</p>
        <Link href="https://github.com/daFoggo/1Min2Meet">
          <Button leftIcon={<Github className="size-4"/>}>Github</Button>
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
