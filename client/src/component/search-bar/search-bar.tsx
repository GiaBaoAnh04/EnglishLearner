"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Loader2 } from "lucide-react";
import clsx from "clsx";

interface ResultItem {
  id: string | number;
  label: string;
  [key: string]: any;
}

interface SearchBarProps {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  results?: ResultItem[];
  onSelect?: (item: ResultItem) => void;
  loading?: boolean;
  error?: string;
  noResultsText?: string;
  debounceTime?: number;
  renderResult?: (item: ResultItem) => React.ReactNode;
  dropdownVisible?: boolean;
  fullWidth?: boolean;
  autoFocus?: boolean;
  clearable?: boolean;
  closeOnSelect?: boolean;
  inputClassName?: string;
  containerClassName?: string;
  dropdownClassName?: string;
}

export function SearchBar({
  label,
  placeholder = "Search...",
  value = "",
  onChange,
  onSearch,
  results = [],
  onSelect,
  loading = false,
  error,
  noResultsText = "No results found",
  debounceTime = 300,
  renderResult,
  dropdownVisible,
  fullWidth,
  autoFocus,
  clearable = true,
  closeOnSelect = true,
  inputClassName = "",
  containerClassName = "",
  dropdownClassName = "",
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const wrapperRef = useRef<HTMLDivElement | null>(null); // 👈 ref bao component

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (onSearch) {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(() => {
        onSearch(inputValue);
      }, debounceTime);
    }
  }, [inputValue]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);
    onChange?.(val);
    setShowDropdown(true);
  };

  const handleSelect = (item: ResultItem) => {
    onSelect?.(item);
    if (closeOnSelect) setShowDropdown(false);
  };

  return (
    <div
      ref={wrapperRef}
      className={clsx("relative", fullWidth && "w-full", containerClassName)}
    >
      {label && (
        <label className="block mb-1 text-sm font-medium dark:text-dark-400 text-light-500">
          {label}
        </label>
      )}
      <div className="flex items-center w-full px-4 py-2 rounded-full border border-input focus-within:ring-2 focus-within:ring-primary-500 text-dark400_light600">
        <Search className="w-5 h-5 dark:text-dark-400 text-light-500" />
        <input
          type="text"
          autoFocus={autoFocus}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={clsx(
            "flex-1 bg-transparent outline-none text-sm dark:text-dark-400 text-light-500 placeholder:text-dark500_light300 dark:placeholder:text-dark-400",
            inputClassName
          )}
        />
      </div>

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}

      {(dropdownVisible ?? showDropdown) && (
        <div
          className={clsx(
            "absolute z-20 mt-1 w-full rounded-md shadow-lg border border-input background-light100_dark100 text-sm dark:text-dark-400 text-light-500",
            dropdownClassName
          )}
        >
          {loading ? (
            <div className="p-2 flex items-center gap-2 dark:text-dark-400 text-light-500">
              <Loader2 className="w-4 h-4 animate-spin" /> Loading...
            </div>
          ) : results.length === 0 ? (
            <div className="p-2 italic dark:text-dark-400 text-light-500">
              {noResultsText}
            </div>
          ) : (
            <ul>
              {results.map((item) => (
                <li
                  key={item.id}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-[#252525] dark:text-dark-400 text-light-500"
                  onClick={() => handleSelect(item)}
                >
                  {renderResult ? renderResult(item) : item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
