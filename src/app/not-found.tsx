import Link from "next/link";

export default function NotFound() {
  return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-2">
      <h2 className="text-2xl font-bold">Not Found</h2>
      <p className="text-xl font-semibold">Could not find requested resource</p>
      <Link href="/" className="font-semibold underline">
        Return Home
      </Link>
    </div>
  );
}
