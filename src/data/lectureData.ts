export interface ErrorSourceItem {
  id: string;
  number: string;
  titleAr: string;
  titleEn: string;
  summaryAr: string;
  detailsAr: string[];
  exampleAr: string;
  categoryTag: string;
}

export interface MatlabLineExplanation {
  lineNumber: number;
  code: string;
  titleAr: string;
  explanationAr: string;
  relatedSubplot?: number;
}

export interface QuizQuestion {
  id: number;
  questionAr: string;
  formulaLtr?: string;
  options: string[];
  correctIndex: number;
  explanationAr: string;
}

export const LECTURE_OUTLINE = {
  part1: {
    titleAr: 'الجزء الأول — الأخطاء والتحليل العددي',
    titleEn: 'Part I — Errors',
    items: [
      { index: '01', titleAr: 'مقدمة في التحليل العددي', titleEn: 'Introduction to Numerical Analysis', slide: '3–4' },
      { index: '02', titleAr: 'الخطأ المطلق والخطأ النسبي', titleEn: 'Absolute and Relative Error', slide: '5–8' },
      { index: '03', titleAr: 'الحسابات والخوارزميات العددية', titleEn: 'Computational and Errors', slide: '9' },
      { index: '04', titleAr: 'المصادر الرئيسية للأخطاء', titleEn: 'Sources of Error', slide: '10–12' },
    ],
  },
  part2: {
    titleAr: 'الجزء الثاني — أدوات المتسلسلات والتقريب',
    titleEn: 'Part II — Series Tools',
    items: [
      { index: '05', titleAr: 'مفكوك متسلسلة تايلور', titleEn: 'Taylor Series Expansions', slide: '13–18' },
      { index: '06', titleAr: 'متسلسلة ماكلورين القياسية', titleEn: 'Maclaurin Series', slide: '19–21, 23' },
      { index: '07', titleAr: 'التطبيق العملي بلغة MATLAB', titleEn: 'MATLAB Demonstration', slide: '22' },
    ],
  },
  outcomes: [
    {
      titleAr: 'التمييز بين الخطأ المطلق والنسبي',
      titleEn: 'Distinguish absolute and relative error',
      descAr: 'حساب كلٍ من الخطأ الحقيقي والمطلق والنسبي وتفسير سبب كون الخطأ النسبي أكثر دلالة في تقييم جودة التقريب.',
    },
    {
      titleAr: 'تحديد مصادر الخطأ الحسابي',
      titleEn: 'Identify main sources of computational error',
      descAr: 'التفريق بين أخطاء صياغة النموذج، أخطاء بيانات الإدخال، أخطاء التقطيع، أخطاء التدوير (Round-off)، وأخطاء البتر (Truncation).',
    },
    {
      titleAr: 'نشر الدوال الملساء في متسلسلات تايلور وماكلورين',
      titleEn: 'Expand a smooth function in a Taylor / Maclaurin series',
      descAr: 'تحويل الدوال غير الجبرية مثل ln(x) و sin(x) و e^x إلى كثيرات حدود يسهل على الحاسوب والآلة الحاسبة تقييمها.',
    },
    {
      titleAr: 'تفسير خطأ البتر في المتسلسلات',
      titleEn: 'Interpret the truncation error of a series approximation',
      descAr: 'فهم كيف ينشأ خطأ البتر (Em) عند الاكتفاء بعدد منتهٍ من الحدود، وكيف يتناقص بزيادة رتبة كثيرة الحدود أو الاقتراب من نقطة النشر.',
    },
  ],
};

export const ERROR_SOURCES: ErrorSourceItem[] = [
  {
    id: 'formulation',
    number: '01',
    titleAr: 'أخطاء في صياغة المسألة',
    titleEn: 'Errors in the Formulation of the Problem',
    summaryAr: 'تحدث قبل بدء أي عملية حسابية نتيجة تبسيط الواقع الفيزيائي أو عدم دقة أدوات القياس.',
    detailsAr: [
      '(أ) أخطاء النموذج الرياضي (Mathematical Model Errors): تنتج عن الفرضيات التبسيطية مثل إهمال مقاومة الهواء أو اعتبار الجاذبية ثابتة تماماً.',
      '(ب) أخطاء بيانات الإدخال (Input Data / Measurement Errors): تنتج عن محدودية دقة أجهزة القياس المختبرية أو الهندسية.',
    ],
    exampleAr: 'مثال: إذا كشفت النتائج المحسوبة عن سلوك غير واقعي، فقد يعني ذلك أن النموذج الرياضي نفسه يحتاج إلى مراجعة وتعديل (شريحة 9).',
    categoryTag: 'النموذج والبيانات',
  },
  {
    id: 'approximation',
    number: '02',
    titleAr: 'أخطاء التقريب والطريقة العددية',
    titleEn: 'Approximation Errors',
    summaryAr: 'تنشأ من طبيعة الخوارزمية العددية المستخدمة لتحويل المسألة المتصلة إلى خطوات حسابية منفصلة.',
    detailsAr: [
      '(أ) خطأ التقطيع (Discretization Error): تحويل التكاملات أو المعادلات التفاضلية المتصلة إلى فروق منتهية.',
      '(ب) خطأ التقارب في الطرق التكرارية (Convergence Error): التوقف بعد عدد محدود من التكرارات قبل الوصول للحل النهائي.',
      '(ج) يتم تقدير هذا الخطأ عن طريق التحليل الرياضي للطريقة المستخدمة.',
    ],
    exampleAr: 'مثال: في الاقتصاد قد نكتفي بطريقة بسيطة منخفضة الدقة لمعرفة السلوك العام، بينما في الهندسة الدقيقة نحتاج خوارزمية معقدة عالية الدقة.',
    categoryTag: 'الخوارزمية',
  },
  {
    id: 'roundoff',
    number: '03',
    titleAr: 'أخطاء التدوير والتمثيل الحاسوبي',
    titleEn: 'Round-off Errors',
    summaryAr: 'تظهر في كل مكان داخل الحسابات العددية لأن الحاسوب يمثل الأعداد الحقيقية بعدد منتهٍ من البتات (Finite-precision arithmetic).',
    detailsAr: [
      'تتصرف بطريقة غير منتظمة أو شبه عشوائية (Unorganized / Pseudo-random manner).',
      'فقدان المعنوية (Loss of significance): يحدث بشكل خطير عند طرح عددين متقاربين جداً في القيمة.',
      'التراكم (Accumulation): تتزايد عبر العمليات الحسابية الطويلة المتسلسلة، مع حساسية بعض الخوارزميات للاضطرابات الصغيرة.',
    ],
    exampleAr: 'معيار IEEE-754 للدقة المزدوجة (Double Precision): يوفر حوالي 16 رقماً عشرياً من الدقة، ويكون خطأ التدوير النسبي في العملية الواحدة بحدود 10⁻¹⁶.',
    categoryTag: 'عتاد الحاسوب',
  },
  {
    id: 'truncation',
    number: '04',
    titleAr: 'خطأ البتر (القطع)',
    titleEn: 'Truncation Error',
    summaryAr: 'ينتج عند استبدال تعبير رياضي لا نهائي دقيق بتقريب رياضي منتهٍ (مثل أخذ أول عدة حدود من متسلسلة لا نهائية وإهمال الباقي).',
    detailsAr: [
      'يُرمز لذيل المتسلسلة المهمل بالرمز Em ويُسمى خطأ البتر (Tail of the expansion).',
      'القاعدة الأساسية: الاحتفاظ بعدد أكبر من الحدود يؤدي مباشرة إلى تقليل خطأ البتر (Keeping more terms ⇒ smaller truncation error).',
      'تسمح متسلسلات تايلور وماكلورين بحساب وتقييد قيمة Em رياضياً.',
    ],
    exampleAr: 'مثال: تقريب sin(α) ≈ α - α³/3! + α⁵/5! وإهمال الحدود ذات القوى الأعلى التي تشكل ذيل المتسلسلة Em (شريحة 12).',
    categoryTag: 'المتسلسلات',
  },
];

export const MATLAB_CODE_LINES: MatlabLineExplanation[] = [
  {
    lineNumber: 1,
    code: 'clc; clear; close all;',
    titleAr: 'تهيئة بيئة العمل في MATLAB',
    explanationAr: 'يمسح نافذة الأوامر (clc)، ويحذف المتغيرات السابقة من الذاكرة (clear)، ويغلق أي نوافذ رسومية مفتوحة سابقاً (close all).',
  },
  {
    lineNumber: 2,
    code: 'x1 = -3*pi : pi/100 : 3*pi;',
    titleAr: 'إنشاء متجه قيم محور السينات x1',
    explanationAr: 'ينشئ مصفوفة نقاط تبدأ من -3π (حوالي -9.42) إلى +3π بخطوة صغيرة قدرها π/100 لضمان رسم منحنى ناعم ودقيق.',
  },
  {
    lineNumber: 3,
    code: 'y1 = sin(x1);',
    titleAr: 'حساب الدالة الحقيقية sin(x)',
    explanationAr: 'يحسب قيمة الجيب الحقيقية عند كل نقطة في المتجه x1 لاستخدامها كمرجع نقارن به كثيرات حدود ماكلورين.',
  },
  {
    lineNumber: 4,
    code: 'y2 = @(x) x;',
    titleAr: 'التقريب الأول (الرتبة 1 - حد واحد)',
    explanationAr: 'دالة مجهولة الاسم (Anonymous Function) تمثل الحد الأول فقط من متسلسلة ماكلورين: P₁(x) = x (خط مستقيم مماس عند الصفر).',
    relatedSubplot: 1,
  },
  {
    lineNumber: 5,
    code: 'y3 = @(x) x - x.^3/factorial(3);',
    titleAr: 'التقريب الثاني (الرتبة 3 - حدّان)',
    explanationAr: 'يضيف الحد التكعيبي (-x³/3!). لاحظ استخدام (.^) للرفع إلى أس لكل عنصر في المصفوفة، والدالة factorial(3) لحساب المضروب 3! = 6.',
    relatedSubplot: 2,
  },
  {
    lineNumber: 6,
    code: 'y4 = @(x) x - x.^3/factorial(3) + x.^5/factorial(5);',
    titleAr: 'التقريب الثالث (الرتبة 5 - 3 حدود)',
    explanationAr: 'يضيف الحد الخامس (+x⁵/5!) حيث 5! = 120، مما يوسع نطاق تطابق المنحنى التقريبي مع دالة الجيب.',
    relatedSubplot: 3,
  },
  {
    lineNumber: 7,
    code: 'y5 = @(x) x - x.^3/factorial(3) + x.^5/factorial(5) - x.^7/factorial(7);',
    titleAr: 'التقريب الرابع (الرتبة 7 - 4 حدود)',
    explanationAr: 'يطرح الحد السابع (-x⁷/7!) حيث 7! = 5040. نلاحظ تناوب الإشارات (+ ثم - ثم + ثم -) في متسلسلة الجيب.',
    relatedSubplot: 4,
  },
  {
    lineNumber: 8,
    code: 'y6 = @(x) y5(x) + x.^9/factorial(9);',
    titleAr: 'التقريب الخامس (الرتبة 9 - 5 حدود)',
    explanationAr: 'يستدعي الدالة السابقة y5(x) مباشرة ويضيف إليها الحد التاسع (+x⁹/9!) لاختصار كتابة الكود.',
    relatedSubplot: 5,
  },
  {
    lineNumber: 9,
    code: 'y7 = @(x) y6(x) - x.^11/factorial(11);',
    titleAr: 'التقريب السادس (الرتبة 11 - 6 حدود)',
    explanationAr: 'يستدعي y6(x) ويطرح الحد الحادي عشر (-x¹¹/11!). هذا التقريب يطابق sin(x) بدقة ممتازة على فترة واسعة جداً.',
    relatedSubplot: 6,
  },
  {
    lineNumber: 10,
    code: "subplot(3,2,1); plot(x1,y1, x1,y2(x1),'LineWidth',2); axis([-8 8 -3 3]); title('x')",
    titleAr: 'رسم الشبكة الفرعية الأولى (1 من 6)',
    explanationAr: 'يقسم نافذة الرسم إلى شبكة 3 صفوف × عمودين، ويرسم في المربع الأول الدالة الحقيقية y1 مع التقريب الأول y2 بسمك خط 2 وتحديد المحاور [-8, 8] و [-3, 3].',
    relatedSubplot: 1,
  },
  {
    lineNumber: 11,
    code: "subplot(3,2,2..6); plot(...); axis([-8 8 -3 3]); title(...)",
    titleAr: 'إكمال الرسوم الفرعية من 2 إلى 6',
    explanationAr: 'يكرر نفس أمر الرسم في الخانات (2 إلى 6) لعرض تطور اقتراب متسلسلة ماكلورين من منحنى sin(x) مع كل حد إضافي.',
    relatedSubplot: 6,
  },
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    questionAr: 'في المثال 1.3 من المحاضرة، كان الخطأ المطلق للحساب الأول 0.001 وللحساب الثاني 20. أيهما يمثل تقريباً أكثر دقة ولماذا؟',
    formulaLtr: 'First: xT = 0.004, xA = 0.003 | Second: yT = 1258, yA = 1238',
    options: [
      'الحساب الأول أدق لأن خطأه المطلق 0.001 أصغر بكثير من 20.',
      'الحساب الثاني أدق لأن خطأه النسبي 1.59% فقط بينما الأول خطأه النسبي 25%.',
      'كلاهما بنفس الدقة النسبية عند القسمة على القيمة التقريبية.',
      'لا يمكن المقارنة بينهما لعدم تساوي القيم الحقيقية.',
    ],
    correctIndex: 1,
    explanationAr: 'الخطأ المطلق وحده قد يكون مضللاً! عند قسمة الخطأ المطلق على القيمة الحقيقية نجد أن الخطأ النسبي للحساب الأول هو 25% بينما للثاني 1.59% فقط، لذا فالحساب الثاني أدق بكثير.',
  },
  {
    id: 2,
    questionAr: 'متى يكون الخطأ النسبي rel(xA) غير مُعرَّف (Undefined) ويجب حينها الاكتفاء بالخطأ المطلق؟',
    formulaLtr: 'rel(xA) = |xT - xA| / xT',
    options: [
      'عندما تكون القيمة التقريبية xA = 0.',
      'عندما تكون القيمة الحقيقية xT = 0.',
      'عندما يكون الخطأ المطلق سالباً.',
      'عندما تكون xT سالبة.',
    ],
    correctIndex: 1,
    explanationAr: 'وفقاً للملاحظة 1 (شريحة 5) وقاعدة الإبهام (شريحة 8)، فإن القسمة على xT = 0 تجعل الخطأ النسبي غير معرف، ولذلك نستخدم الخطأ المطلق في هذه الحالة.',
  },
  {
    id: 3,
    questionAr: 'ما هو نوع الخطأ الناتج عن عدم قدرة الحاسوب على تخزين العدد π بدقة تامة في عدد منتهٍ من البتات؟',
    formulaLtr: 'IEEE-754 Double Precision (~16 decimal digits, rel round-off ~ 10⁻¹⁶)',
    options: [
      'خطأ البتر (Truncation Error)',
      'خطأ التدوير (Round-off Error)',
      'خطأ صياغة النموذج الرياضي (Model Error)',
      'خطأ التقطيع (Discretization Error)',
    ],
    correctIndex: 1,
    explanationAr: 'أخطاء التدوير (Round-off errors) تنشأ بسبب التمثيل الحاسوبي ذي الدقة المنتهية للأعداد (Finite-precision representation)، مثل الاكتفاء بـ 16 خانة عشرية للعدد π.',
  },
  {
    id: 4,
    questionAr: 'عند تقريب الدالة sin(α) بأخذ أول ثلاثة حدود فقط من متسلسلة ماكلورين وإهمال باقي الحدود اللانهائية، ماذا نسمي ذيل المتسلسلة المهمل Em؟',
    formulaLtr: 'sin(α) = α - α³/3! + α⁵/5! + Em',
    options: [
      'خطأ التدوير العشوائي (Round-off Error)',
      'خطأ بيانات الإدخال (Input Data Error)',
      'خطأ البتر (Truncation Error)',
      'خطأ فقدان المعنوية (Loss of Significance)',
    ],
    correctIndex: 2,
    explanationAr: 'استبدال تعبير رياضي دقيق لا نهائي بمجموع منتهٍ من الحدود يولد خطأ البتر (Truncation error) المرموز له بـ Em، وهو يتناقص كلما أضفنا حدوداً أكثر.',
  },
  {
    id: 5,
    questionAr: 'ما هي العلاقة الرياضية بين متسلسلة ماكلورين ومتسلسلة تايلور؟',
    formulaLtr: 'f(x) = Σ f⁽ⁿ⁾(a) (x - a)ⁿ / n!',
    options: [
      'متسلسلة ماكلورين هي حالة خاصة من متسلسلة تايلور عندما تكون نقطة النشر a = 1.',
      'متسلسلة ماكلورين هي حالة خاصة من متسلسلة تايلور عندما تكون نقطة النشر a = 0.',
      'متسلسلة تايلور تصلح فقط للدوال المثلثية بينما ماكلورين تصلح للوغاريتمات.',
      'متسلسلة ماكلورين لا تتطلب اشتقاق الدالة.',
    ],
    correctIndex: 1,
    explanationAr: 'حسب التعريف 3 (شريحة 19)، متسلسلة ماكلورين هي الحالة الخاصة من متسلسلة تايلور عند التعويض عن مركز النشر بـ a = 0.',
  },
  {
    id: 6,
    questionAr: 'في المثال 1.5 لنشر الدالة ln(x) حول النقطة a = 10، ماذا يحدث لجودة التقريب كلما ابتعدت قيمة x عن 10؟',
    formulaLtr: 'ln(x) ≈ 2.302585 + 0.1(x - 10) - (0.01/2!)(x - 10)² + (0.002/3!)(x - 10)³',
    options: [
      'تزداد دقة التقريب كلما ابتعدنا عن x = 10.',
      'تبقى دقة التقريب ثابتة لجميع قيم x الموجبة.',
      'تتراجع جودة التقريب ويزداد خطأ التقريب كلما ابتعدنا عن x = 10، ولتحسينه نحتاج لإضافة حدود ذات رتب أعلى.',
      'يتحول خطأ البتر إلى الصفر تلقائياً.',
    ],
    correctIndex: 2,
    explanationAr: 'كثيرة حدود تايلور تعطي تطابقاً ممتازاً بالقرب من نقطة النشر x = a، ولكن يزداد الخطأ كلما ابتعدنا عنها، ويتم توسيع فترة الدقة بإضافة حدود ذات رتب أعلى (شريحة 16 و 17).',
  },
];
