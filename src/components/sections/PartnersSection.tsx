import { SectionLabel } from '@/components/ui/section-label'

export function PartnersSection() {
  return (
    <section className="py-20 md:py-32 animate-fade-in-up relative overflow-hidden">
      {/* Subtle gradient background with transition to next section */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800/50 to-marble-900 pointer-events-none" />

      <div className="max-w-content mx-auto px-6 relative z-10">
        <SectionLabel>partners</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-16 text-marble-100 max-w-2xl">
          Our trusted collaborators in progress and success
        </h2>

        {/* Partner logos row */}
        <div className="flex flex-wrap items-center justify-between gap-8 md:gap-6">
          {/* ND2 - Nordyne Defense Dynamics */}
          <div className="flex items-center gap-3 px-4 py-3 border border-slate-600/50 rounded bg-slate-800/30">
            <span className="font-display font-bold text-2xl text-slate-300">ND2</span>
            <div className="text-[10px] text-slate-500 leading-tight">
              <div>Nordyne</div>
              <div>Defense</div>
              <div>Dynamics</div>
            </div>
          </div>

          {/* Metriks - Data Center */}
          <div className="flex items-center gap-2 px-4 py-3">
            <div className="w-12 h-7 border border-slate-500/50 rounded-full" />
            <div>
              <span className="font-display text-lg text-slate-300">Metriks</span>
              <span className="text-[9px] text-slate-500 ml-1 align-top">Data<br />Center</span>
            </div>
          </div>

          {/* QUO - Legal Firm */}
          <div className="flex items-center gap-2 px-4 py-3 border border-slate-600/50 bg-slate-800/30">
            <span className="font-display text-2xl font-light tracking-widest text-slate-300">QUO</span>
            <div className="text-[10px] text-slate-500 leading-tight border-l border-slate-600 pl-2">
              <div>LEGAL</div>
              <div>FIRM</div>
            </div>
          </div>

          {/* Agrimax */}
          <div className="flex items-center gap-2 px-4 py-3 border border-slate-600/50 bg-slate-800/30">
            <span className="text-slate-400 text-lg">❦</span>
            <span className="font-display text-xl tracking-wider text-slate-300">AGRIMAX</span>
          </div>

          {/* VS - Vintage Studio */}
          <div className="w-16 h-16 rounded-full border border-slate-500/50 flex items-center justify-center bg-slate-800/30">
            <div className="text-center">
              <div className="font-serif text-xl italic text-slate-300">VS</div>
              <div className="text-[7px] text-slate-500 uppercase tracking-wider">Est. 1998</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
