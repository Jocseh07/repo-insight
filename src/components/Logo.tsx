"use client";

import { cn } from "@/lib/utils";
import { useSidebar } from "./ui/sidebar";
import Link from "next/link";

const Logo = ({ className }: { className?: string }) => {
  const { open } = useSidebar();
  return (
    <Link href={"/"} className="h-full w-full">
      <div className="relative flex h-full w-full items-center gap-2">
        <LogoImage />
        {open && (
          <h1
            className={cn("w-fit text-xl font-bold text-primary/80", className)}
          >
            Repo Insight
          </h1>
        )}
      </div>
    </Link>
  );
};
export default Logo;

export const LogoImage = () => {
  return (
    <>
      <img
        src="/just-logo-light-bg.png"
        alt="logo light"
        className={cn(
          "h-full rounded-md object-contain mix-blend-darken dark:hidden",
          {
            "w-1/2": open,
          },
        )}
      />
      <img
        src="/just-logo-dark-bg.png"
        className={cn(
          "hidden h-full rounded-md object-contain mix-blend-lighten dark:block",
          {
            "w-1/2": open,
          },
        )}
        alt="logo dark"
      />
    </>
  );
};
