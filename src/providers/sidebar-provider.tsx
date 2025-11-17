"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type MenuState = "full" | "collapsed" | "hidden";

interface SidebarContextType {
  // Desktop menu state
  menuState: MenuState;
  toggleMenuState: () => void;
  setMenuState: (state: MenuState) => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;

  // Mobile menu state
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;

  // Device state
  isMobile: boolean;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [menuState, setMenuStateInternal] = useState<MenuState>("full");
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [previousDesktopState, setPreviousDesktopState] =
    useState<MenuState>("full");

  // Cycle through menu states: full -> collapsed -> hidden -> full
  const toggleMenuState = () => {
    setMenuStateInternal((prev) => {
      switch (prev) {
        case "full":
          return "collapsed";
        case "collapsed":
          return "hidden";
        case "hidden":
          return "full";
        default:
          return "full";
      }
    });
  };

  // Set menu state (for external control like theme customizer)
  const setMenuState = (state: MenuState) => {
    if (!isMobile) {
      setMenuStateInternal(state);
    }
  };

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 1024; // lg breakpoint
      setIsMobile(!isDesktop);

      if (!isDesktop) {
        // On mobile/tablet, save current desktop state and set to hidden
        if (menuState !== "hidden") {
          setPreviousDesktopState(menuState);
          setMenuStateInternal("hidden");
        }
      } else {
        // On desktop, restore previous state if coming from mobile
        if (menuState === "hidden" && previousDesktopState !== "hidden") {
          setMenuStateInternal(previousDesktopState);
        }
      }
    };

    // Check on mount
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [menuState, previousDesktopState]);

  const value = {
    menuState,
    toggleMenuState,
    setMenuState,
    isHovered,
    setIsHovered,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    isMobile,
  };

  return (
    <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>
  );
}

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (context === undefined) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }
  return context;
};
