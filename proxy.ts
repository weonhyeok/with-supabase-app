// proxy.ts (프로젝트 루트)
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const VISITOR_COOKIE_NAME = 'blog_visitor_id';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

// Edge Runtime에서 사용 가능한 UUID 생성 함수
function generateUUID() {
  return crypto.randomUUID(); // Web Crypto API 사용
}

// "proxy" 라는 이름으로 export (Next.js 16 요구사항)
export function proxy(request: NextRequest) {
  console.log('🚀 Proxy 실행:', request.nextUrl.pathname);
  
  const response = NextResponse.next();
  
  if (!request.cookies.get(VISITOR_COOKIE_NAME)) {
    const visitorId = generateUUID();
    console.log('🍪 쿠키 생성:', visitorId);
    response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
      maxAge: COOKIE_MAX_AGE,
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
  } else {
    console.log('✅ 기존 쿠키:', request.cookies.get(VISITOR_COOKIE_NAME)?.value);
  }
  
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\..*|_next).*)',
  ],
};