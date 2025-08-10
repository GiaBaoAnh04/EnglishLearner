import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Loader2, X, Check } from "lucide-react";

type OptionValue = string | number;
type Option<T extends OptionValue = OptionValue> = {
  label: string;
  value: T;
};

type SelectValue<T extends OptionValue, M extends boolean> = M extends true
  ? T[]
  : T | null;

interface SelectInputProps<T extends OptionValue, M extends boolean = false> {
  name?: string;
  label?: string;
  value?: SelectValue<T, M>;
  onChange?: (value: M extends true ? Option<T>[] : Option<T> | null) => void;
  options: Option<T>[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  readOnly?: boolean;
  filterable?: boolean;
  noOptionsMessage?: string;
  description?: string;
  error?: string;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  arrow?: boolean;
  clearable?: boolean;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  errorClassName?: string;
  labelClassName?: string;
  dropdownPosition?: "top" | "bottom";
  id?: string;
  isLoading?: boolean;
  loadingMessage?: string;
  size?: "sm" | "md" | "lg";
  isMulti?: M;
  maxSelectedDisplay?: number;
  showCheckbox?: boolean;
}

export function SelectInput<T extends OptionValue, M extends boolean = false>({
  name,
  label,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
  required = false,
  readOnly = false,
  filterable = false,
  noOptionsMessage = "No results found",
  description,
  error,
  fullWidth = false,
  icon,
  arrow = true,
  clearable = false,
  className = "",
  inputClassName = "",
  dropdownClassName = "",
  errorClassName = "text-red-500 text-sm",
  labelClassName = "text-sm font-medium text-gray-700",
  dropdownPosition = "bottom",
  id,
  isLoading = false,
  loadingMessage = "Loading...",
  size = "md",
  isMulti = false as M,
  maxSelectedDisplay = 2,
  showCheckbox = true,
}: SelectInputProps<T, M>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  // Handle both single and multi values
  const selectedValues = useMemo(() => {
    if (isMulti) {
      return Array.isArray(value) ? value : [];
    }
    return value !== undefined && value !== null ? [value] : [];
  }, [value, isMulti]) as T[];

  const selectedOptions = useMemo(
    () => options.filter((opt) => selectedValues.includes(opt.value)),
    [selectedValues, options]
  );

  const singleSelected = useMemo(
    () =>
      !isMulti ? options.find((opt) => opt.value === value) || null : null,
    [value, options, isMulti]
  );

  const filteredOptions = useMemo(() => {
    if (!filterable || !search) return options;
    return options.filter((opt) =>
      opt.label.toLowerCase().includes(search.toLowerCase())
    );
  }, [options, search, filterable]);

  const handleSelect = (opt: Option<T>) => {
    if (readOnly) return;

    if (isMulti) {
      const currentValues = selectedValues;
      const newValues = currentValues.includes(opt.value)
        ? currentValues.filter((v) => v !== opt.value)
        : [...currentValues, opt.value];

      const newOptions = options.filter((o) => newValues.includes(o.value));
      onChange?.(newOptions as any);
    } else {
      onChange?.(opt as any);
      setOpen(false);
    }

    setSearch("");
  };

  const handleRemoveTag = (valueToRemove: T, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isMulti) return;

    const newOptions = selectedOptions.filter(
      (opt) => opt.value !== valueToRemove
    );
    onChange?.(newOptions as any);
  };

  const handleClear = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (isMulti) {
      onChange?.([] as any);
    } else {
      onChange?.(null as any);
    }
    setSearch("");
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return isMulti ? "min-h-8 px-2 py-1 text-xs" : "h-8 px-2 py-1 text-xs";
      case "lg":
        return isMulti
          ? "min-h-10 px-4 py-2 text-base"
          : "h-10 px-4 py-2 text-base";
      default:
        return isMulti ? "min-h-9 px-3 py-2 text-sm" : "h-9 px-3 py-2 text-sm";
    }
  };

  const getTagSize = () => {
    switch (size) {
      case "sm":
        return "px-1.5 py-0.5 text-xs";
      case "lg":
        return "px-2.5 py-1 text-sm";
      default:
        return "px-2 py-0.5 text-xs";
    }
  };

  const renderSelectedTags = () => {
    if (!isMulti || selectedOptions.length === 0) return null;

    const displayedOptions = selectedOptions.slice(0, maxSelectedDisplay);
    const remainingCount = selectedOptions.length - maxSelectedDisplay;

    return (
      <div className="flex flex-wrap gap-1">
        {displayedOptions.map((opt) => (
          <span
            key={String(opt.value)}
            className={`inline-flex items-center gap-1 bg-blue-100 text-blue-800 rounded-md ${getTagSize()}`}
          >
            {opt.label}
            {!readOnly && (
              <X
                className="w-3 h-3 cursor-pointer hover:text-blue-600"
                onClick={(e: any) => handleRemoveTag(opt.value, e)}
              />
            )}
          </span>
        ))}
        {remainingCount > 0 && (
          <span
            className={`inline-flex items-center bg-gray-100 text-gray-600 rounded-md ${getTagSize()}`}
          >
            +{remainingCount} more
          </span>
        )}
      </div>
    );
  };

  const renderSingleValue = () => {
    if (isMulti) return null;

    return (
      <input
        id={id}
        name={name}
        className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full "
        placeholder={placeholder}
        disabled={disabled || !filterable || readOnly}
        value={
          filterable && open
            ? search
            : singleSelected
            ? singleSelected.label
            : ""
        }
        onChange={(e) => {
          if (!filterable) return;
          setSearch(e.target.value);
        }}
        readOnly={!filterable}
      />
    );
  };

  const hasValue = isMulti
    ? selectedOptions.length > 0
    : singleSelected !== null;

  return (
    <div
      className={`${
        fullWidth ? "w-full" : ""
      } flex flex-col gap-1  ${className}`}
    >
      {label && (
        <label
          htmlFor={id}
          className={`${labelClassName} leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70`}
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div ref={inputRef} className="relative">
        <div
          className={`relative flex items-center justify-between border border-gray-300 rounded cursor-pointer ${getSizeClasses()} ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          } ${inputClassName}`}
          onClick={() => !disabled && !readOnly && setOpen((prev) => !prev)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {icon && <div className="flex-shrink-0">{icon}</div>}

            <div className="flex-1 min-w-0">
              {isMulti ? (
                selectedOptions.length > 0 ? (
                  renderSelectedTags()
                ) : (
                  <input
                    id={id}
                    name={name}
                    className="bg-transparent outline-none text-sm text-gray-700 placeholder:text-gray-400 w-full"
                    placeholder={placeholder}
                    disabled={disabled || !filterable || readOnly}
                    value={filterable && open ? search : ""}
                    onChange={(e) => {
                      if (!filterable) return;
                      setSearch(e.target.value);
                    }}
                    readOnly={!filterable}
                  />
                )
              ) : (
                renderSingleValue()
              )}
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            {arrow && (
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${
                  open ? "rotate-180" : ""
                }`}
              />
            )}
          </div>
        </div>

        {open && (
          <ul
            className={`absolute z-20 mt-1 max-h-56 w-full overflow-y-auto border border-gray-300 rounded-md bg-white shadow-md ${dropdownClassName} ${
              dropdownPosition === "top" ? "bottom-full mb-2" : "top-full"
            }`}
          >
            {filterable && (
              <li className="p-2 border-b border-gray-300">
                <input
                  className="w-full px-2 py-1 text-sm border border-gray-300 rounded outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                />
              </li>
            )}

            {isLoading ? (
              <li className="p-2 text-center text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin inline mr-2" />
                {loadingMessage}
              </li>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((opt) => {
                const isSelected = selectedValues.includes(opt.value);
                return (
                  <li
                    key={String(opt.value)}
                    onClick={() => handleSelect(opt)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-gray-100 ${
                      isSelected ? "bg-gray-100 text-gray-900" : "text-gray-700"
                    } ${isMulti ? "flex items-center gap-2" : ""}`}
                  >
                    {isMulti && showCheckbox && (
                      <div
                        className={`w-4 h-4 rounded flex items-center justify-center ${
                          isSelected
                            ? "bg-blue-500 text-white"
                            : "border border-gray-300"
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                      </div>
                    )}
                    {opt.label}
                  </li>
                );
              })
            ) : (
              <li className="p-2 text-center text-gray-500">
                {noOptionsMessage}
              </li>
            )}
          </ul>
        )}
      </div>

      {description && <p className="text-xs text-gray-500">{description}</p>}
      {error && <p className={`${errorClassName}`}>{error}</p>}
    </div>
  );
}
