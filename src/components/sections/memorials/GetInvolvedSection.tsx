"use client";

import { Shield, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { SectionLabel } from "@/components/ui/section-label";

const audiences = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "For Future Keepers",
    description:
      "Become a guardian of your regional cenotaphery. Curate stories, verify accounts, and build a local community that preserves organizational wisdom.",
    cta: "Apply to Be a Keeper",
    href: "/community#keepers",
    buttonVariant: "dark-primary" as const,
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "For Community Builders",
    description:
      "Organize local events, host Day of the Dead Venture celebrations, and connect founders in your region who can learn from each other.",
    cta: "Join the Community",
    href: "/community",
    buttonVariant: "marble" as const,
  },
  {
    icon: <MapPin className="w-8 h-8" />,
    title: "For Regional Leaders",
    description:
      "Help us expand to new regions. Pioneer a cenotaphery where none exists yet and become the founding Keeper of your local chapter.",
    cta: "Start a Chapter",
    href: "/community#keepers",
    buttonVariant: "dark-primary" as const,
  },
];

export function GetInvolvedSection() {
  return (
    <section className="py-16 md:py-24 pb-32 animate-fade-in-up relative overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-content mx-auto px-6">
        <SectionLabel>get involved</SectionLabel>
        <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-12 text-marble-100">
          Shape the Memorial Landscape
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          {audiences.map((audience, index) => (
            <Card key={index} variant="dark-elevated" className="h-full flex flex-col">
              <CardHeader>
                <div className="w-14 h-14 rounded-full bg-gold-500/20 flex items-center justify-center text-gold-400 mb-4">
                  {audience.icon}
                </div>
                <CardTitle variant="dark">{audience.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <p className="text-slate-400 leading-relaxed flex-1">{audience.description}</p>
                <div className="mt-6">
                  <a href={audience.href}>
                    <Button variant={audience.buttonVariant} size="lg" className="w-full">
                      {audience.cta}
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
