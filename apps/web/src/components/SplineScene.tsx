'use client';

import Script from 'next/script';
import { useState, useEffect } from 'react';

export default function SplineScene({ scene }: { scene: string }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black/20 backdrop-blur-sm">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Script 
        type="module" 
        src="https://unpkg.com/@splinetool/viewer@1.9.75/build/spline-viewer.js" 
      />
      {/* @ts-ignore */}
      <spline-viewer 
        url={scene} 
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}