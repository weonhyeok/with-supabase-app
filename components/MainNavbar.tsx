// app/_components/MainNavbar.tsx (예시 경로)
"use client";

import Link from "next/link";
import { Suspense } from "react";
import { DeployButton } from "@/components/deploy-button";
import { EnvVarWarning } from "@/components/env-var-warning";
import { AuthButton } from "@/components/auth-button";
import { hasEnvVars } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function MainNavbar() {
  return (
    <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
        <div className="flex gap-5 items-center font-semibold">
          <Link href={"/"}>Next.js Supabase Starter</Link>

          <div className="flex gap-3">
            <Button asChild>
              <Link href="/simple-list">Simple List</Link>
            </Button>

            <Button asChild>
              <Link href="/simple-sample">Simple Example</Link>
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <DeployButton />
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
  );
}
