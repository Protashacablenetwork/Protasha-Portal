import { useEffect, useRef } from 'react';

/**
 * Universal hardware/browser Back button hook for modals and full-screen pages with inner sub-views.
 * - Pushes a history entry whenever `activeDepth` increases while `isOpen` is true.
 * - Notifies parent via `onSubViewChange(activeDepth > 0)` so the parent modal stays open while
 *   inner sub-views unwind step-by-step on device Back button presses.
 * - Invokes `onPopTopSubView` in LIFO order on `popstate`.
 */
export function useSubViewBack(
  isOpen: boolean,
  activeDepth: number,
  onPopTopSubView: () => void,
  onSubViewChange?: (hasSubView: boolean) => void,
  tag = 'subView'
) {
  const prevDepthRef = useRef(0);
  const popCallbackRef = useRef(onPopTopSubView);
  popCallbackRef.current = onPopTopSubView;
  const activeDepthRef = useRef(activeDepth);
  activeDepthRef.current = activeDepth;

  useEffect(() => {
    const hasSub = isOpen && activeDepth > 0;
    onSubViewChange?.(hasSub);
    return () => {
      onSubViewChange?.(false);
    };
  }, [isOpen, activeDepth, onSubViewChange]);

  useEffect(() => {
    if (!isOpen) {
      prevDepthRef.current = 0;
      return;
    }
    if (activeDepth > prevDepthRef.current) {
      const delta = activeDepth - prevDepthRef.current;
      for (let i = 0; i < delta; i++) {
        try {
          window.history.pushState(
            { appSubView: tag, depth: prevDepthRef.current + i + 1, time: Date.now() },
            ''
          );
        } catch {}
      }
    }
    prevDepthRef.current = activeDepth;
  }, [isOpen, activeDepth, tag]);

  useEffect(() => {
    if (!isOpen) return;
    const handlePop = () => {
      if (activeDepthRef.current > 0) {
        prevDepthRef.current = Math.max(0, activeDepthRef.current - 1);
        popCallbackRef.current();
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [isOpen]);
}
