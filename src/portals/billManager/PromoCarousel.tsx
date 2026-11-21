import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PROMO_SLIDES, PromoSlide } from './constants';

interface PromoCarouselProps {
  onSelectAction: (action: PromoSlide['action']) => void;
}

function SlideIcon({ type }: { type: PromoSlide['iconType'] }) {
  if (type === 'bolt') {
    return (
      <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    );
  }
  if (type === 'refresh') {
    return (
      <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
      </svg>
    );
  }
  if (type === 'calendar') {
    return (
      <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    );
  }
  if (type === 'sms') {
    return (
      <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      </svg>
    );
  }
  return (
    <svg style={{ width: 24, height: 24 }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.3} strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09zM12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
    </svg>
  );
}

export const PromoCarousel: React.FC<PromoCarouselProps> = ({ onSelectAction }) => {
  const totalSlides = PROMO_SLIDES.length;
  // Track index includes cloned last slide at 0 and cloned first slide at totalSlides + 1
  const [trackIndex, setTrackIndex] = useState(1);
  const [animated, setAnimated] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const isAnimatingRef = useRef(false);
  const safetyTimerRef = useRef<number | null>(null);
  const touchStartXRef = useRef(0);
  const touchDiffXRef = useRef(0);

  const realIndex = (trackIndex - 1 + totalSlides) % totalSlides;

  const slidesWithClones = [
    { ...PROMO_SLIDES[totalSlides - 1], cloneKey: 'clone-head' },
    ...PROMO_SLIDES.map((s) => ({ ...s, cloneKey: s.id })),
    { ...PROMO_SLIDES[0], cloneKey: 'clone-tail' }
  ];

  const moveToTrack = useCallback((nextIdx: number) => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    setAnimated(true);
    setTrackIndex(nextIdx);
    if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    safetyTimerRef.current = window.setTimeout(() => {
      isAnimatingRef.current = false;
    }, 520);
  }, []);

  const nextSlide = useCallback(() => {
    moveToTrack(trackIndex + 1);
  }, [moveToTrack, trackIndex]);

  const prevSlide = useCallback(() => {
    moveToTrack(trackIndex - 1);
  }, [moveToTrack, trackIndex]);

  const goToReal = useCallback((idx: number) => {
    moveToTrack(idx + 1);
  }, [moveToTrack]);

  useEffect(() => {
    if (isPaused) return;
    const id = window.setInterval(() => {
      if (!document.hidden) {
        setAnimated(true);
        isAnimatingRef.current = true;
        setTrackIndex((prev) => prev + 1);
        if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
        safetyTimerRef.current = window.setTimeout(() => {
          isAnimatingRef.current = false;
        }, 520);
      }
    }, 4000);
    return () => window.clearInterval(id);
  }, [isPaused]);

  useEffect(() => {
    const onVisibility = () => setIsPaused(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => {
      document.removeEventListener('visibilitychange', onVisibility);
      if (safetyTimerRef.current) window.clearTimeout(safetyTimerRef.current);
    };
  }, []);

  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.propertyName !== 'transform') return;
    isAnimatingRef.current = false;
    if (trackIndex >= totalSlides + 1) {
      setAnimated(false);
      setTrackIndex(1);
    } else if (trackIndex <= 0) {
      setAnimated(false);
      setTrackIndex(totalSlides);
    }
  };

  return (
    <div
      className="bkash-ad-wrapper"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={(e) => {
        setIsPaused(true);
        touchStartXRef.current = e.touches[0].clientX;
        touchDiffXRef.current = 0;
      }}
      onTouchMove={(e) => {
        if (!touchStartXRef.current) return;
        touchDiffXRef.current = e.touches[0].clientX - touchStartXRef.current;
      }}
      onTouchEnd={() => {
        if (Math.abs(touchDiffXRef.current) > 40) {
          if (touchDiffXRef.current < 0) nextSlide();
          else prevSlide();
        }
        touchStartXRef.current = 0;
        touchDiffXRef.current = 0;
        setIsPaused(false);
      }}
    >
      <div
        className="bkash-ad-slider"
        onTransitionEnd={handleTransitionEnd}
        style={{
          transform: `translateX(-${trackIndex * 100}%)`,
          transition: animated ? 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)' : 'none'
        }}
      >
        {slidesWithClones.map((slide) => (
          <div
            key={slide.cloneKey}
            className={`bkash-ad-slide ${slide.slideClass}`}
            onClick={() => onSelectAction(slide.action)}
          >
            <svg className="bkash-watermark-bg" viewBox="0 0 200 90" preserveAspectRatio="none">
              <polygon points="160,0 200,40 180,90 140,50" fill="white" opacity="0.04" />
              <polygon points="180,10 210,0 200,60" fill="#FED500" opacity="0.05" />
              <polygon points="0,0 50,0 20,60" fill="white" opacity="0.03" />
            </svg>
            <div className="bkash-ad-left">
              <div className="bkash-ad-icon-wrap" title={slide.tag}>
                <SlideIcon type={slide.iconType} />
              </div>
              <div className="bkash-ad-body">
                <div className="bkash-tag-row">
                  <span className="bkash-ad-tag">{slide.tag}</span>
                  <span className="bkash-live-badge">{slide.liveBadge}</span>
                </div>
                <h3 className="bkash-ad-title">{slide.title}</h3>
                <div className="bkash-ad-ticket">
                  <span>{slide.ticketText}</span>
                  <span>{slide.ticketIcon}</span>
                </div>
              </div>
            </div>
            <div className="bkash-ad-right">
              <button className="bkash-tap-btn" type="button">
                <span>ট্যাপ করুন</span>
                <span>❯</span>
              </button>
              <span className="bkash-ad-condition">{slide.condition}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="bkash-arrow-btn prev"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        title="আগের বিজ্ঞাপন"
        aria-label="Previous Ad"
      >
        ❮
      </button>
      <button
        type="button"
        className="bkash-arrow-btn next"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        title="পরের বিজ্ঞাপন"
        aria-label="Next Ad"
      >
        ❯
      </button>

      <div className="bkash-ad-dots">
        {PROMO_SLIDES.map((s, idx) => (
          <span
            key={s.id}
            className={`bkash-dot ${realIndex === idx ? 'active' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              goToReal(idx);
            }}
            title={`অ্যাড ${idx + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
