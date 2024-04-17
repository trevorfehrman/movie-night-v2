import { BreadcrumbNav } from "@/components/breadcrumb-nav";
import { MobileNav } from "@/components/mobile-nav";
import { ModeToggle } from "@/components/mode-toggle";
import { Nav } from "@/components/nav";
import { NavSearch } from "@/components/nav-search";
import { ThemeProvider } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import {
  ClerkLoaded,
  ClerkLoading,
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { LoaderCircle, User } from "lucide-react";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import "./globals.css";

export const metadata: Metadata = {
  title: "OK Go Wait Click",
  description: "For all your movie night needs",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const raleway = Raleway({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <head />
        <body className={raleway.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Layout>{children}</Layout>
            <SpeedInsights />
            <Analytics />
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-dvh w-full flex-col bg-muted/40 ring-offset-background">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <Nav />
      </aside>
      <div className="flex flex-col items-center sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 w-full max-w-screen-2xl items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <MobileNav />
          <BreadcrumbNav />
          <NavSearch />
          <ModeToggle />

          <div className="flex size-10 items-center justify-center">
            <ClerkLoading>
              <LoaderCircle className="animate-spin" />
            </ClerkLoading>
            <ClerkLoaded>
              <SignedIn>
                <UserButton />
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <Button
                    size="icon"
                    variant="outline"
                    className="outline-ring"
                    aria-label="Sign in"
                  >
                    <User />
                  </Button>
                </SignInButton>
              </SignedOut>
            </ClerkLoaded>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
