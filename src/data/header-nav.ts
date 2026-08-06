/**
 * The 6-item top navbar. Every real clinic navbar looks like this — Mayo,
 * Cleveland Clinic, Johns Hopkins all top out around 5–7 items. Individual
 * treatment/service pages are reached via the category landing pages listed
 * in the dropdowns, not by cramming 100+ items into the header.
 *
 * The exhaustive taxonomy still lives in `navigation.ts` — it drives the
 * legacy-URL redirect map, sitemap ordering, and any "all pages" listing.
 * Header display uses this file.
 */

export interface HeaderNavItem {
  label: string;
  href: string;
  columns?: HeaderNavColumn[];   // when set, item renders as mega-menu
}

export interface HeaderNavColumn {
  label: string;
  href?: string;                 // heading may be a link or plain text
  items: { label: string; href: string }[];
}

export const HEADER_NAV: HeaderNavItem[] = [
  { label: "Home", href: "/" },

  {
    label: "Conditions",
    href: "/treatments/",
    columns: [
      {
        label: "Pain",
        href: "/treatments/pain/",
        items: [
          { label: "Headaches",              href: "/treatments/headaches/" },
          { label: "Neck pain",              href: "/treatments/neck-pain/" },
          { label: "Back pain",              href: "/treatments/back-pain/" },
          { label: "Sciatica",               href: "/treatments/sciatica/" },
          { label: "Frozen shoulder",        href: "/treatments/frozen-shoulder/" },
          { label: "Knee pain",              href: "/treatments/knee-pain/" },
          { label: "Fibromyalgia",           href: "/treatments/fibromyalgia/" },
          { label: "All pain conditions →",  href: "/treatments/pain/" },
        ],
      },
      {
        label: "Brain",
        href: "/treatments/brain/",
        items: [
          { label: "Stroke",                 href: "/treatments/stroke/" },
          { label: "Brain tumor",            href: "/treatments/brain-tumor/" },
          { label: "Epilepsy & seizures",    href: "/treatments/epilepsy-seizures/" },
          { label: "Head injury",            href: "/treatments/head-injury/" },
          { label: "Bell's palsy",           href: "/treatments/bells-palsy/" },
          { label: "All brain conditions →", href: "/treatments/brain/" },
        ],
      },
      {
        label: "Spine",
        href: "/treatments/spine/",
        items: [
          { label: "Herniated disc",         href: "/treatments/herniated-disc/" },
          { label: "Scoliosis",              href: "/treatments/scoliosis/" },
          { label: "Kyphosis",               href: "/treatments/kyphosis/" },
          { label: "Spinal cord injury",     href: "/treatments/spinal-cord-injury/" },
          { label: "Whiplash",               href: "/treatments/whiplash/" },
          { label: "All spine conditions →", href: "/treatments/spine/" },
        ],
      },
      {
        label: "More",
        items: [
          { label: "Motor disorders",        href: "/treatments/motor-disorders/" },
          { label: "Pediatric neurosurgery", href: "/treatments/pediatric-neurosurgery/" },
          { label: "Neurogenic bladder",     href: "/treatments/neurogenic-bladder/" },
          { label: "Parkinson's disease",    href: "/treatments/parkinsons-disease/" },
          { label: "Multiple sclerosis",     href: "/treatments/multiple-sclerosis/" },
          { label: "Full A–Z index →",       href: "/treatments/" },
        ],
      },
    ],
  },

  {
    label: "Services",
    href: "/services/",
    columns: [
      {
        label: "Rehabilitation & Therapy",
        items: [
          { label: "Rehabilitation",     href: "/services/rehabilitation/" },
          { label: "Physiotherapy",      href: "/services/physiotherapy/" },
          { label: "Chiropractic",       href: "/services/chiropractic/" },
          { label: "Acupuncture",        href: "/services/acupuncture/" },
          { label: "Exercises",          href: "/services/exercises/" },
        ],
      },
      {
        label: "Pain Management",
        items: [
          { label: "Interventional pain",href: "/services/pain-management/" },
          { label: "Radiofrequency",     href: "/services/radiofrequency/" },
          { label: "Steroid injection",  href: "/services/steroid-injection/" },
          { label: "Ozone therapy",      href: "/services/ozone-therapy/" },
          { label: "BOTOX",              href: "/services/botox/" },
        ],
      },
      {
        label: "Advanced Care",
        items: [
          { label: "Brain stimulation",  href: "/services/brain-stimulation/" },
          { label: "Surgery",            href: "/services/surgery/" },
          { label: "Regenerative medicine", href: "/services/regenerative-medicine/" },
          { label: "Fitness",            href: "/services/fitness/" },
          { label: "All services →",     href: "/services/" },
        ],
      },
    ],
  },

  { label: "Doctors", href: "/doctors/" },
  { label: "About",   href: "/about/" },
  { label: "Contact", href: "/contact/" },
];
