import Logo from "@/components/common/Logo";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-300px)]">
      <div className="flex space-x-6 items-center justify-center">
        <Image
          className="dark:invert"
          src="https://nextjs.org/icons/next.svg"
          alt="Next.js logo"
          width={0}
          height={0}
          style={{ width: 100, height: 100 }}
          priority
        />
        <p>X</p>
        <Logo />
      </div>
    </div>
  );
}
