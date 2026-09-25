/**
 * Static UI label strings for article pages, keyed by locale.
 * Dynamic strings (e.g. those that embed entry.data.title) stay in the template.
 */

export type ArticleLabels = {
  reviewedByLabel: string;
  reviewer: string;
  readingTimeLabel: string;
  lastReviewedLabel: string;
  tocLabel: string;
};

export type TreatmentLabels = ArticleLabels & {
  pathwayLabel: string;
  callLabel: string;
  callBody: string;
  ctaHeading: string;
  ctaBody: string;
};

export type BlogLabels = ArticleLabels & {
  callLabel: string;
  callBody: string;
  ctaHeading: string;
  ctaBody: string;
  disclaimer: string;
};

export const NAV_LABELS = {
  en: {
    home:      "Home",
    blog:      "Blog",
    treatments:"Conditions treated",
    services:  "Services",
    doctors:   "Our doctors",
    siteName:  "Alimran Clinic",
  },
  ar: {
    home:      "الرئيسية",
    blog:      "المدونة",
    treatments:"الحالات والإجراءات",
    services:  "الخدمات",
    doctors:   "الأطباء",
    siteName:  "مركز العمران الطبي",
  },
} as const;

export const TREATMENT_LABELS = {
  en: {
    pathwayLabel:     "Pathway",
    reviewedByLabel:  "Reviewed by",
    reviewer:         "Hussein Imran Mousa, consultant neurosurgeon",
    readingTimeLabel: "Reading time",
    lastReviewedLabel:"Last reviewed",
    tocLabel:         "On this page",
    callLabel:        "Discuss this",
    callBody:         "Speak to the secretary about a consultation for this condition.",
    ctaHeading:       "Book a consultation",
    ctaBody:          "The secretary schedules first appointments during clinic hours; please have prior imaging, operative notes and a current medication list available at the time of the call.",
  },
  ar: {
    pathwayLabel:     "المسار",
    reviewedByLabel:  "تمت المراجعة من قبل",
    reviewer:         "الدكتور حسين عمران موسى، استشاري جراحة الأعصاب",
    readingTimeLabel: "وقت القراءة",
    lastReviewedLabel:"آخر مراجعة",
    tocLabel:         "في هذه الصفحة",
    callLabel:        "للاستفسار",
    callBody:         "تحدث مع السكرتير لحجز استشارة حول هذه الحالة.",
    ctaHeading:       "احجز استشارة",
    ctaBody:          "يقوم السكرتير بجدولة المواعيد الأولى خلال ساعات العمل. يُرجى تحضير الصور الشعاعية السابقة وتقارير العمليات وقائمة الأدوية الحالية قبل الاتصال.",
  },
} as const;

export const BLOG_LABELS = {
  en: {
    reviewedByLabel:  "Reviewed by",
    reviewer:         "Hussein Imran Mousa, consultant neurosurgeon",
    readingTimeLabel: "Reading time",
    lastReviewedLabel:"Last reviewed",
    tocLabel:         "On this page",
    callLabel:        "Questions?",
    callBody:         "Contact us to discuss this topic with our team.",
    ctaHeading:       "Need more information?",
    ctaBody:          "Reach out to our team for more details about the topics covered in this article.",
    disclaimer:       "This article provides general information and is not a substitute for professional medical advice. If you have specific health concerns, please consult with a healthcare provider.",
  },
  ar: {
    reviewedByLabel:  "تمت المراجعة من قبل",
    reviewer:         "الدكتور حسين عمران موسى، استشاري الجراحة العصبية",
    readingTimeLabel: "وقت القراءة",
    lastReviewedLabel:"آخر مراجعة",
    tocLabel:         "على هذه الصفحة",
    callLabel:        "أسئلة؟",
    callBody:         "تواصل معنا لمناقشة هذا الموضوع مع فريقنا.",
    ctaHeading:       "هل تحتاج إلى مزيد من المعلومات؟",
    ctaBody:          "تواصل معنا للحصول على المزيد من التفاصيل حول الموضوعات المغطاة في هذا المقال.",
    disclaimer:       "يوفر هذا المقال معلومات عامة ولا يحل محل الاستشارة الطبية المتخصصة. إذا كان لديك مخاوف صحية محددة، يرجى استشارة مقدم الرعاية الصحية.",
  },
} as const;

export const SERVICE_LABELS = {
  en: {
    pathwayLabel:     "Category",
    reviewedByLabel:  "Reviewed by",
    reviewer:         "Hussein Imran Mousa, consultant neurosurgeon",
    readingTimeLabel: "Reading time",
    lastReviewedLabel:"Last reviewed",
    tocLabel:         "On this page",
    callLabel:        "Book now",
    callBody:         "Speak to the secretary about this service.",
    ctaHeading:       "Book a consultation",
    ctaBody:          "The secretary schedules first appointments during clinic hours.",
    disclaimer:       "This page describes a treatment offered at Alimran Medical Center and is not a substitute for individual medical assessment. Suitability is decided in consultation.",
  },
  ar: {
    pathwayLabel:     "الفئة",
    reviewedByLabel:  "تمت المراجعة من قبل",
    reviewer:         "الدكتور حسين عمران موسى، استشاري جراحة الأعصاب",
    readingTimeLabel: "وقت القراءة",
    lastReviewedLabel:"آخر مراجعة",
    tocLabel:         "في هذه الصفحة",
    callLabel:        "احجز الآن",
    callBody:         "تحدث مع السكرتير للاستفسار عن هذه الخدمة.",
    ctaHeading:       "احجز استشارة",
    ctaBody:          "يقوم السكرتير بجدولة المواعيد الأولى خلال ساعات العمل.",
    disclaimer:       "تصف هذه الصفحة علاجاً يُقدَّم في مركز العمران الطبي وليست بديلاً عن التقييم الطبي الفردي. تُحدَّد الملاءمة بالمشاورة.",
  },
} as const;
