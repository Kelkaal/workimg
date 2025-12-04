import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface IconCardProps {
  icon: LucideIcon | IconType;
  title: string;
  description: string;
  isBenefit?: boolean;
}

export interface FAQItemProps {
  question: string;
  answer: string;
}

export interface CountdownProps {
  targetDate: Date;
}

export interface CountdownState {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export interface NavItemProps {
  children: React.ReactNode;
  href: string;
  className?: string;
  onClick?: () => void;
}