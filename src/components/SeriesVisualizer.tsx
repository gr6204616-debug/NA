import React, { useState, useMemo } from 'react';
import { LineChart, Sliders, Plus, Minus, RotateCcw } from 'lucide-react';

interface SeriesVisualizerProps {
  isDark: boolean;
}

interface SeriesPreset {
  id: string;
  titleAr: string;
  slideRef: string;
  formulaTitle: string;
  centerA: number;
  xMin: number;
  xMax: number;
  yMin: number;
  yMax: number;
  defaultTestX: number;
  defaultTerms: number;
  maxTerms: number;
  evalTrue: (x: number) => number;
  evalApprox: (x: number, termsCount: number) => number;
  getFormulaString: (termsCount: number) => string;
  collectedPolynomialNote?: string;
  derivativesTable: { order: string; expr: string; valAtA: string }[];
  pedagogicalNoteAr: string;
}

const factorial = (n: number): number => {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

const SERIES_PRESETS: SeriesPreset[] = [
  {
    id: 'ln_10',
    titleAr: 'مثال 1.5: متسلسلة تايلور للدالة ln(x) حول a = 10',
    slideRef: 'الشرائح 15–17',
    formulaTitle: 'f(x) = ln(x),  a = 10',
    centerA: 10,
    xMin: 0.4,
    xMax: 22,
    yMin: -2.2,
    yMax: 3.6,
    defaultTestX: 14,
    defaultTerms: 4,
    maxTerms: 7,
    evalTrue: (x) => Math.log(x),
    evalApprox: (x, termsCount) => {
      let sum = Math.log(10);
      for (let k = 1; k < termsCount; k++) {
        const sign = k % 2 === 1 ? 1 : -1;
        sum += (sign * Math.pow(x - 10, k)) / (k * Math.pow(10, k));
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const parts = ['2.302585'];
      if (termsCount >= 2) parts.push('+ 0.1(x - 10)');
      if (termsCount >= 3) parts.push('- (0.01 / 2!)(x - 10)²');
      if (termsCount >= 4) parts.push('+ (0.002 / 3!)(x - 10)³');
      if (termsCount >= 5) parts.push('- (0.0006 / 4!)(x - 10)⁴');
      if (termsCount >= 6) parts.push('+ (0.00024 / 5!)(x - 10)⁵');
      if (termsCount >= 7) parts.push('- (0.00012 / 6!)(x - 10)⁶');
      return `ln(x) ≈ ${parts.join(' ')}`;
    },
    collectedPolynomialNote:
      'عند فك الأقواس وتجميع الحدود المتشابهة للرتبة الثالثة (شريحة 16): ln(x) ≈ 0.46925176 + 0.3x - 0.015x² + 0.0003333333x³',
    derivativesTable: [
      { order: 'f(x)', expr: 'ln(x)', valAtA: 'f(10) = ln(10) ≈ 2.302585093' },
      { order: "f'(x)", expr: '1 / x', valAtA: "f'(10) = 1 / 10 = 0.1" },
      { order: "f''(x)", expr: '-1 / x²', valAtA: "f''(10) = -1 / 10² = -0.01" },
      { order: "f'''(x)", expr: '2 / x³', valAtA: "f'''(10) = 2 / 10³ = 0.002" },
      { order: 'f⁽⁴⁾(x)', expr: '-6 / x⁴', valAtA: 'f⁽⁴⁾(10) = -6 / 10⁴ = -0.0006' },
    ],
    pedagogicalNoteAr:
      'بالقرب من x = 10 نلاحظ تطابقاً ممتازاً بين المنحنى الحقيقي والتقريبي، ولكن كلما ابتعدت x عن 10 (نحو الصفر أو فوق 18) يزداد خطأ البتر، ويمكن تحسينه بإضافة حدود ذات رتب أعلى (شريحة 17).',
  },
  {
    id: 'sin_0',
    titleAr: 'مثال 1.8: متسلسلة ماكلورين للدالة sin(x) حول a = 0',
    slideRef: 'الشرائح 12، 20–21',
    formulaTitle: 'f(x) = sin(x),  a = 0',
    centerA: 0,
    xMin: -6.5,
    xMax: 6.5,
    yMin: -2.4,
    yMax: 2.4,
    defaultTestX: 2.5,
    defaultTerms: 3,
    maxTerms: 6,
    evalTrue: (x) => Math.sin(x),
    evalApprox: (x, termsCount) => {
      let sum = 0;
      for (let n = 0; n < termsCount; n++) {
        const power = 2 * n + 1;
        const sign = n % 2 === 0 ? 1 : -1;
        sum += (sign * Math.pow(x, power)) / factorial(power);
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const terms = ['x', '- x³/3!', '+ x⁵/5!', '- x⁷/7!', '+ x⁹/9!', '- x¹¹/11!'];
      return `sin(x) ≈ ${terms.slice(0, termsCount).join(' ')}`;
    },
    derivativesTable: [
      { order: 'f(x)', expr: 'sin(x)', valAtA: 'f(0) = 0' },
      { order: "f'(x)", expr: 'cos(x)', valAtA: "f'(0) = 1" },
      { order: "f''(x)", expr: '-sin(x)', valAtA: "f''(0) = 0" },
      { order: "f'''(x)", expr: '-cos(x)', valAtA: "f'''(0) = -1" },
      { order: 'f⁽⁴⁾(x)', expr: 'sin(x)', valAtA: 'f⁽⁴⁾(0) = 0' },
    ],
    pedagogicalNoteAr:
      'بما أن المشتقات الزوجية عند x = 0 تساوي صفراً، تظهر في متسلسلة sin(x) القوى الفردية فقط مع تناوب الإشارة. كل حد إضافي يوسع الفترة التي يطابق فيها التقريب منحنى الجيب (شريحة 21).',
  },
  {
    id: 'ln_1',
    titleAr: 'واجب 1.6: متسلسلة تايلور للدالة log(x) قرب a = 1',
    slideRef: 'شريحة 18',
    formulaTitle: 'f(x) = ln(x),  a = 1',
    centerA: 1,
    xMin: 0.15,
    xMax: 2.2,
    yMin: -2.0,
    yMax: 1.2,
    defaultTestX: 1.5,
    defaultTerms: 4,
    maxTerms: 7,
    evalTrue: (x) => Math.log(x),
    evalApprox: (x, termsCount) => {
      let sum = 0;
      for (let n = 1; n <= termsCount; n++) {
        const sign = n % 2 === 1 ? 1 : -1;
        sum += (sign * Math.pow(x - 1, n)) / n;
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const terms = [
        '(x - 1)',
        '- (x - 1)²/2',
        '+ (x - 1)³/3',
        '- (x - 1)⁴/4',
        '+ (x - 1)⁵/5',
        '- (x - 1)⁶/6',
        '+ (x - 1)⁷/7',
      ];
      return `log(x) ≈ ${terms.slice(0, termsCount).join(' ')}`;
    },
    derivativesTable: [
      { order: 'f(x)', expr: 'ln(x)', valAtA: 'f(1) = ln(1) = 0' },
      { order: "f'(x)", expr: '1 / x', valAtA: "f'(1) = 1" },
      { order: "f''(x)", expr: '-1 / x²', valAtA: "f''(1) = -1" },
      { order: "f'''(x)", expr: '2 / x³', valAtA: "f'''(1) = 2! = 2" },
      { order: 'f⁽⁴⁾(x)', expr: '-6 / x⁴', valAtA: 'f⁽⁴⁾(1) = -3! = -6' },
    ],
    pedagogicalNoteAr:
      'عند قسمة المشتقة f⁽ⁿ⁾(1) = (-1)ⁿ⁺¹ (n-1)! على n! في قانون تايلور، يختصر المضروب ويتبقى (x - 1)ⁿ / n فقط (شريحة 18).',
  },
  {
    id: 'exp_0',
    titleAr: 'واجب 1.10 (2): متسلسلة ماكلورين للدالة الأسية eˣ',
    slideRef: 'شريحة 23',
    formulaTitle: 'f(x) = eˣ,  a = 0',
    centerA: 0,
    xMin: -3.5,
    xMax: 3.5,
    yMin: -1,
    yMax: 15,
    defaultTestX: 1.8,
    defaultTerms: 4,
    maxTerms: 7,
    evalTrue: (x) => Math.exp(x),
    evalApprox: (x, termsCount) => {
      let sum = 0;
      for (let n = 0; n < termsCount; n++) {
        sum += Math.pow(x, n) / factorial(n);
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const terms = ['1', '+ x', '+ x²/2!', '+ x³/3!', '+ x⁴/4!', '+ x⁵/5!', '+ x⁶/6!'];
      return `eˣ ≈ ${terms.slice(0, termsCount).join(' ')}`;
    },
    derivativesTable: [
      { order: 'f(x)', expr: 'eˣ', valAtA: 'f(0) = e⁰ = 1' },
      { order: "f'(x)", expr: 'eˣ', valAtA: "f'(0) = 1" },
      { order: "f''(x)", expr: 'eˣ', valAtA: "f''(0) = 1" },
      { order: 'f⁽ⁿ⁾(x)', expr: 'eˣ', valAtA: 'f⁽ⁿ⁾(0) = 1 لجميع قيم n' },
    ],
    pedagogicalNoteAr:
      'جميع مشتقات الدالة eˣ هي نفسها eˣ وتساوي 1 عند الصفر، ولذلك فإن جميع معاملات متسلسلة ماكلورين موجبة وتساوي 1/n!.',
  },
  {
    id: 'cos_0',
    titleAr: 'واجب 1.10 (3): متسلسلة ماكلورين للدالة cos(x)',
    slideRef: 'شريحة 23',
    formulaTitle: 'f(x) = cos(x),  a = 0',
    centerA: 0,
    xMin: -6.5,
    xMax: 6.5,
    yMin: -2.4,
    yMax: 2.4,
    defaultTestX: 2.2,
    defaultTerms: 3,
    maxTerms: 6,
    evalTrue: (x) => Math.cos(x),
    evalApprox: (x, termsCount) => {
      let sum = 0;
      for (let n = 0; n < termsCount; n++) {
        const power = 2 * n;
        const sign = n % 2 === 0 ? 1 : -1;
        sum += (sign * Math.pow(x, power)) / factorial(power);
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const terms = ['1', '- x²/2!', '+ x⁴/4!', '- x⁶/6!', '+ x⁸/8!', '- x¹⁰/10!'];
      return `cos(x) ≈ ${terms.slice(0, termsCount).join(' ')}`;
    },
    derivativesTable: [
      { order: 'f(x)', expr: 'cos(x)', valAtA: 'f(0) = 1' },
      { order: "f'(x)", expr: '-sin(x)', valAtA: "f'(0) = 0" },
      { order: "f''(x)", expr: '-cos(x)', valAtA: "f''(0) = -1" },
      { order: "f'''(x)", expr: 'sin(x)', valAtA: "f'''(0) = 0" },
      { order: 'f⁽⁴⁾(x)', expr: 'cos(x)', valAtA: 'f⁽⁴⁾(0) = 1' },
    ],
    pedagogicalNoteAr:
      'بما أن cos(x) دالة زوجية، فإن جميع المشتقات الفردية عند x = 0 تساوي صفراً، وتظهر القوى الزوجية فقط: 1 - x²/2! + x⁴/4! - ...',
  },
  {
    id: 'geom_0',
    titleAr: 'واجب 1.10 (1): المتسلسلة الهندسية 1 / (1 - x)',
    slideRef: 'شريحة 23',
    formulaTitle: 'f(x) = 1 / (1 - x),  |x| < 1',
    centerA: 0,
    xMin: -0.95,
    xMax: 0.9,
    yMin: -1,
    yMax: 6,
    defaultTestX: 0.6,
    defaultTerms: 4,
    maxTerms: 7,
    evalTrue: (x) => 1 / (1 - x),
    evalApprox: (x, termsCount) => {
      let sum = 0;
      for (let n = 0; n < termsCount; n++) {
        sum += Math.pow(x, n);
      }
      return sum;
    },
    getFormulaString: (termsCount) => {
      const terms = ['1', '+ x', '+ x²', '+ x³', '+ x⁴', '+ x⁵', '+ x⁶'];
      return `1/(1 - x) ≈ ${terms.slice(0, termsCount).join(' ')}`;
    },
    derivativesTable: [
      { order: 'f(x)', expr: '(1 - x)⁻¹', valAtA: 'f(0) = 1' },
      { order: "f'(x)", expr: '1!(1 - x)⁻²', valAtA: "f'(0) = 1!" },
      { order: "f''(x)", expr: '2!(1 - x)⁻³', valAtA: "f''(0) = 2!" },
      { order: 'f⁽ⁿ⁾(x)', expr: 'n!(1 - x)⁻⁽ⁿ⁺¹⁾', valAtA: 'f⁽ⁿ⁾(0) = n!' },
    ],
    pedagogicalNoteAr:
      'عند قسمة f⁽ⁿ⁾(0) = n! على n! في قانون ماكلورين، تصبح جميع المعاملات مساوية لـ 1، بشرط أن تكون |x| < 1 لضمان التقارب.',
  },
];

export const SeriesVisualizer: React.FC<SeriesVisualizerProps> = ({ isDark }) => {
  const [selectedId, setSelectedId] = useState<string>('ln_10');
  const [termsCount, setTermsCount] = useState<number>(4);
  const [testX, setTestX] = useState<number>(14);

  const preset = SERIES_PRESETS.find((p) => p.id === selectedId) || SERIES_PRESETS[0];

  const handleSelectPreset = (newPreset: SeriesPreset) => {
    setSelectedId(newPreset.id);
    setTermsCount(newPreset.defaultTerms);
    setTestX(newPreset.defaultTestX);
  };

  const safeTestX = Math.min(preset.xMax, Math.max(preset.xMin, testX));
  const trueY = preset.evalTrue(safeTestX);
  const approxY = preset.evalApprox(safeTestX, termsCount);
  const truncErr = Math.abs(trueY - approxY);
  const relErrPercent = Math.abs(trueY) > 1e-12 ? (truncErr / Math.abs(trueY)) * 100 : null;

  const svgWidth = 680;
  const svgHeight = 360;
  const padLeft = 48;
  const padRight = 24;
  const padTop = 24;
  const padBottom = 38;
  const plotW = svgWidth - padLeft - padRight;
  const plotH = svgHeight - padTop - padBottom;

  const mapX = (x: number) =>
    padLeft + ((x - preset.xMin) / (preset.xMax - preset.xMin)) * plotW;
  const mapY = (y: number) => {
    const clampedY = Math.max(preset.yMin - 5, Math.min(preset.yMax + 5, y));
    return padTop + plotH - ((clampedY - preset.yMin) / (preset.yMax - preset.yMin)) * plotH;
  };

  const { truePath, approxPath } = useMemo(() => {
    const samples = 180;
    const dx = (preset.xMax - preset.xMin) / samples;
    const tPoints: string[] = [];
    const aPoints: string[] = [];

    for (let i = 0; i <= samples; i++) {
      const x = preset.xMin + i * dx;
      const sx = mapX(x).toFixed(2);
      const ty = preset.evalTrue(x);
      const ay = preset.evalApprox(x, termsCount);

      if (Number.isFinite(ty)) {
        tPoints.push(`${tPoints.length === 0 ? 'M' : 'L'} ${sx} ${mapY(ty).toFixed(2)}`);
      }
      if (Number.isFinite(ay)) {
        aPoints.push(`${aPoints.length === 0 ? 'M' : 'L'} ${sx} ${mapY(ay).toFixed(2)}`);
      }
    }

    return {
      truePath: tPoints.join(' '),
      approxPath: aPoints.join(' '),
    };
  }, [preset, termsCount]);

  const xTicks = useMemo(() => {
    const count = 6;
    const step = (preset.xMax - preset.xMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => preset.xMin + i * step);
  }, [preset]);

  const yTicks = useMemo(() => {
    const count = 4;
    const step = (preset.yMax - preset.yMin) / count;
    return Array.from({ length: count + 1 }, (_, i) => preset.yMin + i * step);
  }, [preset]);

  const zeroY = preset.yMin <= 0 && preset.yMax >= 0 ? mapY(0) : null;
  const zeroX = preset.xMin <= 0 && preset.xMax >= 0 ? mapX(0) : null;

  // High-contrast colors for SVG in Light vs Dark mode
  const gridStroke = isDark ? '#1E293B' : '#F1F5F9';
  const axisLineStroke = isDark ? '#475569' : '#CBD5E1';
  const tickTextFill = isDark ? '#94A3B8' : '#64748B';
  const trueLineColor = isDark ? '#38BDF8' : '#0284C7';
  const approxLineColor = isDark ? '#34D399' : '#059669';
  const errorLineColor = isDark ? '#FB7185' : '#DC2626';

  return (
    <section id="series-section" className="space-y-10">
      {/* Section Header */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400 mb-1">
              الجزء الثاني من المحاضرة · الشرائح 13 إلى 23
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-slate-50 text-balance">
              02. متسلسلات تايلور وماكلورين بأسلوب مبسط ومرتب
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>قصة الآلة الحاسبة</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>تايلور (حول a)</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>ماكلورين (حول 0)</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Easy Guide: How to Understand & Solve Any Series Problem */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-6">
        <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border-r-4 border-[#059669] dark:border-emerald-400 p-4 rounded-lg space-y-1.5">
          <div className="text-xs font-bold text-[#059669] dark:text-emerald-400">
            الفكرة ببساطة (قصة الآلة الحاسبة — شريحة 13):
          </div>
          <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
            الحاسوب والآلة الحاسبة لا يعرفان سوى العمليات الأربع البسيطة (جمع، طرح، ضرب، قسمة). فكيف يحسبان دوال صعبة مثل <span dir="ltr" className="font-mono font-semibold">sin(x), ln(x), eˣ</span>؟ السر هو <strong>تحويل الدالة الصعبة إلى كثيرة حدود بسيطة (Polynomial)</strong> تعطي نفس النتيجة بدقة عالية!
          </p>
        </div>

        {/* 3 Cards Comparing Polynomials, Taylor, and Maclaurin */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  1. كثيرة الحدود (Polynomial)
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 13</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                هي دالة تتكون فقط من قوى المتغير <span dir="ltr" className="font-mono">x</span> مضروبة في أعداد ثابتة، وتُعرف درجتها بأكبر أس فيها.
              </p>
            </div>
            <div dir="ltr" className="font-mono text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-1 text-slate-800 dark:text-slate-200">
              <div className="font-bold">f(x) = aₙxⁿ + ... + a₁x + a₀</div>
              <div className="text-[11px] text-[#0284C7] dark:text-sky-400">
                Ex 1: f(x) = x⁴ - x³ - 19x² + 5 (Degree 4)
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#0284C7] dark:text-sky-400">
                  2. متسلسلة تايلور (حول أي نقطة a)
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 14</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                تقرب الدالة بالقرب من نقطة معلومة <span dir="ltr" className="font-mono font-semibold">x = a</span> باستخدام مشتقات الدالة عند تلك النقطة.
              </p>
            </div>
            <div dir="ltr" className="font-mono text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-1 text-slate-800 dark:text-slate-200">
              <div className="font-bold text-[#0284C7] dark:text-sky-400">
                f(x) = Σ [ f⁽ⁿ⁾(a) · (x - a)ⁿ / n! ]
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                = f(a) + f'(a)(x-a) + f''(a)(x-a)²/2! + ...
              </div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[#059669] dark:text-emerald-400">
                  3. متسلسلة ماكلورين (حول الصفر a = 0)
                </h3>
                <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 19</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                هي نفس قانون تايلور تماماً لكن بعد وضع <span dir="ltr" className="font-mono font-semibold">a = 0</span> لتبسيط الحسابات حول نقطة الأصل.
              </p>
            </div>
            <div dir="ltr" className="font-mono text-xs bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-lg space-y-1 text-slate-800 dark:text-slate-200">
              <div className="font-bold text-[#059669] dark:text-emerald-400">
                f(x) = Σ [ f⁽ⁿ⁾(0) · xⁿ / n! ]
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                = f(0) + f'(0)x + f''(0)x²/2! + ...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Interactive Sandbox: Taylor & Maclaurin Live Visualizer */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex flex-col gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-5 mb-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#0F172A] dark:text-slate-50 flex items-center gap-2">
                <LineChart className="w-5 h-5 text-[#0284C7] dark:text-sky-400" />
                <span>المختبر الرسومي التفاعلي لمتسلسلات تايلور وماكلورين</span>
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
                اختر أي دالة من أمثلة المحاضرة، وزد عدد الحدود لمشاهدة كيف ينطبق منحنى كثيرة الحدود على الدالة الحقيقية وكيف يتقلص خطأ البتر <span dir="ltr" className="font-mono">Em</span>.
              </p>
            </div>
          </div>

          {/* Function Preset Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg">
            {SERIES_PRESETS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectPreset(item)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedId === item.id
                    ? 'bg-[#0284C7] dark:bg-sky-500 text-white dark:text-slate-950'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {item.titleAr}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Zone Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Zone (7 cols): SVG Mathematical Curve Canvas & Polynomial Readout */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-4">
              {/* Plot Legend Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 mb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <span className="w-3 h-0.5 bg-[#0284C7] dark:bg-sky-400 inline-block" />
                    <span>● الدالة الحقيقية <span dir="ltr" className="font-mono">{preset.formulaTitle}</span></span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-slate-800 dark:text-slate-200">
                    <span className="w-3 h-0.5 bg-[#059669] dark:bg-emerald-400 border-b border-dashed inline-block" />
                    <span>▲ تقريب المتسلسلة ({termsCount} حدود)</span>
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-medium text-[#DC2626] dark:text-rose-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] dark:bg-rose-400 inline-block" />
                    <span>■ خطأ البتر Em عند x = {safeTestX.toFixed(2)}</span>
                  </span>
                </div>
                <span className="text-slate-500 dark:text-slate-400">{preset.slideRef}</span>
              </div>

              {/* Interactive SVG Coordinate System */}
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden"
                role="img"
                aria-label={preset.titleAr}
              >
                <defs>
                  <clipPath id="plot-clip">
                    <rect x={padLeft} y={padTop} width={plotW} height={plotH} />
                  </clipPath>
                </defs>

                {/* Grid Lines & Ticks */}
                {xTicks.map((tick, idx) => {
                  const cx = mapX(tick);
                  return (
                    <g key={`xtick-${idx}`}>
                      <line
                        x1={cx}
                        y1={padTop}
                        x2={cx}
                        y2={padTop + plotH}
                        stroke={gridStroke}
                        strokeWidth="1"
                      />
                      <text
                        x={cx}
                        y={svgHeight - 12}
                        textAnchor="middle"
                        fill={tickTextFill}
                        className="text-[11px] font-mono"
                      >
                        {tick.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {yTicks.map((tick, idx) => {
                  const cy = mapY(tick);
                  return (
                    <g key={`ytick-${idx}`}>
                      <line
                        x1={padLeft}
                        y1={cy}
                        x2={padLeft + plotW}
                        y2={cy}
                        stroke={gridStroke}
                        strokeWidth="1"
                      />
                      <text
                        x={padLeft - 8}
                        y={cy + 4}
                        textAnchor="end"
                        fill={tickTextFill}
                        className="text-[11px] font-mono"
                      >
                        {tick.toFixed(1)}
                      </text>
                    </g>
                  );
                })}

                {/* Zero Axes if in viewport */}
                {zeroY !== null && (
                  <line
                    x1={padLeft}
                    y1={zeroY}
                    x2={padLeft + plotW}
                    y2={zeroY}
                    stroke={axisLineStroke}
                    strokeWidth="1.25"
                  />
                )}
                {zeroX !== null && (
                  <line
                    x1={zeroX}
                    y1={padTop}
                    x2={zeroX}
                    y2={padTop + plotH}
                    stroke={axisLineStroke}
                    strokeWidth="1.25"
                  />
                )}

                {/* Clipped Curves & Markers */}
                <g clipPath="url(#plot-clip)">
                  {/* True Function Curve */}
                  <path
                    d={truePath}
                    fill="none"
                    stroke={trueLineColor}
                    strokeWidth="2.75"
                  />

                  {/* Taylor/Maclaurin Approximation Curve */}
                  <path
                    d={approxPath}
                    fill="none"
                    stroke={approxLineColor}
                    strokeWidth="2.5"
                    strokeDasharray="6 4"
                  />

                  {/* Vertical Error Gap Line at safeTestX */}
                  <line
                    x1={mapX(safeTestX)}
                    y1={mapY(trueY)}
                    x2={mapX(safeTestX)}
                    y2={mapY(approxY)}
                    stroke={errorLineColor}
                    strokeWidth="2.5"
                  />

                  {/* Expansion Center Point x0 = a */}
                  <circle
                    cx={mapX(preset.centerA)}
                    cy={mapY(preset.evalTrue(preset.centerA))}
                    r="6"
                    fill="#10B981"
                    stroke={isDark ? '#0F172A' : '#FFFFFF'}
                    strokeWidth="2"
                  />

                  {/* Evaluation Points on True & Approx curves */}
                  <circle
                    cx={mapX(safeTestX)}
                    cy={mapY(trueY)}
                    r="4.5"
                    fill={trueLineColor}
                    stroke={isDark ? '#0F172A' : '#FFFFFF'}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx={mapX(safeTestX)}
                    cy={mapY(approxY)}
                    r="4.5"
                    fill={errorLineColor}
                    stroke={isDark ? '#0F172A' : '#FFFFFF'}
                    strokeWidth="1.5"
                  />
                </g>

                {/* Center Label */}
                <text
                  x={Math.min(svgWidth - 90, Math.max(padLeft + 10, mapX(preset.centerA) + 8))}
                  y={Math.max(padTop + 18, mapY(preset.evalTrue(preset.centerA)) - 10)}
                  fill={isDark ? '#34D399' : '#065F46'}
                  className="text-[11px] font-mono font-bold"
                >
                  x₀ = {preset.centerA}
                </text>
              </svg>
            </div>

            {/* Active Polynomial Formula Display */}
            <div className="bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>الصيغة الرياضية للتقريب الحالي ({termsCount} حدود):</span>
                <span dir="ltr" className="font-mono text-sky-400 font-semibold">a = {preset.centerA}</span>
              </div>
              <div dir="ltr" className="font-mono text-xs md:text-sm text-emerald-300 overflow-x-auto py-1 tabular-nums">
                {preset.getFormulaString(termsCount)}
              </div>
              {preset.collectedPolynomialNote && (
                <div className="text-xs text-amber-200/90 border-t border-slate-800 pt-2 leading-relaxed">
                  {preset.collectedPolynomialNote}
                </div>
              )}
            </div>
          </div>

          {/* Right Zone (5 cols): Sliders, Live Error Readout & Step-by-Step Derivatives Table */}
          <div className="lg:col-span-5 space-y-5">
            {/* Control Deck */}
            <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-5">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#0284C7] dark:text-sky-400" />
                  <span>لوحة التحكم بحدود المتسلسلة</span>
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    setTermsCount(preset.defaultTerms);
                    setTestX(preset.defaultTestX);
                  }}
                  className="inline-flex items-center gap-1 text-xs text-slate-600 dark:text-slate-400 hover:text-[#0284C7] dark:hover:text-sky-400 transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>إعادة الضبط</span>
                </button>
              </div>

              {/* Slider 1: Number of Terms */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="terms-slider" className="font-semibold text-slate-700 dark:text-slate-300">
                    عدد الحدود المأخوذة من المتسلسلة (<span dir="ltr" className="font-mono">n</span>):
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setTermsCount(Math.max(1, termsCount - 1))}
                      disabled={termsCount <= 1}
                      className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label="إنقاص عدد الحدود"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="font-mono font-bold text-[#0284C7] dark:text-sky-400 px-2 tabular-nums">
                      {termsCount} / {preset.maxTerms}
                    </span>
                    <button
                      type="button"
                      onClick={() => setTermsCount(Math.min(preset.maxTerms, termsCount + 1))}
                      disabled={termsCount >= preset.maxTerms}
                      className="p-1 rounded bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 disabled:opacity-40 hover:bg-slate-100 dark:hover:bg-slate-700"
                      aria-label="زيادة عدد الحدود"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                <input
                  id="terms-slider"
                  type="range"
                  min={1}
                  max={preset.maxTerms}
                  step={1}
                  value={termsCount}
                  onChange={(e) => setTermsCount(parseInt(e.target.value, 10))}
                  className="w-full accent-[#0284C7] dark:accent-sky-400 cursor-pointer"
                />
              </div>

              {/* Slider 2: Evaluation Point x */}
              <div className="space-y-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="testx-slider" className="font-semibold text-slate-700 dark:text-slate-300">
                    نقطة الاختبار لحساب خطأ البتر (<span dir="ltr" className="font-mono">x</span>):
                  </label>
                  <span dir="ltr" className="font-mono font-bold text-[#0F172A] dark:text-slate-100 tabular-nums">
                    x = {safeTestX.toFixed(2)} (Δ = {Math.abs(safeTestX - preset.centerA).toFixed(2)})
                  </span>
                </div>
                <input
                  id="testx-slider"
                  type="range"
                  min={preset.xMin}
                  max={preset.xMax}
                  step={(preset.xMax - preset.xMin) / 100}
                  value={safeTestX}
                  onChange={(e) => setTestX(parseFloat(e.target.value))}
                  className="w-full accent-[#059669] dark:accent-emerald-400 cursor-pointer"
                />
              </div>

              {/* Live Numerical Readout Box */}
              <div dir="ltr" className="grid grid-cols-2 gap-2.5 pt-2 font-mono text-xs tabular-nums">
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Exact f({safeTestX.toFixed(2)})</div>
                  <div className="font-bold text-[#0284C7] dark:text-sky-400 text-sm mt-0.5">{trueY.toFixed(6)}</div>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Series P({safeTestX.toFixed(2)})</div>
                  <div className="font-bold text-[#059669] dark:text-emerald-400 text-sm mt-0.5">{approxY.toFixed(6)}</div>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Truncation Error |Em|</div>
                  <div className="font-bold text-[#DC2626] dark:text-rose-400 text-sm mt-0.5">{truncErr.toFixed(6)}</div>
                </div>
                <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-2.5">
                  <div className="text-slate-500 dark:text-slate-400 text-[11px]">Relative Error (%)</div>
                  <div className="font-bold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                    {relErrPercent !== null ? `${relErrPercent.toFixed(3)}%` : 'N/A'}
                  </div>
                </div>
              </div>
            </div>

            {/* Derivatives Table at x = a (Slides 15 & 20) */}
            <div className="bg-white dark:bg-slate-900/50 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  جدول المشتقات عند مركز النشر (<span dir="ltr" className="font-mono">a = {preset.centerA}</span>)
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">الخطوة 1 من الحل</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse font-mono tabular-nums" dir="ltr">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 text-left">
                      <th className="py-1.5">Order</th>
                      <th className="py-1.5">Derivative</th>
                      <th className="py-1.5">Value at a = {preset.centerA}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {preset.derivativesTable.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td className="py-1.5 font-semibold text-[#0284C7] dark:text-sky-400">{row.order}</td>
                        <td className="py-1.5 text-slate-700 dark:text-slate-300">{row.expr}</td>
                        <td className="py-1.5 text-[#059669] dark:text-emerald-400 font-medium">{row.valAtA}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-2 border-t border-slate-100 dark:border-slate-800">
                {preset.pedagogicalNoteAr}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
