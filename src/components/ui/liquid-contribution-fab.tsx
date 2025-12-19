"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Heart, X, ArrowRight, Users, Clock, Brain, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { tabsData, colorClasses, ContributionOption } from "@/lib/contribution-data";
import { cn } from "@/lib/utils";

const menuItems = Object.entries(tabsData).map(([key, data]) => ({
  key,
  ...data,
}));

const allTabKeys = Object.keys(tabsData);

// Menu item icons mapping
const menuIcons: Record<string, React.ReactNode> = {
  social: <Users className="w-5 h-5" />,
  time: <Clock className="w-5 h-5" />,
  knowledge: <Brain className="w-5 h-5" />,
  money: <DollarSign className="w-5 h-5" />,
};

function ContributionCard({
  option,
  color,
}: {
  option: ContributionOption;
  color: keyof typeof colorClasses;
}) {
  const colors = colorClasses[color];

  return (
    <Card
      variant="dark"
      padding="md"
      className="flex flex-col w-[240px] h-[280px] bg-transparent border-white/10"
    >
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
        {option.external ? (
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

type MenuState = "closed" | "menu" | "cards";

export function LiquidContributionFab() {
  const [menuState, setMenuState] = useState<MenuState>("closed");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
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
      if (e.key === "Escape" && menuState !== "closed") {
        setMenuState("closed");
        setActiveItem(null);
        setExpandedItem(null);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [menuState]);

  useEffect(() => {
    if (menuState === "closed") return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest("[data-liquid-fab]")) {
        setMenuState("closed");
        setActiveItem(null);
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
  }, [menuState]);

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (switchTimeoutRef.current) clearTimeout(switchTimeoutRef.current);
    };
  }, []);

  // Update menu state based on activeItem
  useEffect(() => {
    if (activeItem) {
      setMenuState("cards");
    } else if (menuState === "cards") {
      setMenuState("menu");
    }
  }, [activeItem, menuState]);

  const handleFabClick = useCallback(() => {
    if (menuState === "closed") {
      setMenuState("menu");
    } else {
      setMenuState("closed");
      setActiveItem(null);
      setExpandedItem(null);
    }
  }, [menuState]);

  const handleFabHover = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (menuState === "closed") {
      setMenuState("menu");
    }
  }, [isMobile, menuState]);

  const handleWidgetLeave = useCallback(() => {
    if (isMobile) return;
    hideTimeoutRef.current = setTimeout(() => {
      setMenuState("closed");
      setActiveItem(null);
    }, 300);
  }, [isMobile]);

  const handleWidgetEnter = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
  }, [isMobile]);

  const handleMenuItemHover = useCallback(
    (key: string) => {
      if (isMobile) return;
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      if (!activeItem) {
        setActiveItem(key);
        return;
      }

      if (activeItem === key) {
        if (switchTimeoutRef.current) {
          clearTimeout(switchTimeoutRef.current);
          switchTimeoutRef.current = null;
        }
        return;
      }

      if (switchTimeoutRef.current) {
        clearTimeout(switchTimeoutRef.current);
      }
      switchTimeoutRef.current = setTimeout(() => {
        setActiveItem(key);
      }, 150);
    },
    [isMobile, activeItem]
  );

  const handleMenuItemLeave = useCallback(() => {
    if (isMobile) return;
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
  }, [isMobile]);

  const handleMenuItemClick = useCallback(
    (key: string) => {
      if (isMobile) {
        setExpandedItem((prev) => (prev === key ? null : key));
      }
    },
    [isMobile]
  );

  const handleCardsEnter = useCallback(() => {
    if (isMobile) return;
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }
    if (switchTimeoutRef.current) {
      clearTimeout(switchTimeoutRef.current);
      switchTimeoutRef.current = null;
    }
  }, [isMobile]);

  const handleCardsLeave = useCallback(() => {
    if (isMobile) return;
    hideTimeoutRef.current = setTimeout(() => {
      setActiveItem(null);
    }, 200);
  }, [isMobile]);

  // Get container dimensions based on state
  // Menu: 4 items × 44px + gaps (3 × 12px) + padding (16px top + 72px bottom for FAB) = 264px height
  const getDimensions = () => {
    if (menuState === "closed") return { width: 56, height: 56 };
    if (menuState === "menu" || !activeItem) return { width: 200, height: 280 };
    return { width: 1000, height: 340 };
  };

  const { width, height } = getDimensions();
  const showMenu = menuState !== "closed";
  const showCards = menuState === "cards" && activeItem;

  return (
    <div
      data-liquid-fab
      className="fixed bottom-6 right-6 z-40"
      onMouseEnter={handleWidgetEnter}
      onMouseLeave={handleWidgetLeave}
    >
      {/* SVG Filters for Liquid Glass Effect */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          {/* Liquid Glass Filter with refraction and glow */}
          <filter id="liquid-glass" x="-50%" y="-50%" width="200%" height="200%">
            {/* Turbulence for organic distortion */}
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.015"
              numOctaves="3"
              seed="1"
              result="turbulence"
            />
            {/* Displacement map for refraction effect */}
            <feDisplacementMap
              in="SourceGraphic"
              in2="turbulence"
              scale="8"
              xChannelSelector="R"
              yChannelSelector="G"
              result="displaced"
            />
            {/* Blur for glass effect */}
            <feGaussianBlur in="displaced" stdDeviation="0.5" result="blurred" />
            {/* Color matrix for saturation boost */}
            <feColorMatrix in="blurred" type="saturate" values="1.2" result="saturated" />
            {/* Specular lighting for shine */}
            <feSpecularLighting
              in="turbulence"
              surfaceScale="2"
              specularConstant="0.8"
              specularExponent="20"
              result="specular"
            >
              <fePointLight x="-50" y="-100" z="200" />
            </feSpecularLighting>
            {/* Composite specular with main image */}
            <feComposite in="specular" in2="saturated" operator="in" result="specularComposite" />
            {/* Blend everything together */}
            <feBlend in="saturated" in2="specularComposite" mode="screen" result="final" />
          </filter>

          {/* Glow filter for outer shine */}
          <filter id="liquid-glow" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="12" result="blur" />
            <feFlood floodColor="rgba(255,255,255,0.15)" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="glow" />
            <feMerge>
              <feMergeNode in="glow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Liquid Glass Background */}
      <div
        className="absolute bottom-0 right-0 transition-all duration-500 ease-out rounded-3xl overflow-hidden"
        style={{
          width: `${width}px`,
          height: `${height}px`,
          background: "rgba(37, 34, 32, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          filter: "url(#liquid-glow)",
        }}
      >
        {/* Inner shine gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 80% 50% at 20% 10%, rgba(255,255,255,0.12) 0%, transparent 50%),
              radial-gradient(ellipse 60% 40% at 80% 90%, rgba(255,255,255,0.06) 0%, transparent 50%)
            `,
          }}
        />

        {/* Animated liquid shine effect */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            background:
              "linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.15) 50%, transparent 60%)",
            animation: "liquidShine 3s ease-in-out infinite",
          }}
        />
      </div>

      {/* Cards content */}
      {!isMobile && (
        <div
          className={cn(
            "absolute bottom-4 right-[220px] transition-all duration-400 ease-out",
            showCards ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          )}
          onMouseEnter={handleCardsEnter}
          onMouseLeave={handleCardsLeave}
        >
          <div className="p-4">
            <div
              className="relative"
              style={{ width: "calc(240px * 3 + 12px * 2)", height: "280px" }}
            >
              {allTabKeys.map((tabKey) => {
                const isVisible = activeItem === tabKey;
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
                          isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
                        )}
                        style={{
                          transitionDelay: isVisible ? `${optIndex * 75}ms` : "0ms",
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

      {/* Menu items */}
      <div
        className={cn(
          "absolute bottom-[72px] right-4 flex flex-col-reverse gap-3",
          "transition-all duration-400",
          showMenu ? "opacity-100" : "opacity-0 pointer-events-none"
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
                showMenu ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
              style={{
                transitionDelay: showMenu ? `${index * 50}ms` : "0ms",
              }}
              onMouseEnter={() => handleMenuItemHover(item.key)}
              onMouseLeave={handleMenuItemLeave}
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

              {/* Menu item button */}
              <button
                onClick={() => handleMenuItemClick(item.key)}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 rounded-full whitespace-nowrap",
                  "text-marble-100 text-sm font-medium",
                  "transition-all duration-200",
                  "hover:bg-white/5",
                  isActive && "bg-white/10"
                )}
              >
                <span className="w-5 h-5 text-marble-300">{menuIcons[item.key]}</span>
                <span>{item.label}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* FAB Button - Liquid Glass Style */}
      <button
        onClick={handleFabClick}
        onMouseEnter={handleFabHover}
        className={cn(
          "relative z-10 rounded-full w-14 h-14 p-0 transition-all duration-300",
          "flex items-center justify-center",
          menuState !== "closed" && "rotate-45"
        )}
        style={{
          background: "rgba(37, 34, 32, 0.65)",
          backdropFilter: "blur(24px) saturate(180%)",
          WebkitBackdropFilter: "blur(24px) saturate(180%)",
          border: "1px solid rgba(255, 255, 255, 0.18)",
          boxShadow: `
            0 8px 32px rgba(0, 0, 0, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 -1px 0 rgba(0, 0, 0, 0.1)
          `,
          filter: "url(#liquid-glow)",
        }}
        aria-label={menuState === "closed" ? "Ways to contribute" : "Close menu"}
        aria-expanded={menuState !== "closed"}
      >
        {/* Inner shine for FAB */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 30% 20%, rgba(255,255,255,0.15) 0%, transparent 50%)",
          }}
        />
        {menuState !== "closed" ? (
          <X className="w-6 h-6 text-marble-300 relative z-10" />
        ) : (
          <Heart className="w-6 h-6 text-marble-300 relative z-10" />
        )}
      </button>

      {/* CSS Animation for liquid shine */}
      <style jsx>{`
        @keyframes liquidShine {
          0%,
          100% {
            transform: translateX(-100%) rotate(135deg);
            opacity: 0;
          }
          50% {
            transform: translateX(100%) rotate(135deg);
            opacity: 0.3;
          }
        }
      `}</style>
    </div>
  );
}
