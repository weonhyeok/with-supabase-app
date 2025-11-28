// app/api/track-page/route.ts (새 파일)
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { headers } from 'next/headers';
import { trackVisitor, logAction } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    const { pageUrl } = await request.json();
    
    const cookieStore = await cookies();
    const visitorCookieId = cookieStore.get('blog_visitor_id')?.value;
    
    if (visitorCookieId) {
      const headersList = await headers();
      const userAgent = headersList.get('user-agent') || undefined;
      
      const visitorId = await trackVisitor(visitorCookieId, userAgent);
      await logAction(visitorId, 'page_view', pageUrl, pageUrl);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Track error:', error);
    return NextResponse.json({ error: 'Failed to track' }, { status: 500 });
  }
}