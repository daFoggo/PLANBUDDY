"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";

import { IGuestLoginFormProps } from "@/types/guest-login-form";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { formSchema } from "./constant";
type FormValues = z.infer<typeof formSchema>;

const GuestLoginForm = ({ onClose }: IGuestLoginFormProps) => {
  const t = useTranslations(
    "Navbar.LoginButton.LoginDialogContent.GuestLoginForm"
  );
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    try {
      setIsLoading(true);
      const result = await signIn("credentials", {
        name: values.name,
        userType: "GUEST",
        redirect: false,
      });

      if (result?.error) {
        form.setError("root", {
          type: "manual",
          message: "Failed to login. Please try again.",
        });
      } else if (result?.ok) {
        onClose();
        const isMeetingPage = /^\/en\/meeting\/[a-zA-Z0-9]+$/.test(pathname);
        if (!isMeetingPage) {
          router.push("/dashboard");
        }
      }
    } catch (error) {
      form.setError("root", {
        type: "manual",
        message: `An unexpected error occurred: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("fields.name.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("fields.name.placeholder")}
                  disabled={isLoading}
                  autoComplete="name"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <p className="text-sm text-red-500">
            {form.formState.errors.root.message}
          </p>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              {t("submit.text.loading")}
            </>
          ) : (
            t("submit.text.normal")
          )}
        </Button>
      </form>
    </Form>
  );
};

export default GuestLoginForm;
