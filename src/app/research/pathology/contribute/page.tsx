import { Metadata } from "next";
import { ContributeForm } from "./contribute-form";

export const metadata: Metadata = {
  title: "Contribute | SOIL Pathology Classification",
  description:
    "Propose new organizational pathologies or suggest improvements to the SOIL Pathology Classification. Your contributions help build the definitive taxonomy of organizational diseases.",
};

export default function ContributePage() {
  return (
    <main className="min-h-screen bg-slate-900 pt-20">
      <ContributeForm />
    </main>
  );
}
