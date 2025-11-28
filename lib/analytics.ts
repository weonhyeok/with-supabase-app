// lib/analytics.ts
import { createClient } from '@/lib/supabase/server';

export async function trackVisitor(visitorCookieId: string, userAgent?: string) {
  try {
    const supabase = await createClient();
    
    console.log('🔍 방문자 체크:', visitorCookieId);
    
    // UPSERT: 있으면 업데이트, 없으면 삽입
    const { data, error } = await supabase
      .from('visitors')
      .upsert(
        {
          visitor_cookie_id: visitorCookieId,
          user_agent: userAgent,
          last_visit_at: new Date().toISOString(),
        },
        {
          onConflict: 'visitor_cookie_id', // 이 컬럼 기준으로 중복 체크
          ignoreDuplicates: false, // 중복 시 업데이트
        }
      )
      .select('id')
      .single();

    if (error) {
      console.error('❌ Upsert 에러:', error);
      return undefined;
    }

    console.log('✅ 방문자 처리 완료:', data?.id);
    return data?.id;
  } catch (error) {
    console.error('❌ trackVisitor 에러:', error);
    return undefined;
  }
}

export async function logAction(
  visitorId: string | undefined,
  actionType: string,
  actionTarget?: string,
  pageUrl?: string
) {
  if (!visitorId) {
    console.log('⚠️ visitorId 없음, 로그 스킵');
    return;
  }
  
  try {
    const supabase = await createClient();
    
    console.log('📝 액션 로그:', { visitorId, actionType, actionTarget, pageUrl });
    
    const { error } = await supabase.from('action_logs').insert({
      visitor_id: visitorId,
      action_type: actionType,
      action_target: actionTarget,
      page_url: pageUrl,
    });

    if (error) {
      console.error('❌ 로그 저장 에러:', error);
    } else {
      console.log('✅ 로그 저장 완료');
    }
  } catch (error) {
    console.error('❌ logAction 에러:', error);
  }
}