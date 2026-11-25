import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Language } from '../types';
import { sounds } from '../utils/audio';

export type TabId = 'home' | 'transactions' | 'ledger' | 'profile';

interface BottomNavProps {
  activeTab: TabId;
  lang: Language;
  onTabChange: (tab: TabId) => void;
  onQuickEntry?: (type: 'income' | 'expense') => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  lang,
  onTabChange,
  onQuickEntry
}) => {
  const isBn = lang === 'bn';

  const navBarRef = useRef<HTMLElement | null>(null);
  const indicatorRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<TabId, HTMLButtonElement | null>>({
    home: null,
    transactions: null,
    ledger: null,
    profile: null
  });
  const longPressMenuRef = useRef<HTMLDivElement | null>(null);

  const pressTimerRef = useRef<number | null>(null);
  const suppressNextClickRef = useRef(false);
  const lastScrollYRef = useRef(typeof window !== 'undefined' ? window.scrollY : 0);

  const [isNavHidden, setIsNavHidden] = useState(false);
  const [showLongPressMenu, setShowLongPressMenu] = useState(false);
  const [popAnimState, setPopAnimState] = useState<{ tab: TabId; tick: number }>({
    tab: activeTab,
    tick: 0
  });

  const updateIndicatorPosition = useCallback(() => {
    const navBar = navBarRef.current;
    const indicator = indicatorRef.current;
    const activeEl = itemRefs.current[activeTab];
    if (!navBar || !indicator || !activeEl) return;

    const containerRect = navBar.getBoundingClientRect();
    const elementRect = activeEl.getBoundingClientRect();
    const elementCenter = elementRect.left - containerRect.left + elementRect.width / 2;
    const indicatorWidth = indicator.offsetWidth || 20;
    const leftPosition = elementCenter - indicatorWidth / 2;
    indicator.style.transform = `translateX(${leftPosition}px)`;
  }, [activeTab]);

  useLayoutEffect(() => {
    updateIndicatorPosition();
  }, [updateIndicatorPosition, lang]);

  useEffect(() => {
    const handleResize = () => updateIndicatorPosition();
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    window.addEventListener('load', handleResize);
    const rafId = window.requestAnimationFrame(handleResize);

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== 'undefined' && navBarRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updateIndicatorPosition();
      });
      resizeObserver.observe(navBarRef.current);
      Object.values(itemRefs.current).forEach((el) => {
        if (el) resizeObserver?.observe(el);
      });
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      window.removeEventListener('load', handleResize);
      window.cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updateIndicatorPosition]);

  // Show nav immediately when switching tabs
  useEffect(() => {
    setIsNavHidden(false);
  }, [activeTab]);

  // Scroll hide/show effect
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (lastScrollYRef.current < currentScrollY && currentScrollY > 50) {
        setIsNavHidden(true);
        setShowLongPressMenu(false);
      } else {
        setIsNavHidden(false);
      }
      lastScrollYRef.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closePopupMenu = useCallback(() => {
    setShowLongPressMenu(false);
    window.setTimeout(() => {
      suppressNextClickRef.current = false;
    }, 100);
  }, []);

  // Close long-press popup when tapping/clicking outside
  useEffect(() => {
    if (!showLongPressMenu) return;
    const handleDocumentClick = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node | null;
      const trxBtn = itemRefs.current.transactions;
      const menuEl = longPressMenuRef.current;
      if (!target) return;
      if (menuEl?.contains(target) || trxBtn?.contains(target)) return;
      closePopupMenu();
    };

    document.addEventListener('mousedown', handleDocumentClick);
    document.addEventListener('touchstart', handleDocumentClick, { passive: true });
    return () => {
      document.removeEventListener('mousedown', handleDocumentClick);
      document.removeEventListener('touchstart', handleDocumentClick);
    };
  }, [showLongPressMenu, closePopupMenu]);

  useEffect(() => {
    return () => {
      if (pressTimerRef.current !== null) {
        window.clearTimeout(pressTimerRef.current);
      }
    };
  }, []);

  const triggerTabClick = (tab: TabId) => {
    if (tab === 'transactions' && suppressNextClickRef.current) {
      suppressNextClickRef.current = false;
      return;
    }

    sounds.playTap();
    try {
      if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
        navigator.vibrate(30);
      }
    } catch {}

    setPopAnimState((prev) => ({ tab, tick: prev.tick + 1 }));
    closePopupMenu();
    onTabChange(tab);
  };

  const startLongPress = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
    }
    suppressNextClickRef.current = false;
    pressTimerRef.current = window.setTimeout(() => {
      suppressNextClickRef.current = true;
      setShowLongPressMenu(true);
      sounds.playTap();
      try {
        if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
          navigator.vibrate([50, 50, 50]);
        }
      } catch {}
    }, 400);
  };

  const cancelLongPress = () => {
    if (pressTimerRef.current !== null) {
      window.clearTimeout(pressTimerRef.current);
      pressTimerRef.current = null;
    }
  };

  const handleLongPressOption = (type: 'income' | 'expense', e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    e.stopPropagation();
    sounds.playTap();
    closePopupMenu();
    if (onQuickEntry) {
      onQuickEntry(type);
    }
  };

  return (
    <nav
      ref={navBarRef}
      id="bottomNav"
      aria-label={isBn ? 'মূল নেভিগেশন' : 'Main Navigation'}
      className={`pcn-bottom-nav print:hidden ${isNavHidden ? 'hide-nav' : ''}`}
    >
      {/* Sliding Red Indicator */}
      <div ref={indicatorRef} id="navIndicator" className="pcn-nav-indicator" aria-hidden="true" />

      {/* 1. Home */}
      <button
        ref={(el) => { itemRefs.current.home = el; }}
        type="button"
        aria-current={activeTab === 'home' ? 'page' : undefined}
        onClick={() => triggerTabClick('home')}
        className={`pcn-nav-item ${activeTab === 'home' ? 'active' : ''}`}
      >
        <svg
          key={popAnimState.tab === 'home' ? `home-${popAnimState.tick}` : 'home'}
          viewBox="0 -960 960 960"
          aria-hidden="true"
          className={`pcn-nav-svg ${popAnimState.tab === 'home' && popAnimState.tick > 0 ? 'pcn-animate-icon' : ''}`}
        >
          <path d="M160-120v-480l320-240 320 240v480H560v-280H400v280H160Z" />
        </svg>
        <span className="pcn-nav-text">{isBn ? 'হোম' : 'Home'}</span>
      </button>

      {/* 2. Transactions (৳) with Long Press Income / Expense Quick Entry */}
      <div className="pcn-nav-item-wrap">
        <button
          ref={(el) => { itemRefs.current.transactions = el; }}
          id="transactionBtn"
          type="button"
          aria-current={activeTab === 'transactions' ? 'page' : undefined}
          onMouseDown={startLongPress}
          onTouchStart={startLongPress}
          onMouseUp={cancelLongPress}
          onMouseLeave={cancelLongPress}
          onTouchEnd={cancelLongPress}
          onTouchCancel={cancelLongPress}
          onContextMenu={(e) => e.preventDefault()}
          onClick={() => triggerTabClick('transactions')}
          className={`pcn-nav-item ${activeTab === 'transactions' ? 'active' : ''}`}
        >
          <span
            key={popAnimState.tab === 'transactions' ? `trx-${popAnimState.tick}` : 'trx'}
            className={`pcn-taka-icon ${popAnimState.tab === 'transactions' && popAnimState.tick > 0 ? 'pcn-animate-icon' : ''}`}
          >
            ৳
          </span>
          <span className="pcn-nav-text">{isBn ? 'লেনদেন' : 'History'}</span>
        </button>

        {/* Long Press Popup Menu */}
        <div
          ref={longPressMenuRef}
          id="longPressMenu"
          role="menu"
          aria-label={isBn ? 'দ্রুত আয়-ব্যয় এন্ট্রি' : 'Quick Income/Expense Entry'}
          className={`pcn-long-press-menu ${showLongPressMenu ? 'show' : ''}`}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handleLongPressOption('income', e)}
            className="pcn-lp-btn income"
          >
            {isBn ? '+ আয়' : '+ Income'}
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={(e) => handleLongPressOption('expense', e)}
            className="pcn-lp-btn expense"
          >
            {isBn ? '- ব্যয়' : '- Expense'}
          </button>
        </div>
      </div>

      {/* 3. Ledger (হিসাব খাতা) */}
      <button
        ref={(el) => { itemRefs.current.ledger = el; }}
        type="button"
        aria-current={activeTab === 'ledger' ? 'page' : undefined}
        onClick={() => triggerTabClick('ledger')}
        className={`pcn-nav-item ${activeTab === 'ledger' ? 'active' : ''}`}
      >
        <svg
          key={popAnimState.tab === 'ledger' ? `ledger-${popAnimState.tick}` : 'ledger'}
          viewBox="0 -960 960 960"
          aria-hidden="true"
          className={`pcn-nav-svg ${popAnimState.tab === 'ledger' && popAnimState.tick > 0 ? 'pcn-animate-icon' : ''}`}
        >
          <path d="M480-160q-48-38-104-59t-116-21q-42 0-82.5 11T100-198q-21 11-40.5-1T40-234v-482q0-11 5.5-21T62-752q46-24 96-36t102-12q58 0 113.5 15T480-740v484q51-32 107-48t113-16q36 0 70.5 6t69.5 18v-480q15 5 29.5 10.5T898-752q11 5 16.5 15t5.5 21v482q0 23-19.5 35t-40.5 1q-37-20-77.5-31T700-240q-60 0-116 21t-104 59Zm80-200v-380l200-200v400L560-360Z" />
        </svg>
        <span className="pcn-nav-text">{isBn ? 'হিসাব খাতা' : 'Ledger'}</span>
      </button>

      {/* 4. Menu (মেনু) */}
      <button
        ref={(el) => { itemRefs.current.profile = el; }}
        type="button"
        aria-current={activeTab === 'profile' ? 'page' : undefined}
        onClick={() => triggerTabClick('profile')}
        className={`pcn-nav-item ${activeTab === 'profile' ? 'active' : ''}`}
      >
        <svg
          key={popAnimState.tab === 'profile' ? `profile-${popAnimState.tick}` : 'profile'}
          viewBox="0 -960 960 960"
          aria-hidden="true"
          className={`pcn-nav-svg ${popAnimState.tab === 'profile' && popAnimState.tick > 0 ? 'pcn-animate-icon' : ''}`}
        >
          <path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z" />
        </svg>
        <span className="pcn-nav-text">{isBn ? 'মেনু' : 'Menu'}</span>
      </button>
    </nav>
  );
};

