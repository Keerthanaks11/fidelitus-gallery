export default function Input({ label, className = "", ...props }) {
  return (
    <label className="block text-sm">
      {label && <span className="mb-1 block">{label}</span>}
      <input className={`w-full rounded border px-3 py-2 outline-none focus:border-brand ${className}`} {...props} />
    </label>
  );
}
