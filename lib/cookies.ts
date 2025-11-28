// lib/cookies.ts
import { cookies } from 'next/headers';

const VISITOR_COOKIE_NAME = 'blog_visitor_id';

export async function getVisitorId(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(VISITOR_COOKIE_NAME)?.value;
}