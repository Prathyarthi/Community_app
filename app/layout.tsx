import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { cn } from "@/lib/utils";
import { ModalProvider } from "@/components/providers/modal-provider";
import { SocketProvider } from "@/components/providers/socket-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { InputBox } from "@/components/InputBox";

const font = Open_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Campus Connect",
  description: "Campus connect",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={cn(font.className, "bg-white dark:bg-[#14171A]")}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            storageKey="discord-theme"
          >
            <SocketProvider>
              <ModalProvider />
              <QueryProvider>
                {children}
                <InputBox />
              </QueryProvider>
            </SocketProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
