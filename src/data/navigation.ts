/**
 * Master navigation for alimranmed.com — mirrored verbatim from the legacy
 * WordPress site so the migration produces a like-for-like sitemap. Each entry
 * carries the legacy URL so the bulk-fetch script (see docs/MIGRATION.md) can
 * populate content collections without duplicating the taxonomy.
 *
 * The header renders top-level items with dropdowns for their children. The
 * mobile menu flattens the hierarchy into collapsible sections.
 */

export interface NavItem {
  labelKey: string;           // i18n key OR fallback literal (see resolveLabel below)
  label?: string;             // literal label if no i18n key
  href: string;               // new site URL (not the legacy one)
  legacyUrl?: string;         // original URL on alimranmed.com
  category?: string;          // maps to content collection category
  collection?:                // which content collection this belongs to (for bulk import)
    | "treatments"
    | "services"
    | "doctors"
    | "posts"
    | "cases"
    | "testimonies"
    | "pages";
  children?: NavItem[];
}

// Slug helper: strip trailing slash, strip locale prefix.
const slugFor = (legacyPath: string) =>
  legacyPath.replace(/^https?:\/\/[^/]+\//, "").replace(/\/$/, "");

export const NAV: NavItem[] = [
  {
    labelKey: "nav.home",
    href: "/",
  },

  {
    label: "What We Treat",
    href: "/treatments/",
    legacyUrl: "https://alimranmed.com/what-we-deal-with/",
    collection: "pages",
    children: [
      {
        label: "Pain",
        href: "/treatments/pain/",
        legacyUrl: "https://alimranmed.com/pain/",
        collection: "treatments",
        category: "pain",
        children: [
          { label: "Headaches", href: "/treatments/headaches/", legacyUrl: "https://alimranmed.com/headaches/", collection: "treatments", category: "pain" },
          { label: "Cluster headache", href: "/treatments/cluster-headache/", legacyUrl: "https://alimranmed.com/cluster-headache/", collection: "treatments", category: "pain" },
          { label: "Tension headache", href: "/treatments/tension-headaches/", legacyUrl: "https://alimranmed.com/%ef%bb%bftension-headaches/", collection: "treatments", category: "pain" },
          { label: "Migraine", href: "/treatments/migraine/", legacyUrl: "https://alimranmed.com/migrain/", collection: "treatments", category: "pain" },
          { label: "Achondroplasia", href: "/treatments/achondroplasia/", legacyUrl: "https://alimranmed.com/achondroplasia/", collection: "treatments", category: "pain" },
          { label: "Acoustic neuroma", href: "/treatments/acoustic-neuroma/", legacyUrl: "https://alimranmed.com/acoustic-neuroma/", collection: "treatments", category: "pain" },
          { label: "Acromegaly", href: "/treatments/acromegaly/", legacyUrl: "https://alimranmed.com/acromegaly/", collection: "treatments", category: "pain" },
          { label: "Avascular necrosis", href: "/treatments/avascular-necrosis/", legacyUrl: "https://alimranmed.com/avascular-necrosis/", collection: "treatments", category: "pain" },
          { label: "Brachial plexus injuries", href: "/treatments/brachial-plexus-injuries/", legacyUrl: "https://alimranmed.com/brachial-plexus-injuries/", collection: "treatments", category: "pain" },
          { label: "Bursitis", href: "/treatments/bursitis/", legacyUrl: "https://alimranmed.com/bursitis/", collection: "treatments", category: "pain" },
          { label: "Central Pain Syndrome", href: "/treatments/central-pain-syndrome/", legacyUrl: "https://alimranmed.com/central-pain-syndrome/", collection: "treatments", category: "pain" },
          { label: "De Quervain's tenosynovitis", href: "/treatments/de-quervains-tenosynovitis/", legacyUrl: "https://alimranmed.com/de-quervains-tenosynovitis/", collection: "treatments", category: "pain" },
          { label: "Depression (major depressive disorder)", href: "/treatments/depression/", legacyUrl: "https://alimranmed.com/depression-major-depressive-disorder%ef%bb%bf/", collection: "treatments", category: "pain" },
          { label: "Peripheral Nerve Disorders", href: "/treatments/peripheral-nerve-disorders/", legacyUrl: "https://alimranmed.com/peripral-nerve-disordershe/", collection: "treatments", category: "pain" },
          { label: "Meralgia Paresthetica", href: "/treatments/meralgia-paresthetica/", legacyUrl: "https://alimranmed.com/meralgia-paresthetica/", collection: "treatments", category: "pain" },
          { label: "Muscle cramp", href: "/treatments/muscle-cramp/", legacyUrl: "https://alimranmed.com/muscle-cramp/", collection: "treatments", category: "pain" },
          { label: "Neuropathic Pain", href: "/treatments/neuropathic-pain/", legacyUrl: "https://alimranmed.com/neuropathic-pain/", collection: "treatments", category: "pain" },
          { label: "Occipital neuralgia", href: "/treatments/occipital-neuralgia/", legacyUrl: "https://alimranmed.com/occipital-neuralgia/", collection: "treatments", category: "pain" },
          { label: "Osteomalacia", href: "/treatments/osteomalacia/", legacyUrl: "https://alimranmed.com/osteomalacia%ef%bb%bf/", collection: "treatments", category: "pain" },
          { label: "Pituitary tumors", href: "/treatments/pituitary-tumors/", legacyUrl: "https://alimranmed.com/pituitary-tumors%ef%bb%bf/", collection: "treatments", category: "pain" },
          { label: "Polymyalgia rheumatica", href: "/treatments/polymyalgia-rheumatica/", legacyUrl: "https://alimranmed.com/polymyalgia-rheumatica/", collection: "treatments", category: "pain" },
          { label: "Restless legs syndrome", href: "/treatments/restless-legs-syndrome/", legacyUrl: "https://alimranmed.com/restless-legs-syndrome/", collection: "treatments", category: "pain" },
          { label: "Primary Sleep Disorders: Dyssomnias", href: "/treatments/primary-sleep-disorders-dyssomnias/", legacyUrl: "https://alimranmed.com/primary-sleep-disorders-dyssomnias/", collection: "treatments", category: "pain" },
          { label: "Sacroiliitis", href: "/treatments/sacroiliitis/", legacyUrl: "https://alimranmed.com/sacroiliitis/", collection: "treatments", category: "pain" },
          { label: "Spasmodic Torticollis", href: "/treatments/spasmodic-torticollis/", legacyUrl: "https://alimranmed.com/spasmodic-torticollis/", collection: "treatments", category: "pain" },
          { label: "Spasticity", href: "/treatments/spasticity/", legacyUrl: "https://alimranmed.com/spasticity/", collection: "treatments", category: "pain" },
          { label: "Temporal arteritis", href: "/treatments/temporal-arteritis/", legacyUrl: "https://alimranmed.com/temporal-arteritis/", collection: "treatments", category: "pain" },
          { label: "Temporomandibular joint (TMJ)", href: "/treatments/tmj/", legacyUrl: "https://alimranmed.com/the-temporomandibular-joint-tmj/", collection: "treatments", category: "pain" },
          { label: "Transverse Myelitis", href: "/treatments/transverse-myelitis/", legacyUrl: "https://alimranmed.com/transverse-myelitis/", collection: "treatments", category: "pain" },
          { label: "Benign paroxysmal positional vertigo (BPPV)", href: "/treatments/bppv/", legacyUrl: "https://alimranmed.com/benign-paroxysmal-positional-vertigo-bppv/", collection: "treatments", category: "pain" },
          { label: "Vulvodynia", href: "/treatments/vulvodynia/", legacyUrl: "https://alimranmed.com/vulvodynia/", collection: "treatments", category: "pain" },
          { label: "Intermittent claudication", href: "/treatments/intermittent-claudication/", legacyUrl: "https://alimranmed.com/intermittent-claudication/", collection: "treatments", category: "pain" },
          { label: "Diabetic Neuropathy", href: "/treatments/diabetic-neuropathy/", legacyUrl: "https://alimranmed.com/diabetic-neuropathy/", collection: "treatments", category: "pain" },
          { label: "Neck Pain", href: "/treatments/neck-pain/", legacyUrl: "https://alimranmed.com/neck-pain/", collection: "treatments", category: "pain" },
          { label: "Carpal Tunnel Syndrome", href: "/treatments/carpal-tunnel-syndrome/", legacyUrl: "https://alimranmed.com/carpal-tunnel-syndrome/", collection: "treatments", category: "pain" },
          { label: "Frozen Shoulder", href: "/treatments/frozen-shoulder/", legacyUrl: "https://alimranmed.com/frozen-shoulder/", collection: "treatments", category: "pain" },
          { label: "Complex Regional Pain", href: "/treatments/complex-regional-pain/", legacyUrl: "https://alimranmed.com/complex-regional-pain/", collection: "treatments", category: "pain" },
          { label: "Back Pain", href: "/treatments/back-pain/", legacyUrl: "https://alimranmed.com/back-pain-2/", collection: "treatments", category: "pain" },
          { label: "Osteoporosis Pain", href: "/treatments/osteoporosis-pain/", legacyUrl: "https://alimranmed.com/osteoporosis-pain/", collection: "treatments", category: "pain" },
          { label: "Arthritis of the Hip", href: "/treatments/arthritis-of-the-hip/", legacyUrl: "https://alimranmed.com/arthritis-of-the-hip/", collection: "treatments", category: "pain" },
          { label: "Rheumatoid disease", href: "/treatments/rheumatoid-disease/", legacyUrl: "https://alimranmed.com/rheumatoid-disease/", collection: "treatments", category: "pain" },
          { label: "Trigeminal Neuralgia", href: "/treatments/trigeminal-neuralgia/", legacyUrl: "https://alimranmed.com/trigeminal-neuralgia/", collection: "treatments", category: "pain" },
          { label: "Sports Injuries", href: "/treatments/sports-injuries/", legacyUrl: "https://alimranmed.com/sports-injuries/", collection: "treatments", category: "pain" },
          { label: "Tennis Elbow", href: "/treatments/tennis-elbow/", legacyUrl: "https://alimranmed.com/tennis-elbow/", collection: "treatments", category: "pain" },
          { label: "Fibromyalgia", href: "/treatments/fibromyalgia/", legacyUrl: "https://alimranmed.com/fibromyalgia/", collection: "treatments", category: "pain" },
          { label: "Myofascial Pain", href: "/treatments/myofascial-pain/", legacyUrl: "https://alimranmed.com/myofascial-pain/", collection: "treatments", category: "pain" },
          { label: "Amyotrophic Lateral Sclerosis (ALS)", href: "/treatments/als/", legacyUrl: "https://alimranmed.com/amyotrophic-lateral-sclerosis-als/", collection: "treatments", category: "pain" },
          { label: "Multiple sclerosis", href: "/treatments/multiple-sclerosis/", legacyUrl: "https://alimranmed.com/multiple-sclerosis/", collection: "treatments", category: "pain" },
          { label: "Claudication", href: "/treatments/claudication/", legacyUrl: "https://alimranmed.com/claudication/", collection: "treatments", category: "pain" },
          { label: "Flatfeet", href: "/treatments/flatfeet/", legacyUrl: "https://alimranmed.com/flatfeet/", collection: "treatments", category: "pain" },
          { label: "Foot drop", href: "/treatments/foot-drop/", legacyUrl: "https://alimranmed.com/foot-drop/", collection: "treatments", category: "pain" },
          { label: "Metatarsalgia", href: "/treatments/metatarsalgia/", legacyUrl: "https://alimranmed.com/metatarsalgia/", collection: "treatments", category: "pain" },
          { label: "Muscle strains", href: "/treatments/muscle-strains/", legacyUrl: "https://alimranmed.com/muscle-strains/", collection: "treatments", category: "pain" },
          { label: "Heel spur", href: "/treatments/heel-spur/", legacyUrl: "https://alimranmed.com/heel-spur/", collection: "treatments", category: "pain" },
          { label: "Intercostal Neuralgia", href: "/treatments/intercostal-neuralgia/", legacyUrl: "https://alimranmed.com/intercostal-neuralgia/", collection: "treatments", category: "pain" },
          { label: "Rotator cuff injury", href: "/treatments/rotator-cuff-injury/", legacyUrl: "https://alimranmed.com/rotator-cuff-injury/", collection: "treatments", category: "pain" },
          { label: "Tendinitis", href: "/treatments/tendinitis/", legacyUrl: "https://alimranmed.com/tendinitis/", collection: "treatments", category: "pain" },
          { label: "Sprains", href: "/treatments/sprains/", legacyUrl: "https://alimranmed.com/sprains/", collection: "treatments", category: "pain" },
          { label: "Knee pain", href: "/treatments/knee-pain/", legacyUrl: "https://alimranmed.com/knee-pain/", collection: "treatments", category: "pain" },
        ],
      },
      {
        label: "Brain",
        href: "/treatments/brain/",
        legacyUrl: "https://alimranmed.com/brain/",
        collection: "treatments",
        category: "brain",
        children: [
          { label: "Stroke", href: "/treatments/stroke/", legacyUrl: "https://alimranmed.com/stroke/", collection: "treatments", category: "brain" },
          { label: "Transient ischemic attack (TIA)", href: "/treatments/tia/", legacyUrl: "https://alimranmed.com/transient-ischemic-attack-tia/", collection: "treatments", category: "brain" },
          { label: "Bell's palsy", href: "/treatments/bells-palsy/", legacyUrl: "https://alimranmed.com/bells-palsy/", collection: "treatments", category: "brain" },
          { label: "Brain Abscess", href: "/treatments/brain-abscess/", legacyUrl: "https://alimranmed.com/brain-abscess/", collection: "treatments", category: "brain" },
          { label: "Brain Tumor", href: "/treatments/brain-tumor/", legacyUrl: "https://alimranmed.com/brain-tumor/", collection: "treatments", category: "brain" },
          { label: "Cerebrovascular disease", href: "/treatments/cerebrovascular-disease/", legacyUrl: "https://alimranmed.com/cerebrovascular-disease/", collection: "treatments", category: "brain" },
          { label: "Cranial Gunshot Wounds", href: "/treatments/cranial-gunshot-wounds/", legacyUrl: "https://alimranmed.com/cranial-gunshot-wounds/", collection: "treatments", category: "brain" },
          { label: "Epilepsy & Seizures", href: "/treatments/epilepsy-seizures/", legacyUrl: "https://alimranmed.com/epilepsy-seizures/", collection: "treatments", category: "brain" },
          { label: "Head injury", href: "/treatments/head-injury/", legacyUrl: "https://alimranmed.com/head-injury/", collection: "treatments", category: "brain" },
          { label: "Normal Pressure Hydrocephalus", href: "/treatments/normal-pressure-hydrocephalus/", legacyUrl: "https://alimranmed.com/normal-pressure-hydrocephalus/", collection: "treatments", category: "brain" },
          { label: "Subdural Hematoma", href: "/treatments/subdural-hematoma/", legacyUrl: "https://alimranmed.com/subdural-hematoma/", collection: "treatments", category: "brain" },
        ],
      },
      {
        label: "Motor disorders",
        href: "/treatments/motor-disorders/",
        legacyUrl: "https://alimranmed.com/motor-disorders/",
        collection: "treatments",
        category: "motor",
        children: [
          { label: "Gout", href: "/treatments/gout/", legacyUrl: "https://alimranmed.com/gout/", collection: "treatments", category: "motor" },
          { label: "Parkinson's Disease", href: "/treatments/parkinsons-disease/", legacyUrl: "https://alimranmed.com/parkinsons-disease/", collection: "treatments", category: "motor" },
          { label: "Hemifacial Spasm", href: "/treatments/hemifacial-spasm/", legacyUrl: "https://alimranmed.com/hemifacial-spasm/", collection: "treatments", category: "motor" },
          { label: "Alzheimer's disease", href: "/treatments/alzheimers-disease/", legacyUrl: "https://alimranmed.com/alzheimers-disease/", collection: "treatments", category: "motor" },
          { label: "Raynaud's disease", href: "/treatments/raynauds-disease/", legacyUrl: "https://alimranmed.com/raynauds-disease/", collection: "treatments", category: "motor" },
          { label: "Sickle cell anemia", href: "/treatments/sickle-cell-anemia/", legacyUrl: "https://alimranmed.com/sickle-cell-anemia/", collection: "treatments", category: "motor" },
        ],
      },
      {
        label: "Pediatric neurosurgery",
        href: "/treatments/pediatric-neurosurgery/",
        legacyUrl: "https://alimranmed.com/pediatric-neurosurgery/",
        collection: "treatments",
        category: "pediatric",
        children: [
          { label: "Cerebral palsy", href: "/treatments/cerebral-palsy/", legacyUrl: "https://alimranmed.com/cerebral-palsy/", collection: "treatments", category: "pediatric" },
          { label: "Postpolio syndrome", href: "/treatments/postpolio-syndrome/", legacyUrl: "https://alimranmed.com/postpolio-syndrome/", collection: "treatments", category: "pediatric" },
          { label: "Craniosynostosis", href: "/treatments/craniosynostosis/", legacyUrl: "https://alimranmed.com/craniosynostosis/", collection: "treatments", category: "pediatric" },
          { label: "Tethered Spinal Cord", href: "/treatments/tethered-spinal-cord/", legacyUrl: "https://alimranmed.com/tethered-spinal-cord/", collection: "treatments", category: "pediatric" },
          { label: "Pediatric Hydrocephalus", href: "/treatments/pediatric-hydrocephalus/", legacyUrl: "https://alimranmed.com/pediatric-hydrocephalus/", collection: "treatments", category: "pediatric" },
        ],
      },
      {
        label: "Spine",
        href: "/treatments/spine/",
        legacyUrl: "https://alimranmed.com/spine/",
        collection: "treatments",
        category: "spine",
        children: [
          { label: "Failed Back Surgery Syndrome", href: "/treatments/failed-back-surgery-syndrome/", legacyUrl: "https://alimranmed.com/failed-back-surgery-syndrome/", collection: "treatments", category: "spine" },
          { label: "Kyphosis", href: "/treatments/kyphosis/", legacyUrl: "https://alimranmed.com/kyphosis%ef%bb%bf/", collection: "treatments", category: "spine" },
          { label: "Scoliosis", href: "/treatments/scoliosis/", legacyUrl: "https://alimranmed.com/scoliosis/", collection: "treatments", category: "spine" },
          { label: "Syringomyelia (Syrinx)", href: "/treatments/syringomyelia/", legacyUrl: "https://alimranmed.com/syringomyelia-syrinx/", collection: "treatments", category: "spine" },
          { label: "Spinal Trauma", href: "/treatments/spinal-trauma/", legacyUrl: "https://alimranmed.com/spinal-trauma/", collection: "treatments", category: "spine" },
          { label: "Spinal Cord Injury", href: "/treatments/spinal-cord-injury/", legacyUrl: "https://alimranmed.com/spinal-cord-injury/", collection: "treatments", category: "spine" },
          { label: "Spina Bifida", href: "/treatments/spina-bifida/", legacyUrl: "https://alimranmed.com/spina-bifida/", collection: "treatments", category: "spine" },
          { label: "Herniated disc", href: "/treatments/herniated-disc/", legacyUrl: "https://alimranmed.com/herniated-disc/", collection: "treatments", category: "spine" },
          { label: "Compression Fracture", href: "/treatments/compression-fracture/", legacyUrl: "https://alimranmed.com/compression-fracture/", collection: "treatments", category: "spine" },
          { label: "Cervical Spondylotic Myelopathy", href: "/treatments/cervical-spondylotic-myelopathy/", legacyUrl: "https://alimranmed.com/cervical-spondylotic-myelopathy/", collection: "treatments", category: "spine" },
          { label: "Cauda equina syndrome", href: "/treatments/cauda-equina-syndrome/", legacyUrl: "https://alimranmed.com/cauda-equina-syndrome/", collection: "treatments", category: "spine" },
        ],
      },
      { label: "Neurogenic bladder", href: "/treatments/neurogenic-bladder/", legacyUrl: "https://alimranmed.com/nervous-bladder/", collection: "treatments" },
    ],
  },

  {
    label: "Rehabilitation",
    href: "/services/rehabilitation/",
    legacyUrl: "https://alimranmed.com/rehablitation-medicine/",
    collection: "services",
    category: "rehabilitation",
    children: [
      { label: "Neuroplasticity and CNS Reorganization", href: "/services/rehabilitation/neuroplasticity/", legacyUrl: "https://alimranmed.com/2020/06/08/neuroplasticity-and-cns-reorganization/", collection: "services", category: "rehabilitation" },
      { label: "Bladder Rehabilitation", href: "/services/rehabilitation/bladder-rehabilitation/", legacyUrl: "https://alimranmed.com/bladder-rehabilitation/", collection: "services", category: "rehabilitation" },
      { label: "Bed sore", href: "/services/rehabilitation/bed-sore/", legacyUrl: "https://alimranmed.com/bed-sore/", collection: "services", category: "rehabilitation" },
      { label: "Nursing care", href: "/services/rehabilitation/nursing-care/", legacyUrl: "https://alimranmed.com/nursing-care/", collection: "services", category: "rehabilitation" },
      { label: "Spinal cord Rehabilitation", href: "/services/rehabilitation/spinal-cord-rehabilitation/", legacyUrl: "https://alimranmed.com/spinal-cord-rehabilitation/", collection: "services", category: "rehabilitation" },
      { label: "Stroke recovery", href: "/services/rehabilitation/stroke-recovery/", legacyUrl: "https://alimranmed.com/stroke-recovery/", collection: "services", category: "rehabilitation" },
      { label: "Speech therapy", href: "/services/rehabilitation/speech-therapy/", legacyUrl: "https://alimranmed.com/speech-therapy/", collection: "services", category: "rehabilitation" },
      { label: "Psychological Intervention", href: "/services/rehabilitation/psychological-intervention/", legacyUrl: "https://alimranmed.com/psychological-intervention/", collection: "services", category: "rehabilitation" },
      { label: "Nutritional therapy", href: "/services/rehabilitation/nutritional-therapy/", legacyUrl: "https://alimranmed.com/nutritional-therapy/", collection: "services", category: "rehabilitation" },
      { label: "Rehabilitation Consists", href: "/services/rehabilitation/rehabilitation-consists/", legacyUrl: "https://alimranmed.com/rehabilitation-consists/", collection: "services", category: "rehabilitation" },
      { label: "Occupational Therapy", href: "/services/rehabilitation/occupational-therapy/", legacyUrl: "https://alimranmed.com/occupational-therapy/", collection: "services", category: "rehabilitation" },
    ],
  },

  {
    label: "Fitness",
    href: "/services/fitness/",
    legacyUrl: "https://alimranmed.com/fitness/",
    collection: "services",
    category: "fitness",
    children: [
      { label: "Fitness", href: "/services/fitness/overview/", legacyUrl: "https://alimranmed.com/fitness/", collection: "services", category: "fitness" },
      { label: "Mesotherapy injection", href: "/services/fitness/mesotherapy-injection/", legacyUrl: "https://alimranmed.com/mesotherapy-injection/", collection: "services", category: "fitness" },
      { label: "Cryosens skin slimming and tightening", href: "/services/fitness/cryosens/", legacyUrl: "https://alimranmed.com/cryosens-new-skin-slimming-and-tightening-device/", collection: "services", category: "fitness" },
    ],
  },

  {
    labelKey: "nav.chiropractic",
    label: "Chiropractic",
    href: "/services/chiropractic/",
    legacyUrl: "https://alimranmed.com/chiropractic/",
    collection: "services",
    category: "chiropractic",
    children: [
      { label: "SPINMED System", href: "/services/chiropractic/spinmed/", legacyUrl: "https://alimranmed.com/spinmed/", collection: "services", category: "chiropractic" },
      { label: "Sigma", href: "/services/chiropractic/sigma/", legacyUrl: "https://alimranmed.com/sigma/", collection: "services", category: "chiropractic" },
    ],
  },

  {
    labelKey: "nav.brainStimulation",
    label: "Brain Stimulation",
    href: "/services/brain-stimulation/",
    legacyUrl: "https://alimranmed.com/brain-stimulation/",
    collection: "services",
    category: "brain-stimulation",
    children: [
      { label: "tDCS", href: "/services/brain-stimulation/tdcs/", legacyUrl: "https://alimranmed.com/tdcs/", collection: "services", category: "brain-stimulation" },
      { label: "TMS", href: "/services/brain-stimulation/tms/", legacyUrl: "https://alimranmed.com/rtms/", collection: "services", category: "brain-stimulation" },
      { label: "TMS in stroke patients", href: "/services/brain-stimulation/tms-stroke/", legacyUrl: "https://alimranmed.com/tms-in-stroke-patients/", collection: "services", category: "brain-stimulation" },
      { label: "TMS for migraine", href: "/services/brain-stimulation/tms-migraine/", legacyUrl: "https://alimranmed.com/transcranial-magnetic-stimulation-tms-for-migraine/", collection: "services", category: "brain-stimulation" },
      { label: "TMS for pain", href: "/services/brain-stimulation/tms-pain/", legacyUrl: "https://alimranmed.com/repetitive-transcranial-magnetic-stimulation-rtms-for-treating-various-pain-conditions/", collection: "services", category: "brain-stimulation" },
      { label: "TMS for Alzheimer disease", href: "/services/brain-stimulation/tms-alzheimer/", legacyUrl: "https://alimranmed.com/alzheimer-s-disease/", collection: "services", category: "brain-stimulation" },
      { label: "TMS for Tinnitus", href: "/services/brain-stimulation/tms-tinnitus/", legacyUrl: "https://alimranmed.com/tinnitus/", collection: "services", category: "brain-stimulation" },
      { label: "TMS for neuropsychiatric disorders", href: "/services/brain-stimulation/tms-neuropsychiatric/", legacyUrl: "https://alimranmed.com/repetitive-transcranial-magnetic-stimulation-rtms-for-neuropsychiatric-disorders/", collection: "services", category: "brain-stimulation" },
      { label: "TMS Results", href: "/services/brain-stimulation/tms-results/", legacyUrl: "https://alimranmed.com/tms-result/", collection: "services", category: "brain-stimulation" },
    ],
  },

  {
    label: "Radiofrequency",
    href: "/services/radiofrequency/",
    legacyUrl: "https://alimranmed.com/radiofrequency-2/",
    collection: "services",
    category: "radiofrequency",
    children: [
      { label: "Review of radiofrequency", href: "/services/radiofrequency/review/", legacyUrl: "https://alimranmed.com/2020/04/28/radiofrequency-ablation-review/", collection: "services", category: "radiofrequency" },
      { label: "Radiofrequency for Headache", href: "/services/radiofrequency/headache/", legacyUrl: "https://alimranmed.com/2020/05/03/radiofrequency-for-headache/", collection: "services", category: "radiofrequency" },
      { label: "Knee Radiofrequency", href: "/services/radiofrequency/knee/", legacyUrl: "https://alimranmed.com/2020/04/29/radiofrequency-of-knee-joint/", collection: "services", category: "radiofrequency" },
      { label: "Spine Radiofrequency", href: "/services/radiofrequency/spine/", legacyUrl: "https://alimranmed.com/2020/04/28/radiofrequency-ablation-for-spine/", collection: "services", category: "radiofrequency" },
      { label: "Nucleoplasty", href: "/services/radiofrequency/nucleoplasty/", legacyUrl: "https://alimranmed.com/2020/05/04/nucleoplasty/", collection: "services", category: "radiofrequency" },
      { label: "Epidural adhesiolysis with pulsed radiofrequency", href: "/services/radiofrequency/epidural-adhesiolysis/", legacyUrl: "https://alimranmed.com/2020/05/05/epidural-adhesiolysis-with-pulsed-radiofrequency/", collection: "services", category: "radiofrequency" },
      { label: "Radiofrequency for trigeminal neuralgia", href: "/services/radiofrequency/trigeminal-neuralgia/", legacyUrl: "https://alimranmed.com/2020/05/08/radiofrequency-for-trigeminal-neuralgia/", collection: "services", category: "radiofrequency" },
    ],
  },

  {
    label: "Steroid injection",
    href: "/services/steroid-injection/",
    legacyUrl: "https://alimranmed.com/steroid-injection/",
    collection: "services",
    category: "steroid-injection",
    children: [
      { label: "Spinal injections", href: "/services/steroid-injection/spinal/", legacyUrl: "https://alimranmed.com/spinal-injections/", collection: "services", category: "steroid-injection" },
      { label: "Steroid injection for joint pain", href: "/services/steroid-injection/joint-pain/", legacyUrl: "https://alimranmed.com/steroid-injection-for-joint-pain/", collection: "services", category: "steroid-injection" },
      { label: "Trigger point injections", href: "/services/steroid-injection/trigger-point/", legacyUrl: "https://alimranmed.com/trigger-point-injections/", collection: "services", category: "steroid-injection" },
    ],
  },

  {
    label: "Regenerative Medicine",
    href: "/services/regenerative-medicine/",
    legacyUrl: "https://alimranmed.com/2020/05/07/regenerative-medicine/",
    collection: "services",
    category: "regenerative-medicine",
  },

  {
    label: "Ozone Therapy",
    href: "/services/ozone-therapy/",
    legacyUrl: "https://alimranmed.com/ozone-therapy/",
    collection: "services",
    category: "ozone-therapy",
    children: [
      { label: "Review of Ozone Therapy", href: "/services/ozone-therapy/review/", legacyUrl: "https://alimranmed.com/review-of-ozone-therapy/", collection: "services", category: "ozone-therapy" },
      { label: "Ozone for Disc Prolapse", href: "/services/ozone-therapy/disc-prolapse/", legacyUrl: "https://alimranmed.com/ozone-therapy-for-disc-prolapse/", collection: "services", category: "ozone-therapy" },
      { label: "Ozone for Osteoarthritis", href: "/services/ozone-therapy/osteoarthritis/", legacyUrl: "https://alimranmed.com/ozone-therapy-for-osteoarthritis/", collection: "services", category: "ozone-therapy" },
    ],
  },

  {
    label: "BOTOX",
    href: "/services/botox/",
    legacyUrl: "https://alimranmed.com/botox/",
    collection: "services",
    category: "botox",
  },

  {
    labelKey: "nav.surgery",
    label: "Surgery",
    href: "/services/surgery/",
    legacyUrl: "https://alimranmed.com/surgery/",
    collection: "services",
    category: "surgery",
    children: [
      { label: "Vertebroplasty", href: "/services/surgery/vertebroplasty/", legacyUrl: "https://alimranmed.com/vertebroplasty/", collection: "services", category: "surgery" },
      { label: "Endoscopic transnasal transsphenoidal surgery", href: "/services/surgery/transnasal-transsphenoidal/", legacyUrl: "https://alimranmed.com/endoscopic-transnasal-transsphenoidal-surgery/", collection: "services", category: "surgery" },
      { label: "Stereotactic radiosurgery", href: "/services/surgery/stereotactic-radiosurgery/", legacyUrl: "https://alimranmed.com/stereotactic-radiosurgery/", collection: "services", category: "surgery" },
      { label: "Endoscopic spine surgery", href: "/services/surgery/endoscopic-spine/", legacyUrl: "https://alimranmed.com/endoscopic-spine-surgery/", collection: "services", category: "surgery" },
      { label: "Selective dorsal rhizotomy (SDR)", href: "/services/surgery/sdr/", legacyUrl: "https://alimranmed.com/a-selective-dorsal-rhizotomysdr/", collection: "services", category: "surgery" },
      { label: "Lumbar Spinal Fusion Surgery", href: "/services/surgery/lumbar-spinal-fusion/", legacyUrl: "https://alimranmed.com/lumbar-spinal-fusion-surgery/", collection: "services", category: "surgery" },
      { label: "Anterior Cervical Discectomy and Fusion", href: "/services/surgery/acdf/", legacyUrl: "https://alimranmed.com/anterior-cervical-discectomy-and-fusion-3/", collection: "services", category: "surgery" },
      { label: "Deep brain stimulation", href: "/services/surgery/dbs/", legacyUrl: "https://alimranmed.com/deep-brain-stimulation/", collection: "services", category: "surgery" },
      { label: "Intrathecal pump", href: "/services/surgery/intrathecal-pump/", legacyUrl: "https://alimranmed.com/an-intrathecal-pump/", collection: "services", category: "surgery" },
      { label: "Arthroplasty (Artificial Disc Replacement)", href: "/services/surgery/arthroplasty/", legacyUrl: "https://alimranmed.com/arthroplasty-artificial-disc-replacement/", collection: "services", category: "surgery" },
      { label: "Burr Holes and Craniotomy", href: "/services/surgery/burr-holes-craniotomy/", legacyUrl: "https://alimranmed.com/burr-holes-and-craniotomy-2/", collection: "services", category: "surgery" },
      { label: "Spinal Decompression", href: "/services/surgery/spinal-decompression/", legacyUrl: "https://alimranmed.com/spinal-decompression-2/", collection: "services", category: "surgery" },
    ],
  },

  {
    labelKey: "nav.physiotherapy",
    label: "Physiotherapy",
    href: "/services/physiotherapy/",
    legacyUrl: "https://alimranmed.com/physiotherapy-3/",
    collection: "services",
    category: "physiotherapy",
    children: [
      { label: "LUNA EMG ROBOT", href: "/services/physiotherapy/luna-emg-robot/", legacyUrl: "https://alimranmed.com/luna-emg-robot/", collection: "services", category: "physiotherapy" },
      { label: "Magnetic Field Therapy", href: "/services/physiotherapy/magnetic-field-therapy/", legacyUrl: "https://alimranmed.com/magnetic-field-therapy/", collection: "services", category: "physiotherapy" },
      { label: "Shortwave Therapy", href: "/services/physiotherapy/shortwave-therapy/", legacyUrl: "https://alimranmed.com/shortwave-therapy/", collection: "services", category: "physiotherapy" },
      { label: "Laser therapy", href: "/services/physiotherapy/laser-therapy/", legacyUrl: "https://alimranmed.com/laser-therapy-3/", collection: "services", category: "physiotherapy" },
      { label: "Electrical stimulation", href: "/services/physiotherapy/electrical-stimulation/", legacyUrl: "https://alimranmed.com/electrical-stimulation-3/", collection: "services", category: "physiotherapy" },
      { label: "Ultrasound Therapy", href: "/services/physiotherapy/ultrasound-therapy/", legacyUrl: "https://alimranmed.com/ultrasound-therapy-2/", collection: "services", category: "physiotherapy" },
      { label: "Virtual Reality", href: "/services/physiotherapy/virtual-reality/", legacyUrl: "https://alimranmed.com/2020/06/08/virtual-reality/", collection: "services", category: "physiotherapy" },
      { label: "Virtual Reality for Stroke", href: "/services/physiotherapy/virtual-reality-stroke/", legacyUrl: "https://alimranmed.com/2020/06/08/virtual-reality-for-stroke/", collection: "services", category: "physiotherapy" },
      { label: "Kinesiology", href: "/services/physiotherapy/kinesiology/", legacyUrl: "https://alimranmed.com/kinesiology-2/", collection: "services", category: "physiotherapy" },
    ],
  },

  {
    labelKey: "nav.exercises",
    label: "Exercises",
    href: "/services/exercises/",
    legacyUrl: "https://alimranmed.com/exercises-2/",
    collection: "services",
    category: "exercises",
    children: [
      { label: "Neck", href: "/services/exercises/neck/", legacyUrl: "https://alimranmed.com/neek/", collection: "services", category: "exercises" },
      { label: "Back", href: "/services/exercises/back/", legacyUrl: "https://alimranmed.com/back/", collection: "services", category: "exercises" },
      { label: "Hip", href: "/services/exercises/hip/", legacyUrl: "https://alimranmed.com/hip/", collection: "services", category: "exercises" },
      { label: "Knee", href: "/services/exercises/knee/", legacyUrl: "https://alimranmed.com/knee/", collection: "services", category: "exercises" },
      { label: "Ankle", href: "/services/exercises/ankle/", legacyUrl: "https://alimranmed.com/ankle/", collection: "services", category: "exercises" },
      { label: "Foot", href: "/services/exercises/foot/", legacyUrl: "https://alimranmed.com/foot/", collection: "services", category: "exercises" },
    ],
  },

  {
    label: "Acupuncture",
    href: "/services/acupuncture/",
    legacyUrl: "https://alimranmed.com/acupuncture/",
    collection: "services",
    category: "acupuncture",
  },

  {
    labelKey: "nav.cases",
    label: "Cases",
    href: "/cases/",
    legacyUrl: "https://alimranmed.com/cases-2/",
    collection: "pages",
    children: [
      { label: "Tumor cases", href: "/cases/tumor/", legacyUrl: "https://alimranmed.com/tumor-cases/", collection: "cases" },
      { label: "Spine cases", href: "/cases/spine/", legacyUrl: "https://alimranmed.com/spine-cases/", collection: "cases" },
      { label: "Trauma cases", href: "/cases/trauma/", legacyUrl: "https://alimranmed.com/trauma-cases/", collection: "cases" },
      { label: "Paediatric cases", href: "/cases/paediatric/", legacyUrl: "https://alimranmed.com/paediatric-cases/", collection: "cases" },
    ],
  },

  { label: "About", href: "/about/", collection: "pages",
    children: [
      { label: "Mission", href: "/about/#mission", collection: "pages" },
      { label: "Vision",  href: "/about/#vision",  collection: "pages" },
      { label: "Values",  href: "/about/#values",  collection: "pages" },
      { label: "Our Doctors", href: "/doctors/", collection: "pages" },
    ],
  },
  { labelKey: "nav.doctors", label: "Doctors", href: "/doctors/", legacyUrl: "https://alimranmed.com/doctors/", collection: "pages" },
  { labelKey: "nav.contact", label: "Contact", href: "/contact/", legacyUrl: "https://alimranmed.com/contact-us/", collection: "pages" },
];

// Flatten the tree into a list of leaves + intermediates for bulk-migration.
export function flattenNav(items: NavItem[] = NAV): NavItem[] {
  const out: NavItem[] = [];
  const walk = (list: NavItem[]) => {
    for (const item of list) {
      out.push(item);
      if (item.children) walk(item.children);
    }
  };
  walk(items);
  return out;
}

// Resolve a NavItem's display label using i18n dictionary, with fallback.
export function resolveLabel(
  item: NavItem,
  dict: Record<string, string>,
): string {
  if (item.labelKey && dict[item.labelKey]) return dict[item.labelKey];
  return item.label ?? item.labelKey ?? "";
}
