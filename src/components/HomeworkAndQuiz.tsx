import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/lectureData';
import { BookOpen, CheckCircle2, XCircle, RotateCcw, Award } from 'lucide-react';

interface HomeworkTabItem {
  id: string;
  titleAr: string;
  slideRef: string;
  targetFormula: string;
  conditionStr: string;
  simpleIdeaAr: string;
  steps: {
    stepTitleAr: string;
    explanationAr: string;
    mathLines: string[];
  }[];
}

const HOMEWORK_SOLUTIONS: HomeworkTabItem[] = [
  {
    id: 'hw_1_6',
    titleAr: 'واجب 1.6: متسلسلة تايلور للدالة log(x) قرب x = 1',
    slideRef: 'شريحة 18',
    targetFormula:
      'log(x) = Σ [ (-1)ⁿ⁺¹ (x - 1)ⁿ / n ] = (x - 1) - (x - 1)²/2 + (x - 1)³/3 - (x - 1)⁴/4 + ...',
    conditionStr: 'a = 1,  0 < x ≤ 2',
    simpleIdeaAr:
      'فكرة الحل ببساطة: لا يمكننا نشر log(x) حول الصفر لأن log(0) غير معرف! لذلك ننشرها حول a = 1 باستخدام 3 خطوات فقط: نشتق الدالة، نعوض بـ 1، ثم نختصر المضروب في قانون تايلور.',
    steps: [
      {
        stepTitleAr: 'الخطوة 1: حساب الدالة ومشتقاتها المتتالية عند المركز a = 1',
        explanationAr:
          'نشتق الدالة f(x) = ln(x) عدة مرات ثم نعوض عن x = 1 في كل مشتقة لنكتشف النمط الحسابي:',
        mathLines: [
          'f(x)    = ln(x)       ⇒  f(1)    = ln(1) = 0',
          "f'(x)   = x⁻¹         ⇒  f'(1)   = 1",
          "f''(x)  = -1 · x⁻²    ⇒  f''(1)  = -1",
          "f'''(x) = 2! · x⁻³    ⇒  f'''(1) = 2",
          'f⁽⁴⁾(x) = -3! · x⁻⁴   ⇒  f⁽⁴⁾(1) = -6',
          'النمط العام للمشتقة النونية: f⁽ⁿ⁾(1) = (-1)ⁿ⁺¹ · (n - 1)!   (حيث n ≥ 1)',
        ],
      },
      {
        stepTitleAr: 'الخطوة 2: التعويض في القانون العام لمتسلسلة تايلور حول a = 1',
        explanationAr:
          'نكتب قانون تايلور ثم نعوض بقيم المشتقات التي أوجدناها في الخطوة الأولى:',
        mathLines: [
          "f(x) = f(1) + f'(1)(x - 1) + f''(1)(x - 1)²/2! + f'''(1)(x - 1)³/3! + f⁽⁴⁾(1)(x - 1)⁴/4! + ...",
          'log(x) = 0 + (1)(x - 1) + (-1)(x - 1)²/2! + (2!)(x - 1)³/3! + (-3!)(x - 1)⁴/4! + ...',
        ],
      },
      {
        stepTitleAr: 'الخطوة 3: اختصار المضروب (Factorial) واستخراج الصيغة النهائية',
        explanationAr:
          'بما أن n! = n · (n - 1)! فإن (n - 1)! في البسط يختصر مع n! في المقام ويتبقى n فقط في المقام:',
        mathLines: [
          'f⁽ⁿ⁾(1) / n! = [ (-1)ⁿ⁺¹ · (n - 1)! ] / [ n · (n - 1)! ] = (-1)ⁿ⁺¹ / n',
          '∴ log(x) = (x - 1) - (x - 1)²/2 + (x - 1)³/3 - (x - 1)⁴/4 + ... = Σ [ (-1)ⁿ⁺¹ (x - 1)ⁿ / n ]',
        ],
      },
    ],
  },
  {
    id: 'hw_1_10_1',
    titleAr: 'واجب 1.10 (1): المتسلسلة الهندسية 1 / (1 - x)',
    slideRef: 'شريحة 23',
    targetFormula: '1 / (1 - x) = Σ xⁿ = 1 + x + x² + x³ + ...',
    conditionStr: 'a = 0,  -1 < x < 1',
    simpleIdeaAr:
      'فكرة الحل ببساطة: كلما نشتق (1 - x)⁻¹ يظهر لنا مضروب n! في البسط، وعند القسمة على n! الموجود في قانون ماكلورين يختفي المضروب تماماً وتصبح كل المعاملات 1!',
    steps: [
      {
        stepTitleAr: 'الخطوة 1: حساب المشتقات عند x = 0',
        explanationAr:
          'نكتب الدالة على الصورة الأسية f(x) = (1 - x)⁻¹ ونشتقها باستخدام قاعدة السلسلة (مشتقة داخل القوس هي -1 فتلغي الإشارة السالبة في كل مرة):',
        mathLines: [
          'f(x)    = (1 - x)⁻¹         ⇒  f(0)    = 1 = 0!',
          "f'(x)   = 1 · (1 - x)⁻²     ⇒  f'(0)   = 1 = 1!",
          "f''(x)  = 2 · 1 · (1 - x)⁻³ ⇒  f''(0)  = 2 = 2!",
          "f'''(x) = 3! · (1 - x)⁻⁴    ⇒  f'''(0) = 6 = 3!",
          'النمط العام: f⁽ⁿ⁾(0) = n!',
        ],
      },
      {
        stepTitleAr: 'الخطوة 2: التعويض في صيغة ماكلورين واختصار n!',
        explanationAr:
          'نعوض عن f⁽ⁿ⁾(0) = n! في قانون ماكلورين فيختصر المضروب من البسط والمقام:',
        mathLines: [
          'f(x) = Σ [ f⁽ⁿ⁾(0) / n! ] xⁿ = Σ [ n! / n! ] xⁿ = Σ xⁿ',
          '∴ 1 / (1 - x) = 1 + x + x² + x³ + x⁴ + ...   (-1 < x < 1)',
        ],
      },
    ],
  },
  {
    id: 'hw_1_10_2',
    titleAr: 'واجب 1.10 (2): المتسلسلة الأسية eˣ',
    slideRef: 'شريحة 23',
    targetFormula: 'eˣ = Σ (xⁿ / n!) = 1 + x + x²/2! + x³/3! + ...',
    conditionStr: 'a = 0,  x ∈ ℝ',
    simpleIdeaAr:
      'فكرة الحل ببساطة: هذا أسهل إثبات في المحاضرة! لأن مشتقة eˣ هي نفسها eˣ دائماً، وعند التعويض بـ x = 0 تصبح كل المشتقات مساوية لـ e⁰ = 1.',
    steps: [
      {
        stepTitleAr: 'الخطوة 1: حساب المشتقات عند x = 0',
        explanationAr:
          'تتميز الدالة الأسية الطبيعية f(x) = eˣ بأن مشتقتها من أي رتبة n هي نفسها eˣ:',
        mathLines: [
          "f(x) = f'(x) = f''(x) = ... = f⁽ⁿ⁾(x) = eˣ",
          'وعند التعويض بـ x = 0 نحصل على: f⁽ⁿ⁾(0) = e⁰ = 1 لجميع قيم n = 0, 1, 2, ...',
        ],
      },
      {
        stepTitleAr: 'الخطوة 2: التعويض المباشر في صيغة ماكلورين',
        explanationAr: 'بوضع f⁽ⁿ⁾(0) = 1 في متسلسلة ماكلورين نتحقق مباشرة من المتطابقة:',
        mathLines: [
          "eˣ = f(0) + f'(0)x + f''(0)x²/2! + f'''(0)x³/3! + ...",
          '∴ eˣ = 1 + x + x²/2! + x³/3! + x⁴/4! + ... = Σ (xⁿ / n!)',
        ],
      },
    ],
  },
  {
    id: 'hw_1_10_3',
    titleAr: 'واجب 1.10 (3): متسلسلة جيب التمام cos(x)',
    slideRef: 'شريحة 23',
    targetFormula: 'cos(x) = Σ [ (-1)ⁿ x²ⁿ / (2n)! ] = 1 - x²/2! + x⁴/4! - x⁶/6! + ...',
    conditionStr: 'a = 0,  x ∈ ℝ',
    simpleIdeaAr:
      'فكرة الحل ببساطة: عكس دالة sin(x) التي احتفظت بالقوى الفردية فقط، فإن دالة cos(x) تحتفظ بالقوى الزوجية فقط (1, x², x⁴, x⁶) مع تناوب الإشارة (+ ثم -).',
    steps: [
      {
        stepTitleAr: 'الخطوة 1: حساب المشتقات الدورية عند x = 0',
        explanationAr: 'مشتقات cos(x) تتكرر كل 4 مرات بنمط دوري (1, 0, -1, 0):',
        mathLines: [
          'f(x)    = cos(x)   ⇒  f(0)    = 1',
          "f'(x)   = -sin(x)  ⇒  f'(0)   = 0   (تختفي جميع القوى الفردية)",
          "f''(x)  = -cos(x)  ⇒  f''(0)  = -1",
          "f'''(x) = sin(x)   ⇒  f'''(0) = 0",
          'f⁽⁴⁾(x) = cos(x)   ⇒  f⁽⁴⁾(0) = 1',
        ],
      },
      {
        stepTitleAr: 'الخطوة 2: التعويض في متسلسلة ماكلورين وكتابة المجموع العام',
        explanationAr: 'تبقى الحدود ذات القوى الزوجية فقط (2n) مع تناوب الإشارة (-1)ⁿ:',
        mathLines: [
          'cos(x) = 1 + (0)x + (-1)x²/2! + (0)x³/3! + (1)x⁴/4! + (0)x⁵/5! + (-1)x⁶/6! + ...',
          '∴ cos(x) = 1 - x²/2! + x⁴/4! - x⁶/6! + ... = Σ [ (-1)ⁿ / (2n)! ] x²ⁿ',
        ],
      },
    ],
  },
];

export const HomeworkAndQuiz: React.FC = () => {
  const [activeHwId, setActiveHwId] = useState<string>('hw_1_6');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showExplanations, setShowExplanations] = useState<Record<number, boolean>>({});

  const activeHw = HOMEWORK_SOLUTIONS.find((h) => h.id === activeHwId) || HOMEWORK_SOLUTIONS[0];

  const handleSelectAnswer = (qId: number, optionIndex: number) => {
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optionIndex }));
    setShowExplanations((prev) => ({ ...prev, [qId]: true }));
  };

  const handleResetQuiz = () => {
    setSelectedAnswers({});
    setShowExplanations({});
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const correctCount = QUIZ_QUESTIONS.filter(
    (q) => selectedAnswers[q.id] === q.correctIndex
  ).length;

  return (
    <div className="space-y-16">
      {/* Homework Solutions Section (Slides 18 & 23) */}
      <section id="homework-section" className="space-y-8">
        <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400 mb-1">
                الحلول النموذجية التفصيلية · الشرائح 18 و 23
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-slate-50 text-balance">
                04. حلول واجبات المحاضرة خطوة بخطوة (Homework 1.6 &amp; 1.10)
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span>إثبات log(x) قرب 1</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>المتسلسلة الهندسية</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>الدالة الأسية وجيب التمام</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
          {/* Homework Selector Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg">
            {HOMEWORK_SOLUTIONS.map((hw) => (
              <button
                key={hw.id}
                type="button"
                onClick={() => setActiveHwId(hw.id)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  activeHwId === hw.id
                    ? 'bg-[#0284C7] dark:bg-sky-500 text-white dark:text-slate-950'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {hw.titleAr}
              </button>
            ))}
          </div>

          {/* Target Identity Header */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-[#0284C7] dark:text-sky-400" />
                <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-50">
                  {activeHw.titleAr}
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activeHw.slideRef} · <span dir="ltr" className="font-mono">{activeHw.conditionStr}</span>
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeHw.simpleIdeaAr}
            </p>

            <div
              dir="ltr"
              className="bg-slate-950 border border-slate-800 text-emerald-300 font-mono text-xs md:text-sm p-3.5 rounded-lg overflow-x-auto"
            >
              {activeHw.targetFormula}
            </div>
          </div>

          {/* Step-by-Step Derivation Cards */}
          <div className="grid grid-cols-1 gap-4">
            {activeHw.steps.map((step, idx) => (
              <div
                key={idx}
                className="border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/50 space-y-3"
              >
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  {step.stepTitleAr}
                </h4>
                <p className="text-xs md:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {step.explanationAr}
                </p>
                <div
                  dir="ltr"
                  className="bg-[#F8FAFC] dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3.5 font-mono text-xs text-slate-800 dark:text-slate-200 space-y-1.5 overflow-x-auto tabular-nums"
                >
                  {step.mathLines.map((line, lIdx) => (
                    <div
                      key={lIdx}
                      className={
                        lIdx === step.mathLines.length - 1
                          ? 'font-bold text-[#0284C7] dark:text-sky-400 pt-1.5 border-t border-slate-200/80 dark:border-slate-800'
                          : ''
                      }
                    >
                      {line}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Summary & Interactive Self-Assessment Section (Slide 24) */}
      <section id="summary-section" className="space-y-8">
        <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400 mb-1">
                الخلاصة المركزة واختبار الفهم · شريحة 24
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-slate-50 text-balance">
                05. ملخص المحاضرة الأولى والاختبار التفاعلي السريع
              </h2>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              <span>6 أفكار رئيسية</span>
              <span className="mx-2" aria-hidden="true">·</span>
              <span>6 أسئلة تفاعلية</span>
            </div>
          </div>
        </div>

        {/* 6 Key Ideas from Slide 24 */}
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
              الأفكار الست الرئيسية في المحاضرة (Summary of Lecture 1 — Slide 24)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">مراجعة سريعة قبل الاختبار</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                01. هدف التحليل العددي
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                يطور ويحلل الطرق الرياضية والخوارزميات لإيجاد <strong>حلول تقريبية</strong> للمسائل العملية في عدد منتهٍ من الخطوات.
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                02. مقياسا الخطأ الأساسيان
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                الخطأ المطلق والخطأ النسبي (الأكثر دلالة):
              </p>
              <div
                dir="ltr"
                className="font-mono text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800"
              >
                Aerr = |xT - xA|, rel = |xT - xA| / |xT|
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                03. المصادر الخمسة للأخطاء
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                خطأ النموذج الرياضي، خطأ بيانات الإدخال، خطأ التقريب/التقطيع، خطأ التدوير الحاسوبي (Round-off)، وخطأ البتر (Truncation).
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                04. متسلسلة تايلور حول x = a
              </div>
              <p className="text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                تمثيل الدالة الملساء بدلالة مشتقاتها عند النقطة a:
              </p>
              <div
                dir="ltr"
                className="font-mono text-xs text-slate-900 dark:text-slate-100 bg-white dark:bg-slate-950 p-2 rounded border border-slate-200 dark:border-slate-800"
              >
                f(x) = Σ f⁽ⁿ⁾(a) (x - a)ⁿ / n!
              </div>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                05. متسلسلة ماكلورين
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                هي الحالة الخاصة المباشرة من متسلسلة تايلور عندما تكون نقطة النشر في المركز{' '}
                <span dir="ltr" className="font-mono font-semibold">
                  a = 0
                </span>
                .
              </p>
            </div>

            <div className="p-4 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl space-y-2">
              <div className="text-xs font-mono font-bold text-[#0284C7] dark:text-sky-400">
                06. خطأ البتر Em
              </div>
              <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                قطع المتسلسلة اللانهائية والاكتفاء بعدد منتهٍ من الحدود يُدخل خطأ بتر{' '}
                <span dir="ltr" className="font-mono font-semibold">
                  Em
                </span>{' '}
                يتناقص كلما أضفنا حدوداً أكثر.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Quiz */}
        <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 md:p-8 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2.5">
              <Award className="w-5 h-5 text-[#0284C7] dark:text-sky-400" />
              <div>
                <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
                  اختبر فهمك للمحاضرة (6 أسئلة تفاعلية شاملة)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  اختر الإجابة الصحيحة لكل سؤال للحصول على التغذية الراجعة الفورية
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-xs font-medium text-slate-700 dark:text-slate-300 tabular-nums">
                النتيجة الحالية:{' '}
                <span className="font-bold text-[#0284C7] dark:text-sky-400 font-mono">
                  {correctCount} / {QUIZ_QUESTIONS.length}
                </span>{' '}
                (أجبت على {answeredCount})
              </div>
              {answeredCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetQuiz}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium bg-[#F8FAFC] dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة المحاولة</span>
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {QUIZ_QUESTIONS.map((q, qIdx) => {
              const userChoice = selectedAnswers[q.id];
              const isAnswered = userChoice !== undefined;
              const isCorrect = userChoice === q.correctIndex;

              return (
                <div
                  key={q.id}
                  className="border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 bg-[#F8FAFC]/60 dark:bg-slate-900/60 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                      <span className="font-mono font-bold text-[#0284C7] dark:text-sky-400">
                        السؤال 0{qIdx + 1}
                      </span>
                      {isAnswered && (
                        <span
                          className={`inline-flex items-center gap-1 font-bold ${
                            isCorrect
                              ? 'text-[#059669] dark:text-emerald-400'
                              : 'text-[#DC2626] dark:text-rose-400'
                          }`}
                        >
                          {isCorrect ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>إجابة صحيحة</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3.5 h-3.5" />
                              <span>إجابة غير صحيحة</span>
                            </>
                          )}
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100 leading-relaxed">
                      {q.questionAr}
                    </h4>

                    {q.formulaLtr && (
                      <div
                        dir="ltr"
                        className="font-mono text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded text-slate-700 dark:text-slate-300 tabular-nums"
                      >
                        {q.formulaLtr}
                      </div>
                    )}

                    <div className="space-y-2 pt-1">
                      {q.options.map((opt, optIdx) => {
                        const isSelected = userChoice === optIdx;
                        const isRightOption = q.correctIndex === optIdx;

                        let btnStyle =
                          'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:border-[#0284C7] dark:hover:border-sky-400';
                        if (isAnswered) {
                          if (isRightOption) {
                            btnStyle =
                              'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-400 dark:border-emerald-500 text-emerald-950 dark:text-emerald-200 font-bold';
                          } else if (isSelected && !isRightOption) {
                            btnStyle =
                              'bg-rose-50 dark:bg-rose-950/60 border-rose-300 dark:border-rose-500 text-rose-900 dark:text-rose-200';
                          } else {
                            btnStyle =
                              'bg-white/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/60 text-slate-400 dark:text-slate-500';
                          }
                        }

                        return (
                          <button
                            key={optIdx}
                            type="button"
                            onClick={() => handleSelectAnswer(q.id, optIdx)}
                            className={`w-full text-right px-3.5 py-2.5 text-xs rounded-lg border transition-colors flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <span className="leading-relaxed">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {showExplanations[q.id] && (
                    <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                      <strong className="text-[#0F172A] dark:text-white">التوضيح: </strong>
                      {q.explanationAr}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
