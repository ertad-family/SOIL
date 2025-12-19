"use client";

import {
  Users,
  Clock,
  Brain,
  DollarSign,
  Share2,
  UserPlus,
  Mail,
  Handshake,
  Lightbulb,
  Briefcase,
  MessageSquare,
  BarChart3,
  GraduationCap,
  Heart,
  TrendingUp,
  Award,
} from "lucide-react";

export interface ContributionOption {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  href: string;
  external?: boolean;
}

export interface TabData {
  label: string;
  icon: React.ReactNode;
  color: "gold" | "purple" | "emerald" | "orange";
  options: ContributionOption[];
}

export const tabsData: Record<string, TabData> = {
  social: {
    label: "Invest Social",
    icon: <Users className="w-4 h-4" />,
    color: "gold",
    options: [
      {
        icon: <Share2 className="w-6 h-6" />,
        title: "Spread the Word",
        description:
          "Share SOIL with your professional network. Help founders discover a community that understands.",
        cta: "Share on Social",
        href: "#share",
      },
      {
        icon: <UserPlus className="w-6 h-6" />,
        title: "Refer Talent & Support",
        description:
          "Know potential team members, advisors, researchers, or investors? Introduce them to SOIL.",
        cta: "Make Introduction",
        href: "/recommend",
      },
      {
        icon: <Mail className="w-6 h-6" />,
        title: "Join Our Community",
        description:
          "Subscribe to newsletter and follow us on social media to stay connected with updates.",
        cta: "Subscribe",
        href: "#newsletter",
      },
    ],
  },
  time: {
    label: "Invest Time",
    icon: <Clock className="w-4 h-4" />,
    color: "purple",
    options: [
      {
        icon: <Handshake className="w-6 h-6" />,
        title: "Volunteer",
        description:
          "Contribute your skills as a content reviewer, event organizer, translation helper, or community moderator.",
        cta: "View Opportunities",
        href: "/volunteer",
      },
      {
        icon: <Lightbulb className="w-6 h-6" />,
        title: "Help Solve Challenges",
        description:
          "We have business and technical challenges we need help with. Browse open problems and propose solutions.",
        cta: "View Challenges",
        href: "/challenges",
      },
      {
        icon: <Briefcase className="w-6 h-6" />,
        title: "Join Our Team",
        description:
          "Explore full-time and part-time positions. We're building something meaningful together.",
        cta: "See Openings",
        href: "/careers",
      },
    ],
  },
  knowledge: {
    label: "Invest Knowledge",
    icon: <Brain className="w-4 h-4" />,
    color: "emerald",
    options: [
      {
        icon: <MessageSquare className="w-6 h-6" />,
        title: "Give Feedback",
        description:
          "Share thoughts on platform, UX, content. Your perspective shapes our development priorities.",
        cta: "Provide Feedback",
        href: "/feedback",
      },
      {
        icon: <BarChart3 className="w-6 h-6" />,
        title: "Help with Analysis",
        description:
          "Know competitors, similar projects, or adjacent research? Help us understand the landscape.",
        cta: "Contribute Insights",
        href: "/analysis",
      },
      {
        icon: <GraduationCap className="w-6 h-6" />,
        title: "Become Advisor/Mentor",
        description:
          "Share your expertise in entrepreneurship, research methodology, community building, or technology.",
        cta: "Apply",
        href: "/advisors",
      },
    ],
  },
  money: {
    label: "Invest Money",
    icon: <DollarSign className="w-4 h-4" />,
    color: "orange",
    options: [
      {
        icon: <Heart className="w-6 h-6" />,
        title: "Donate",
        description:
          "Support platform development with one-time or recurring donation via Patreon or direct transfer.",
        cta: "Donate on Patreon",
        href: "https://patreon.com/soil",
        external: true,
      },
      {
        icon: <TrendingUp className="w-6 h-6" />,
        title: "Become an Investor",
        description:
          "SOIL is seeking strategic investors who believe in preserving organizational knowledge. Get our pitch deck.",
        cta: "Request Pitch Deck",
        href: "/investors",
      },
      {
        icon: <Award className="w-6 h-6" />,
        title: "Sponsor Features",
        description:
          "Sponsor specific features, research projects, or regional cenotapheries. Your name immortalized in the platform.",
        cta: "Learn More",
        href: "/sponsors",
      },
    ],
  },
};

export const colorClasses = {
  gold: {
    iconBg: "bg-gold-500/20",
    iconText: "text-gold-400",
  },
  purple: {
    iconBg: "bg-purple-500/20",
    iconText: "text-purple-400",
  },
  emerald: {
    iconBg: "bg-emerald-500/20",
    iconText: "text-emerald-400",
  },
  orange: {
    iconBg: "bg-orange-500/20",
    iconText: "text-orange-400",
  },
};
