"use client";

import { SectionLabel } from "@/components/ui/section-label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Landmark, FlaskConical, Shield, Wrench } from "lucide-react";

const roles = [
  {
    id: "founders",
    icon: <Landmark className="w-7 h-7" />,
    title: "Founders",
    description:
      "Share your story, preserve your legacy, and help others learn from your experience.",
    color: "gold",
  },
  {
    id: "researchers",
    icon: <FlaskConical className="w-7 h-7" />,
    title: "Researchers",
    description:
      "Access unique datasets, collaborate on publications, and advance organizational science.",
    color: "purple",
  },
  {
    id: "keepers",
    icon: <Shield className="w-7 h-7" />,
    title: "Keepers",
    description: "Lead regional communities, organize events, and build the local ecosystem.",
    color: "green",
  },
  {
    id: "contributors",
    icon: <Wrench className="w-7 h-7" />,
    title: "Contributors",
    description:
      "Develop the platform, design interfaces, translate content, or support the community.",
    color: "terra",
  },
];

const colorClasses = {
  gold: {
    bg: "bg-gold-500/20",
    text: "text-gold-400",
    border: "group-hover:border-gold-500/50",
  },
  purple: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    border: "group-hover:border-purple-500/50",
  },
  green: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    border: "group-hover:border-emerald-500/50",
  },
  terra: {
    bg: "bg-orange-500/20",
    text: "text-orange-400",
    border: "group-hover:border-orange-500/50",
  },
};

export function CommunityOverviewSection() {
  return (
    <section id="roles" className="py-16 md:py-24 animate-fade-in-up">
      <div className="max-w-content mx-auto px-6">
        <div className="text-center mb-12">
          <SectionLabel>community roles</SectionLabel>
          <h2 className="font-display text-3xl md:text-4xl font-medium mt-4 mb-6 text-marble-100">
            Find Your Place in the Ecosystem
          </h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto">
            SOIL is built by a diverse community of founders, researchers, regional leaders, and
            contributors. Each role brings unique value to our mission of preserving organizational
            wisdom.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => {
            const colors = colorClasses[role.color as keyof typeof colorClasses];
            return (
              <a key={role.id} href={`#${role.id}`} className="group block">
                <Card
                  variant="dark"
                  padding="lg"
                  className={`h-full transition-all duration-300 hover:-translate-y-1 ${colors.border}`}
                >
                  <CardHeader>
                    <div
                      className={`w-14 h-14 rounded-full ${colors.bg} flex items-center justify-center ${colors.text} mb-2 transition-transform group-hover:scale-110`}
                    >
                      {role.icon}
                    </div>
                    <CardTitle
                      variant="dark"
                      className="group-hover:text-gold-400 transition-colors"
                    >
                      {role.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400 text-sm leading-relaxed">{role.description}</p>
                  </CardContent>
                </Card>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
