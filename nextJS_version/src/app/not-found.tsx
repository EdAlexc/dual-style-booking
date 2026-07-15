import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="font-display text-7xl">404</p>
        <h1 className="mt-4 text-xl font-semibold">Page not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <div className="mt-6">
          <Link
            href="/"
            className="inline-flex items-center justify-center border border-foreground px-5 py-2 text-xs uppercase tracking-[0.2em] hover:bg-foreground hover:text-background"
          >
            Return home
          </Link>
        </div>
      </div>
    </div>
  );
}
