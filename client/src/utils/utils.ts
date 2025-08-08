import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatNumberVN = (
  value: number | string,
  withCurrency: boolean = false
): string => {
  const number = typeof value === "string" ? parseInt(value, 10) : value;

  const formatted = new Intl.NumberFormat("vi-VN").format(number);
  return withCurrency ? `${formatted} VND` : formatted;
};

export function formatDateTime(input: Date | string): string {
  const date = typeof input === "string" ? new Date(input) : input;

  if (isNaN(date.getTime())) return "Invalid date";

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2); // chỉ lấy 2 chữ số cuối

  let hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // 0 → 12

  const hourStr = String(hours).padStart(2, "0");

  return `${day}/${month}/${year}, ${hourStr}:${minutes} ${ampm}`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.round(seconds / 60);
  return `${minutes} ${minutes === 1 ? "minute" : "minutes"}`;
}

export const getDifficultyColor = (difficulty: string): string => {
  switch (difficulty) {
    case "Beginner":
      return "bg-green-100 text-green-800 border-green-200";
    case "Intermediate":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Advanced":
      return "bg-red-100 text-red-800 border-red-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
