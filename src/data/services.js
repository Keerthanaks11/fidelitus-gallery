// All service names, descriptions and photos live here. Edit the text freely.
// "included" and "idealFor" are placeholder wording: change them to match what you really offer.
// Descriptions marked [confirm details] are also placeholders.
//
// featured: true  -> the service also appears on the HOMEPAGE (keep it to 4).
//
// PHOTOS: the photos are files named image_5, image_6 ... image_13 (and image_15) inside src/assets
// (any picture type works: jpg, jpeg, png, webp). A service without a photo shows a plain coloured card.
const files = import.meta.glob("../assets/**/*.{jpg,jpeg,png,webp,avif,JPG,JPEG,PNG}", { eager: true, import: "default" });
const photo = (n) => {
  const key = Object.keys(files).find((p) => new RegExp(`/image_${n}\\.[a-z]+$`, "i").test(p));
  return key ? files[key] : undefined;
};

export const SERVICES = [
  { id: "gallery-for-rent", image: photo(5), featured: true, name: "Gallery for Rent", tag: "Space",
    desc: "Host your exhibition, launch or private event in our Bengaluru gallery space. [confirm details]",
    included: ["Exhibition-ready gallery wall space", "Lighting and display set-up", "Support from our gallery team"],
    idealFor: ["Artists", "Brand launches", "Private events"] },
  { id: "rent-on-art", image: photo(6), featured: true, name: "Rent on Art", tag: "Rental",
    desc: "Rent paintings for any length of time. Choose your space and style, and receive suggestions.",
    included: ["Paintings suggested for your space and style", "Rent for any length of time", "Delivery and collection"],
    idealFor: ["Homes", "Offices", "Events"] },
  { id: "speed-painting", image: photo(7), featured: true, name: "Speed Painting", tag: "Live",
    desc: "A live portrait of your guest of honour, painted at your event while everyone watches.",
    included: ["A live portrait painted at your event", "Finished while your guests watch", "A keepsake for the guest of honour"],
    idealFor: ["Weddings", "Corporate events", "Farewells"] },
  { id: "workshop", image: photo(8), featured: true, name: "Workshop", tag: "Learning",
    desc: "A three-hour painting session, or a two to three day portrait workshop on canvas.",
    included: ["A three-hour painting session", "Or a two to three day portrait workshop", "Painting on canvas, with guidance"],
    idealFor: ["Beginners", "Teams", "Families"] },
  { id: "desktop-painting", image: photo(9), name: "Desktop Painting", tag: "Gifting",
    desc: "Desktop paintings as a considered gift, with bulk enquiries and a downloadable catalogue.",
    included: ["Desktop paintings made as gifts", "Bulk enquiries welcome", "A downloadable catalogue"],
    idealFor: ["Corporate gifting", "Festivals", "Clients and staff"] },
  { id: "caricature", image: photo(15), name: "Caricature", tag: "Live",
    desc: "Playful hand-drawn caricatures, made live at events or from your photo. [confirm details]",
    included: ["Hand-drawn caricatures", "Made live at events or from your photo", "Quick to finish"],
    idealFor: ["Parties", "Corporate events", "Gifts"] },
  { id: "murals", image: photo(11), name: "Murals", tag: "Commission",
    desc: "Large painted walls for homes, offices and public spaces, designed to fit your space. [confirm details]",
    included: ["A design planned for your wall", "Painted on site", "For homes, offices and public spaces"],
    idealFor: ["Homes", "Offices", "Public spaces"] },
  { id: "portraits", image: photo(12), name: "Portraits", tag: "Commission",
    desc: "Commissioned portraits of people and families, painted from your photographs. [confirm details]",
    included: ["Painted from your photographs", "Individual or family portraits", "Size chosen with you"],
    idealFor: ["Gifts", "Families", "Anniversaries"] },
  { id: "art-works", image: photo(13), name: "Art Works", tag: "Collection",
    desc: "Original paintings from our collection: realistic, modern, contemporary and abstract.",
    included: ["Original paintings from our collection", "Realistic, modern, contemporary and abstract", "A certificate of authenticity"],
    idealFor: ["Collectors", "Homes", "Gifting"] },
];