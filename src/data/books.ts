/** Books that shaped how I think about DevOps, oldest first. */
export interface Book {
  title: string;
  authors: string;
  year: number;
  /** publisher's or authors' official page */
  url: string;
}

const books: Book[] = [
  {
    title: 'Extreme Programming Explained',
    authors: 'Kent Beck & Cynthia Andres',
    year: 2004,
    url: 'https://www.informit.com/store/extreme-programming-explained-embrace-change-9780321278654',
  },
  {
    title: 'The Phoenix Project',
    authors: 'Gene Kim, Kevin Behr & George Spafford',
    year: 2013,
    url: 'https://itrevolution.com/product/the-phoenix-project/',
  },
  {
    title: 'Accelerate',
    authors: 'Nicole Forsgren, Jez Humble & Gene Kim',
    year: 2018,
    url: 'https://itrevolution.com/product/accelerate/',
  },
  {
    title: 'The Site Reliability Workbook',
    authors: 'Betsy Beyer, Niall Richard Murphy, David K. Rensin, Kent Kawahara & Stephen Thorne',
    year: 2018,
    url: 'https://sre.google/workbook/table-of-contents/',
  },
  {
    title: 'Team Topologies',
    authors: 'Matthew Skelton & Manuel Pais',
    year: 2019,
    url: 'https://teamtopologies.com/book',
  },
  {
    title: 'Frictionless',
    authors: 'Nicole Forsgren & Abi Noda',
    year: 2025,
    url: 'https://getdx.com/news/frictionless/',
  },
];

// stable sort keeps same-year books in the order above (Accelerate came out before the SRE Workbook)
export const BOOKS = [...books].sort((a, b) => a.year - b.year);
