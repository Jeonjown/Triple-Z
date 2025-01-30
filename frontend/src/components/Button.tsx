import React from "react";

interface ButtonProps {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  style?: React.CSSProperties;
  variant?: "primary" | "secondary" | "cancel" | "success" | "warning";
}

const Button = ({
  onClick,
  children,
  className = "",
  disabled = false,
  type = "button",
  style = {},
  variant = "primary", // Default variant is 'primary'
}: ButtonProps) => {
  // Define button styles for each variant
  const variantStyles = {
    primary:
      "mt-10 flex-1 rounded bg-accent py-2 text-white hover:scale-105 hover:opacity-90 active:scale-110 active:opacity-95 md:text-base",
    secondary: "bg-gray-500 text-white",
    cancel: "bg-red-500 text-white",
    success: "bg-green-500 text-white", // Example: success variant
    warning: "bg-yellow-500 text-white", // Example: warning variant
  };

  // Get the appropriate button style based on the variant prop
  const buttonClass = variantStyles[variant] || variantStyles.primary; // Fallback to primary if variant is unknown

  return (
    <button
      onClick={onClick}
      className={`rounded-md px-4 py-2 transition-all focus:outline-none ${buttonClass} ${className}`}
      disabled={disabled}
      type={type}
      style={style}
    >
      {children}
    </button>
  );
};

export default Button;
