// =====================================================================
// LOCAL DATA — replaces the old server/database (frontend-only site).
// Edit artworks, artists and exhibitions here; images live in src/assets.
// ⚠ Entries marked TODO use placeholder titles/years — replace them with the real details.
// price: a number in ₹, or null for "Price on request".
// =====================================================================

import vishwaroopa from "../assets/vishwaroopa.jpeg";
import trimurthy from "../assets/trimurthy.jpeg";
import sun from "../assets/sun.jpeg";
import img1 from "../assets/image_1.jpeg";
import img2 from "../assets/image_2.jpeg";
import img3 from "../assets/image_3.jpg";
import queen from "../assets/07.jpeg";
import bgPainting from "../assets/background.jpg";
import sketch from "../assets/11.jpeg";
import caricature from "../assets/image_10.jpg";
import mural from "../assets/image_11.jpg";
import workshop from "../assets/12.jpg";
import talk from "../assets/13.jpg";
import room from "../assets/image_5.jpg";

export const ARTISTS = [
  {
    _id: "ravi",
    slug: "kotegadde-s-ravi",
    name: "Kotegadde S Ravi",
    country: "India",
    photo: sun, // TODO: replace with a portrait of the artist
    bio:
      "Award-winning Chief Artist of Fidelitus Gallery. His hand-painted works move between realistic, modern, " +
      "contemporary and abstract styles, and include the gallery's exclusive collection — Vishwaroopa, Trimurthy and Sun Chariot.",
  },
];

const ravi = ARTISTS[0];

export const ARTWORKS = [
  { _id: "a1", slug: "vishwaroopa", title: "Vishwaroopa", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    dimensions: "96″ × 36″", year: 2020, price: null, status: "available", featured: true, images: [vishwaroopa],
    description: "Part of the gallery's exclusive collection by Kotegadde S Ravi." },
  { _id: "a2", slug: "trimurthy", title: "Trimurthy", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    dimensions: "48″ × 60″", year: 2022, price: null, status: "available", featured: true, images: [trimurthy],
    description: "Part of the gallery's exclusive collection by Kotegadde S Ravi." },
  { _id: "a3", slug: "sun-chariot", title: "Sun Chariot", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    dimensions: "72″ × 72″", year: 2022, price: null, status: "available", featured: true, images: [sun],
    description: "Part of the gallery's exclusive collection by Kotegadde S Ravi." },
  // TODO: real titles / details for the works below
  { _id: "a4", slug: "untitled-01", title: "Untitled 01", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    price: null, status: "available", images: [img1], description: "Original hand-painted work." },
  { _id: "a5", slug: "untitled-02", title: "Untitled 02", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    price: null, status: "available", images: [img2], description: "Original hand-painted work." },
  { _id: "a6", slug: "untitled-03", title: "Untitled 03", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    price: null, status: "available", images: [img3], description: "Original hand-painted work." },
  { _id: "a7", slug: "untitled-04", title: "Untitled 04", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    price: null, status: "available", images: [queen], description: "Original hand-painted work." },
  { _id: "a8", slug: "untitled-05", title: "Untitled 05", artist: ravi, category: "Painting", medium: "Acrylic on canvas",
    price: null, status: "available", images: [bgPainting], description: "Original hand-painted work." },
  { _id: "a9", slug: "untitled-sketch", title: "Untitled Sketch", artist: ravi, category: "Drawing", medium: "Pencil on paper",
    price: null, status: "available", images: [sketch], description: "Original drawing." },
  { _id: "a10", slug: "caricature-studies", title: "Caricature Studies", artist: ravi, category: "Drawing", medium: "Ink on paper",
    price: null, status: "available", images: [caricature], description: "Caricature drawings." },
  { _id: "a11", slug: "mural", title: "Mural", artist: ravi, category: "Mural", medium: "Wall painting",
    price: null, status: "available", images: [mural], description: "Mural work." },
];

// No dates are invented here: add startDate / endDate ("2026-12-01") when you have them.
export const EXHIBITIONS = [
  { _id: "e1", title: "The Permanent Collection", status: "current", location: "Fidelitus Gallery, Bengaluru", coverImage: room,
    description: "Hand-painted originals by Kotegadde S Ravi and celebrated Indian artists, on show at the gallery." },
  { _id: "e2", title: "Workshops & Live Painting", status: "ongoing", location: "Fidelitus Gallery, Bengaluru", coverImage: workshop,
    description: "Hands-on workshops, speed painting and art sessions for all ages." }, // TODO: real dates / details
  { _id: "e3", title: "Talks & Gatherings", status: "ongoing", location: "Fidelitus Gallery, Bengaluru", coverImage: talk,
    description: "Conversations with artists and art lovers at the gallery." }, // TODO: real dates / details
];

export const CONTACT_EMAIL = "info@fidelituscorp.com";
