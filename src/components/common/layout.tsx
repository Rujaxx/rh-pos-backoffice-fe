"use client";

import type { ReactNode } from "react";
import Sidebar from "./sidebar";
import TopNav from "./top-nav";
import { useEffect, useState } from "react";
import { useI18n } from "@/providers/i18n-provider";
import { SidebarProvider, useSidebar } from "@/providers/sidebar-provider";

interface LayoutProps {
  children: ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const { locale } = useI18n();
  const { menuState, isHovered, isMobile } = useSidebar();
  const [mounted, setMounted] = useState(false);

  const isRTL = locale === "ar";

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Calculate margin based on menu state, hover, and language direction - only for desktop
  const getSidebarMargin = () => {
    if (isMobile) {
      return { marginLeft: "0", marginRight: "0" }; // No margin on mobile, sidebar is overlay
    }

    let marginValue = "0";
    if (menuState === "hidden") {
      marginValue = "0";
    } else if (menuState === "collapsed" && isHovered) {
      marginValue = "16rem"; // 256px - full width
    } else if (menuState === "collapsed") {
      marginValue = "4rem"; // 64px - collapsed width
    } else {
      marginValue = "16rem"; // 256px - full width
    }

    // Apply margin to the correct side based on language direction
    return isRTL
      ? { marginLeft: "0", marginRight: marginValue }
      : { marginLeft: marginValue, marginRight: "0" };
  };

  return (
    <div className={`flex h-screen ${isRTL ? "flex-row-reverse" : ""}`}>
      <Sidebar />
      <div
        className="w-full flex flex-1 flex-col transition-all duration-300 ease-in-out min-w-0"
        style={getSidebarMargin()}
      >
        <header className="h-16 border-b border-gray-200 dark:border-[#1F1F23] flex-shrink-0">
          <TopNav />
        </header>
        <main className="flex-1 overflow-auto p-3 sm:p-6 bg-white dark:bg-[#0F0F12] min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <LayoutContent>{children}</LayoutContent>
    </SidebarProvider>
  );
}
