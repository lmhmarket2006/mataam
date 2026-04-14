export default function Loading() {
  return (
    <div
      className="min-h-[70vh] flex flex-col items-center justify-center gap-4 bg-background px-4"
      aria-busy="true"
      aria-live="polite"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-primary border-t-transparent"
        aria-hidden
      />
      <p className="text-sm text-muted-foreground text-center">
        <span className="block" dir="rtl">
          جاري التحميل…
        </span>
        <span className="block mt-1" dir="ltr">
          Loading…
        </span>
      </p>
    </div>
  );
}
