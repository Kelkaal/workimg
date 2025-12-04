import React from "react";

interface NavItemProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ children, href, onClick }) => (
  <a
    href={href}
    onClick={onClick}
    className="text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 block py-3 md:py-0 px-4"
  >
    {children}
  </a>
);

export default NavItem;