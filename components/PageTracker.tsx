// components/PageTracker.tsx
import { cookies } from "next/headers";
import { headers } from "next/headers";
import { trackVisitor, logAction } from "@/lib/analytics";

export async function PageTracker({ pageUrl }: { pageUrl: string }) {
  const cookieStore = await cookies();
  const visitorCookieId = cookieStore.get('blog_visitor_id')?.value;
  
  if (visitorCookieId) {
    const headersList = await headers();
    const userAgent = headersList.get('user-agent') || undefined;
    
    const visitorId = await trackVisitor(visitorCookieId, userAgent);
    await logAction(visitorId, 'page_view', pageUrl, pageUrl);
  }
  
  return null; // 아무것도 렌더링하지 않음
}