"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  variant?: "primary" | "outline";
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
  className?: string;
}

export default function Button({
  children, variant = "primary", onClick, type = "button", disabled, className = ""
}: Props) {
  const base = "inline-flex items-center gap-2 rounded-full font-sans font-semibold text-sm tracking-wide transition-all px-6 py-3 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";
  const variants = {
    primary: "bg-gradient-to-r from-gold to-gold-light text-navy border-0 hover:shadow-[0_10px_28px_rgba(196,146,42,0.35)]",
    outline: "bg-transparent border border-mist/30 text-mist hover:border-mist hover:text-white",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {children}
    </motion.button>
  );
}
