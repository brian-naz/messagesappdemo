function GlassHeader({ title, left, center, right }) {
  return (
    <div
      className="
      sticky top-0 z-20
      backdrop-blur-3xl
      bg-gradient-to-br from-white/40 to-white/10
      dark:from-white/10 dark:to-white/5
      border-b border-white/30 dark:border-white/10
      shadow-[0_8px_32px_rgba(0,0,0,0.15)]
      px-4 pt-4 pb-5
      flex items-center justify-between
    "
    >
      <div className="w-16">{left}</div>

      <div className="flex flex-col items-center">
        {center || <div className="font-semibold text-sm">{title}</div>}
      </div>

      <div className="w-16 flex justify-end">{right}</div>
    </div>
  );
}

export default GlassHeader;
