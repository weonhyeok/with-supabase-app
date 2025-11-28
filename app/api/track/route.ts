// app/api/track/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  const { actionType, actionTarget, pageUrl } = await request.json();
  
  const cookieStore = await cookies();
  const visitorCookieId = cookieStore.get('blog_visitor_id')?.value;
  
  if (!visitorCookieId) {
    return NextResponse.json({ error: 'No visitor ID' }, { status: 400 });
  }

  const supabase = await createClient();
  
  // visitor_id 찾기
  const { data: visitor } = await supabase
    .from('visitors')
    .select('id')
    .eq('visitor_cookie_id', visitorCookieId)
    .single();

  if (visitor) {
    await supabase.from('action_logs').insert({
      visitor_id: visitor.id,
      action_type: actionType,
      action_target: actionTarget,
      page_url: pageUrl,
    });
  }

  return NextResponse.json({ success: true });
}