import Image from "next/image";
import { SectionLabel } from "@/components/ui/section-label";

export function CenotaphExplainerSection() {
  // TODO: Later fetch dynamically based on most respects
  const featuredCenotaph = {
    imageUrl:
      "https://xjyejwasivospoajqsrg.supabase.co/storage/v1/object/public/cenotaph-designs/1082dd0c-9578-4506-bf1f-e9bb01ec9f24/design_1082dd0c-9578-4506-bf1f-e9bb01ec9f24_1766116555264_0.png",
    epitaph: "Those who do not shepherd their sheep will not find any one day",
  };

  return (
    <section className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Cenotaph Image */}
          <div className="relative">
            <div className="relative aspect-square max-w-[500px] mx-auto lg:mx-0">
              <Image
                src={featuredCenotaph.imageUrl}
                alt="A cenotaph memorial"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>
            {/* Epitaph caption */}
            <p className="mt-6 text-center lg:text-left text-marble-300 italic text-lg">
              &ldquo;{featuredCenotaph.epitaph}&rdquo;
            </p>
          </div>

          {/* Right: Explanation */}
          <div>
            <SectionLabel>the memorial</SectionLabel>
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-medium mt-4 mb-8 text-marble-100">
              A Cenotaph for Every Venture
            </h2>

            <p className="text-marble-100 text-lg leading-relaxed mb-6">
              Every organization on SOIL gets a cenotaph erected in its honor. A cenotaph — from
              Greek meaning &ldquo;empty tomb&rdquo; — is a monument for someone whose remains are
              elsewhere.
            </p>

            <p className="text-slate-400 text-lg leading-relaxed">
              Here, your cenotaph becomes the permanent digital memorial for your venture: a place
              where its story, lessons, and legacy are preserved forever. Together, all cenotaphs
              form the Cenotaphery — a collective memorial garden honoring organizations that shaped
              their founders and taught the world.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
