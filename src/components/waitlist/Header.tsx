"useclient";

import React, { useState } from "react";
import DesktopNav from "@/components/waitlist/DesktopNav";
import MobileNav from "@/components/waitlist/MobileNav";

interface HeaderProps {
  handleScrollToJoin: () => void;
}

export default function Header({ handleScrollToJoin }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
const handleNavItemClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-3">
        <div className="flex justify-between items-center h-16">
          <DesktopNav handleScrollToJoin={handleScrollToJoin} />
          <MobileNav 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
            handleNavItemClick={handleNavItemClick}
            handleScrollToJoin={handleScrollToJoin}
          />
        </div>
      </div>
    </header>
  );
}
