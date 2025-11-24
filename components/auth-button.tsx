import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function AuthButton() {
  const supabase = await createClient();

  // 🔹 getClaims 대신 getUser 사용 + 에러 방어
  let user = null;

  try {
    const { data, error } = await supabase.auth.getUser();

    if (!error && data.user) {
      user = data.user;
    }
  } catch (e) {
    console.error("AuthButton getUser error:", e);
    // 에러가 나도 버튼 UI만 '로그인'으로 보여주고 전체 페이지는 살려둔다
  }

  if (!user) {
    // 로그인 안 된 상태
    return (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline">
          <Link href="/auth/login">Sign in</Link>
        </Button>
        <Button asChild size="sm">
          <Link href="/auth/sign-up">Sign up</Link>
        </Button>
      </div>
    );
  }

  // 로그인 된 상태
  return (
    <div className="flex items-center gap-3 text-sm">
      <span>{user.email}</span>
      <form action="/auth/sign-out" method="post">
        <Button size="sm" variant="outline" type="submit">
          Sign out
        </Button>
      </form>
    </div>
  );
}
