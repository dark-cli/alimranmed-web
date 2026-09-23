export function gql(strings, ...args) {
  let str = "";
  strings.forEach((string, i) => {
    str += string + (args[i] || "");
  });
  return str;
}
export const Blog_EnPartsFragmentDoc = gql`
    fragment Blog_enParts on Blog_en {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  author
  publishedAt
  tags
  redesigned
  clinicallyRelevant
  relatedTreatments
  sections {
    __typename
    ... on Blog_enSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Blog_enSectionsProse {
      heading
      body
    }
    ... on Blog_enSectionsPull_quote {
      text
      attribution
    }
    ... on Blog_enSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Blog_enSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Blog_enSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Blog_enSectionsRelated {
      slugs
    }
    ... on Blog_enSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Blog_enSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Blog_ArPartsFragmentDoc = gql`
    fragment Blog_arParts on Blog_ar {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  author
  publishedAt
  tags
  redesigned
  clinicallyRelevant
  relatedTreatments
  sections {
    __typename
    ... on Blog_arSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Blog_arSectionsProse {
      heading
      body
    }
    ... on Blog_arSectionsPull_quote {
      text
      attribution
    }
    ... on Blog_arSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Blog_arSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Blog_arSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Blog_arSectionsRelated {
      slugs
    }
    ... on Blog_arSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Blog_arSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Treatments_EnPartsFragmentDoc = gql`
    fragment Treatments_enParts on Treatments_en {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  bodyRegion
  publishedAt
  redesigned
  faqItems {
    __typename
    question
    answer
  }
  sections {
    __typename
    ... on Treatments_enSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Treatments_enSectionsProse {
      heading
      body
    }
    ... on Treatments_enSectionsPull_quote {
      text
      attribution
    }
    ... on Treatments_enSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Treatments_enSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Treatments_enSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Treatments_enSectionsRelated {
      slugs
    }
    ... on Treatments_enSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Treatments_enSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Treatments_ArPartsFragmentDoc = gql`
    fragment Treatments_arParts on Treatments_ar {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  bodyRegion
  publishedAt
  redesigned
  faqItems {
    __typename
    question
    answer
  }
  sections {
    __typename
    ... on Treatments_arSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Treatments_arSectionsProse {
      heading
      body
    }
    ... on Treatments_arSectionsPull_quote {
      text
      attribution
    }
    ... on Treatments_arSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Treatments_arSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Treatments_arSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Treatments_arSectionsRelated {
      slugs
    }
    ... on Treatments_arSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Treatments_arSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Services_EnPartsFragmentDoc = gql`
    fragment Services_enParts on Services_en {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  redesigned
  isHub
  sections {
    __typename
    ... on Services_enSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Services_enSectionsProse {
      heading
      body
    }
    ... on Services_enSectionsPull_quote {
      text
      attribution
    }
    ... on Services_enSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Services_enSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Services_enSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Services_enSectionsRelated {
      slugs
    }
    ... on Services_enSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Services_enSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Services_ArPartsFragmentDoc = gql`
    fragment Services_arParts on Services_ar {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  redesigned
  isHub
  sections {
    __typename
    ... on Services_arSectionsAt_a_glance {
      items {
        __typename
        label
        value
      }
    }
    ... on Services_arSectionsProse {
      heading
      body
    }
    ... on Services_arSectionsPull_quote {
      text
      attribution
    }
    ... on Services_arSectionsComparison_pair {
      heading
      intro
      a {
        __typename
        label
        title
        items
      }
      b {
        __typename
        label
        title
        items
      }
    }
    ... on Services_arSectionsStats_facts {
      heading
      intro
      stats {
        __typename
        value
        label
      }
      facts
    }
    ... on Services_arSectionsTreatment_groups {
      heading
      intro
      note
      groups {
        __typename
        title
        subtitle
        items
      }
    }
    ... on Services_arSectionsRelated {
      slugs
    }
    ... on Services_arSectionsRegister {
      heading
      items {
        __typename
        label
        body
      }
    }
    ... on Services_arSectionsMedia {
      kind
      src
      alt
      caption
      aspect
    }
  }
}
    `;
export const Cases_EnPartsFragmentDoc = gql`
    fragment Cases_enParts on Cases_en {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  condition
  outcome
}
    `;
export const Cases_ArPartsFragmentDoc = gql`
    fragment Cases_arParts on Cases_ar {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
  condition
  outcome
}
    `;
export const Doctors_EnPartsFragmentDoc = gql`
    fragment Doctors_enParts on Doctors_en {
  __typename
  title
  description
  category
  order
  updated
  source
  reviewedBy
  reviewedAt
  fullName
  titles
  specialty
  photo
  memberships
  languages
  cvStats {
    __typename
    value
    label
  }
  appointments {
    __typename
    label
    body
  }
  education {
    __typename
    label
    body
  }
  cvMemberships {
    __typename
    label
    body
  }
  publications {
    __typename
    label
    body
  }
  conferences {
    __typename
    label
    body
  }
}
    `;
export const Doctors_ArPartsFragmentDoc = gql`
    fragment Doctors_arParts on Doctors_ar {
  __typename
  title
  description
  category
  order
  updated
  source
  reviewedBy
  reviewedAt
  fullName
  titles
  specialty
  photo
  memberships
  languages
  cvStats {
    __typename
    value
    label
  }
  appointments {
    __typename
    label
    body
  }
  education {
    __typename
    label
    body
  }
  cvMemberships {
    __typename
    label
    body
  }
  publications {
    __typename
    label
    body
  }
  conferences {
    __typename
    label
    body
  }
}
    `;
export const Pages_EnPartsFragmentDoc = gql`
    fragment Pages_enParts on Pages_en {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
}
    `;
export const Pages_ArPartsFragmentDoc = gql`
    fragment Pages_arParts on Pages_ar {
  __typename
  title
  description
  category
  order
  image
  imageAlt
  updated
  source
  reviewedBy
  reviewedAt
}
    `;
export const Blog_EnDocument = gql`
    query blog_en($relativePath: String!) {
  blog_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Blog_enParts
  }
}
    ${Blog_EnPartsFragmentDoc}`;
export const Blog_EnConnectionDocument = gql`
    query blog_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Blog_enFilter) {
  blog_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Blog_enParts
      }
    }
  }
}
    ${Blog_EnPartsFragmentDoc}`;
export const Blog_ArDocument = gql`
    query blog_ar($relativePath: String!) {
  blog_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Blog_arParts
  }
}
    ${Blog_ArPartsFragmentDoc}`;
export const Blog_ArConnectionDocument = gql`
    query blog_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Blog_arFilter) {
  blog_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Blog_arParts
      }
    }
  }
}
    ${Blog_ArPartsFragmentDoc}`;
export const Treatments_EnDocument = gql`
    query treatments_en($relativePath: String!) {
  treatments_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Treatments_enParts
  }
}
    ${Treatments_EnPartsFragmentDoc}`;
export const Treatments_EnConnectionDocument = gql`
    query treatments_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Treatments_enFilter) {
  treatments_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Treatments_enParts
      }
    }
  }
}
    ${Treatments_EnPartsFragmentDoc}`;
export const Treatments_ArDocument = gql`
    query treatments_ar($relativePath: String!) {
  treatments_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Treatments_arParts
  }
}
    ${Treatments_ArPartsFragmentDoc}`;
export const Treatments_ArConnectionDocument = gql`
    query treatments_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Treatments_arFilter) {
  treatments_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Treatments_arParts
      }
    }
  }
}
    ${Treatments_ArPartsFragmentDoc}`;
export const Services_EnDocument = gql`
    query services_en($relativePath: String!) {
  services_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Services_enParts
  }
}
    ${Services_EnPartsFragmentDoc}`;
export const Services_EnConnectionDocument = gql`
    query services_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Services_enFilter) {
  services_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Services_enParts
      }
    }
  }
}
    ${Services_EnPartsFragmentDoc}`;
export const Services_ArDocument = gql`
    query services_ar($relativePath: String!) {
  services_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Services_arParts
  }
}
    ${Services_ArPartsFragmentDoc}`;
export const Services_ArConnectionDocument = gql`
    query services_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Services_arFilter) {
  services_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Services_arParts
      }
    }
  }
}
    ${Services_ArPartsFragmentDoc}`;
export const Cases_EnDocument = gql`
    query cases_en($relativePath: String!) {
  cases_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Cases_enParts
  }
}
    ${Cases_EnPartsFragmentDoc}`;
export const Cases_EnConnectionDocument = gql`
    query cases_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Cases_enFilter) {
  cases_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Cases_enParts
      }
    }
  }
}
    ${Cases_EnPartsFragmentDoc}`;
export const Cases_ArDocument = gql`
    query cases_ar($relativePath: String!) {
  cases_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Cases_arParts
  }
}
    ${Cases_ArPartsFragmentDoc}`;
export const Cases_ArConnectionDocument = gql`
    query cases_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Cases_arFilter) {
  cases_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Cases_arParts
      }
    }
  }
}
    ${Cases_ArPartsFragmentDoc}`;
export const Doctors_EnDocument = gql`
    query doctors_en($relativePath: String!) {
  doctors_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Doctors_enParts
  }
}
    ${Doctors_EnPartsFragmentDoc}`;
export const Doctors_EnConnectionDocument = gql`
    query doctors_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Doctors_enFilter) {
  doctors_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Doctors_enParts
      }
    }
  }
}
    ${Doctors_EnPartsFragmentDoc}`;
export const Doctors_ArDocument = gql`
    query doctors_ar($relativePath: String!) {
  doctors_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Doctors_arParts
  }
}
    ${Doctors_ArPartsFragmentDoc}`;
export const Doctors_ArConnectionDocument = gql`
    query doctors_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Doctors_arFilter) {
  doctors_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Doctors_arParts
      }
    }
  }
}
    ${Doctors_ArPartsFragmentDoc}`;
export const Pages_EnDocument = gql`
    query pages_en($relativePath: String!) {
  pages_en(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Pages_enParts
  }
}
    ${Pages_EnPartsFragmentDoc}`;
export const Pages_EnConnectionDocument = gql`
    query pages_enConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Pages_enFilter) {
  pages_enConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Pages_enParts
      }
    }
  }
}
    ${Pages_EnPartsFragmentDoc}`;
export const Pages_ArDocument = gql`
    query pages_ar($relativePath: String!) {
  pages_ar(relativePath: $relativePath) {
    ... on Document {
      _sys {
        filename
        basename
        hasReferences
        breadcrumbs
        path
        relativePath
        extension
      }
      id
    }
    ...Pages_arParts
  }
}
    ${Pages_ArPartsFragmentDoc}`;
export const Pages_ArConnectionDocument = gql`
    query pages_arConnection($before: String, $after: String, $first: Float, $last: Float, $sort: String, $filter: Pages_arFilter) {
  pages_arConnection(
    before: $before
    after: $after
    first: $first
    last: $last
    sort: $sort
    filter: $filter
  ) {
    pageInfo {
      hasPreviousPage
      hasNextPage
      startCursor
      endCursor
    }
    totalCount
    edges {
      cursor
      node {
        ... on Document {
          _sys {
            filename
            basename
            hasReferences
            breadcrumbs
            path
            relativePath
            extension
          }
          id
        }
        ...Pages_arParts
      }
    }
  }
}
    ${Pages_ArPartsFragmentDoc}`;
export function getSdk(requester) {
  return {
    blog_en(variables, options) {
      return requester(Blog_EnDocument, variables, options);
    },
    blog_enConnection(variables, options) {
      return requester(Blog_EnConnectionDocument, variables, options);
    },
    blog_ar(variables, options) {
      return requester(Blog_ArDocument, variables, options);
    },
    blog_arConnection(variables, options) {
      return requester(Blog_ArConnectionDocument, variables, options);
    },
    treatments_en(variables, options) {
      return requester(Treatments_EnDocument, variables, options);
    },
    treatments_enConnection(variables, options) {
      return requester(Treatments_EnConnectionDocument, variables, options);
    },
    treatments_ar(variables, options) {
      return requester(Treatments_ArDocument, variables, options);
    },
    treatments_arConnection(variables, options) {
      return requester(Treatments_ArConnectionDocument, variables, options);
    },
    services_en(variables, options) {
      return requester(Services_EnDocument, variables, options);
    },
    services_enConnection(variables, options) {
      return requester(Services_EnConnectionDocument, variables, options);
    },
    services_ar(variables, options) {
      return requester(Services_ArDocument, variables, options);
    },
    services_arConnection(variables, options) {
      return requester(Services_ArConnectionDocument, variables, options);
    },
    cases_en(variables, options) {
      return requester(Cases_EnDocument, variables, options);
    },
    cases_enConnection(variables, options) {
      return requester(Cases_EnConnectionDocument, variables, options);
    },
    cases_ar(variables, options) {
      return requester(Cases_ArDocument, variables, options);
    },
    cases_arConnection(variables, options) {
      return requester(Cases_ArConnectionDocument, variables, options);
    },
    doctors_en(variables, options) {
      return requester(Doctors_EnDocument, variables, options);
    },
    doctors_enConnection(variables, options) {
      return requester(Doctors_EnConnectionDocument, variables, options);
    },
    doctors_ar(variables, options) {
      return requester(Doctors_ArDocument, variables, options);
    },
    doctors_arConnection(variables, options) {
      return requester(Doctors_ArConnectionDocument, variables, options);
    },
    pages_en(variables, options) {
      return requester(Pages_EnDocument, variables, options);
    },
    pages_enConnection(variables, options) {
      return requester(Pages_EnConnectionDocument, variables, options);
    },
    pages_ar(variables, options) {
      return requester(Pages_ArDocument, variables, options);
    },
    pages_arConnection(variables, options) {
      return requester(Pages_ArConnectionDocument, variables, options);
    }
  };
}
import { createClient } from "tinacms/dist/client";
const generateRequester = (client) => {
  const requester = async (doc, vars, options) => {
    let url = client.apiUrl;
    if (options?.branch) {
      const index = client.apiUrl.lastIndexOf("/");
      url = client.apiUrl.substring(0, index + 1) + options.branch;
    }
    const data = await client.request({
      query: doc,
      variables: vars,
      url
    }, options);
    return { data: data?.data, errors: data?.errors, query: doc, variables: vars || {} };
  };
  return requester;
};
export const ExperimentalGetTinaClient = () => getSdk(
  generateRequester(
    createClient({
      url: "http://localhost:4001/graphql",
      queries
    })
  )
);
export const queries = (client) => {
  const requester = generateRequester(client);
  return getSdk(requester);
};
