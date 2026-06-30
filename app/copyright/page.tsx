import Link from "next/link";
import { ChevronLeft, ExternalLink, ShieldAlert, FileText, Share2, Info } from "lucide-react";

export default function CopyrightPage() {
  return (
    <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-8 sm:px-6 lg:px-8 lg:py-12 justify-center">
      {/* Back to Home Button */}
      <div className="animate-rise-in mb-6">
        <Link
          href="/"
          className="cursor-pointer inline-flex items-center gap-1.5 text-sm font-bold text-ocean hover:text-brand-deep transition-colors group"
        >
          <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          返回首頁
        </Link>
      </div>

      {/* Main Card Container */}
      <article className="animate-rise-in animate-delay-1 overflow-hidden rounded-4xl border border-border bg-surface-contrast/85 shadow-(--shadow) backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-border px-6 py-6 sm:px-8 bg-white/40">
          <ShieldAlert className="h-8 w-8 text-brand-deep" />
          <div>
            <h1 className="text-2xl font-black text-foreground">
              版權與資料來源聲明
            </h1>
            <p className="text-xs text-ink-soft mt-1">
              Copyright & Data Source Declarations
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Copyright Statement */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <Info className="h-5 w-5 text-ocean" />
              版權聲明
            </h2>
            <div className="rounded-2xl bg-surface border border-border p-4 sm:p-5 text-sm leading-relaxed text-ink-soft space-y-3">
              <p>
                本網站為<strong>非營利之粉絲自建靜態網站</strong>，旨在整理、歸檔及提供便捷的《海綿寶寶》經典中配台詞與迷因梗圖搜尋服務。
              </p>
              <p>
                本站所展示之所有電視動畫畫面、截圖、角色形象及台詞著作權，皆歸原版權所有者（包括但不限於 Nickelodeon、派拉蒙影業 Paramount Pictures 等）所有。本站不聲稱擁有任何素材之版權。
              </p>
            </div>
          </section>

          {/* Sources Section */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <FileText className="h-5 w-5 text-ocean" />
              資料來源致謝
            </h2>
            <p className="text-sm text-ink-soft">
              本站資料庫得以建立，特別感謝以下社群前輩整理與開放的資料庫：
            </p>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Source 1: VulcandDays */}
              <div className="flex flex-col justify-between rounded-3xl border border-border bg-white p-5 hover:border-brand-deep/50 hover:shadow-md transition-all duration-300">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-deep/10 text-brand-deep px-3 py-1 text-xs font-bold">
                    <Share2 className="h-3 w-3" />
                    台詞與梗圖整理者
                  </div>
                  <h3 className="text-lg font-black text-foreground">VulcandDays</h3>
                  <p className="text-xs leading-relaxed text-ink-soft">
                    感謝 VulcandDays 於巴哈姆特論壇整理分享的「海綿寶寶經典語錄梗圖」，提供了豐富且考究的中配台詞及對照編號，是本站極為重要的史料基礎。
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-border/40">
                  <a
                    href="https://forum.gamer.com.tw/C.php?bsn=8063&snA=933"
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-slate-50 hover:bg-ocean hover:text-white hover:border-ocean py-2 text-xs font-bold text-ocean transition-all"
                  >
                    <span>巴哈姆特原文連結</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>

              {/* Source 2: Leko */}
              <div className="flex flex-col justify-between rounded-3xl border border-border bg-white p-5 hover:border-brand-deep/50 hover:shadow-md transition-all duration-300">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 rounded-full bg-ocean/10 text-ocean px-3 py-1 text-xs font-bold">
                    <Share2 className="h-3 w-3" />
                    Meme Database 開發者
                  </div>
                  <h3 className="text-lg font-black text-foreground">Leko</h3>
                  <p className="text-xs leading-relaxed text-ink-soft">
                    感謝 Leko 所建立的 SpongeBob Meme Database 專案（sb.leko.moe），為社群提供極佳的語音、圖片庫及豐富的前端技術啟發與社群示範。
                  </p>
                </div>
                <div className="pt-4 mt-2 border-t border-border/40">
                  <a
                    href="https://sb.leko.moe/"
                    target="_blank"
                    rel="noreferrer"
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-border bg-slate-50 hover:bg-ocean hover:text-white hover:border-ocean py-2 text-xs font-bold text-ocean transition-all"
                  >
                    <span>Leko 網站連結</span>
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* Additional Notes */}
          <section className="border-t border-border/60 pt-6 text-center text-xs text-ink-soft">
            <p>本站承諾不進行任何商業廣告置入或營利行為。若有任何版權疑慮，歡迎與開發團隊聯繫。</p>
          </section>
        </div>
      </article>
    </div>
  );
}
