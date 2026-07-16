"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
  className = "",
}: PaginationProps) {
  const [prevCurrentPage, setPrevCurrentPage] = useState(currentPage);
  const [inputValue, setInputValue] = useState(currentPage.toString());

  // Keep internal text input state in sync with external currentPage updates without useEffect
  if (currentPage !== prevCurrentPage) {
    setPrevCurrentPage(currentPage);
    setInputValue(currentPage.toString());
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputValue(val);

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      onPageChange(parsed);
    }
  };

  const handleInputBlur = () => {
    setInputValue(currentPage.toString());
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  };

  const pageStart = (currentPage - 1) * itemsPerPage;
  const pageEnd = Math.min(pageStart + itemsPerPage, totalItems);
  const displayStart = totalItems === 0 ? 0 : pageStart + 1;

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3.5 text-sm sm:flex-row sm:items-center sm:justify-between shadow-sm transition-all duration-300 ${className}`}
    >
      {/* Items count summary */}
      <div className="text-center font-bold text-foreground sm:text-left">
        顯示第 <span className="text-ocean">{displayStart}</span> 到{" "}
        <span className="text-ocean">{pageEnd}</span> 筆 (共{" "}
        <span className="text-ocean">{totalItems}</span> 筆)
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        {/* Prev Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 font-bold text-foreground transition-all duration-200 hover:border-ocean hover:text-ocean active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 shadow-xs"
          aria-label="上一頁"
        >
          <ChevronLeft className="h-4 w-4" />
          <span>上一頁</span>
        </button>

        {/* Numeric input indicator */}
        <div className="flex items-center gap-1.5 font-bold text-foreground">
          <span>第</span>
          <input
            type="number"
            min={1}
            max={totalPages}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleInputKeyDown}
            className="w-14 text-center font-bold bg-white border border-border py-1 px-1.5 text-sm outline-none rounded-xl focus:border-ocean focus:ring-2 focus:ring-ocean/10 transition-all [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none shadow-inner"
          />
          <span>/ {totalPages} 頁</span>
        </div>

        {/* Next Page Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="cursor-pointer inline-flex items-center gap-1.5 rounded-xl border border-border bg-white px-3.5 py-2 font-bold text-foreground transition-all duration-200 hover:border-ocean hover:text-ocean active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 shadow-xs"
          aria-label="下一頁"
        >
          <span>下一頁</span>
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
