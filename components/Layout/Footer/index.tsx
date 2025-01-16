import { Mail } from "lucide-react";
import { getTranslations } from "next-intl/server";
import ContactForm from "./contact-form";

const Footer = async () => {
  const t = await getTranslations("Footer");
  return (
    <footer className="border-t bg-muted p-4">
      <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-start">
        <p className="text-xs text-muted-foreground text-center md:text-left">
          &copy; {t("copyright")}
        </p>

        {/* Right Section - Contact Form */}
        <div className="flex flex-col gap-2 w-full md:w-auto max-w-md">
          <p className="text-sm font-semibold text-center md:text-left">
            {t("contactWithMe")}
          </p>
          <ContactForm />
          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-center md:justify-start">
            <Mail className="size-4" />
            <span className="break-all">contact@planbuddy.info</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
