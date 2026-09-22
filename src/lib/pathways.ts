export type Pathway = "brain" | "spine" | "pain";

export type TreatmentPathwayInfo = { label: string; pathway: string };

export const TREATMENT_PATHWAY: Record<"en" | "ar", Record<string, TreatmentPathwayInfo>> = {
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
};

export const BLOG_PATHWAY: Record<string, Pathway> = {
  "amyotrophic-lateral-sclerosis-als-2": "brain",
  "covid-19-symptoms-on-the-nervous-and-locomotor-system": "brain",
  "results-of-treatment-of-cerebral-palsy-in-children": "brain",
  "tms-for-alzheimer-disease": "brain",
  "tms-for-neuropsychiatric-disorders": "brain",
  "tms-for-tinnitus": "brain",
  "tms-for-tinnitus-2": "brain",
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
  "tms-for-migraine": "pain",
  "tms-for-pains": "pain",
  "vasotrain-or-air-pressure-massage": "pain",
};

export const PATHWAY_LABELS = {
  en: { brain: "Brain", spine: "Spine", pain: "Pain", other: "Other" },
  ar: { brain: "الدماغ", spine: "العمود الفقري", pain: "الألم", other: "أخرى" },
} as const;
