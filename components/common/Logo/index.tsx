"use client";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

const Logo = () => {
  const { theme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <p className="sm:inline-block text-2xl font-clash font-semibold">
      <Image
        src={currentTheme === "dark" ? "/logos/dark.png" : "/logos/light.png"}
        alt="Plan Buddy"
        width={160}
        height={40}
        priority
        className="w-auto h-auto"
      />
    </p>
  );
};

export default Logo;
