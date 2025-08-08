"use client";
import React, { useCallback, useMemo } from "react";
import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom"; // ✅ React Router

// Type definitions
interface TableItem {
  [key: string]: any;
  id: string | number;
}

interface Column {
  header: string;
  accessor: string;
  className?: string;
  sortable?: boolean;
  width?: string;
}

interface BaseTableProps<T extends TableItem> {
  columns: Column[];
  renderRow: (item: T) => React.ReactNode;
  data: T[];
  onSort?: (key: string) => void;
  sortKey?: string | null;
  sortOrder?: "asc" | "desc";
  sortIcon?: boolean;
  routeParamKey?: string;
  path?: string;
  loading?: boolean;
  emptyMessage?: string;
  rowClassName?: (item: T) => string;
  onRowClick?: (item: T) => void;
  enableNavigation?: boolean;
}

const BaseTable = <T extends TableItem>({
  columns,
  renderRow,
  data,
  onSort,
  sortKey,
  sortOrder,
  sortIcon = true,
  routeParamKey = "id",
  path = "/details/:id",
  loading = false,
  emptyMessage = "No data available",
  rowClassName,
  onRowClick,
  enableNavigation = true,
}: BaseTableProps<T>) => {
  const navigate = useNavigate(); // ✅ React Router navigation

  const handleNavigation = useCallback(
    (item: T) => {
      if (!enableNavigation || !path) return;

      const id = item[routeParamKey];
      if (!id) {
        console.warn(`No ${routeParamKey} found for navigation`);
        return;
      }

      const finalPath = path.replace(`:${routeParamKey}`, String(id));
      navigate(finalPath);
    },
    [navigate, path, routeParamKey, enableNavigation]
  );

  const handleRowClick = useCallback(
    (item: T) => {
      if (onRowClick) {
        onRowClick(item);
      } else if (enableNavigation) {
        handleNavigation(item);
      }
    },
    [onRowClick, enableNavigation, handleNavigation]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, item: T) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleRowClick(item);
      }
    },
    [handleRowClick]
  );

  const handleSort = useCallback(
    (accessor: string) => {
      if (onSort) {
        onSort(accessor);
      }
    },
    [onSort]
  );

  const tableHeader = useMemo(
    () => (
      <thead>
        <tr className="border-b border-gray-100 text-left text-xs md:text-sm bg-gray-50">
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`py-3 px-2 text-gray-700 font-semibold ${
                col.className || ""
              }`}
              style={col.width ? { width: col.width } : undefined}
            >
              <div className="flex items-center gap-2">
                <span>{col.header}</span>
                {col.sortable !== false && sortIcon && onSort && (
                  <button
                    type="button"
                    className="inline-flex items-center cursor-pointer text-gray-500 hover:text-gray-800 transition-colors"
                    onClick={() => handleSort(col.accessor)}
                    aria-label={`Sort by ${col.header}`}
                    title={`Sort by ${col.header}`}
                  >
                    {sortKey === col.accessor ? (
                      <Icon
                        icon={
                          sortOrder === "asc"
                            ? "mdi:arrow-up"
                            : "mdi:arrow-down"
                        }
                        width={16}
                        height={16}
                      />
                    ) : (
                      <Icon icon="basil:sort-outline" width={16} height={16} />
                    )}
                  </button>
                )}
              </div>
            </th>
          ))}
        </tr>
      </thead>
    ),
    [columns, sortKey, sortOrder, sortIcon, onSort]
  );

  const tableBody = useMemo(() => {
    if (loading) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-8 text-gray-500"
            >
              <div className="flex items-center justify-center gap-2">
                <div className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
                Loading...
              </div>
            </td>
          </tr>
        </tbody>
      );
    }

    if (data.length === 0) {
      return (
        <tbody>
          <tr>
            <td
              colSpan={columns.length}
              className="text-center py-8 text-gray-500"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody>
        {data.map((item) => {
          const isClickable = enableNavigation || onRowClick;
          const dynamicClassName = rowClassName ? rowClassName(item) : "";

          return (
            <tr
              key={item.id || JSON.stringify(item)}
              className={`text-sm text-gray-700 border-b border-gray-100 transition-colors hover:bg-gray-50 ${
                isClickable ? "cursor-pointer" : ""
              } ${dynamicClassName}`}
              onClick={isClickable ? () => handleRowClick(item) : undefined}
              onKeyDown={
                isClickable ? (e) => handleKeyDown(e, item) : undefined
              }
              tabIndex={isClickable ? 0 : undefined}
              role={isClickable ? "button" : undefined}
              aria-label={
                isClickable
                  ? `View details for ${item["name"] || item.id}`
                  : undefined
              }
            >
              {renderRow(item)}
            </tr>
          );
        })}
      </tbody>
    );
  }, [
    loading,
    data,
    columns.length,
    emptyMessage,
    enableNavigation,
    onRowClick,
    rowClassName,
    handleRowClick,
    handleKeyDown,
    renderRow,
  ]);

  return (
    <div className="hide-scrollbar overflow-x-auto">
      <table className="min-w-full border-collapse table-auto shadow-md rounded-lg overflow-hidden">
        {tableHeader}
        {tableBody}
      </table>
    </div>
  );
};

export default BaseTable;
export type { BaseTableProps, Column, TableItem };
