import React, { useState } from 'react';
import { ERROR_SOURCES } from '../data/lectureData';
import { Calculator, AlertTriangle, CheckCircle2, Sliders, Cpu } from 'lucide-react';

interface ErrorSandboxProps {
  isDark: boolean;
}

interface PresetCase {
  id: string;
  labelAr: string;
  slideRef: string;
  xT: number;
  xTDisplay: string;
  xA: number;
  simpleStoryAr: string;
  noteAr: string;
}

const PRESET_CASES: PresetCase[] = [
  {
    id: 'ex1_2',
    labelAr: 'مثال 1.2 (الكتاب)',
    slideRef: 'شريحة 6',
    xT: 19 / 7,
    xTDisplay: '19 / 7 ≈ 2.7142857',
    xA: 2.718281,
    simpleStoryAr: 'ببساطة: لدينا كسر حقيقي (19/7) وقربناه إلى عدد عشري قريب منه. نريد معرفة مقدار الفرق بينهما وكم يشكل هذا الفرق كنسبة مئوية.',
    noteAr: 'لاحظ أن الإشارة السالبة في err(xA) = -0.003996 تعني فقط أن التقريب xA أكبر قليلاً من القيمة الحقيقية xT، بينما الخطأ المطلق يأخذ القيمة الموجبة دائماً.',
  },
  {
    id: 'ex1_3_first',
    labelAr: 'مثال 1.3 — الحساب الأول',
    slideRef: 'شريحة 7–8',
    xT: 0.004,
    xTDisplay: '0.004',
    xA: 0.003,
    simpleStoryAr: 'ببساطة: تخيل أنك تقيس سُمك شعرة دقيقة جداً (0.004 ملم) وأخطأت بمقدار 0.001 ملم؛ أنت أخطأت في ربع القيمة الأصلية (25%)!',
    noteAr: 'رغم أن الخطأ المطلق صغير جداً ظاهرياً (0.001)، إلا أن الخطأ النسبي ضخم ويساوي 25% لأن القيمة الحقيقية نفسها صغيرة جداً.',
  },
  {
    id: 'ex1_3_second',
    labelAr: 'مثال 1.3 — الحساب الثاني',
    slideRef: 'شريحة 7–8',
    xT: 1258,
    xTDisplay: '1258',
    xA: 1238,
    simpleStoryAr: 'ببساطة: تخيل أنك تقيس مسافة طريق طوله 1258 متراً وأخطأت بـ 20 متراً؛ هذا الخطأ لا يتجاوز 1.59% فقط من المسافة الكلية!',
    noteAr: 'رغم أن الخطأ المطلق يبدو كبيراً (20)، إلا أن الخطأ النسبي لا يتجاوز 1.59% لأن القيمة الحقيقية كبيرة (1258)، مما يجعله تقريباً أدق بكثير من الحساب الأول.',
  },
  {
    id: 'remark_zero',
    labelAr: 'ملاحظة 1 (عندما xT = 0)',
    slideRef: 'شريحة 5 و 8',
    xT: 0,
    xTDisplay: '0',
    xA: 0.025,
    simpleStoryAr: 'ببساطة: في الرياضيات لا يجوز القسمة على صفر، لذلك إذا كانت القيمة الحقيقية صفراً لا يمكن حساب الخطأ النسبي ونكتفي بالخطأ المطلق.',
    noteAr: 'عندما تكون القيمة الحقيقية xT = 0 فإن القسمة على صفر تجعل الخطأ النسبي غير معرف (Undefined)، وهنا نلتزم بقاعدة الإبهام ونكتفي بالخطأ المطلق.',
  },
];

export const ErrorSandbox: React.FC<ErrorSandboxProps> = ({ isDark }) => {
  const [selectedPresetId, setSelectedPresetId] = useState<string>('ex1_2');
  const [xT, setXT] = useState<number>(19 / 7);
  const [xA, setXA] = useState<number>(2.718281);
  const [activeSourceId, setActiveSourceId] = useState<string>('roundoff');
  const [sigDigits, setSigDigits] = useState<number>(4);

  const handleSelectPreset = (preset: PresetCase) => {
    setSelectedPresetId(preset.id);
    setXT(preset.xT);
    setXA(preset.xA);
  };

  const handleCustomXT = (val: number) => {
    setSelectedPresetId('custom');
    setXT(val);
  };

  const handleCustomXA = (val: number) => {
    setSelectedPresetId('custom');
    setXA(val);
  };

  const errVal = xT - xA;
  const absErrVal = Math.abs(errVal);
  const isZeroTrue = Math.abs(xT) < 1e-15;
  const relErrVal = isZeroTrue ? null : absErrVal / Math.abs(xT);
  const relPercent = relErrVal !== null ? relErrVal * 100 : null;

  const activePreset = PRESET_CASES.find((p) => p.id === selectedPresetId);
  const activeSource = ERROR_SOURCES.find((s) => s.id === activeSourceId) || ERROR_SOURCES[0];

  // Finite precision / Loss of significance simulation (Slide 11)
  const trueNum1 = 0.7654321;
  const trueNum2 = 0.7651111;
  const exactDiff = trueNum1 - trueNum2;
  const roundToSig = (num: number, digits: number) => {
    if (num === 0) return 0;
    return Number(num.toPrecision(digits));
  };
  const rounded1 = roundToSig(trueNum1, sigDigits);
  const rounded2 = roundToSig(trueNum2, sigDigits);
  const computedDiff = roundToSig(rounded1 - rounded2, sigDigits);
  const cancellationRelErr = (Math.abs(exactDiff - computedDiff) / Math.abs(exactDiff)) * 100;
  const piApprox = Number(Math.PI.toPrecision(sigDigits));
  const piRelErr = Math.abs(Math.PI - piApprox) / Math.PI;

  const axisStroke = isDark ? '#94A3B8' : '#0F172A';
  const curveStroke = isDark ? '#38BDF8' : '#0284C7';
  const trueCurveStroke = isDark ? '#64748B' : '#94A3B8';

  return (
    <section id="errors-section" className="space-y-10">
      {/* Section Header */}
      <div className="border-b border-[#E2E8F0] dark:border-slate-800 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400 mb-1">
              الجزء الأول من المحاضرة · الشرائح 3 إلى 12
            </p>
            <h2 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-slate-50 text-balance">
              01. مدخل مبسط إلى التحليل العددي وحساب الأخطاء
            </h2>
          </div>
          <div className="text-xs text-slate-500 dark:text-slate-400">
            <span>الفكرة ببساطة</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>قوانين الخطأ</span>
            <span className="mx-2" aria-hidden="true">·</span>
            <span>مصادر الأخطاء</span>
          </div>
        </div>
      </div>

      {/* Step-by-Step Simplified Concept Cards (Slides 3 & 4) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
                ما هو التحليل العددي ببساطة؟ (شريحة 3)
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">المفهوم الأساسي</span>
            </div>

            {/* Plain-Arabic Easy Summary Box */}
            <div className="bg-[#F8FAFC] dark:bg-slate-800/60 border-r-4 border-[#0284C7] dark:border-sky-400 p-4 rounded-lg space-y-1.5">
              <div className="text-xs font-bold text-[#0284C7] dark:text-sky-400">
                الخلاصة بكلمتين:
              </div>
              <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                في الواقع الهندسي والعلمي، أغلب المعادلات معقدة جداً ولا يمكن حلها بالورقة والقلم لإيجاد إجابة تامة 100%. <strong>التحليل العددي</strong> يصمم <strong>طرقاً متسلسلة (خوارزميات)</strong> ينفذها الحاسوب في خطوات محدودة ليعطينا <strong>جواباً تقريبياً قريباً جداً من الحقيقة</strong> بالقدر الذي نحتاجه من الدقة.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <p className="text-xs font-semibold text-[#0284C7] dark:text-sky-400">1. طبيعة النتيجة</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">تقريب (Approximation)</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  ليست إجابة تامة، بل تقترب من الحل الحقيقي لمعادلة أو كمية فيزيائية.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <p className="text-xs font-semibold text-[#059669] dark:text-emerald-400">2. كيف تعمل الطريقة؟</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">خطوات منتهية ودقة محددة</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  تحل المسألة في عدد محدود من الخطوات الحسابية للوصول إلى الدقة المطلوبة.
                </p>
              </div>
              <div className="p-3.5 rounded-lg bg-[#F8FAFC] dark:bg-slate-900/80 border border-slate-200/70 dark:border-slate-800">
                <p className="text-xs font-semibold text-[#D97706] dark:text-amber-400">3. لماذا الحاسوب؟</p>
                <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">كثرة العمليات الحسابية</p>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  المسائل الواقعية تتطلب آلاف أو ملايين العمليات مما يجعل الحاسوب ضرورياً.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
            <strong className="text-slate-900 dark:text-slate-100">كيف نختار الخوارزمية؟ (شريحة 9):</strong> يعتمد ذلك على هدفك؛ ففي <strong>الاقتصاد</strong> نكتفي بطريقة بسيطة وسريعة لمعرفة الاتجاه العام، بينما في <strong>الهندسة الدقيقة</strong> نستخدم خوارزمية معقدة وعالية الدقة.
          </div>
        </div>

        {/* Slide 4 Visual Card */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-3">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-50">
              نظرة أولى على التقريب (شريحة 4)
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">توصيل النقاط بمنحنى</span>
          </div>
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg p-3">
            <svg viewBox="0 0 360 165" className="w-full h-auto" role="img" aria-label="رسم توضيحي لمنحنى التقريب f(x) المار بنقاط البيانات">
              <line x1="40" y1="20" x2="40" y2="140" stroke={axisStroke} strokeWidth="1.5" />
              <line x1="25" y1="125" x2="335" y2="125" stroke={axisStroke} strokeWidth="1.5" />
              <polygon points="40,14 36,22 44,22" fill={axisStroke} />
              <polygon points="340,125 332,121 332,129" fill={axisStroke} />
              <text x="24" y="24" fill={axisStroke} className="text-[12px] italic font-mono">y</text>
              <text x="344" y="129" fill={axisStroke} className="text-[12px] italic font-mono">x</text>

              {/* True underlying function */}
              <path
                d="M 55 105 Q 150 38, 305 28"
                fill="none"
                stroke={trueCurveStroke}
                strokeWidth="1.75"
                strokeDasharray="4 4"
              />
              {/* Computed smooth curve f(x) */}
              <path
                d="M 55 102 C 115 62, 195 45, 305 34"
                fill="none"
                stroke={curveStroke}
                strokeWidth="2.75"
              />
              {/* Dashed projection lines x1, x2 */}
              <line x1="135" y1="68" x2="135" y2="125" stroke={axisStroke} strokeWidth="1.2" strokeDasharray="3 3" />
              <line x1="225" y1="46" x2="225" y2="125" stroke={axisStroke} strokeWidth="1.2" strokeDasharray="3 3" />

              {/* Data points */}
              <circle cx="135" cy="68" r="5" fill="#F59E0B" stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="1.5" />
              <circle cx="225" cy="46" r="5" fill="#F59E0B" stroke={isDark ? '#0F172A' : '#FFFFFF'} strokeWidth="1.5" />

              {/* Labels */}
              <text x="128" y="142" fill={axisStroke} className="text-[12px] font-mono">x₁</text>
              <text x="218" y="142" fill={axisStroke} className="text-[12px] font-mono">x₂</text>
              <text x="268" y="54" fill={curveStroke} className="text-[13px] font-semibold font-mono">f(x)</text>
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mt-3">
            عندما نجمع قراءات تجربة علمية على شكل نقاط <span dir="ltr" className="font-mono font-semibold text-slate-800 dark:text-slate-100">(xᵢ, yᵢ)</span>، نرسم دالة ناعمة <span dir="ltr" className="font-mono font-semibold text-[#0284C7] dark:text-sky-400">f(x)</span> تمر بها. الفرق البسيط بين الدالة المحسوبة والدالة الحقيقية يُسمى <strong>الخطأ (Error)</strong>.
          </p>
        </div>
      </div>

      {/* Clear Dictionary of Error Symbols & Formulas (Slide 5) */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
              دليل القوانين الثلاثة لحساب الخطأ (شريحة 5 — Definition 1)
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-0.5">
              احفظ هذه القوانين الثلاثة البسيطة؛ حيث <span dir="ltr" className="font-mono font-bold text-[#0284C7] dark:text-sky-400">xT</span> هي القيمة الحقيقية (True Value) و <span dir="ltr" className="font-mono font-bold text-[#059669] dark:text-emerald-400">xA</span> هي القيمة التقريبية (Approximation).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Formula 1 */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-slate-900 dark:text-slate-100">1. الخطأ العادي (Error)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">قد يكون موجباً أو سالباً</span>
            </div>
            <div dir="ltr" className="font-mono text-base font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-center">
              err(xA) = xT - xA
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              نطرح القيمة التقريبية من القيمة الحقيقية مباشرةً. إذا ظهر الناتج سالباً فهذا يعني أن تقريبك كان أكبر من القيمة الحقيقية.
            </p>
          </div>

          {/* Formula 2 */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#0284C7] dark:text-sky-400">2. الخطأ المطلق (Absolute Error)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">موجب دائماً</span>
            </div>
            <div dir="ltr" className="font-mono text-base font-bold text-[#0284C7] dark:text-sky-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-center">
              Aerr(xA) = |xT - xA|
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              نأخذ القيمة المطلقة (بدون إشارة سالبة) لنعرف حجم الفرق الصافي بين القيمتين، لكنه لا يخبرنا هل هذا الفرق كبير أم صغير بالنسبة للعدد الأصلي.
            </p>
          </div>

          {/* Formula 3 */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#059669] dark:text-emerald-400">3. الخطأ النسبي (Relative Error)</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">الأهم والأدق دلالةً</span>
            </div>
            <div dir="ltr" className="font-mono text-base font-bold text-[#059669] dark:text-emerald-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg text-center">
              rel(xA) = |xT - xA| / xT
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              نقسم الخطأ المطلق على القيمة الحقيقية (بشرط <span dir="ltr" className="font-mono">xT ≠ 0</span>). هذا المقياس هو الأهم لأنه يقيس نسبة الخطأ المئوية مهما اختلف حجم الأعداد.
            </p>
          </div>
        </div>
      </div>

      {/* Two-Zone Sandbox: Absolute & Relative Error Calculator (Slides 5-8) */}
      <div className="bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 md:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#E2E8F0] dark:border-slate-800 pb-5 mb-6">
          <div>
            <h3 className="text-xl font-bold text-[#0F172A] dark:text-slate-50 flex items-center gap-2">
              <Calculator className="w-5 h-5 text-[#0284C7] dark:text-sky-400" />
              <span>مختبر تطبيق الأمثلة (مثال 1.2 ومثال 1.3 من المحاضرة)</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mt-1">
              اضغط على أي مثال من أزرار المحاضرة لمشاهدة الشرح المبسط والحل بالتفصيل، أو جرب إدخال أرقامك الخاصة.
            </p>
          </div>

          {/* Interactive Segmented Control for Presets */}
          <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg">
            {PRESET_CASES.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  selectedPresetId === preset.id
                    ? 'bg-[#0284C7] dark:bg-sky-500 text-white dark:text-slate-950'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/70 dark:hover:bg-slate-800'
                }`}
              >
                {preset.labelAr}
              </button>
            ))}
          </div>
        </div>

        {/* Two-Zone Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Zone: Live Step-by-Step Math Stage */}
          <div className="lg:col-span-7 space-y-5">
            {activePreset && (
              <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-4 space-y-1">
                <div className="text-xs font-bold text-[#0284C7] dark:text-sky-400">
                  التشبيه المبسط ({activePreset.labelAr} — {activePreset.slideRef}):
                </div>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
                  {activePreset.simpleStoryAr}
                </p>
              </div>
            )}

            {/* Live Computed Step-by-Step Solution */}
            <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-4 bg-white dark:bg-slate-900/50">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  خطوات التعويض والحساب المباشر
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  {activePreset ? `${activePreset.labelAr} (${activePreset.slideRef})` : 'إدخال مخصص'}
                </span>
              </div>

              <div dir="ltr" className="space-y-3 font-mono text-sm tabular-nums bg-slate-950 text-slate-100 border border-slate-800 rounded-lg p-4 overflow-x-auto">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                  <span className="text-sky-400 font-semibold">
                    xT = {activePreset ? activePreset.xTDisplay : xT}
                  </span>
                  <span className="text-amber-300 font-semibold">xA = {xA}</span>
                </div>
                <div>
                  <span className="text-slate-400">1) err(xA)  = xT - xA = </span>
                  <span className="text-white font-bold">{errVal.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-slate-400">2) Aerr(xA) = |err(xA)| = </span>
                  <span className="text-sky-300 font-bold">{absErrVal.toFixed(6)}</span>
                </div>
                <div>
                  <span className="text-slate-400">3) rel(xA)  = Aerr(xA) / |xT| = </span>
                  {isZeroTrue ? (
                    <span className="text-rose-400 font-bold">
                      Undefined (القسمة على xT = 0 غير معرفة!)
                    </span>
                  ) : (
                    <span className="text-emerald-400 font-bold">
                      {relErrVal!.toFixed(6)} ({relPercent!.toFixed(3)}%)
                    </span>
                  )}
                </div>
              </div>

              {/* Contextual Pedagogical Interpretation */}
              <div
                className={`p-4 rounded-lg border text-sm flex items-start gap-3 ${
                  isZeroTrue
                    ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                    : relPercent !== null && relPercent > 10
                    ? 'bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
                    : 'bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                }`}
              >
                {isZeroTrue || (relPercent !== null && relPercent > 10) ? (
                  <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                )}
                <div className="space-y-1">
                  <div className="font-bold">
                    {isZeroTrue
                      ? 'حالة خاصة (ملاحظة 1 — شريحة 5): الخطأ النسبي غير معرف'
                      : relPercent !== null && relPercent > 10
                      ? `تنبيه: خطأ نسبي مرتفع (${relPercent.toFixed(2)}%)`
                      : `تقريب ممتاز: خطأ نسبي منخفض (${relPercent?.toFixed(3)}%)`}
                  </div>
                  <p className="text-xs leading-relaxed">
                    {activePreset
                      ? activePreset.noteAr
                      : 'كلما اقترب الخطأ النسبي من الصفر زادت جودة التقريب بغض النظر عن كبر أو صغر الأعداد المستخدمة.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Zone: Parameter Controls & Example 1.3 Comparison */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100 flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-[#0284C7] dark:text-sky-400" />
                  <span>التحكم بالقيم (جرب أرقامك الخاصة)</span>
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400 tabular-nums">تحديث فوري</span>
              </div>

              {/* Control 1: True Value xT */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="xt-input" className="font-medium text-slate-700 dark:text-slate-300">
                    القيمة الحقيقية (<span dir="ltr" className="font-mono">xT</span>)
                  </label>
                  <span dir="ltr" className="font-mono font-bold text-[#0284C7] dark:text-sky-400 tabular-nums">
                    {xT.toFixed(4)}
                  </span>
                </div>
                <input
                  id="xt-input"
                  type="number"
                  step="0.001"
                  value={Number(xT.toFixed(6))}
                  onChange={(e) => handleCustomXT(parseFloat(e.target.value) || 0)}
                  dir="ltr"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0284C7] dark:focus:ring-sky-400"
                />
              </div>

              {/* Control 2: Approx Value xA */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="xa-input" className="font-medium text-slate-700 dark:text-slate-300">
                    القيمة التقريبية (<span dir="ltr" className="font-mono">xA</span>)
                  </label>
                  <span dir="ltr" className="font-mono font-bold text-[#059669] dark:text-emerald-400 tabular-nums">
                    {xA.toFixed(4)}
                  </span>
                </div>
                <input
                  id="xa-input"
                  type="number"
                  step="0.001"
                  value={Number(xA.toFixed(6))}
                  onChange={(e) => handleCustomXA(parseFloat(e.target.value) || 0)}
                  dir="ltr"
                  className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg text-sm font-mono text-slate-900 dark:text-slate-100 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#0284C7] dark:focus:ring-sky-400"
                />
              </div>

              {/* Fine-tune slider for xA around xT */}
              <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <label htmlFor="xa-slider" className="font-medium text-slate-700 dark:text-slate-300">
                    إزاحة التقريب <span dir="ltr" className="font-mono">xA</span> حول <span dir="ltr" className="font-mono">xT</span>
                  </label>
                  <span dir="ltr" className="font-mono text-slate-600 dark:text-slate-400 tabular-nums">
                    Δ = {(xA - xT).toFixed(4)}
                  </span>
                </div>
                <input
                  id="xa-slider"
                  type="range"
                  min={xT === 0 ? -1 : xT * 0.5}
                  max={xT === 0 ? 1 : xT * 1.5}
                  step={xT === 0 ? 0.01 : Math.max(0.0001, Math.abs(xT) * 0.005)}
                  value={xA}
                  onChange={(e) => handleCustomXA(parseFloat(e.target.value))}
                  className="w-full accent-[#0284C7] dark:accent-sky-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Slide 7-8 Comparison Table: Why Relative Error Matters */}
            <div className="border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 bg-white dark:bg-slate-900/50 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#0F172A] dark:text-slate-100">
                  لماذا يهمنا الخطأ النسبي؟ (مقارنة مثال 1.3)
                </h4>
                <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 7 و 8</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-right border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-2 font-medium">العملية</th>
                      <th className="py-2 font-medium" dir="ltr">xT</th>
                      <th className="py-2 font-medium" dir="ltr">xA</th>
                      <th className="py-2 font-medium" dir="ltr">Aerr</th>
                      <th className="py-2 font-medium" dir="ltr">rel (%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-mono tabular-nums">
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 font-sans font-medium text-slate-800 dark:text-slate-200">الأولى</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">0.004</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">0.003</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">0.001</td>
                      <td className="py-2 text-[#DC2626] dark:text-rose-400 font-bold" dir="ltr">▲ 25.0% (سيئ)</td>
                    </tr>
                    <tr className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                      <td className="py-2 font-sans font-medium text-slate-800 dark:text-slate-200">الثانية</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">1258</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">1238</td>
                      <td className="py-2 text-slate-700 dark:text-slate-300" dir="ltr">20</td>
                      <td className="py-2 text-[#059669] dark:text-emerald-400 font-bold" dir="ltr">● 1.59% (أدق)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1 border-t border-slate-100 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-slate-100">قاعدة الإبهام (Rule of thumb):</strong> اعتمد دائماً على <strong>الخطأ النسبي</strong> عند تقييم جودة التقريب، إلا إذا طلبت المسألة صراحةً الخطأ المطلق (مثل حالة <span dir="ltr" className="font-mono">xT = 0</span>).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sources of Error & IEEE-754 Round-off Simulator (Slides 10-12) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 4 Main Sources of Error Interactive Selector */}
        <div className="lg:col-span-7 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
            <div>
              <h3 className="text-lg font-bold text-[#0F172A] dark:text-slate-50">
                من أين تأتي الأخطاء في الحسابات؟ (المصادر الأربعة — شريحة 10)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                اضغط على أي مصدر لقراءة شرحه المبسط ومثاله العملي
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-1.5 bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg">
            {ERROR_SOURCES.map((source) => (
              <button
                key={source.id}
                type="button"
                onClick={() => setActiveSourceId(source.id)}
                className={`px-3 py-2 text-xs font-medium rounded-md transition-colors text-right ${
                  activeSourceId === source.id
                    ? 'bg-white dark:bg-slate-800 text-[#0284C7] dark:text-sky-400 shadow-xs border border-slate-200/80 dark:border-slate-700 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                <div className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">{source.number}</div>
                <div className="truncate">{source.titleAr}</div>
              </button>
            ))}
          </div>

          {/* Active Error Source Detail */}
          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h4 className="text-base font-bold text-[#0F172A] dark:text-slate-50">
                {activeSource.number}. {activeSource.titleAr}
              </h4>
              <span dir="ltr" className="text-xs font-mono text-[#0284C7] dark:text-sky-400">
                {activeSource.titleEn}
              </span>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">
              {activeSource.summaryAr}
            </p>
            <ul className="space-y-2 text-xs md:text-sm text-slate-700 dark:text-slate-300 list-disc list-inside">
              {activeSource.detailsAr.map((detail, idx) => (
                <li key={idx} className="leading-relaxed">
                  {detail}
                </li>
              ))}
            </ul>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
              {activeSource.exampleAr}
            </div>
          </div>
        </div>

        {/* Interactive IEEE-754 & Catastrophic Cancellation Simulator (Slide 11) */}
        <div className="lg:col-span-5 bg-white dark:bg-[#111827] border border-[#E2E8F0] dark:border-slate-800 rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-base font-bold text-[#0F172A] dark:text-slate-50 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-[#0284C7] dark:text-sky-400" />
              <span>محاكي أخطاء التدوير وفقدان المعنوية</span>
            </h3>
            <span className="text-xs text-slate-500 dark:text-slate-400">شريحة 11</span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            ذاكرة الحاسوب محدودة، لذا فهي تقص الأرقام الطويلة (مثل <span dir="ltr" className="font-mono">π</span>). المشكلة الأخطر تحدث عند <strong>طرح عددين متقاربين جداً</strong> حيث تضيع الخانات المهمة (Loss of significance). جرب تحريك المؤشر لترى الفرق:
          </p>

          <div className="bg-[#F8FAFC] dark:bg-slate-900 border border-[#E2E8F0] dark:border-slate-800 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="sig-digits-slider" className="font-semibold text-slate-700 dark:text-slate-300">
                دقة الحاسوب (عدد الخانات العشرية):
              </label>
              <span className="font-mono font-bold text-[#0284C7] dark:text-sky-400 tabular-nums">
                {sigDigits} خانات {sigDigits === 16 ? '(IEEE-754 Double)' : ''}
              </span>
            </div>
            <input
              id="sig-digits-slider"
              type="range"
              min={3}
              max={16}
              step={1}
              value={sigDigits}
              onChange={(e) => setSigDigits(parseInt(e.target.value, 10))}
              className="w-full accent-[#0284C7] dark:accent-sky-400 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-slate-400 dark:text-slate-500 font-mono" dir="ltr">
              <span>3 digits (Low)</span>
              <span>7 digits (Single)</span>
              <span>16 digits (IEEE-754 Double)</span>
            </div>
          </div>

          <div dir="ltr" className="bg-slate-950 text-slate-100 border border-slate-800 rounded-lg p-4 font-mono text-xs space-y-2.5 tabular-nums">
            <div className="text-slate-400 border-b border-slate-800 pb-1.5">
              1) Storing π in {sigDigits} decimal digits:
            </div>
            <div className="flex justify-between">
              <span>Stored π ≈ {piApprox}</span>
              <span className="text-sky-400">rel ≈ {piRelErr.toExponential(2)}</span>
            </div>

            <div className="text-slate-400 border-b border-slate-800 pb-1.5 pt-2">
              2) Subtracting nearly equal numbers (a - b):
            </div>
            <div className="text-[11px] text-slate-300">
              Exact: {trueNum1} - {trueNum2} = <strong className="text-emerald-400">{exactDiff.toFixed(7)}</strong>
            </div>
            <div className="text-[11px] text-slate-300">
              Rounded ({sigDigits}d): {rounded1} - {rounded2} = <strong className="text-amber-300">{computedDiff}</strong>
            </div>
            <div className="pt-1 flex items-center justify-between">
              <span className="text-slate-400">Relative Error in (a - b):</span>
              <span className={cancellationRelErr > 5 ? 'text-rose-400 font-bold' : 'text-emerald-400 font-bold'}>
                {cancellationRelErr > 5 ? `▲ ${cancellationRelErr.toFixed(2)}% (Loss of Significance!)` : `● ${cancellationRelErr.toFixed(4)}% (Accurate)`}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
