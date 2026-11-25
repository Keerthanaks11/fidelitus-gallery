export const formatPrice = (n) => (n == null ? "Price on request" : new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n));
export const formatDate = (d) => (d ? new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "");
export const imgUrl = (p) => p || "https://placehold.co/600x750?text=No+Image";
