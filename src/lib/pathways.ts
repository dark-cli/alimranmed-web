export type Pathway = "brain" | "spine" | "pain";

export type TreatmentPathwayInfo = { label: string; pathway: string };

export const TREATMENT_PATHWAY: Record<"en" | "ar" | "tr", Record<string, TreatmentPathwayInfo>> = {
  en: {
    brain: { label: "Brain", pathway: "Brain — neurosurgical" },
    spine: { label: "Spine", pathway: "Spine — surgical" },
    pain:  { label: "Pain",  pathway: "Pain — interventional" },
  },
  ar: {
    brain: { label: "الدماغ",        pathway: "الدماغ — جراحي" },
    spine: { label: "العمود الفقري",  pathway: "العمود الفقري — جراحي" },
    pain:  { label: "الألم",          pathway: "الألم — تداخلي" },
  },
  tr: {
    brain: { label: "Beyin",   pathway: "Beyin — cerrahi" },
    spine: { label: "Omurga",  pathway: "Omurga — cerrahi" },
    pain:  { label: "Ağrı",    pathway: "Ağrı — girişimsel" },
  },
};

/** Turkish display names for service category slugs (tr.md keeps the EN slug). */
export const SERVICE_CATEGORY_TR: Record<string, string> = {
  "acupuncture": "Akupunktur",
  "botox": "Botoks",
  "brain-stimulation": "Beyin stimülasyonu",
  "chiropractic": "Kayropraktik",
  "exercises": "Egzersizler",
  "fitness": "Zindelik",
  "ozone-therapy": "Ozon tedavisi",
  "pain-management": "Ağrı yönetimi",
  "physiotherapy": "Fizyoterapi",
  "radiofrequency": "Radyofrekans",
  "regenerative-medicine": "Rejeneratif tıp",
  "rehabilitation": "Rehabilitasyon",
  "steroid-injection": "Steroid enjeksiyonu",
  "surgery": "Cerrahi",
};

export const BLOG_PATHWAY: Record<string, Pathway> = {
  "covid-19-symptoms-on-the-nervous-and-locomotor-system": "brain",
  "results-of-treatment-of-cerebral-palsy-in-children": "brain",
  "tms-for-alzheimer-disease": "brain",
  "tms-for-neuropsychiatric-disorders": "brain",
  "transcranial-direct-current-stimulation-tdcs": "brain",
  "transcranial-magnetic-stimulation": "brain",
  "poliomyelitis": "spine",
  "spin-med": "spine",
  "what-is-an-intrathecal-pump": "spine",
  "achilles-tendinitis": "pain",
  "arthritis": "pain",
  "diabetic-foot-pain-and-ulcers": "pain",
  "osteoporosis": "pain",
  "physiotherapy": "pain",
  "tension-headaches": "pain",
  "vasotrain-or-air-pressure-massage": "pain",
};

export const PATHWAY_LABELS = {
  en: { brain: "Brain", spine: "Spine", pain: "Pain", other: "Other" },
  ar: { brain: "الدماغ", spine: "العمود الفقري", pain: "الألم", other: "أخرى" },
  tr: { brain: "Beyin", spine: "Omurga", pain: "Ağrı", other: "Diğer" },
} as const;
