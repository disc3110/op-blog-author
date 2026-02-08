function StatusBadge({ published }) {
  if (published) {
    return (
      <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-300 border border-emerald-500/40">
        Published
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/40">
      Draft
    </span>
  );
}

export default StatusBadge;