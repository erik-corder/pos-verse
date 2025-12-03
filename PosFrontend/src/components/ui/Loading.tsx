import React from "react";

export const Loading: React.FC<{ message?: string }> = ({
  message = "Loading...",
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-B-500"></div>
      <p className="mt-4 text-N-600">{message}</p>
    </div>
  );
};

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div
      className={`animate-spin rounded-full border-b-2 border-B-500 ${sizes[size]}`}
    ></div>
  );
};
