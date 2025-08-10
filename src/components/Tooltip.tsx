import React, { useState, useRef, useEffect, useCallback } from 'react';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  delay?: number;
  position?: 'top' | 'bottom' | 'left' | 'right';
  disabled?: boolean;
  disableChildHover?: boolean;
  offsetX?: number;
  offsetY?: number;
}

export default function Tooltip({ 
  content, 
  children, 
  delay = 100,
  position = 'right',
  disabled = false,
  disableChildHover = false,
  offsetX = 8,
  offsetY = 0,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState<React.CSSProperties>({});
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = useCallback(() => {
    if (!containerRef.current || !tooltipRef.current) return;

    const anchorEl = (containerRef.current.firstElementChild as HTMLElement) || containerRef.current;
    const anchorRect = anchorEl.getBoundingClientRect();
    const tipRect = tooltipRef.current.getBoundingClientRect();

    let top = 0;
    let left = 0;

    const gap = offsetX; // reuse offsetX as horizontal/vertical gap

    switch (position) {
      case 'top':
        top = anchorRect.top - tipRect.height - gap;
        left = anchorRect.left + (anchorRect.width - tipRect.width) / 2;
        break;
      case 'bottom':
        top = anchorRect.bottom + gap;
        left = anchorRect.left + (anchorRect.width - tipRect.width) / 2;
        break;
      case 'left':
        top = anchorRect.top + (anchorRect.height - tipRect.height) / 2 + offsetY;
        left = anchorRect.left - tipRect.width - gap;
        break;
      case 'right':
      default:
        top = anchorRect.top + (anchorRect.height - tipRect.height) / 2 + offsetY;
        left = anchorRect.right + gap;
        break;
    }

    setTooltipStyle({
      position: 'fixed',
      top: `${Math.round(top)}px`,
      left: `${Math.round(left)}px`,
      zIndex: 9999,
    });
  }, [position, offsetX, offsetY]);

  const showTooltip = () => {
    if (disabled) return;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  useEffect(() => {
    if (isVisible) {
      calculatePosition();
    }
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    if (!isVisible) return;
    const handler = () => calculatePosition();
    window.addEventListener('scroll', handler, true);
    window.addEventListener('resize', handler);
    return () => {
      window.removeEventListener('scroll', handler, true);
      window.removeEventListener('resize', handler);
    };
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    if (!isVisible || !tooltipRef.current) return;
    const ro = new ResizeObserver(() => calculatePosition());
    ro.observe(tooltipRef.current);
    return () => ro.disconnect();
  }, [isVisible, calculatePosition]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={containerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block relative"
      >
        {children}
      </div>
      
      {isVisible && (
        <div
          ref={tooltipRef}
          style={tooltipStyle}
          className="inline-flex bg-slate-900 dark:bg-slate-700 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none transition-opacity duration-150 opacity-100 whitespace-nowrap"
          role="tooltip"
        >
          {content}
          {/* Arrow */}
          <div 
            className={`absolute w-2 h-2 bg-slate-900 dark:bg-slate-700 rotate-45 ${
              position === 'top' ? 'bottom-[-4px] left-1/2 -translate-x-1/2' :
              position === 'bottom' ? 'top-[-4px] left-1/2 -translate-x-1/2' :
              position === 'left' ? 'right-[-4px] top-1/2 -translate-y-1/2' :
              'left-[-4px] top-1/2 -translate-y-1/2'
            }`}
          />
        </div>
      )}
    </>
  );
}
