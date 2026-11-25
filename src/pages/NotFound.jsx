import { Link } from "react-router-dom";
export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <h1 className="font-serif text-5xl">404</h1>
      <Link to="/" className="mt-4 inline-block underline">Back home</Link>
    </div>
  );
}
