import { useState } from "react";
import { sendMessage } from "../services/contactService.js";
import Input from "../components/ui/Input.jsx";
import Button from "../components/ui/Button.jsx";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setStatus("Opening your email app…");
    try {
      await sendMessage(form);
      setStatus("Your email app has opened with your message — just press Send.");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setStatus("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="mb-6 font-serif text-4xl">Contact</h1>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Name" value={form.name} onChange={set("name")} required />
        <Input label="Email" type="email" value={form.email} onChange={set("email")} required />
        <Input label="Subject" value={form.subject} onChange={set("subject")} />
        <label className="block text-sm">
          <span className="mb-1 block">Message</span>
          <textarea rows={5} value={form.message} onChange={set("message")} required className="w-full rounded border px-3 py-2" />
        </label>
        <Button type="submit">Send</Button>
        {status && <p className="text-sm">{status}</p>}
      </form>
    </div>
  );
}
