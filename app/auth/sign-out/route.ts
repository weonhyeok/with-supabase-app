// app/auth/sign-out/route.ts
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function POST() {
  const supabase = await createClient();

  // 세션 끊기
  await supabase.auth.signOut({ scope: "global" });

  // 홈으로 보내기
  redirect("/");
}
