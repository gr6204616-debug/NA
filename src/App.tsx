import React, { useState, useEffect } from 'react';
import { LECTURE_OUTLINE } from './data/lectureData';
import { ErrorSandbox } from './components/ErrorSandbox';
import { SeriesVisualizer } from './components/SeriesVisualizer';
import { MatlabStudio } from './components/MatlabStudio';
import { HomeworkAndQuiz } from './components/HomeworkAndQuiz';
import { BookMarked, X, ArrowLeft, Moon, Sun } from 'lucide-react';

export default function App() {
  const [isFormulaModalOpen, setIsFormulaModalOpen] = useState<boolean>(false);
  const [isDark, setIsDark] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('na_lecture1_theme');
      return saved ? saved === 'dark' : false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('na_lecture1_theme', isDark ? 'dark' : 'light');
    } catch {
      // ignore storage errors in restricted environments
    }
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-[#0B1120] text-[#0F172A] dark:text-slate-100 transition-colors duration-200">
      {/* Strict 3-Zone Top Bar Contract */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur border-b border-[#E2E8F0] dark:border-slate-800 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Zone 1: Single text element wordmark */}
          <a
            href="#top"
            className="text-base sm:text-lg font-bold tracking-tight text-[#0F172A] dark:text-slate-50 whitespace-nowrap shrink-0"
          >
            التحليل العددي · المحاضرة 1
          </a>

          {/* Zone 2: 5 clean text navigation links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a
              href="#errors-section"
              className="hover:text-[#0284C7] dark:hover:text-sky-400 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              الأخطاء والمصادر
            </a>
            <a
              href="#series-section"
              className="hover:text-[#0284C7] dark:hover:text-sky-400 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              متسلسلات تايلور وماكلورين
            </a>
            <a
              href="#matlab-section"
              className="hover:text-[#0284C7] dark:hover:text-sky-400 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              كود MATLAB
            </a>
            <a
              href="#homework-section"
              className="hover:text-[#0284C7] dark:hover:text-sky-400 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              حلول الواجبات
            </a>
            <a
              href="#summary-section"
              className="hover:text-[#0284C7] dark:hover:text-sky-400 hover:underline underline-offset-8 transition-colors whitespace-nowrap"
            >
              الملخص والاختبار
            </a>
          </nav>

          {/* Zone 3: 2 primary actions (Dark Mode Toggle + Quick Formula Sheet) */}
          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsDark((prev) => !prev)}
              aria-label={isDark ? 'التبديل إلى الوضع النهاري' : 'التبديل إلى الوضع الليلي'}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border border-slate-300 dark:border-slate-700 bg-[#F8FAFC] dark:bg-slate-800 text-slate-800 dark:text-amber-300 hover:bg-slate-200/70 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
            >
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
              <span>{isDark ? 'الوضع النهاري' : 'الوضع الليلي'}</span>
            </button>

            <button
              type="button"
              onClick={() => setIsFormulaModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white dark:text-slate-950 bg-[#0284C7] dark:bg-sky-400 rounded-lg hover:bg-[#0369A1] dark:hover:bg-sky-300 transition-colors whitespace-nowrap"
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>ورقة القوانين السريعة</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Container (1440px Desktop Presence) */}
      <main id="top" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-8 md:py-12 space-y-16">
        {/* Hero & Lecture Outline Section (Slides 1 & 2) */}
        <section className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl p-6 sm:p-10 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              {/* Unboxed Academic Metadata with Typographic Separators */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span>جامعة الكوفة · كلية علوم الحاسوب والرياضيات</span>
                <span aria-hidden="true">·</span>
                <span>د. عمار علي نعمة الرماحي</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">2026 (25 شريحة)</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-bold text-[#0F172A] dark:text-slate-50 leading-tight text-balance">
                المحاضرة الأولى: مقدمة في التحليل العددي، الأخطاء، ومتسلسلات تايلور وماكلورين
              </h1>

              <p dir="ltr" className="text-sm sm:text-base font-mono text-[#0284C7] dark:text-sky-400 font-semibold">
                Numerical Analysis — Lecture 1: Introduction, Errors, Taylor and Maclaurin Series
              </p>

              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                تم ترتيب وتبسيط جميع أفكار المحاضرة في 5 محطات متسلسلة تبدأ بالمعنى الفيزيائي البسيط، ثم القانون الرياضي، ثم أمثلة الكتاب والرسوم البيانية التفاعلية وحلول الواجبات خطوة بخطوة.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href="#errors-section"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-white dark:text-slate-950 bg-[#0284C7] dark:bg-sky-400 rounded-lg hover:bg-[#0369A1] dark:hover:bg-sky-300 transition-colors whitespace-nowrap"
                >
                  <span>ابدأ بالجزء الأول: الأخطاء</span>
                  <ArrowLeft className="w-4 h-4" />
                </a>
                <a
                  href="#series-section"
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-[#F8FAFC] dark:bg-slate-800 border border-[#E2E8F0] dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors whitespace-nowrap"
                >
                  <span>الانتقال إلى متسلسلات تايلور وماكلورين</span>
                </a>
              </div>
            </div>

            {/* Outline of Lecture 1 Card (Slide 2) */}
            <div className="lg:col-span-5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <h2 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  خارطة المحاضرة السريعة (Outline of Lecture 1)
                </h2>
                <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 2</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-xs font-bold text-[#0284C7] dark:text-sky-400 mb-2">
                    {LECTURE_OUTLINE.part1.titleAr}
                  </div>
                  <div className="space-y-1.5">
                    {LECTURE_OUTLINE.part1.items.map((item) => (
                      <a
                        key={item.index}
                        href="#errors-section"
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#0284C7] dark:hover:border-sky-400 transition-colors"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          <span className="font-mono text-[#0284C7] dark:text-sky-400 ml-1.5">{item.index}.</span>
                          {item.titleAr}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                          ص {item.slide}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-bold text-[#059669] dark:text-emerald-400 mb-2">
                    {LECTURE_OUTLINE.part2.titleAr}
                  </div>
                  <div className="space-y-1.5">
                    {LECTURE_OUTLINE.part2.items.map((item) => (
                      <a
                        key={item.index}
                        href={item.index === '07' ? '#matlab-section' : '#series-section'}
                        className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-white dark:bg-slate-950 border border-slate-200/80 dark:border-slate-800 hover:border-[#059669] dark:hover:border-emerald-400 transition-colors"
                      >
                        <span className="font-medium text-slate-800 dark:text-slate-200">
                          <span className="font-mono text-[#059669] dark:text-emerald-400 ml-1.5">{item.index}.</span>
                          {item.titleAr}
                        </span>
                        <span className="text-[11px] text-slate-400 dark:text-slate-500 font-mono tabular-nums">
                          ص {item.slide}
                        </span>
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Outcomes Row (Slide 2) */}
          <div className="pt-6 border-t border-[#E2E8F0] dark:border-slate-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                أهداف المحاضرة الأربعة (Learning Outcomes — ماذا ستتقن بعد قراءة هذه الصفحة؟):
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {LECTURE_OUTLINE.outcomes.map((outcome, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-xl bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 space-y-1.5"
                >
                  <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                    الهدف 0{idx + 1}
                  </div>
                  <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">{outcome.titleAr}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{outcome.descAr}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Part I: Interactive Error Sandbox (Slides 3-12) */}
        <ErrorSandbox isDark={isDark} />

        {/* Part II: Interactive Taylor & Maclaurin Series Visualizer (Slides 13-21, 23) */}
        <SeriesVisualizer isDark={isDark} />

        {/* Part III: Interactive MATLAB Code 1.9 Studio (Slide 22) */}
        <MatlabStudio isDark={isDark} />

        {/* Part IV & V: Step-by-Step Homework Solutions & Self-Assessment Quiz (Slides 18, 23, 24) */}
        <HomeworkAndQuiz />
      </main>

      {/* Clean Footer */}
      <footer className="bg-white dark:bg-[#0F172A] border-t border-[#E2E8F0] dark:border-slate-800 px-4 sm:px-8 py-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div>
            <span>المصدر الأكاديمي: المحاضرة الأولى في التحليل العددي — د. عمار علي نعمة الرماحي (جامعة الكوفة · 2026)</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#top" className="hover:text-[#0284C7] dark:hover:text-sky-400 transition-colors">
              العودة للأعلى
            </a>
            <span aria-hidden="true">·</span>
            <button
              type="button"
              onClick={() => setIsFormulaModalOpen(true)}
              className="hover:text-[#0284C7] dark:hover:text-sky-400 transition-colors"
            >
              ملخص القوانين الرياضية
            </button>
          </div>
        </div>
      </footer>

      {/* Quick Formula Sheet Modal */}
      {isFormulaModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="formula-sheet-title"
        >
          <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <h2 id="formula-sheet-title" className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
                  ورقة القوانين والمتسلسلات السريعة (Lecture 1 Cheat Sheet)
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  جميع القوانين والمتسلسلات القياسية الواردة في الشرائح 5 إلى 24
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-100 transition-colors"
                aria-label="إغلاق النافذة"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-[#0284C7] dark:text-sky-400">
                  1. قوانين الأخطاء (شريحة 5)
                </h3>
                <div dir="ltr" className="font-mono text-xs space-y-1.5 text-slate-800 dark:text-slate-200 tabular-nums">
                  <div>• Error: err(xA) = xT - xA</div>
                  <div>• Absolute Error: Aerr(xA) = |xT - xA|</div>
                  <div>• Relative Error: rel(xA) = |xT - xA| / |xT|   (xT ≠ 0)</div>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-[#0284C7] dark:text-sky-400">
                  2. متسلسلة تايلور حول x = a ومتسلسلة ماكلورين حول a = 0 (شريحة 14 و 19)
                </h3>
                <div dir="ltr" className="font-mono text-xs space-y-1.5 text-slate-800 dark:text-slate-200 tabular-nums">
                  <div>
                    • Taylor Series: f(x) = Σ [ f⁽ⁿ⁾(a) (x - a)ⁿ / n! ] = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...
                  </div>
                  <div>
                    • Maclaurin Series (a = 0): f(x) = Σ [ f⁽ⁿ⁾(0) xⁿ / n! ] = f(0) + f'(0)x + f''(0)x²/2! + ...
                  </div>
                </div>
              </div>

              <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
                <h3 className="text-sm font-bold text-[#059669] dark:text-emerald-400">
                  3. المتسلسلات القياسية الخمس في المحاضرة (شريحة 18، 20، 23)
                </h3>
                <div dir="ltr" className="font-mono text-xs space-y-2 text-slate-800 dark:text-slate-200 tabular-nums">
                  <div>1) sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ... = Σ (-1)ⁿ x²ⁿ⁺¹ / (2n + 1)!</div>
                  <div>2) cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ... = Σ (-1)ⁿ x²ⁿ / (2n)!</div>
                  <div>3) eˣ     = 1 + x + x²/2! + x³/3! + ...     = Σ xⁿ / n!</div>
                  <div>4) 1/(1-x) = 1 + x + x² + x³ + ...          = Σ xⁿ   (-1 &lt; x &lt; 1)</div>
                  <div>5) log(x) near x=1: (x-1) - (x-1)²/2 + (x-1)³/3 - ... = Σ (-1)ⁿ⁺¹(x-1)ⁿ / n</div>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={() => setIsFormulaModalOpen(false)}
                className="px-5 py-2 text-xs font-semibold bg-[#0F172A] dark:bg-sky-400 text-white dark:text-slate-950 rounded-lg hover:bg-slate-800 dark:hover:bg-sky-300 transition-colors"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
