export function SectionLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4].map(i => (
        <div key={i} className="h-20 bg-surface-100 rounded-lg animate-pulse" />
      ))}
    </div>
  );
}