import React from "react";

import { CardProps } from "../types";

export type { CardProps };

const Card = ({ children, className = "" }: CardProps) => (
  <div className={`rounded-xl border bg-card text-card-foreground shadow-sm p-5 md:p-8 ${className}`}>
    {children}
  </div>
);

export default Card;