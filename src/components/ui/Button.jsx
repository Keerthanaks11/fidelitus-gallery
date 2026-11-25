export default function Button({ children, className = "", ...props }) {
  return (
    <button className={`rounded bg-brand px-6 py-2 text-white transition hover:bg-brand-accent disabled:opacity-50 ${className}`} {...props}>
      {children}
    </button>
  );
}
