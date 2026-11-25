// Frontend-only: there is no server to store messages, so the form opens the
// visitor's own email app with everything filled in, addressed to the gallery.
import { CONTACT_EMAIL } from "../data/catalog.js";

export const sendMessage = ({ name, email, subject, message }) => {
  const body = `${message}\n\n— ${name} (${email})`;
  const url = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject || "Enquiry from the website")}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
  return Promise.resolve();
};
