"use client";

import React from "react";

export default function UnderConstructionPage() {
  return (
    <div className="min-h-screen  text-slate-50 flex items-center justify-center px-4 py-10">
      {/* Little global styles just for this page */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-8px); }
            100% { transform: translateY(0px); }
          }
          @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.2; }
          }
          .animate-float {
            animation: float 3s ease-in-out infinite;
          }
          .animate-blink {
            animation: blink 1.2s ease-in-out infinite;
          }
        `,
        }}
      />

      <div className="relative max-w-4xl w-full">
        {/* Background glow blobs */}
        <div className="pointer-events-none absolute -top-24 -left-16 h-56 w-56 rounded-full bg-emerald-500/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -right-10 h-64 w-64 rounded-full bg-cyan-500/30 blur-3xl" />

        {/* Card */}
        <div className="relative overflow-hidden rounded-3xl border border-slate-800 bg-gradient-to-br from-slate-900/80 via-slate-900/95 to-slate-950 shadow-2xl shadow-emerald-500/10 backdrop-blur-xl px-5 py-8 sm:px-8 sm:py-10 lg:px-10 lg:py-12">
          {/* Top tag */}
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-semibold uppercase tracking-[0.18em]">
                Work in progress
              </span>
            </div>
            <span className="hidden sm:inline text-[11px]">
              Yes, we ship features. No, you can’t see them yet. 😌
            </span>
          </div>

          {/* Main content */}
          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-10">
            {/* Left side: text */}
            <div className="flex-1 space-y-5">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight">
                This page is
                <span className="block text-emerald-400">still booting up.</span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                The designers are arguing about one pixel,
                the devs are refactoring something that was{" "}
                <span className="italic">totally fine</span>, and this page
                will be live as soon as everyone agrees on a shade of green.
              </p>

              {/* Progress bar */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="font-medium">Under construction status</span>
                  <span className="font-mono text-emerald-300">73.42% done*</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
                  <div className="relative h-full w-3/4 rounded-full bg-gradient-to-r from-emerald-400 via-emerald-300 to-cyan-300">
                    <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/50 to-transparent opacity-40 [animation:shimmer_2s_infinite]" />
                  </div>
                </div>
                <p className="text-[10px] text-slate-500">
                  *Highly scientific estimate powered by vibes and coffee.
                </p>
              </div>

              {/* CTA row */}
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-emerald-500 px-5 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-emerald-500/30 transition hover:bg-emerald-400 hover:shadow-emerald-400/40 active:translate-y-[1px]">
                  Notify me when it’s live
                  <span className="text-lg">🚀</span>
                </button>
                <button className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-slate-700 bg-slate-900/40 px-5 py-3 text-xs sm:text-sm font-medium text-slate-200 transition hover:border-slate-500 hover:bg-slate-900">
                  Take me back home
                  <span className="text-base">🏠</span>
                </button>
              </div>
            </div>

            {/* Right side: illustration / fun stuff */}
            <div className="flex-1">
              <div className="mx-auto mt-4 w-full max-w-xs sm:max-w-sm">
                <div className="relative rounded-3xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 shadow-inner shadow-black/40">
                  {/* Floating icon */}
                  <div className="mx-auto mb-4 flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-400 text-3xl sm:text-4xl shadow-lg shadow-emerald-500/40 animate-float">
                    🚧
                  </div>

                  <p className="mb-3 text-center text-sm font-semibold text-slate-100 sm:text-base">
                    Live Construction Feed
                  </p>

                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-300">
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        Devs are{" "}
                        <span className="font-semibold text-emerald-300">
                          renaming variables
                        </span>{" "}
                        to something slightly better.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        Designers are debating the{" "}
                        <span className="font-semibold text-emerald-300">
                          border-radius
                        </span>{" "}
                        of one button.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-400" />
                      <span>
                        Product just said:{" "}
                        <span className="italic text-slate-200">
                          &quot;What if we make it… simpler?&quot;
                        </span>
                      </span>
                    </li>
                  </ul>

                  {/* Fake console / status */}
                  <div className="mt-4 rounded-2xl border border-slate-800 bg-slate-950/70 p-3 text-[10px] sm:text-xs font-mono text-slate-400">
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-[0.18em] text-slate-500">
                        build.log
                      </span>
                      <span className="flex items-center gap-1 text-[9px] text-emerald-400">
                        ● <span className="animate-blink">running</span>
                      </span>
                    </div>
                    <p>$ yarn build</p>
                    <p className="text-emerald-400">✔ Compiling classy UI...</p>
                    <p className="text-emerald-400">✔ Injecting bad jokes...</p>
                    <p className="text-yellow-300">▸ Waiting for final polish...</p>
                  </div>
                </div>

                <p className="mt-4 text-center text-[11px] text-slate-500">
                  In the meantime, hydrate, stretch, and pretend this was the page you
                  were looking for.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
