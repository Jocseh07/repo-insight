"use client";
import dynamic from "next/dynamic";
import { dark } from "@clerk/themes";

const ThemeProvider = dynamic(
  () => import("./theme-provider").then((mod) => mod.ThemeProvider),
  {
    ssr: false,
  },
);
import { ClerkProvider } from "@clerk/nextjs";
import { useTheme } from "next-themes";

export default function Providers({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  return (
    <>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {theme === "light" ? (
          <ClerkProvider>{children}</ClerkProvider>
        ) : (
          <ClerkProvider appearance={{ baseTheme: dark }}>
            {children}
          </ClerkProvider>
        )}
      </ThemeProvider>
    </>
  );
}
