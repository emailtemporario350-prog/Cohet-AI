import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Plus,
  Sparkles,
} from "lucide-react";
import { BrandButton } from "#/components/features/settings/brand-button";
import { settingsLikeMainScrollClassName } from "#/utils/settings-like-page-layout-classes";

const PLANS = [
  {
    title: "Website refresh",
    summary: "A focused plan for the next product iteration.",
    progress: "3 of 5 steps complete",
    percentage: 60,
  },
  {
    title: "Workspace setup",
    summary: "Prepare the project environment for a clean start.",
    progress: "1 of 4 steps complete",
    percentage: 25,
  },
] as const;

const COPY = {
  eyebrow: "Work in motion",
  title: "Plans",
  description:
    "Turn a conversation into a clear path forward, with every step visible when you need it.",
  newPlan: "New plan",
  active: "Active plans",
  continue: "Continue",
  emptyTitle: "Start with a conversation",
  emptyDescription:
    "Tell Cohet what you want to accomplish and it will help shape the work into an actionable plan.",
  note: "Plans stay close to the work",
} as const;

export default function PlansPage() {
  return (
    <main className={settingsLikeMainScrollClassName} data-testid="plans-page">
      <div className="mx-auto flex w-full max-w-[920px] flex-col gap-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--oh-muted)]">
              <ClipboardList className="size-4" strokeWidth={1.7} />
              {COPY.eyebrow}
            </div>
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-white">
              {COPY.title}
            </h1>
            <p className="max-w-xl text-sm leading-6 text-[var(--oh-text-tertiary)]">
              {COPY.description}
            </p>
          </div>
          <BrandButton
            type="button"
            variant="primary"
            testId="plans-new-button"
            startContent={<Plus className="size-4" />}
          >
            {COPY.newPlan}
          </BrandButton>
        </header>

        <section className="space-y-3" aria-label={COPY.active}>
          {PLANS.map(({ title, summary, progress, percentage }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5 transition-colors hover:border-white/[0.14] hover:bg-white/[0.045]"
            >
              <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-xl bg-[#fa7d4b]/10 text-[#fa9b75]">
                    <ClipboardList className="size-4" strokeWidth={1.7} />
                  </div>
                  <div>
                    <h2 className="font-medium text-white">{title}</h2>
                    <p className="mt-1 text-sm text-[var(--oh-muted)]">
                      {summary}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-xs font-medium text-[var(--oh-text-tertiary)] transition-colors hover:text-white"
                >
                  {COPY.continue} <ArrowRight className="size-3.5" />
                </button>
              </div>
              <div className="mt-5">
                <div className="mb-2 flex items-center justify-between text-xs text-[var(--oh-muted)]">
                  <span>{progress}</span>
                  <span>{percentage}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#fa7d4b] to-[#ffb38d]"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="rounded-2xl border border-white/[0.07] bg-gradient-to-br from-[#fa7d4b]/10 via-white/[0.025] to-transparent p-6">
          <div className="flex items-start gap-4">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#fa7d4b]/15 text-[#ffb18e]">
              <Sparkles className="size-5" strokeWidth={1.5} />
            </div>
            <div>
              <h2 className="font-medium text-white">{COPY.emptyTitle}</h2>
              <p className="mt-1 max-w-lg text-sm leading-6 text-[var(--oh-text-tertiary)]">
                {COPY.emptyDescription}
              </p>
              <div className="mt-4 flex items-center gap-2 text-xs text-[#ffb18e]">
                <CheckCircle2 className="size-4" strokeWidth={1.7} />
                {COPY.note}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
