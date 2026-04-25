export default function TutorialHero() {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-blue-800 via-blue-700 to-blue-400 px-5 pt-8 pb-12">
      {/* Decorative circles */}
      <div className=" absolute -top-14 -right-10 w-48 h-48 rounded-full bg-white/5" />
      <div className="absolute -bottom-8 left-4 w-28 h-28 rounded-full bg-white/[0.04]" />

      <div className="max-w-6xl mx-auto relative z-10">
        <span className="inline-flex items-center gap-1.5 bg-white/15 border border-white/25 text-white text-[11px] font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-white/70 inline-block" />
          Panduan Lengkap
        </span>
        <h1 className="text-white text-2xl font-bold leading-snug mb-2">
          Cara Pakai Langkaloka
        </h1>
        <p className="text-white/75 text-[13px] leading-relaxed">
          Panduan mudah untuk beli, jual, dan kelola tokomu di platform preloved
          terpercaya.
        </p>
      </div>
    </div>
  );
}
