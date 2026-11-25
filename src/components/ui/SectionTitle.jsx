export default function SectionTitle({ title, subtitle }) {
  return (
    <div className="mb-10 text-center">
      <h2 className="font-serif text-3xl">{title}</h2>
      {subtitle && <p className="mt-2 text-brand-light">{subtitle}</p>}
    </div>
  );
}
