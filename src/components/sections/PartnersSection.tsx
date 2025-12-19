import { SectionLabel } from "@/components/ui/section-label";

export function PartnersSection() {
  return (
    <section className="py-20 md:py-32 animate-fade-in-up relative overflow-hidden">
      {/* Subtle gradient background with transition to next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/50 to-marble-900 pointer-events-none" />

      <div className="max-w-content mx-auto px-6 relative z-10">
        <SectionLabel>research partners</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-16 text-marble-100 max-w-2xl">
          Collaborating with leading research institutions worldwide
        </h2>

        {/* Partner logos row */}
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-6">
          {/* McKinsey Global Institute */}
          <div className="flex items-center gap-3 px-4 py-3 border border-slate-600/50 rounded bg-slate-800/30">
            <span className="font-display font-bold text-2xl text-slate-300">MGI</span>
            <div className="text-[10px] text-slate-500 leading-tight">
              <div>McKinsey</div>
              <div>Global</div>
              <div>Institute</div>
            </div>
          </div>

          {/* Santa Fe Institute */}
          <div className="flex items-center gap-2 px-4 py-3 border border-slate-600/50 rounded bg-slate-800/30">
            <div className="w-10 h-10 rounded-full border-2 border-gold-500/50 flex items-center justify-center">
              <span className="font-display font-bold text-lg text-gold-400">SFI</span>
            </div>
            <div className="text-[10px] text-slate-400 leading-tight">
              <div>Santa Fe</div>
              <div>Institute</div>
            </div>
          </div>

          {/* BCG Henderson Institute */}
          <div className="flex items-center gap-2 px-4 py-3 border border-slate-600/50 bg-slate-800/30 rounded">
            <span className="font-display text-2xl font-medium tracking-tight text-slate-300">
              BCG
            </span>
            <div className="text-[10px] text-slate-500 leading-tight border-l border-slate-600 pl-2">
              <div>Henderson</div>
              <div>Institute</div>
            </div>
          </div>

          {/* MIT Sloan */}
          <div className="flex items-center gap-2 px-4 py-3 border border-slate-600/50 bg-slate-800/30 rounded">
            <span className="font-display text-xl font-bold text-slate-300">MIT</span>
            <div className="text-[10px] text-slate-500 leading-tight">
              <div>Sloan School</div>
              <div>of Management</div>
            </div>
          </div>

          {/* Stanford GSB */}
          <div className="px-4 py-3 border border-slate-600/50 bg-slate-800/30 rounded">
            <div className="text-center">
              <div className="font-serif text-lg font-medium text-slate-300">Stanford</div>
              <div className="text-[9px] text-slate-500 uppercase tracking-wider">
                Graduate School of Business
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
