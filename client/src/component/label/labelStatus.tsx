import React from "react";
import { cn } from "../../utils/utils";

interface LabelStatusProps {
  label: string;
  color: string; // 'green' | 'blue' | 'red' | ...
  className?: string;
  withBorder?: boolean; // mặc định có border
  textAlign?: "left" | "center" | "right"; // mặc định center
}

export const LabelStatus: React.FC<LabelStatusProps> = ({
  label,
  color,
  className,
  withBorder = true,
  textAlign = "center",
}) => {
  const colorMap: Record<string, string> = {
    green: "text-green-600 border-green-600",
    blue: "text-blue-600 border-blue-600",
    red: "text-red-600 border-red-600",
    yellow: "text-yellow-600 border-yellow-600",
    gray: "text-gray-600 border-gray-600",
  };

  const alignmentMap: Record<"left" | "center" | "right", string> = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  };

  const colorClass = colorMap[color] || "text-gray-500 border-gray-500";
  const textAlignClass = alignmentMap[textAlign];

  return (
    <span
      className={cn(
        "px-3 py-1 w-24 text-sm font-medium inline-block capitalize rounded-full",
        colorClass,
        withBorder && "border",
        textAlignClass,
        className
      )}
    >
      {label}
    </span>
  );
};
