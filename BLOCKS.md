# Block / Widget Reference

Every content file that uses `sections:` can include any of the blocks below.
The `type` field is required on every block; all other fields marked `?` are optional.

---

## prose

```yaml
- type: prose
  heading: "What it is"          # optional
  body: |
    First paragraph text.

    Second paragraph. Inline [links](/some-page/) work.
```

---

## highlights

```yaml
- type: highlights
  heading: "At a glance"         # optional — defaults to locale label
  items:
    - label: "What it is"
      value: "A chronic inflammatory disease of the spine."
    - label: "Symptoms"
      value: "Pain, morning stiffness, fatigue."
```

---

## stats

```yaml
- type: stats
  heading: "What we see in clinic"   # optional
  intro: "Optional intro sentence."  # optional
  items:
    - value: "30–50%"
      label: "Of patients experience pain during active treatment"
    - value: "75%"
      label: "With advanced disease have pain"
```

---

## facts

```yaml
- type: facts
  heading: "Key facts"               # optional — defaults to locale label
  items:
    - "Uncontrolled cancer pain is one of the strongest predictors of desire for hastened death."
    - "Tolerance develops over months to years; this is different from addiction."
    - "Interventional procedures can dramatically reduce opioid requirements."
```

---

## list (variant: rows)

```yaml
- type: list
  variant: rows
  heading: "Appointments"
  items:
    - label: "2006 — present"
      body: "Consultant Neurosurgeon, Alsadr Teaching Hospital, Basra."
      subtitle: "Optional subtitle line."   # optional
    - label: "2022 — present"
      body: "Iraq Director, Middle East Stereotactic Society."
```

## list (variant: wrap)

```yaml
- type: list
  variant: wrap
  heading: "Memberships"
  items:
    - label: "2022"
      body: "European Society for Stereotactic Neurosurgery"
    - label: "2020"
      body: "World Stroke Organization"
```

## list (variant: columns)

```yaml
- type: list
  variant: columns
  heading: "Fellowships"
  items:
    - label: "2013"
      body: "Interventional Pain Management, Mobi Pain Clinic, Mumbai"
      subtitle: "Optional subtitle."        # optional
    - label: "2017"
      body: "Anaesthesiology & Pain Medicine, Seoul National University"
```

---

## quote

```yaml
- type: quote
  text: "The role of the physician is to help nature — nothing more, nothing less."
  attribution: "— Hippocratic principle"   # optional
```

---

## panels

Two panels read as a comparison; three or four read as an options grid.

```yaml
- type: panels
  heading: "Treatment options"     # optional
  intro: "Intro sentence."         # optional
  note: "Footer note."             # optional
  panels:
    - eyebrow: "Before"            # optional
      title: "Symptom-focused management"
      subtitle: "Short sub-line."  # optional
      items:
        - "Rest and NSAIDs"
        - "Escalating opioids"
    - eyebrow: "After"
      title: "Root-cause treatment"
      items:
        - "Nerve blocks + radiofrequency ablation"
        - "Guided physiotherapy"
```

---

## media

```yaml
- type: media
  kind: image           # image | video | youtube
  src: "/images/some-photo.jpg"
  alt: "Description"    # optional but recommended
  caption: "Caption."   # optional
  aspect: "16/9"        # optional — 16/9 | 4/3 | 1/1 | 3/4
  uploadDate: "2024-03-01"  # optional, for VideoObject JSON-LD
```

---

## pathway

```yaml
- type: pathway
  heading: "Conditions we treat"   # optional
  intro: "Intro sentence."         # optional
  groups:
    - eyebrow: "PATHWAY 01"        # optional
      title: "Brain"
      items:
        - name: "Brain tumour"
          href: "/treatments/brain-tumor/"
        - name: "Stroke"
          href: "/treatments/stroke/"
```

---

## row

```yaml
- type: row
  heading: "Inside the clinic"     # optional
  columns: "3"                     # auto | 2 | 3 | 4
  items:
    - src: "/images/room-1.jpg"
      alt: "Consulting room"       # optional
      caption: "Consulting room"   # optional
      href: "/some-page/"          # optional
      aspect: "4/3"                # optional
```

---

## cards

Slugs are resolved by the page dispatcher into card data.

```yaml
- type: cards
  heading: "Related reading"       # optional — defaults to locale label
  slugs:
    - herniated-disc
    - sciatica
    - back-pain
```
