import type React from "react";
import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import Link from "next/link";

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <header className="border-b bg-background">
          <nav className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
            <Link href="/" className="font-semibold text-foreground">
              Resume Builder
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="#builder"
                className="text-sm text-muted-foreground hover:text-foreground"
                aria-current="page"
              >
                Builder
              </a>
              <a
                href="#preview"
                className="text-sm text-muted-foreground hover:text-foreground"
                aria-current="page"
              >
                Preview
              </a>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      </Suspense>
      <Analytics />
    </>
  );
}
