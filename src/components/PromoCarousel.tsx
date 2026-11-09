import React, { useState, useEffect, useRef, useMemo } from 'react';
import { ChevronRight, Settings2, Sparkles } from 'lucide-react';
import { BannerAd, Language, UserSession } from '../types';
import { sounds } from '../utils/audio';

interface PromoCarouselProps {
  banners: BannerAd[];
  lang: Language;
  user: UserSession | null;
  onExploreOffer: (banner?: BannerAd) => void;
  onOpenBannerManager: () => void;
  onSaveBanners?: (banners: BannerAd[]) => void;
}

const FALLBACK_BANNER_IMAGE = 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=1000&q=80';

export const PromoCarousel: React.FC<PromoCarouselProps> = ({
  banners,
  lang,
  user,
  onExploreOffer,
  onOpenBannerManager
}) => {
  const activeBanners = useMemo(() => {
    const filtered = banners.filter(b => b.isActive !== false);
    return filtered.length > 0 ? filtered : banners;
  }, [banners]);

  const isSingle = activeBanners.length <= 1;

  // Cloned list for seamless infinite loop (bKash app style)
  const clonedList = useMemo(() => {
    if (isSingle) return activeBanners;
    const last = activeBanners[activeBanners.length - 1];
    const first = activeBanners[0];
    return [last, ...activeBanners, first];
  }, [activeBanners, isSingle]);

  // Index inside cloned list (1 is real slide 0; 0 for single)
  const [currentIndex, setCurrentIndex] = useState(isSingle ? 0 : 1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartXRef = useRef<number | null>(null);

  // Sync index when active banners change
  useEffect(() => {
    setCurrentIndex(isSingle ? 0 : 1);
    setIsTransitioning(false);
    setDragOffset(0);
  }, [activeBanners.length, isSingle]);

  // Pause rotation when browser tab is hidden to prevent frame drops or runaway timers
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsPaused(true);
      } else {
        setIsPaused(false);
        // Ensure index is strictly inside valid bounds upon returning
        if (!isSingle) {
          setCurrentIndex(prev => {
            if (prev < 1 || prev > activeBanners.length) {
              setIsTransitioning(false);
              return 1;
            }
            return prev;
          });
        }
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeBanners.length, isSingle]);

  // Bulletproof infinite loop reset: handles silent jumps when reaching cloned boundary slides
  useEffect(() => {
    if (isSingle) return;

    if (currentIndex === activeBanners.length + 1) {
      // Reached the clone of the first slide. Wait for the 350ms transition to finish, then silent snap to 1.
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(1);
      }, 360);
      return () => clearTimeout(timer);
    }

    if (currentIndex === 0) {
      // Reached the clone of the last slide. Wait for the 350ms transition to finish, then silent snap to N.
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(activeBanners.length);
      }, 360);
      return () => clearTimeout(timer);
    }

    // Hard safety guard: if index ever goes out of bounds, immediately reset to 1
    if (currentIndex > activeBanners.length + 1 || currentIndex < 0) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  }, [currentIndex, activeBanners.length, isSingle]);

  // Auto rotate every 4.5s
  useEffect(() => {
    if (isSingle || isPaused || isDragging) return;
    const timer = setInterval(() => {
      setIsTransitioning(true);
      setCurrentIndex(prev => {
        // Guard against runaway increments
        if (prev >= activeBanners.length + 1) {
          return 2;
        }
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [isSingle, isPaused, isDragging, activeBanners.length]);

  // Immediate infinite jump on transition end
  const handleTransitionEnd = (e: React.TransitionEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget || e.propertyName !== 'transform') return;
    if (isSingle) return;

    if (currentIndex === 0) {
      setIsTransitioning(false);
      setCurrentIndex(activeBanners.length);
    } else if (currentIndex === activeBanners.length + 1) {
      setIsTransitioning(false);
      setCurrentIndex(1);
    }
  };

  if (activeBanners.length === 0) return null;

  // Real active banner index for pagination bullets (0-based)
  const realSlideIndex = useMemo(() => {
    if (isSingle) return 0;
    if (currentIndex === 0) return activeBanners.length - 1;
    if (currentIndex === activeBanners.length + 1) return 0;
    const idx = currentIndex - 1;
    return (idx >= 0 && idx < activeBanners.length) ? idx : 0;
  }, [currentIndex, activeBanners.length, isSingle]);

  // Touch / Mouse Gesture Handlers for Live Physics Dragging
  const handleDragStart = (clientX: number) => {
    dragStartXRef.current = clientX;
    setIsDragging(true);
    setIsPaused(true);
    setDragOffset(0);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || dragStartXRef.current === null) return;
    const offset = clientX - dragStartXRef.current;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    setIsPaused(false);

    if (Math.abs(dragOffset) > 20 && !isSingle) {
      sounds.playTap();
      setIsTransitioning(true);
      if (dragOffset < 0) {
        // Dragged Left -> Next
        setCurrentIndex(prev => Math.min(prev + 1, activeBanners.length + 1));
      } else {
        // Dragged Right -> Prev
        setCurrentIndex(prev => Math.max(prev - 1, 0));
      }
    }
    setDragOffset(0);
    dragStartXRef.current = null;
  };

  // Safe track calculations
  const trackWidthPercent = isSingle ? 100 : clonedList.length * 100;
  const slideWidthPercent = isSingle ? 100 : 100 / clonedList.length;
  const translatePercent = isSingle ? 0 : (currentIndex * 100) / clonedList.length;

  return (
    <div className="px-4 py-1.5 select-none relative w-full max-w-full mx-auto">
      {/* Admin Quick Control Badge */}
      {user?.role === 'admin' && (
        <div className="flex items-center justify-between mb-1.5 px-0.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 dark:text-slate-200">
            <Sparkles className="w-3.5 h-3.5 text-[#E52E2E]" />
            <span>{lang === 'bn' ? 'মেইন পেইজ বিজ্ঞাপন' : 'Homepage Featured Ads'}</span>
            <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950 text-[#E52E2E] dark:text-rose-400">
              {activeBanners.length}টি
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => {
                sounds.playTap();
                onOpenBannerManager();
              }}
              className="flex items-center gap-1 text-[10px] font-bold text-[#E52E2E] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 border border-rose-200/80 dark:border-rose-900/60 px-2 py-0.5 rounded-full transition-all active:scale-95 shadow-2xs cursor-pointer"
            >
              <Settings2 className="w-3 h-3" />
              <span>{lang === 'bn' ? 'বিজ্ঞাপন নিয়ন্ত্রণ' : 'Manage Ads'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Draggable Swiper Container (Pure Infinite Loop Slider with Drag & Swipe) */}
      <div 
        onMouseDown={(e) => handleDragStart(e.clientX)}
        onMouseMove={(e) => handleDragMove(e.clientX)}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={(e) => handleDragStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleDragMove(e.touches[0].clientX)}
        onTouchEnd={handleDragEnd}
        className={`relative overflow-hidden rounded-2xl bg-slate-900 shadow-md border border-slate-200/80 dark:border-slate-800 touch-pan-y select-none h-28 sm:h-36 md:h-40 lg:h-44 ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
      >
        <div 
          className="flex h-full"
          onTransitionEnd={handleTransitionEnd}
          style={{
            width: `${trackWidthPercent}%`,
            transform: `translateX(calc(-${translatePercent}% + ${dragOffset}px))`,
            transition: (isDragging || !isTransitioning) ? 'none' : 'transform 0.35s cubic-bezier(0.25, 1, 0.5, 1)'
          }}
        >
          {clonedList.map((banner, index) => {
            const hasBannerLink = Boolean(
              banner.linkUrl && 
              banner.linkUrl.trim() !== '' && 
              banner.linkUrl.trim() !== '#' && 
              banner.linkUrl.trim() !== 'none'
            );
            const hasText = Boolean(
              (banner.titleBn && banner.titleBn.trim()) ||
              (banner.titleEn && banner.titleEn.trim()) ||
              (banner.badgeBn && banner.badgeBn.trim()) ||
              (banner.badgeEn && banner.badgeEn.trim()) ||
              (banner.subtitleBn && banner.subtitleBn.trim()) ||
              (banner.subtitleEn && banner.subtitleEn.trim())
            );

            return (
              <div 
                key={`${banner.id}-${index}`}
                onClick={() => {
                  if (!isDragging && hasBannerLink) {
                    sounds.playTap();
                    onExploreOffer(banner);
                  }
                }}
                style={{ width: `${slideWidthPercent}%` }}
                className={`relative h-full shrink-0 overflow-hidden bg-slate-900 ${hasBannerLink ? 'cursor-pointer' : 'cursor-grab'}`}
              >
                <img
                  src={banner.imageUrl || FALLBACK_BANNER_IMAGE}
                  alt={banner.titleBn || 'বিজ্ঞাপন'}
                  referrerPolicy="no-referrer"
                  draggable={false}
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== FALLBACK_BANNER_IMAGE) {
                      target.src = FALLBACK_BANNER_IMAGE;
                    }
                  }}
                  className="w-full h-full object-cover object-center pointer-events-none select-none"
                />

                {/* Offer Badge (Top Left) */}
                {(banner.badgeBn || banner.badgeEn || hasText) && (
                  <div className="absolute top-2.5 left-2.5 z-10 pointer-events-none">
                    <span className="bg-[#ff5722] text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase shadow-xs">
                      {banner.badgeBn || (lang === 'bn' ? 'অফার' : 'Offer')}
                    </span>
                  </div>
                )}

                {/* Details Button / Overlay (Bottom Right) */}
                {hasBannerLink && (
                  <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
                    <span className="flex items-center gap-0.5 bg-white/25 hover:bg-white/40 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full border border-white/40 shadow-xs">
                      <span>{lang === 'bn' ? 'বিস্তারিত' : 'Details'}</span>
                      <ChevronRight className="w-3 h-3 stroke-[2.5]" />
                    </span>
                  </div>
                )}

                {/* Title & Subtitle overlay if present */}
                {hasText && (
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex items-center justify-start px-3.5 py-2.5 text-white pointer-events-none">
                    <div className="max-w-[70%] mt-3">
                      {(banner.titleBn || banner.titleEn) && (
                        <h4 className="text-xs sm:text-sm font-black text-white leading-tight line-clamp-1 drop-shadow-sm">
                          {lang === 'bn' ? banner.titleBn : banner.titleEn}
                        </h4>
                      )}
                      {(banner.subtitleBn || banner.subtitleEn) && (
                        <p className="text-[10px] text-slate-200 line-clamp-1 opacity-90 mt-0.5">
                          {lang === 'bn' ? banner.subtitleBn : banner.subtitleEn}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Swiper Pagination Bullets (Bottom Center) */}
        {activeBanners.length > 1 && (
          <div className="absolute bottom-1.5 left-0 right-0 z-20 flex justify-center items-center gap-1 pointer-events-none">
            {activeBanners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  sounds.playTap();
                  setIsTransitioning(true);
                  setCurrentIndex(idx + 1);
                }}
                className={`transition-all duration-300 pointer-events-auto cursor-pointer ${
                  realSlideIndex === idx
                    ? 'w-4 h-1.5 rounded-full bg-white shadow-xs'
                    : 'w-1.5 h-1.5 rounded-full bg-white/60 hover:bg-white'
                }`}
                aria-label={`Slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
