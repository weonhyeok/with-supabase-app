// components/ClientPageTracker.tsx
'use client';

import { useEffect, useRef } from 'react';

export function ClientPageTracker({ pageUrl }: { pageUrl: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    // 한 세션에서 한 번만 트래킹
    if (tracked.current) return;
    
    fetch('/api/track-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageUrl }),
    }).catch(error => console.error('Tracking failed:', error));

    tracked.current = true;
  }, [pageUrl]);

  return null;
}