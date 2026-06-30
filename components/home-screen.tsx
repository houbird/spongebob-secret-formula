"use client";

import Image from "next/image";
import { startTransition, useDeferredValue, useEffect, useId, useRef, useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Dices,
  ExternalLink,
  GalleryVerticalEnd,
  LoaderCircle,
  RotateCcw,
  Search,
  Sparkles,
  TriangleAlert,
} from "lucide-react";

import { fetchQuotes, type Quote } from "@/lib/quotes";

type LoadState = "loading" | "ready" | "error";
const RESULTS_PER_PAGE = 12;

export function HomeScreen() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInputValue, setSearchInputValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isComposingSearch, setIsComposingSearch] = useState(false);
  const [brokenImageIds, setBrokenImageIds] = useState<Record<string, boolean>>(
    {},
  );
  const fortuneSectionRef = useRef<HTMLElement | null>(null);
  const searchSummaryId = useId();

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const normalizedQuery = deferredSearchTerm.trim().toLowerCase();
  const isFiltering = deferredSearchTerm !== searchTerm;
  const filteredQuotes = normalizedQuery
    ? quotes.filter((quote) => quote.searchText.includes(normalizedQuery))
    : [];
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
    void loadQuotes();
  }, []);

  async function loadQuotes() {
    try {
      setLoadState("loading");
      setErrorMessage("");
      const nextQuotes = await fetchQuotes();
      setQuotes(nextQuotes);
      setLoadState("ready");
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

    revealQuote(nextQuote);
  }

  function revealQuote(nextQuote: Quote, options?: { scrollIntoView?: boolean }) {
    startTransition(() => {
      setSelectedQuote(nextQuote);
    });

    if (options?.scrollIntoView) {
      requestAnimationFrame(() => {
        fortuneSectionRef.current?.scrollIntoView({
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

  function handleImageError(quoteId: string) {
    setBrokenImageIds((current) => ({
      ...current,
      [quoteId]: true,
    }));
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <header className="animate-rise-in overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur">
        <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[1.3fr_0.7fr] lg:px-10 lg:py-10">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-1 text-sm font-medium text-ocean">
              <Sparkles className="h-4 w-4" />
              海底迷因靜態站
            </div>
            <div className="space-y-3">
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                神奇海螺不開口，
                <span className="text-brand-deep"> 你自己抽一張。</span>
              </h1>
              <p className="max-w-2xl text-base leading-7 text-ink-soft sm:text-lg">
                資料來自 opensheet 即時 API。首頁不預載全部圖片，只在你抽到一張或查到當前分頁結果時才真正請求圖片。
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-ink-soft">
              <StatusPill label="模式" value="Static export" />
              <StatusPill label="資料源" value="Runtime fetch" />
              <StatusPill label="目前筆數" value={quotes.length ? `${quotes.length}` : "載入中"} />
            </div>
          </div>
          <div className="grid gap-3 rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(18,116,117,0.12),rgba(255,183,3,0.12))] p-4 sm:grid-cols-3 lg:grid-cols-1">
            <MiniStat title="好手氣" value="抽一張" accent="text-brand-deep" className="animate-rise-in animate-delay-1" />
            <MiniStat title="查詢" value="關鍵字 + 分頁" accent="text-ocean" className="animate-rise-in animate-delay-2" />
          </div>
        </div>
      </header>

      <main className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
        <section
          ref={fortuneSectionRef}
          className="animate-rise-in animate-delay-1 overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur"
        >
          <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 sm:px-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-deep">
                好手氣
              </p>
              <h2 className="mt-2 text-2xl font-bold text-foreground">
                抽一張今日名場面
              </h2>
            </div>
            <button
              type="button"
              onClick={handleDrawQuote}
              disabled={loadState !== "ready" || quotes.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-3 text-sm font-semibold text-white transition hover:scale-[1.02] hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Dices className="h-4 w-4" />
              抽一張
            </button>
          </div>

          <div className="px-6 py-6 sm:px-8 sm:py-8">
            {loadState === "loading" ? <LoadingState /> : null}

            {loadState === "error" ? (
              <ErrorState message={errorMessage} onRetry={loadQuotes} />
            ) : null}

            {loadState === "ready" && !selectedQuote ? (
              <EmptyFortuneState total={quotes.length} />
            ) : null}

            {loadState === "ready" && selectedQuote ? (
              <article className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-ocean">
                    <span className="inline-flex items-center rounded-full bg-surface px-3 py-1">
                      {selectedQuote.id}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-border bg-white/70 px-3 py-1 text-ink-soft">
                      {selectedQuote.date}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <blockquote className="space-y-3 text-2xl font-black leading-tight text-foreground sm:text-3xl">
                      {selectedQuote.quoteLines.map((line) => (
                        <p key={`${selectedQuote.id}-${line}`}>{line}</p>
                      ))}
                    </blockquote>
                    <div className="flex flex-wrap gap-2 text-sm text-ink-soft">
                      <MetaChip label="Wiki" value={selectedQuote.wikipediaEpisode} />
                      <MetaChip label="ESFIO" value={selectedQuote.esfio} />
                      <MetaChip label="日期" value={selectedQuote.date} />
                    </div>
                  </div>
                  <a
                    href={selectedQuote.imgurUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-ocean transition hover:text-brand-deep"
                  >
                    看原圖
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <div className="overflow-hidden rounded-3xl border border-border bg-surface p-3">
                  <div className="animate-soft-float relative aspect-4/5 overflow-hidden rounded-[1.1rem]">
                    <Image
                      src={selectedQuote.imageUrl}
                      alt={selectedQuote.quote}
                      fill
                      sizes="(min-width: 1024px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </article>
            ) : null}
          </div>
        </section>

        <section className="overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur">
          <div className="border-b border-border px-6 py-5 sm:px-8">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ocean">
              查詢
            </p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">
              關鍵字與分頁搜尋
            </h2>
          </div>
          <div className="px-6 py-6 sm:px-8 sm:py-8">
            <div className="animate-rise-in animate-delay-2 flex flex-col gap-4 rounded-3xl border border-border bg-surface p-4 sm:p-5">
              <label className="space-y-2">
                <span className="text-sm font-semibold text-foreground">
                  搜尋台詞、編號或集數
                </span>
                <div className="flex items-center gap-3 rounded-[1.15rem] border border-border bg-white px-4 py-3 transition focus-within:border-brand focus-within:ring-4 focus-within:ring-brand/10">
                  <Search className="h-5 w-5 text-ocean" />
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
                    placeholder="例如：神奇海螺、SS0001、S3E03"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-ink-soft"
                  />
                </div>
              </label>

              <div
                id={searchSummaryId}
                className="flex flex-col gap-3 text-sm text-ink-soft sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {normalizedQuery ? (
                    <>
                      <StatusPill label="關鍵字" value={searchTerm.trim()} />
                      <StatusPill label="命中" value={`${filteredQuotes.length} 筆`} />
                      <StatusPill label="頁面" value={`${safePage} / ${totalPages}`} />
                    </>
                  ) : null}
                  {isFiltering ? (
                    <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 font-semibold text-ocean">
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                      篩選中
                    </span>
                  ) : null}
                </div>
                <span>
                  {normalizedQuery
                    ? `找到 ${filteredQuotes.length} 筆結果，現在第 ${safePage} / ${totalPages} 頁`
                    : "輸入關鍵字後才會開始渲染搜尋結果圖片。"}
                </span>
                <button
                  type="button"
                  onClick={handleResetSearch}
                  disabled={!searchInputValue}
                  className="inline-flex items-center gap-2 self-start rounded-full border border-border bg-white px-3 py-2 font-semibold text-foreground transition hover:border-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40 sm:self-auto"
                >
                  <RotateCcw className="h-4 w-4" />
                  清除
                </button>
              </div>
            </div>

            {loadState === "ready" && !normalizedQuery ? (
              <SearchIdleState />
            ) : null}

            {loadState === "ready" && normalizedQuery && filteredQuotes.length === 0 ? (
              <SearchEmptyState query={searchTerm} />
            ) : null}

            {loadState === "ready" && visibleQuotes.length > 0 ? (
              <>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {visibleQuotes.map((quote, index) => (
                    <article
                      key={quote.id}
                      className="animate-rise-in group overflow-hidden rounded-[1.4rem] border border-border bg-white shadow-[0_16px_30px_rgba(29,36,51,0.08)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_22px_44px_rgba(29,36,51,0.12)]"
                      style={{ animationDelay: `${Math.min(index * 50, 200)}ms` }}
                    >
                      <div className="relative aspect-4/3 bg-[#f4e5ba]">
                        {brokenImageIds[quote.id] ? (
                          <div className="flex h-full items-center justify-center px-6 text-center text-sm font-semibold text-ink-soft">
                            這張圖暫時載不到，點進 Imgur 看原圖。
                          </div>
                        ) : (
                          <Image
                            src={quote.imageUrl}
                            alt={quote.quote}
                            fill
                            sizes="(min-width: 1280px) 20vw, (min-width: 640px) 40vw, 100vw"
                            onError={() => {
                              handleImageError(quote.id);
                            }}
                            className="object-cover"
                          />
                        )}
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(29,36,51,0.72))] px-4 py-3 text-white">
                          <p className="text-xs font-semibold uppercase tracking-[0.18em] opacity-85">
                            {quote.wikipediaEpisode}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="space-y-1">
                            <span className="inline-flex rounded-full bg-surface px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-ocean">
                              {quote.id}
                            </span>
                            <p className="text-xs font-medium text-ink-soft">
                              {quote.date}
                            </p>
                          </div>
                          <span className="rounded-full border border-border bg-surface-contrast px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
                            {quote.esfio}
                          </span>
                        </div>
                        <p className="line-clamp-3 min-h-21 text-[15px] font-bold leading-7 text-foreground sm:text-base">
                          {quote.quote}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs text-ink-soft">
                          <MetaChip label="Wiki" value={quote.wikipediaEpisode} />
                        </div>
                        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                          <button
                            type="button"
                            onClick={() => {
                              revealQuote(quote, { scrollIntoView: true });
                            }}
                            className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm font-semibold text-white transition hover:bg-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                          >
                            <GalleryVerticalEnd className="h-4 w-4" />
                            帶去上面
                          </button>
                          <a
                            href={quote.imgurUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center justify-center gap-1 rounded-full border border-border px-4 py-2 text-sm font-semibold text-ocean transition hover:border-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
                          >
                            Imgur
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </a>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>

                <div className="mt-5 flex flex-col gap-3 rounded-[1.3rem] border border-border bg-surface px-4 py-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                  <div className="text-center font-semibold text-foreground sm:text-left">
                    顯示第 {pageStart + 1} 到 {pageStart + visibleQuotes.length} 筆
                  </div>
                  <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((page) => Math.max(1, page - 1));
                    }}
                    disabled={safePage === 1}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 font-semibold text-foreground transition hover:border-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    上一頁
                  </button>
                  <span className="font-semibold text-foreground">
                    第 {safePage} / {totalPages} 頁
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCurrentPage((page) => Math.min(totalPages, page + 1));
                    }}
                    disabled={safePage === totalPages}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-4 py-2 font-semibold text-foreground transition hover:border-brand hover:text-brand-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    下一頁
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  </div>
                </div>
              </>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}

function EmptyFortuneState({ total }: { total: number }) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-border bg-surface px-6 py-10 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-deep">
        準備好了
      </p>
      <h3 className="mt-3 text-3xl font-black text-foreground">
        今天要抽哪一句？
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">
        目前已載入 {total} 筆台詞資料，但還沒有建立任何圖片請求。按下上方按鈕後，才會真的渲染抽中的那張圖。
      </p>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="rounded-[1.75rem] border border-border bg-surface px-6 py-10">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/75 px-3 py-1 text-sm font-medium text-ocean">
        <LoaderCircle className="h-4 w-4 animate-spin" />
        載入資料中
      </div>
      <div className="mt-6 space-y-3">
        <div className="h-5 w-32 rounded-full bg-white/80" />
        <div className="h-10 w-full rounded-full bg-white/70" />
        <div className="h-10 w-4/5 rounded-full bg-white/70" />
        <div className="h-10 w-3/5 rounded-full bg-white/70" />
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
    <div className="rounded-[1.75rem] border border-[#f0c7b8] bg-[#fff2ed] px-6 py-10 text-[#7b341e]">
      <div className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-sm font-medium">
        <TriangleAlert className="h-4 w-4" />
        無法載入資料
      </div>
      <p className="mt-4 text-base leading-7">{message}</p>
      <button
        type="button"
        onClick={() => {
          void onRetry();
        }}
        className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#7b341e] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5a2312]"
      >
        重新載入
      </button>
    </div>
  );
}

function SearchIdleState() {
  return (
    <div className="animate-rise-in mt-5 rounded-[1.75rem] border border-dashed border-border bg-white/75 px-6 py-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-ocean">
        尚未搜尋
      </p>
      <h3 className="mt-3 text-2xl font-black text-foreground">
        先輸入關鍵字，再決定要載哪些圖
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">
        這個區塊預設不渲染任何搜尋圖片。只有你真的輸入條件，且結果進到目前頁面時，才會建立那些圖片請求。
      </p>
    </div>
  );
}

function SearchEmptyState({ query }: { query: string }) {
  return (
    <div className="animate-rise-in mt-5 rounded-[1.75rem] border border-dashed border-border bg-white/75 px-6 py-8 text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-brand-deep">
        沒有結果
      </p>
      <h3 className="mt-3 text-2xl font-black text-foreground">
        找不到「{query}」
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-soft sm:text-base">
        可以試試台詞片段、`SS` 編號、`SxExx` 格式，或 wiki 集數代號。
      </p>
    </div>
  );
}

function MiniStat({
  title,
  value,
  accent,
  className,
}: {
  title: string;
  value: string;
  accent: string;
  className?: string;
}) {
  return (
    <div className={`rounded-[1.25rem] border border-white/60 bg-white/75 p-4 ${className ?? ""}`}>
      <p className="text-sm font-medium text-ink-soft">{title}</p>
      <p className={`mt-2 text-lg font-black ${accent}`}>{value}</p>
    </div>
  );
}

function StatusPill({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/70 px-3 py-1.5">
      <span className="font-semibold text-foreground">{label}</span>
      <span>{value}</span>
    </span>
  );
}

function MetaChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-white/75 px-3 py-1.5">
      <span className="font-semibold text-foreground">{label}</span>
      <span>{value}</span>
    </span>
  );
}