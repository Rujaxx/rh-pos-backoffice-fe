'use client';

import { useState, useEffect } from 'react';
import { useSidebar } from '@/providers/sidebar-provider';

export function useSidebarOffset() {
  const { menuState } = useSidebar(); // "overlay" | "collapsed" | "full"
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    function computeOffset() {
      const w = window.innerWidth;

      // <768px → mobile → overlay sidebar → takes NO layout space
      if (w < 768) {
        setOffset(0);
        return;
      }

      // 768px–1023px → collapsed → w-16 (4rem = 64px)
      if (w < 1024) {
        setOffset(64 / 2); // shift by half the sidebar width
        return;
      }

      // ≥1024px → full → w-64 (16rem = 256px)
      setOffset(256 / 2); // shift by half the sidebar width
    }

    computeOffset();
    window.addEventListener('resize', computeOffset);

    return () => window.removeEventListener('resize', computeOffset);
  }, [menuState]);

  return offset;
}
export default useSidebarOffset;
