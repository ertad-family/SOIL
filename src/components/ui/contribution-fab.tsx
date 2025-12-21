"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, X, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { tabsData, colorClasses, ContributionOption } from "@/lib/contribution-data";
import { cn } from "@/lib/utils";
import { ShareButton } from "@/components/ui/share-button";

const menuItems = Object.entries(tabsData).map(([key, data]) => ({
  key,
  ...data,
}));

// All possible tab keys for rendering all card sets
const allTabKeys = Object.keys(tabsData);

function ContributionCard({
  option,
  color,
}: {
  option: ContributionOption;
  color: keyof typeof colorClasses;
}) {
  const colors = colorClasses[color];

  return (
    <Card variant="dark" padding="md" className="flex flex-col w-[240px] h-[280px]">
      <CardHeader className="pb-2">
        <div
          className={cn(
            "w-10 h-10 rounded-full flex items-center justify-center mb-2",
            colors.iconBg,
            colors.iconText
          )}
        >
          {option.icon}
        </div>
        <CardTitle variant="dark" className="text-base">
          {option.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-slate-400 text-xs leading-relaxed flex-1 mb-3 line-clamp-4">
          {option.description}
        </p>
        {/* Render ShareButton for Spread the Word card */}
        {option.title.includes("Spread") ? (
          <div className="flex justify-center">
            <ShareButton
              url={option.href}
              title="SOIL - Where founders share their stories for science"
              description="Help build the future of organizational research. Join the movement at soil.rip"
            />
          </div>
        ) : option.external ? (
          <a href={option.href} target="_blank" rel="noopener noreferrer">
            <Button
              variant="dark-secondary"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        ) : (
          <a href={option.href}>
            <Button
              variant="dark-secondary"
              size="sm"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              {option.cta}
            </Button>
          </a>
        )}
      </CardContent>
    </Card>
  );
}

export function ContributionFab() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [pendingItem, setPendingItem] = useState<string | null>(null);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const switchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setActiveItem(null);
        setPendingItem(null);
        setExpandedItem(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-contribution-fab]")) {
        setIsOpen(false);
        setActiveItem(null);
        setPendingItem(null);
        setExpandedItem(null);
      }
    };

    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    };
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => !prev);
    if (isOpen) {
      setActiveItem(null);
      setPendingItem(null);
      setExpandedItem(null);
    }
  }, [isOpen]);

  const handleItemClick = useCallback(
    (key: string) => {
      if (isMobile) {
        setExpandedItem((prev) => (prev === key ? null : key));
      }
    },
    [isMobile]
  );

  // Desktop: show item with delay when switching between items
  const handleMouseEnterItem = useCallback(
    (key: string) => {
      if (isMobile) return;

      // Clear any pending hide
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      // If no active item, show immediately
      if (!activeItem) {
        setActiveItem(key);
        setPendingItem(null);
        return;
      }

      // If same item, do nothing
      if (activeItem === key) {
        if (switchTimeoutRef.current) {
          clearTimeout(switchTimeoutRef.current);
          switchTimeoutRef.current = null;
        }
        setPendingItem(null);
        return;
      }

      // Different item - delay the switch
      setPendingItem(key);
      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
      switchTimeoutRef.current = setTimeout(() => {
        setActiveItem(key);
        setPendingItem(null);
      }, 200);
    },
    [isMobile, activeItem]
  );

  const handleMouseLeaveItem = useCallback(() => {
    if (isMobile) return;

    // Clear any pending switch
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
    setPendingItem(null);

    hideTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  }, [isMobile]);

  const handleMouseEnterCards = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    // Also clear switch timeout when entering cards
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
    setPendingItem(null);
  }, [isMobile]);

  const handleMouseLeaveCards = useCallback(() => {
    if (isMobile) return;
    hideTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  }, [isMobile]);

  const showOptions = isMobile ? expandedItem : activeItem;

  // Open menu on hover
  const handleMouseEnterFab = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    setIsOpen(true);
  }, [isMobile]);

  const handleMouseLeaveFab = useCallback(() => {
    if (isMobile) return;
    // Only close if no active item (user not interacting with cards)
    if (!activeItem) {
      hideTimeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 200);
    }
  }, [isMobile, activeItem]);

  // Close menu when leaving the entire widget area
  const handleMouseLeaveWidget = useCallback(() => {
    if (isMobile) return;
    hideTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setActiveItem(null);
      setPendingItem(null);
    }, 200);
  }, [isMobile]);

  const handleMouseEnterWidget = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, [isMobile]);

  // Suppress unused variable warning
  void pendingItem;

  return (
    <div
      data-contribution-fab
      className="fixed bottom-6 right-6 z-40"
      onMouseEnter={handleMouseEnterWidget}
      onMouseLeave={handleMouseLeaveWidget}
    >
      {/* Combined backdrop - L-shaped form with cards area + menu area */}
      {!isMobile && (
        <div
          className={cn(
            "absolute bottom-16 right-0 transition-all duration-300 ease-in-out pointer-events-none",
            isOpen ? "opacity-100" : "opacity-0"
          )}
        >
          {/* Glassmorphism overlay div - for actual backdrop-filter */}
          <div
            className="absolute bottom-0 right-0 overflow-hidden"
            style={{
              width: showOptions ? "1020px" : "220px",
              height: showOptions ? "340px" : "220px",
              background: "rgba(37, 34, 32, 0.6)",
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
              clipPath: showOptions
                ? 'path("M 30 0 H 790 Q 820 0 820 30 V 120 H 990 Q 1020 120 1020 150 V 310 Q 1020 340 990 340 H 30 Q 0 340 0 310 V 30 Q 0 0 30 0 Z")'
                : "inset(0 round 30px)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              boxShadow: "0 25px 50px rgba(0, 0, 0, 0.4)",
              transition: "all 0.3s ease-in-out",
            }}
          >
            {/* Inner glow effect */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  "radial-gradient(ellipse at top left, rgba(255, 255, 255, 0.08) 0%, transparent 50%)",
              }}
            />
          </div>
        </div>
      )}

      {/* Cards content - positioned inside the L-shape */}
      {!isMobile && (
        <div
          className={cn(
            "absolute bottom-16 right-[220px] transition-all duration-300 ease-in-out pointer-events-auto",
            showOptions ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          onMouseEnter={handleMouseEnterCards}
          onMouseLeave={handleMouseLeaveCards}
        >
          <div className="p-6">
            <div
              className="relative"
              style={{ width: "calc(240px * 3 + 12px * 2)", height: "280px" }}
            >
              {allTabKeys.map((tabKey) => {
                const isVisible = showOptions === tabKey;
                const tab = tabsData[tabKey];

                return (
                  <div
                    key={tabKey}
                    className={cn(
                      "absolute inset-0 flex flex-row-reverse gap-3",
                      "transition-opacity duration-300 ease-in-out",
                      isVisible
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                    )}
                  >
                    {tab.options.map((option, optIndex) => (
                      <div
                        key={`${tabKey}-${optIndex}`}
                        className={cn(
                          "transition-all duration-300 ease-out",
                          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                        )}
                        style={{
                          transitionDelay: isVisible ? `${optIndex * 50}ms` : "0ms",
                        }}
                      >
                        <ContributionCard option={option} color={tab.color} />
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Menu Items - floating pills */}
      <div
        className={cn(
          "absolute bottom-16 right-0 flex flex-col-reverse gap-2",
          "transition-all duration-300",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
        )}
      >
        {menuItems.map((item, index) => {
          const isExpanded = expandedItem === item.key;
          const isActive = isMobile ? isExpanded : activeItem === item.key;

          return (
            <div
              key={item.key}
              className={cn(
                "relative transition-all duration-300 ease-out",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
              onMouseEnter={() => handleMouseEnterItem(item.key)}
              onMouseLeave={handleMouseLeaveItem}
            >
              {/* Mobile: Cards below menu item */}
              {isMobile && isExpanded && (
                <div className="flex flex-col gap-2 mb-2">
                  {item.options.map((option, optIndex) => (
                    <div
                      key={optIndex}
                      className="transition-all duration-200"
                      style={{
                        transitionDelay: `${optIndex * 50}ms`,
                      }}
                    >
                      <ContributionCard option={option} color={item.color} />
                    </div>
                  ))}
                </div>
              )}

              {/* Main menu item - pill style with glassmorphism */}
              <button
                onClick={() => handleItemClick(item.key)}
                className={cn(
                  "flex items-center gap-3 px-5 py-3 rounded-full whitespace-nowrap",
                  "text-marble-100 text-sm font-medium",
                  "transition-all duration-200",
                  isActive && "scale-105"
                )}
                style={{
                  background: isActive ? "rgba(37, 34, 32, 0.8)" : "rgba(37, 34, 32, 0.6)",
                  backdropFilter: "blur(16px) saturate(150%)",
                  WebkitBackdropFilter: "blur(16px) saturate(150%)",
                  border: isActive
                    ? "1px solid rgba(255, 255, 255, 0.2)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  boxShadow: "0 8px 32px -8px rgba(0, 0, 0, 0.4)",
                }}
              >
                <span className="w-5 h-5 text-marble-300">{item.icon}</span>
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* FAB Button */}
      <Button
        variant="dark-primary"
        size="lg"
        onClick={toggleMenu}
        onMouseEnter={handleMouseEnterFab}
        onMouseLeave={handleMouseLeaveFab}
        className={cn(
          "rounded-full w-14 h-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300",
          isOpen && "rotate-45"
        )}
        aria-label={isOpen ? "Close contribution menu" : "Ways to contribute"}
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-6 h-6" /> : <Heart className="w-6 h-6" />}
      </Button>
    </div>
  );
}
