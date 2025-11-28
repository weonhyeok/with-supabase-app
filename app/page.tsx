// app/page.tsx
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { Hero } from "@/components/hero";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { hasEnvVars } from "@/lib/utils";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { PageTracker } from "@/components/PageTracker";
import { TrackedLink } from "@/components/TrackedLink";

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <PageTracker pageUrl="/" />
      </Suspense>
      
      <main className="min-h-screen flex flex-col items-center">
        <div className="flex-1 w-full flex flex-col gap-20 items-center">
          <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
            <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
              <div className="flex gap-5 items-center font-semibold">
                <TrackedLink href="/">행동경제학</TrackedLink>

              <div className="flex gap-3">
                <Button asChild>
                  <TrackedLink href="/simple-list">글목록</TrackedLink>
                </Button>

                <Button asChild>
                  <TrackedLink href="/guestbook">방명록</TrackedLink>
                </Button>
              </div>

              </div>

              {!hasEnvVars ? (
                <EnvVarWarning />
              ) : (
                <Suspense>
                  <AuthButton />
                </Suspense>
              )}
            </div>
          </nav>

            <div>
              Check out the following
              <div className="flex gap-3">
                <Button asChild>
                  <TrackedLink href="/simple-list">글목록</TrackedLink>
                </Button>
                <Button asChild>
                  <TrackedLink href="/guestbook">방명록</TrackedLink>
                </Button>
              </div>
            </div>

          <footer className="w-full flex items-center justify-center border-t mx-auto text-center text-xs gap-8 py-16">
            <p>
              안녕하세요! 행동경제학 글모음에 오신 것을 환영합니다 :) 
            </p>
            <p>
              글을 읽다가 궁금하신 내용이 있으면, 방명록에 남겨주세요! 
            </p>
            <ThemeSwitcher />
          </footer>
        </div>
      </main>
    </>
  );
}