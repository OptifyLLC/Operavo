"use client";

import { useState } from "react";

type Billing = "monthly" | "annual";

type Tier = {
  name: string;
  badge?: string;
  subtitle: string;
  monthlyPrice: string;
  annualPrice: string;
  monthlySuffix?: string;
  annualSuffix?: string;
  monthlyNote?: string;
  annualNote?: string;
  usage?: { minutes: string; overage: string };
  features: string[];
  cta: string;
  ctaHref: string;
  featured?: boolean;
};

const tiers: Tier[] = [
  {
    name: "Launch",
    subtitle: "Perfect for solo agents and small teams getting started.",
    monthlyPrice: "$449",
    annualPrice: "$4,590",
    monthlySuffix: "/mo",
    annualSuffix: "/year",
    annualNote: "Save 15%, equivalent to ~$382/mo",
    usage: { minutes: "200 minutes included", overage: "$0.55 / min overage" },
    features: [
      "AI Receptionist 24/7",
      "Multi-User Dashboard (up to 3 users)",
      "Appointment Booking",
      "SMS Confirmations",
      "Call Summaries & Logs",
      "Basic Lead Qualification",
      "Core Business Knowledge Setup",
      "Basic CRM Logging",
      "Dedicated Business Number",
      "Email Support",
      "Guided Self-Serve Setup",
    ],
    cta: "Start Now",
    ctaHref: "https://calendly.com/admin-optifyllc/30min",
  },
  {
    name: "Professional",
    badge: "Most Popular",
    subtitle: "Best for growing brokerages and active teams.",
    monthlyPrice: "$1,299",
    annualPrice: "$13,250",
    monthlySuffix: "/mo",
    annualSuffix: "/year",
    annualNote: "Save 15%, equivalent to ~$1,104/mo",
    usage: { minutes: "1,000 minutes included", overage: "$0.35 / min overage" },
    features: [
      "Everything in Launch",
      "AI Workflow Automation",
      "Advanced Lead Qualification Workflows",
      "Unlimited Knowledge Base",
      "Brand Voice Tuning",
      "Advanced CRM Integrations",
      "Team Inbox Integrations",
      "Unlimited Team Users",
      "Monthly AI Optimization Review",
      "Priority Support",
      "White-Glove Onboarding",
    ],
    cta: "Get Started",
    ctaHref: "https://calendly.com/admin-optifyllc/30min",
    featured: true,
  },
  {
    name: "Enterprise",
    subtitle: "Built for multi-office and high-volume operations.",
    monthlyPrice: "Custom",
    annualPrice: "Custom",
    annualNote: "Contact Sales",
    usage: { minutes: "Custom minutes included", overage: "Volume-based overage pricing" },
    features: [
      "Everything in Professional",
      "Multi-Location Deployment",
      "Custom Workflow Automation",
      "Custom Integrations & APIs",
      "Custom Voice Persona",
      "Dedicated Infrastructure",
      "SLA & Uptime Guarantee",
      "Dedicated Success Manager",
      "Compliance & Governance Support",
      "Advanced Reporting & Analytics",
      "Volume-Based Pricing",
    ],
    cta: "Talk to Sales",
    ctaHref: "https://calendly.com/admin-optifyllc/30min",
  },
];

const roiStats = [
  "Faster lead response",
  "More booked appointments",
  "Reduced admin workload",
  "Better after-hours coverage",
];

const trustItems = [
  "24/7 AI Lead Coverage",
  "<2s Average Response Time",
  "Enterprise-Grade Security",
  "CRM-Ready Integrations",
  "Automated Booking",
];

export function Pricing() {
  const [billing, setBilling] = useState<Billing>("monthly");

  return (
    <section
      id="pricing"
      className="relative mx-auto w-full max-w-6xl px-4 py-28 sm:px-6 md:py-36 scroll-mt-24"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[10%] -z-10 h-[500px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,rgba(16,185,129,0.06),transparent_80%)] mix-blend-screen"
      />

      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div className="max-w-xl">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-emerald-400/60" />
            <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
              Pricing
            </p>
          </div>
          <h2 className="mt-5 text-balance text-3xl font-medium leading-[1.15] -tracking-[0.02em] text-white sm:text-4xl md:text-[44px]">
            Never miss another lead.{" "}
            <span className="font-accent italic font-normal text-zinc-400">
              Capture every call, 24/7.
            </span>
          </h2>
        </div>
        <p className="max-w-md text-[15px] leading-[1.6] font-light text-zinc-400 md:pb-2 md:text-right">
          Brokerages lose revenue when calls go unanswered or leads wait too
          long. Our AI receptionist answers instantly, books appointments,
          qualifies leads, and follows up automatically.
        </p>
      </div>

      <ul className="mt-12 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-white/8 py-6 md:grid-cols-4">
        {roiStats.map((stat) => (
          <li
            key={stat}
            className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-300"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80" />
            {stat}
          </li>
        ))}
      </ul>

      <div className="mt-14 flex justify-center">
        <BillingToggle billing={billing} onChange={setBilling} />
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-7">
        {tiers.map((tier) => (
          <TierCard key={tier.name} tier={tier} billing={billing} />
        ))}
      </div>

      <div className="mt-20">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-emerald-400/60" />
          <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-zinc-300">
            Built for modern brokerages
          </p>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-x-8 gap-y-4 border-y border-white/8 py-6 md:grid-cols-5">
          {trustItems.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2.5 text-[13px] font-medium text-zinc-300"
            >
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400/80" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-12 space-y-1.5 text-center text-[12.5px] leading-[1.6] text-zinc-500">
        <p>Minutes are billed only during live connected conversations.</p>
        <p>Annual plans include discounted pricing and onboarding incentives.</p>
        <p>Additional integrations and deployment services available upon request.</p>
      </div>
    </section>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 p-1">
      <button
        type="button"
        onClick={() => onChange("monthly")}
        className={
          "rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-300 " +
          (billing === "monthly"
            ? "bg-white text-black shadow-[0_0_24px_-8px_rgba(255,255,255,0.4)]"
            : "text-zinc-400 hover:text-white")
        }
      >
        Monthly
      </button>
      <button
        type="button"
        onClick={() => onChange("annual")}
        className={
          "inline-flex items-center gap-2 rounded-full px-5 py-2 text-[13px] font-medium transition-all duration-300 " +
          (billing === "annual"
            ? "bg-white text-black shadow-[0_0_24px_-8px_rgba(255,255,255,0.4)]"
            : "text-zinc-400 hover:text-white")
        }
      >
        Annual
        <span
          className={
            "rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.1em] " +
            (billing === "annual"
              ? "bg-emerald-500/20 text-emerald-700"
              : "bg-emerald-500/15 text-emerald-300")
          }
        >
          Save 15%
        </span>
      </button>
    </div>
  );
}

function TierCard({ tier, billing }: { tier: Tier; billing: Billing }) {
  const price = billing === "monthly" ? tier.monthlyPrice : tier.annualPrice;
  const suffix =
    billing === "monthly" ? tier.monthlySuffix : tier.annualSuffix;
  const note = billing === "monthly" ? tier.monthlyNote : tier.annualNote;

  return (
    <div
      className={
        "group relative flex flex-col overflow-hidden rounded-3xl border p-8 transition-all duration-500 ease-out hover:-translate-y-2 " +
        (tier.featured
          ? "border-emerald-500/40 bg-linear-to-br from-emerald-950/50 via-zinc-950/60 to-black shadow-[0_0_80px_-20px_rgba(16,185,129,0.5)] hover:shadow-[0_0_100px_-15px_rgba(16,185,129,0.65)]"
          : "border-white/8 bg-linear-to-br from-emerald-950/10 via-zinc-950/50 to-black hover:border-white/20 hover:shadow-[0_0_40px_-15px_rgba(255,255,255,0.15)]")
      }
    >
      {tier.featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.2),transparent_60%)]"
        />
      )}

      <div className="relative z-10 flex items-center justify-between">
        <h3 className="text-lg font-medium -tracking-[0.01em] text-white">
          {tier.name}
        </h3>
        {tier.badge && (
          <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-emerald-300 ring-1 ring-inset ring-emerald-500/30">
            {tier.badge}
          </span>
        )}
      </div>

      <p className="relative z-10 mt-2 text-[13.5px] leading-[1.55] font-light text-zinc-400">
        {tier.subtitle}
      </p>

      <div className="relative z-10 mt-6 flex items-baseline gap-1.5">
        <span className="text-5xl font-semibold -tracking-[0.03em] text-white">
          {price}
        </span>
        {suffix && (
          <span className="text-[15px] font-light text-zinc-400">{suffix}</span>
        )}
      </div>
      {note && (
        <p className="relative z-10 mt-2 text-[12px] leading-[1.5] text-emerald-300/80">
          {note}
        </p>
      )}

      {tier.usage && (
        <div className="relative z-10 mt-6 rounded-xl border border-white/8 bg-white/2 p-4">
          <div className="flex items-center gap-2">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-emerald-400"
              aria-hidden
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <p className="text-[13px] font-medium text-white">
              {tier.usage.minutes}
            </p>
          </div>
          <p className="mt-1.5 pl-6 text-[12px] text-zinc-500">
            {tier.usage.overage}
          </p>
        </div>
      )}

      <ul className="relative z-10 mt-6 space-y-2.5 border-t border-white/5 pt-6">
        {tier.features.map((f) => (
          <li
            key={f}
            className="flex items-start gap-3 text-[13.5px] leading-[1.5] text-zinc-300"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0 text-emerald-400"
              aria-hidden
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <a
        href={tier.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={
          "relative z-10 mt-8 inline-flex h-12 items-center justify-center rounded-full text-[14px] font-medium transition-all duration-300 ease-out hover:scale-[1.02] " +
          (tier.featured
            ? "bg-white text-black shadow-[0_0_30px_-8px_rgba(255,255,255,0.4)] hover:bg-zinc-100 hover:shadow-[0_0_45px_-10px_rgba(255,255,255,0.6)]"
            : "border border-white/10 bg-white/3 text-white hover:border-white/20 hover:bg-white/6")
        }
      >
        {tier.cta}
      </a>
    </div>
  );
}
