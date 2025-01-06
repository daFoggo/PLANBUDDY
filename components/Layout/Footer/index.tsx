import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { IoLogoGithub } from "react-icons/io";
import Link from "next/link";
import ContactForm from "./contact-form";
import { getTranslations } from "next-intl/server";

const Footer = async () => {
  const t = await getTranslations("Footer");
  return (
    <footer className="border-t bg-muted p-4">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-end">
        {/* Left Section - Github */}
        <div className="flex flex-col gap-4 items-center md:items-start">
          <Link href="https://github.com/daFoggo/Schedou.git">
            <Button size="sm" className="w-full md:w-auto">
              <IoLogoGithub className="size-4" />
              Github
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground text-center md:text-left">
            &copy;  {t("copyright")}
          </p>
        </div>

        {/* Right Section - Contact Form */}
        <div className="flex flex-col gap-2 w-full md:w-auto max-w-md">
          <p className="text-sm font-semibold text-center md:text-left">
            {t("contactWithMe")}
          </p>
          <ContactForm />
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center md:justify-start">
            <Mail className="size-4" />
            <span className="break-all">ntgiang141105@gmail.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
