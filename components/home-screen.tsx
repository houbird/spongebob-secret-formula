"use client";

import Image from "next/image";
import Link from "next/link";
import { startTransition, useDeferredValue, useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Dices,
  ExternalLink,
  LoaderCircle,
  RotateCcw,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { fetchQuotes, type Quote } from "@/lib/quotes";

type LoadState = "loading" | "ready" | "error";
const RESULTS_PER_PAGE = 12;

const RECOMMENDED_KEYWORDS = [
  "S3E03",
  "胖",
  "想",
  "酷",
  "錢",
  "派欸",
  "很嗆",
  "上班",
  "遜咖",
  "美好",
  "蟹堡",
  "垃圾",
  "勁爆",
  "不對",
  "想像力",
];

export function HomeScreen() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInputValue, setPageInputValue] = useState("1");
  const [isComposingSearch, setIsComposingSearch] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>(
    {},
  );
  const previewSectionRef = useRef<HTMLElement | null>(null);
  const searchSectionRef = useRef<HTMLElement | null>(null);
  const searchSummaryId = useId();

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();
  const isFiltering = deferredSearchTerm !== searchTerm;
  
  // Show all quotes if there is no query, otherwise filter
  const filteredQuotes = normalizedQuery
    ? quotes.filter((quote) => quote.searchText.includes(normalizedQuery))
    : quotes;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredQuotes.length / RESULTS_PER_PAGE),
  );
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * RESULTS_PER_PAGE;
  const visibleQuotes = filteredQuotes.slice(
    pageStart,
    pageStart + RESULTS_PER_PAGE,
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPageInputValue(safePage.toString());
  }, [safePage]);

  function handlePageInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const val = e.target.value;
    setPageInputValue(val);

    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= totalPages) {
      setCurrentPage(parsed);
    }
  }

  function handlePageInputBlur() {
    setPageInputValue(safePage.toString());
  }

  function handlePageInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      e.currentTarget.blur();
    }
  }

  useEffect(() => {
    void loadQuotes();
  }, []);

  async function loadQuotes() {
    try {
      setLoadState("loading");
      setErrorMessage("");
      const nextQuotes = await fetchQuotes();
      setQuotes(nextQuotes);
      setLoadState("ready");
      
      // Auto-select a random quote on mount to avoid blank/empty preview state
      if (nextQuotes.length > 0) {
        const initialQuote = nextQuotes[Math.floor(Math.random() * nextQuotes.length)];
        setSelectedQuote(initialQuote);
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to load quotes.",
      );
      setLoadState("error");
    }
  }

  function handleDrawQuote() {
    if (!quotes.length) {
      return;
    }
    const nextQuote = quotes[Math.floor(Math.random() * quotes.length)];
    revealQuote(nextQuote, { scrollIntoView: true });
  }

  function revealQuote(nextQuote: Quote, options?: { scrollIntoView?: boolean }) {
    startTransition(() => {
      setSelectedQuote(nextQuote);
    });

    if (options?.scrollIntoView) {
      requestAnimationFrame(() => {
        previewSectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      });
    }
  }

  function handleSearchTermChange(nextValue: string) {
    setSearchInputValue(nextValue);

    if (isComposingSearch) {
      return;
    }

    startTransition(() => {
      setSearchTerm(nextValue);
      setCurrentPage(1);
    });
  }

  function commitSearchTerm(nextValue: string) {
    startTransition(() => {
      setSearchTerm(nextValue);
      setCurrentPage(1);
    });
  }

  function handleResetSearch() {
    setSearchInputValue("");
    setIsComposingSearch(false);

    startTransition(() => {
      setSearchTerm("");
      setCurrentPage(1);
    });
  }

  function handleSelectKeyword(keyword: string, shouldScroll = false) {
    setSearchInputValue(keyword);
    startTransition(() => {
      setSearchTerm(keyword);
      setCurrentPage(1);
    });

    if (shouldScroll) {
      searchSectionRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }

  function handleImageError(quoteId: string) {
    setBrokenImageIds((current) => ({
      ...current,
      [quoteId]: true,
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10 space-y-8">
      {/* Header Block */}
      <header className="animate-rise-in overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur-md">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 px-6 py-8 sm:px-8 lg:px-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-semibold text-ocean">
              <Sparkles className="h-4 w-4 text-brand" />
              你現在是在懷疑神奇海螺的神奇魔力嗎
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              沒有人敢叫我
              <span className="text-brand-deep">胖呆</span>
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-ink-soft">
            <StatusPill label="總台詞庫" value={quotes.length ? `${quotes.length} 筆` : "載入中"} />
          </div>
        </div>
      </header>

      {/* Main Flow */}
      <main className="space-y-8">
        {/* Loading and Error States */}
        {loadState === "loading" && (
          <section className="rounded-4xl border border-border bg-surface-contrast/85 p-8 shadow-(--shadow) backdrop-blur-md">
            <LoadingState />
          </section>
        )}

        {loadState === "error" && (
          <section className="rounded-4xl border border-border bg-surface-contrast/85 p-8 shadow-(--shadow) backdrop-blur-md">
            <ErrorState message={errorMessage} onRetry={loadQuotes} />
          </section>
        )}

        {/* Selected Quote Preview Section */}
        {loadState === "ready" && selectedQuote && (
          <section
            ref={previewSectionRef}
            className="animate-rise-in animate-delay-1 overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur-md scroll-mt-6"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8 bg-white/40">
              <div className="space-y-1">
                <span className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-deep">
                  🎬 名場面預覽
                </span>
                <h2 className="text-xl font-bold text-foreground">
                  編號：{selectedQuote.id}
                </h2>
              </div>
              <button
                type="button"
                onClick={handleDrawQuote}
                className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-brand-deep px-5 py-3 text-sm font-bold text-white transition shadow-sm hover:scale-[1.02] hover:bg-brand-deep/95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
              >
                <Dices className="h-4 w-4" />
                隨機抽一張
              </button>
            </div>

            <div className="px-6 py-8 sm:px-8 sm:py-10">
              <article className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
                {/* Details Side */}
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                    <span className="inline-flex items-center rounded-full bg-ocean/10 text-ocean px-3 py-1">
                      {selectedQuote.id}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1 text-ink-soft">
                      {selectedQuote.date}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <blockquote className="space-y-3 border-l-8 border-brand pl-6 text-2xl font-black leading-relaxed text-foreground sm:text-3xl lg:text-4xl">
                      {selectedQuote.quoteLines.map((line) => (
                        <p key={`${selectedQuote.id}-${line}`}>{line}</p>
                      ))}
                    </blockquote>
                  </div>

                  {/* Meta Chips */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    <MetaChip
                      label="維基集數"
                      value={selectedQuote.wikipediaEpisode}
                      onClick={() => handleSelectKeyword(selectedQuote.wikipediaEpisode, true)}
                    />
                    <MetaChip
                      label="ESFIO 代號"
                      value={selectedQuote.esfio}
                      onClick={() => handleSelectKeyword(selectedQuote.esfio, true)}
                    />
                    <MetaChip
                      label="上傳日期"
                      value={selectedQuote.date}
                      onClick={() => handleSelectKeyword(selectedQuote.date, true)}
                    />
                  </div>

                  <div className="pt-2">
                    <a
                      href={selectedQuote.imgurUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-surface hover:bg-surface-strong px-4 py-2.5 text-sm font-bold text-ocean border border-border transition hover:text-brand-deep"
                    >
                      <span>在 Imgur 上觀看原圖</span>
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>

                {/* Image Side */}
                <div className="overflow-hidden rounded-3xl border border-border bg-surface p-4 shadow-sm">
                  <div className="animate-soft-float relative aspect-4/3 w-full overflow-hidden rounded-2xl shadow-inner">
                    <Image
                      src={selectedQuote.imageUrl}
                      alt={selectedQuote.quote}
                      fill
                      priority
                      sizes="(min-width: 1024px) 35vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </article>
            </div>
          </section>
        )}

        {/* Search & Grid Gallery Section */}
        {loadState === "ready" && (
          <section
            ref={searchSectionRef}
            className="animate-rise-in animate-delay-2 overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur-md scroll-mt-6"
          >
            <div className="border-b border-border px-6 py-5 sm:px-8 bg-white/40">
              <span className="text-xs font-semibold uppercase tracking-[0.22em] text-ocean">
                🔍 探索與搜尋
              </span>
              <h2 className="text-xl font-bold text-foreground mt-1">
                所有經典名場面
              </h2>
            </div>

            <div className="px-6 py-6 sm:px-8 sm:py-8 space-y-6">
              {/* Unified Controls Card */}
              <div className="flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5">
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
                  {/* Search Bar Input */}
                  <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-ocean" />
                    <input
                      type="search"
                      aria-describedby={searchSummaryId}
                      value={searchInputValue}
                      onChange={(event) => {
                        handleSearchTermChange(event.target.value);
                      }}
                      onCompositionStart={() => {
                        setIsComposingSearch(true);
                      }}
                      onCompositionEnd={(event) => {
                        const nextValue = event.currentTarget.value;
                        setIsComposingSearch(false);
                        setSearchInputValue(nextValue);
                        commitSearchTerm(nextValue);
                      }}
                      placeholder="搜尋台詞、編號或集數 (例如：神奇海螺、SS0001、S3E03)"
                      className="w-full bg-white border border-border pl-12 pr-4 py-3 text-base outline-none placeholder:text-ink-soft rounded-2xl focus:border-ocean focus:ring-4 focus:ring-ocean/10 transition"
                    />
                  </div>

                  {/* Actions buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleDrawQuote}
                      className="cursor-pointer flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-2xl bg-ocean px-5 py-3 text-sm font-bold text-white transition hover:bg-ocean/95 shadow-sm active:scale-95"
                    >
                      <Dices className="h-4 w-4" />
                      隨機抽卡
                    </button>
                    <button
                      type="button"
                      onClick={handleResetSearch}
                      disabled={!searchInputValue}
                      className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-white px-5 py-3 text-sm font-bold text-foreground transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <RotateCcw className="h-4 w-4" />
                      清除
                    </button>
                  </div>
                </div>

                {/* Recommended Keywords */}
                <div className="flex flex-wrap items-center gap-2 text-xs border-t border-border/40 pt-3 mt-1">
                  <span className="text-ink-soft font-bold mr-1 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-brand" />
                    熱門推薦：
                  </span>
                  {RECOMMENDED_KEYWORDS.map((kw) => (
                    <button
                      key={kw}
                      type="button"
                      onClick={() => handleSelectKeyword(kw)}
                      className="cursor-pointer inline-flex items-center rounded-full bg-white hover:bg-ocean hover:text-white border border-border px-3 py-1.5 font-semibold text-ink-soft transition shadow-sm active:scale-95"
                    >
                      #{kw}
                    </button>
                  ))}
                </div>

                {/* Filter Summary */}
                <div
                  id={searchSummaryId}
                  className="flex flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between border-t border-border/50 pt-3 mt-1"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    {normalizedQuery ? (
                      <>
                        <StatusPill label="關鍵字" value={searchTerm.trim()} />
                        <StatusPill label="匹配筆數" value={`${filteredQuotes.length} 筆`} />
                        <StatusPill label="目前分頁" value={`${safePage} / ${totalPages}`} />
                      </>
                    ) : (
                      <>
                        <StatusPill label="資料總量" value={`${quotes.length} 筆`} />
                        <StatusPill label="目前分頁" value={`${safePage} / ${totalPages}`} />
                      </>
                    )}
                    {isFiltering ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-white border border-border px-3 py-1 font-semibold text-ocean animate-pulse">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        正在篩選中...
                      </span>
                    ) : null}
                  </div>
                  <span className="font-medium">
                    {normalizedQuery
                      ? `找到 ${filteredQuotes.length} 筆符合條件，現在顯示第 ${safePage} / ${totalPages} 頁`
                      : `顯示全部名場面，共 ${totalPages} 頁`}
                  </span>
                </div>
              </div>

              {/* No Search Results State */}
              {filteredQuotes.length === 0 ? (
                <SearchEmptyState query={searchTerm} />
              ) : null}

              {/* Grid Gallery */}
              {visibleQuotes.length > 0 ? (
                <div className="space-y-6">
                  {/* Expanded Grid Layout (4 columns on desktop) */}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {visibleQuotes.map((quote, index) => (
                      <article
                        key={quote.id}
                        onClick={() => revealQuote(quote, { scrollIntoView: true })}
                        className="animate-rise-in group cursor-pointer overflow-hidden rounded-3xl border border-border bg-white shadow-[0_12px_24px_rgba(29,36,51,0.06)] transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-deep/60 hover:shadow-[0_20px_35px_rgba(29,36,51,0.12)] flex flex-col"
                        style={{ animationDelay: `${Math.min(index * 40, 200)}ms` }}
                      >
                        {/* Image Frame */}
                        <div className="relative aspect-4/3 w-full overflow-hidden bg-[#f4e5ba]">
                          {brokenImageIds[quote.id] ? (
                            <div className="flex h-full items-center justify-center px-6 text-center text-xs font-semibold text-ink-soft">
                              這張圖暫時載不到，請點連結往 Imgur 觀看。
                            </div>
                          ) : (
                            <Image
                              src={quote.imageUrl}
                              alt={quote.quote}
                              fill
                              sizes="(min-width: 1200px) 25vw, (min-width: 768px) 33vw, 50vw"
                              onError={() => {
                                handleImageError(quote.id);
                              }}
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )}
                          
                          {/* Hover Play/Preview Overlay */}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold text-foreground shadow-md transition-transform scale-95 group-hover:scale-100 duration-300">
                              <Sparkles className="h-3.5 w-3.5 text-brand-deep" />
                              點擊預覽此畫面
                            </span>
                          </div>

                          {/* Top ID overlay */}
                          <div className="absolute top-3 left-3">
                            <span className="inline-flex rounded-full bg-black/55 backdrop-blur px-2.5 py-1 text-[11px] font-bold tracking-wider text-white shadow-sm">
                              {quote.id}
                            </span>
                          </div>

                          {/* Bottom info overlay */}
                          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-black/85 to-transparent px-4 py-3 text-white">
                            <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-90 truncate">
                              {quote.wikipediaEpisode}
                            </p>
                          </div>
                        </div>

                        {/* Card Meta Content */}
                        <div className="flex flex-1 flex-col justify-between p-5 space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-xs text-ink-soft">
                              <span>{quote.date}</span>
                              <span className="font-semibold text-ocean bg-ocean/5 px-2.5 py-0.5 rounded-full text-[11px]">
                                {quote.esfio}
                              </span>
                            </div>
                            <p className="text-base font-bold leading-relaxed text-foreground line-clamp-3 group-hover:text-ocean transition-colors">
                              {quote.quote}
                            </p>
                          </div>

                          {/* Card Actions Footer */}
                          <div className="flex items-center justify-end pt-2 border-t border-border/50">
                            <a
                              href={quote.imgurUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="cursor-pointer inline-flex items-center justify-center gap-1.5 rounded-xl border border-border px-3.5 py-1.5 text-xs font-bold text-ocean transition hover:border-brand-deep hover:text-brand-deep hover:bg-brand-deep/5"
                            >
                              <span>Imgur</span>
                              <ArrowUpRight className="h-3.5 w-3.5" />
                            </a>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Pagination Controls */}
                  <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-border bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between shadow-sm">
                    <div className="text-center font-bold text-foreground sm:text-left">
                      顯示第 {pageStart + 1} 到 {pageStart + visibleQuotes.length} 筆 (共 {filteredQuotes.length} 筆)
                    </div>
                    <div className="flex items-center justify-between gap-3 sm:justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((page) => Math.max(1, page - 1));
                        }}
                        disabled={safePage === 1}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 font-bold text-foreground transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        <ChevronLeft className="h-4 w-4" />
                        上一頁
                      </button>
                      <div className="flex items-center gap-1.5 font-bold text-foreground">
                        <span>第</span>
                        <input
                          type="number"
                          min={1}
                          max={totalPages}
                          value={pageInputValue}
                          onChange={handlePageInputChange}
                          onBlur={handlePageInputBlur}
                          onKeyDown={handlePageInputKeyDown}
                          className="w-14 text-center font-bold bg-white border border-border py-1 px-1.5 text-sm outline-none rounded-xl focus:border-ocean focus:ring-2 focus:ring-ocean/10 transition [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span>/ {totalPages} 頁</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentPage((page) => Math.min(totalPages, page + 1));
                        }}
                        disabled={safePage === totalPages}
                        className="cursor-pointer inline-flex items-center gap-2 rounded-xl border border-border bg-white px-4 py-2 font-bold text-foreground transition hover:border-ocean hover:text-ocean disabled:cursor-not-allowed disabled:opacity-40"
                      >
                        下一頁
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </section>
        )}
      </main>

      {/* Footer Block */}
      <footer className="mt-12 py-6 border-t border-border/40 text-center text-xs text-ink-soft">
        <p>© {new Date().getFullYear()} 海底迷因靜態站. 非官方粉絲網頁。</p>
        <p className="mt-2">
          <Link
            href="/copyright"
            className="cursor-pointer font-bold text-ocean hover:text-brand-deep underline transition-colors"
          >
            版權聲明與資料來源
          </Link>
        </p>
      </footer>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="px-6 py-10 flex flex-col items-center justify-center">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/75 border border-border px-4 py-1.5 text-sm font-semibold text-ocean shadow-sm animate-pulse">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        載入台詞資料庫中...
      </div>
      <div className="mt-8 space-y-4 w-full max-w-md">
        <div className="h-6 w-1/3 rounded-full bg-slate-200/80 animate-pulse" />
        <div className="h-12 w-full rounded-2xl bg-slate-200/70 animate-pulse" />
        <div className="h-12 w-4/5 rounded-2xl bg-slate-200/70 animate-pulse" />
      </div>
    </div>
  );
}

function ErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => Promise<void>;
}) {
  return (
    <div className="rounded-3xl border border-[#f0c7b8] bg-[#fff2ed] p-6 sm:p-8 text-[#7b341e]">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3.5 py-1.5 text-sm font-bold border border-[#f0c7b8]/60 shadow-sm">
        <TriangleAlert className="h-4 w-4" />
        發生錯誤
      </div>
      <p className="mt-4 text-base font-semibold leading-relaxed">{message}</p>
      <button
        type="button"
        onClick={() => {
          void onRetry();
        }}
        className="cursor-pointer mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#7b341e] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#5a2312] shadow-sm active:scale-95"
      >
        重新載入資料
      </button>
    </div>
  );
}

function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="animate-rise-in rounded-3xl border border-dashed border-border bg-white/50 px-6 py-12 text-center">
      <p className="text-sm font-bold uppercase tracking-[0.22em] text-brand-deep">
        查無結果
      </p>
      <h3 className="mt-3 text-2xl font-black text-foreground">
        找不到關於「{query}」的台詞
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft sm:text-base">
        試試輸入台詞片段（例如：神奇海螺）、SS 編號（例如：SS0001），或集數代號（例如：S3E03）。
      </p>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/80 px-3 py-1.5 text-xs shadow-sm">
      <span className="font-bold text-foreground">{label}</span>
      <span className="text-ink-soft">{value}</span>
    </span>
  );
}

function MetaChip({
  label,
  value,
  onClick,
}: {
  label: string;
  value: string;
  onClick?: () => void;
}) {
  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="cursor-pointer inline-flex items-center gap-2 rounded-full border border-border bg-white/90 hover:bg-ocean hover:text-white hover:border-ocean px-3 py-1.5 text-xs shadow-sm transition active:scale-95 group text-left"
      >
        <span className="font-bold text-foreground group-hover:text-white transition-colors">
          {label}
        </span>
        <span className="text-ink-soft group-hover:text-white/90 transition-colors">
          {value}
        </span>
      </button>
    );
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/90 px-3 py-1.5 text-xs shadow-sm">
      <span className="font-bold text-foreground">{label}</span>
      <span className="text-ink-soft">{value}</span>
    </span>
  );
}