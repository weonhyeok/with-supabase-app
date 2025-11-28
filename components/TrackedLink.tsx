// components/TrackedLink.tsx
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function TrackedLink({ 
  href, 
  children,
  className,
  style,
  ...props 
}: { 
  href: string; 
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  [key: string]: any;
}) {
  const pathname = usePathname();

  const handleClick = async () => {
    // 링크 클릭 트래킹
    await fetch('/api/track-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        actionType: 'link_click',
        actionTarget: href,
        pageUrl: pathname,
      }),
    }).catch(err => console.error('Track failed:', err));
  };

  return (
    <Link 
      href={href} 
      onClick={handleClick} 
      className={className}
      style={style}
      {...props}
    >
      {children}
    </Link>
  );
}