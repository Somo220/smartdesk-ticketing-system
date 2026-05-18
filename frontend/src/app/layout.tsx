import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartDesk - IT Ticketing System",
  description: "Modern IT Support Ticketing System built with Next.js and Spring Boot",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased transition-colors duration-300`}>
        <ThemeProvider>
          <AuthProvider>
            {children}

            <Toaster
              position="top-right"
              toastOptions={{
                className: "glass shadow-xl border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 font-semibold text-sm",
                style: {
                  background: "transparent",
                  color: "inherit",
                },
                success: {
                  iconTheme: { primary: '#10b981', secondary: '#fff' },
                },
                error: {
                  iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  duration: 5000,
                },
              }}
            />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}