import React, { useState, useMemo } from 'react';
import { MATLAB_CODE_LINES } from '../data/lectureData';
import { Terminal, Play, Copy, Check } from 'lucide-react';

interface MatlabStudioProps {
  isDark: boolean;
}

const factorial = (n: number): number => {
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
};

interface SubplotItem {
  index: number;
  varName: string;
  titleExpr: string;
  maxOddPower: number;
  descAr: string;
}

const SUBPLOTS: SubplotItem[] = [
  {
    index: 1,
    varName: 'y2',
    titleExpr: 'x',
    maxOddPower: 1,
    descAr: 'subplot(3,2,1): خط مستقيم مماس للمنحنى عند نقطة الأصل فقط.',
  },
  {
    index: 2,
    varName: 'y3',
    titleExpr: 'x - x^3/3!',
    maxOddPower: 3,
    descAr: 'subplot(3,2,2): منحنى تكعيبي يطابق الجيب في الفترة [-1.5, 1.5] تقريباً.',
  },
  {
    index: 3,
    varName: 'y4',
    titleExpr: 'x - x^3/3! + x^5/5!',
    maxOddPower: 5,
    descAr: 'subplot(3,2,3): الدرجة الخامسة تطابق القمة الأولى والقاع الأول للموجة.',
  },
  {
    index: 4,
    varName: 'y5',
    titleExpr: '... - x^7/7!',
    maxOddPower: 7,
    descAr: 'subplot(3,2,4): الدرجة السابعة توسع التطابق ليشمل الفترة [-3.2, 3.2].',
  },
  {
    index: 5,
    varName: 'y6',
    titleExpr: '... + x^9/9!',
    maxOddPower: 9,
    descAr: 'subplot(3,2,5): الدرجة التاسعة تطابق الموجة حتى حدود [-4.2, 4.2].',
  },
  {
    index: 6,
    varName: 'y7',
    titleExpr: '... - x^11/11!',
    maxOddPower: 11,
    descAr: 'subplot(3,2,6): الدرجة الحادية عشرة تطابق sin(x) عبر أكثر من دورة كاملة!',
  },
];

const evalSinMaclaurin = (x: number, maxOddPower: number): number => {
  let sum = 0;
  let sign = 1;
  for (let p = 1; p <= maxOddPower; p += 2) {
    sum += (sign * Math.pow(x, p)) / factorial(p);
    sign = -sign;
  }
  return sum;
};

const FULL_MATLAB_SCRIPT = `clc; clear; close all;
x1 = -3*pi : pi/100 : 3*pi;
y1 = sin(x1);

y2 = @(x) x;
y3 = @(x) x - x.^3/factorial(3);
y4 = @(x) x - x.^3/factorial(3) + x.^5/factorial(5);
y5 = @(x) x - x.^3/factorial(3) + x.^5/factorial(5) - x.^7/factorial(7);
y6 = @(x) y5(x) + x.^9/factorial(9);
y7 = @(x) y6(x) - x.^11/factorial(11);

subplot(3,2,1); plot(x1,y1, x1,y2(x1),'LineWidth',2); axis([-8 8 -3 3]); title('x')
subplot(3,2,2); plot(x1,y1, x1,y3(x1),'LineWidth',2); axis([-8 8 -3 3]); title('x - x^3/3!')
subplot(3,2,3); plot(x1,y1, x1,y4(x1),'LineWidth',2); axis([-8 8 -3 3]); title('x - x^3/3! + x^5/5!')
subplot(3,2,4); plot(x1,y1, x1,y5(x1),'LineWidth',2); axis([-8 8 -3 3]); title('... - x^7/7!')
subplot(3,2,5); plot(x1,y1, x1,y6(x1),'LineWidth',2); axis([-8 8 -3 3]); title('... + x^9/9!')
subplot(3,2,6); plot(x1,y1, x1,y7(x1),'LineWidth',2); axis([-8 8 -3 3]); title('... - x^11/11!')`;

export const MatlabStudio: React.FC<MatlabStudioProps> = ({ isDark }) => {
  const [selectedLineNumber, setSelectedLineNumber] = useState<number>(5);
  const [activeSubplot, setActiveSubplot] = useState<number>(2);
  const [copied, setCopied] = useState<boolean>(false);

  const selectedLine =
    MATLAB_CODE_LINES.find((l) => l.lineNumber === selectedLineNumber) || MATLAB_CODE_LINES[0];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(FULL_MATLAB_SCRIPT);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const w = 240;
  const h = 135;
  const pad = 18;
  const pw = w - pad * 2;
  const ph = h - pad * 2;

  const mapX = (x: number) => pad + ((x - -8) / 16) * pw;
  const mapY = (y: number) => {
    const cy = Math.max(-3.5, Math.min(3.5, y));
    return pad + ph - ((cy - -3) / 6) * ph;
  };

  const subplotPaths = useMemo(() => {
    const samples = 120;
    const dx = 16 / samples;
    const sinPts: string[] = [];

    for (let i = 0; i <= samples; i++) {
      const x = -8 + i * dx;
      sinPts.push(`${i === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(Math.sin(x)).toFixed(1)}`);
    }
    const sinPath = sinPts.join(' ');

    const approxPaths = SUBPLOTS.map((sp) => {
      const pts: string[] = [];
      for (let i = 0; i <= samples; i++) {
        const x = -8 + i * dx;
        const y = evalSinMaclaurin(x, sp.maxOddPower);
        pts.push(`${i === 0 ? 'M' : 'L'} ${mapX(x).toFixed(1)} ${mapY(y).toFixed(1)}`);
      }
      return pts.join(' ');
    });

    return { sinPath, approxPaths };
  }, []);

  const boxStroke = isDark ? '#334155' : '#CBD5E1';
  const zeroStroke = isDark ? '#1E293B' : '#E2E8F0';
  const sinStroke = isDark ? '#38BDF8' : '#0284C7';
  const approxStroke = isDark ? '#FBBF24' : '#D97706';
  const labelFill = isDark ? '#94A3B8' : '#64748B';

  return (
    <section id="matlab-section" className="space-y-8">
      {/* Section Header */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400 mb-1">
              التطبيق البرمجي العملي · شريحة 22
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-slate-50 text-balance">
              03. شرح ومحاكي كود MATLAB 1.9 — تقريب الدالة sin(x)
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>Anonymous Functions @(x)</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>subplot(3,2,k)</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>axis([-8 8 -3 3])</span>
          </div>
        </div>
      </div>

      {/* Quick Dictionary of MATLAB Commands */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5">
        <div className="text-xs font-bold text-[#0284C7] dark:text-sky-400 mb-3">
          مفتاح فهم أوامر MATLAB الواردة في الشريحة 22:
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div dir="ltr" className="font-mono font-bold text-slate-900 dark:text-slate-100">@(x) ...</div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              تعريف دالة رياضية سريعة (Anonymous Function) بدلالة المتغير x.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div dir="ltr" className="font-mono font-bold text-slate-900 dark:text-slate-100">x.^3 &amp; factorial(n)</div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              النقطة قبل الأس <span dir="ltr" className="font-mono">(.^)</span> ترفع كل عنصر في المصفوفة للأس، و <span dir="ltr" className="font-mono">factorial</span> تحسب المضروب.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div dir="ltr" className="font-mono font-bold text-slate-900 dark:text-slate-100">subplot(3, 2, k)</div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              تقسيم نافذة الرسم إلى 3 صفوف وعمودين (6 مربعات) والكتابة في المربع رقم k.
            </p>
          </div>
          <div className="p-3 rounded-lg bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800">
            <div dir="ltr" className="font-mono font-bold text-slate-900 dark:text-slate-100">axis([-8 8 -3 3])</div>
            <p className="text-slate-600 dark:text-slate-300 mt-1">
              تثبيت حدود الرسم أفقياً من -8 إلى 8 وعمودياً من -3 إلى 3 لسهولة المقارنة.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Zone Studio: Code Inspector + 3x2 Subplot Output Window */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Zone: Interactive MATLAB Editor & Line-by-Line Arabic Breakdown */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#0284C7] dark:text-sky-400" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-50">
                مستكشف كود MATLAB التفاعلي (اضغط على أي سطر لشرحه)
              </h3>
            </div>
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#F8FAFC] dark:bg-slate-900 hover:bg-slate-200/70 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 border border-[#E2E8F0] dark:border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#059669] dark:text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم نسخ الكود' : 'نسخ الكود كاملاً'}</span>
            </button>
          </div>

          {/* Interactive Code Lines */}
          <div dir="ltr" className="bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs space-y-1 overflow-x-auto">
            {MATLAB_CODE_LINES.map((line) => {
              const isSelected = line.lineNumber === selectedLineNumber;
              return (
                <button
                  key={line.lineNumber}
                  type="button"
                  onClick={() => {
                    setSelectedLineNumber(line.lineNumber);
                    if (line.relatedSubplot) {
                      setActiveSubplot(line.relatedSubplot);
                    }
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-3 ${
                    isSelected
                      ? 'bg-[#0284C7]/30 text-white border border-sky-400/60'
                      : 'text-slate-300 hover:bg-slate-800/80'
                  }`}
                >
                  <span className="text-slate-500 select-none w-5 shrink-0 tabular-nums">
                    {line.lineNumber}
                  </span>
                  <span className="break-all">{line.code}</span>
                </button>
              );
            })}
          </div>

          {/* Selected Line Explanation Card */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#0284C7] dark:text-sky-400">
                شرح السطر رقم {selectedLine.lineNumber}: {selectedLine.titleAr}
              </span>
              {selectedLine.relatedSubplot && (
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400" dir="ltr">
                  subplot(3,2,{selectedLine.relatedSubplot})
                </span>
              )}
            </div>
            <div dir="ltr" className="font-mono text-xs text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 px-3 py-1.5 rounded">
              {selectedLine.code}
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed pt-1">
              {selectedLine.explanationAr}
            </p>
          </div>
        </div>

        {/* Right Zone: Live MATLAB Figure 1 Output (3x2 Subplot Grid) */}
        <div className="lg:col-span-6 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            <div className="flex items-center gap-2">
              <Play className="w-4 h-4 text-[#059669] dark:text-emerald-400" />
              <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-50">
                مخرجات التنفيذ الرسومية — شبكة subplot(3, 2, 1..6)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-0.5 bg-[#0284C7] dark:bg-sky-400 inline-block" />
                <span dir="ltr" className="font-mono">y1 = sin(x1)</span>
              </span>
              <span className="inline-flex items-center gap-1 text-slate-700 dark:text-slate-300">
                <span className="w-2.5 h-0.5 bg-[#D97706] dark:bg-amber-400 inline-block" />
                <span dir="ltr" className="font-mono">y2..y7</span>
              </span>
            </div>
          </div>

          {/* 3x2 Grid of Subplots */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" dir="ltr">
            {SUBPLOTS.map((sp, idx) => {
              const isFocused = activeSubplot === sp.index;
              return (
                <button
                  key={sp.index}
                  type="button"
                  onClick={() => setActiveSubplot(sp.index)}
                  className={`text-left rounded-xl p-3 border transition-all ${
                    isFocused
                      ? 'bg-[#F8FAFC] dark:bg-slate-900 border-[#0284C7] dark:border-sky-400 ring-2 ring-[#0284C7]/20 dark:ring-sky-400/20'
                      : 'bg-white dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="font-bold text-slate-900 dark:text-slate-100">title('{sp.titleExpr}')</span>
                    <span className="text-[11px] text-[#0284C7] dark:text-sky-400 font-semibold">
                      subplot(3,2,{sp.index})
                    </span>
                  </div>
                  <svg
                    viewBox={`0 0 ${w} ${h}`}
                    className="w-full h-auto bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded"
                  >
                    <defs>
                      <clipPath id={`matlab-clip-${sp.index}`}>
                        <rect x={pad} y={pad} width={pw} height={ph} />
                      </clipPath>
                    </defs>
                    {/* Axis Box [-8 8 -3 3] */}
                    <rect
                      x={pad}
                      y={pad}
                      width={pw}
                      height={ph}
                      fill="none"
                      stroke={boxStroke}
                      strokeWidth="1"
                    />
                    {/* Zero crosshairs */}
                    <line
                      x1={pad}
                      y1={mapY(0)}
                      x2={pad + pw}
                      y2={mapY(0)}
                      stroke={zeroStroke}
                      strokeWidth="1"
                    />
                    <line
                      x1={mapX(0)}
                      y1={pad}
                      x2={mapX(0)}
                      y2={pad + ph}
                      stroke={zeroStroke}
                      strokeWidth="1"
                    />
                    <g clipPath={`url(#matlab-clip-${sp.index})`}>
                      {/* y1 = sin(x1) */}
                      <path
                        d={subplotPaths.sinPath}
                        fill="none"
                        stroke={sinStroke}
                        strokeWidth="2"
                      />
                      {/* y_k = Maclaurin truncation */}
                      <path
                        d={subplotPaths.approxPaths[idx]}
                        fill="none"
                        stroke={approxStroke}
                        strokeWidth="1.8"
                        strokeDasharray="4 2"
                      />
                    </g>
                    {/* Axis labels */}
                    <text x={pad} y={h - 4} fill={labelFill} className="text-[9px] font-mono">-8</text>
                    <text x={mapX(0) - 3} y={h - 4} fill={labelFill} className="text-[9px] font-mono">0</text>
                    <text x={pad + pw - 10} y={h - 4} fill={labelFill} className="text-[9px] font-mono">8</text>
                  </svg>
                </button>
              );
            })}
          </div>

          {/* Focused Subplot Note */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-4 text-xs text-slate-700 dark:text-slate-200 flex items-center justify-between gap-4">
            <span>
              <strong className="text-slate-900 dark:text-white">الرسم المحدد حالياً:</strong>{' '}
              {SUBPLOTS.find((s) => s.index === activeSubplot)?.descAr}
            </span>
            <span dir="ltr" className="font-mono text-[#0284C7] dark:text-sky-400 shrink-0">
              axis([-8 8 -3 3])
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
