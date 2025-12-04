export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  variant?: "primary" | "secondary" | "unstyled";
  children: React.ReactNode;
}

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export interface IconCardProps {
  number: number;
  image: string;
  title: string;
  description: string;
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


