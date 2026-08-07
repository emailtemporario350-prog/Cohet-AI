import { FileCode2, FileStack, FolderOpen, Plus, Sparkles } from "lucide-react";
import { BrandButton } from "#/components/features/settings/brand-button";
import { settingsLikeMainScrollClassName } from "#/utils/settings-like-page-layout-classes";

const ARTIFACTS = [
  {
    title: "Launch brief",
    type: "Document",
    updated: "Edited today",
    accent: "from-[#fa7d4b] to-[#ffb38d]",
    icon: FileCode2,
  },
  {
    title: "Product workspace",
    type: "Project",
    updated: "Edited yesterday",
    accent: "from-[#7d8cff] to-[#a8b0ff]",
    icon: FolderOpen,
  },
  {
    title: "Interface concepts",
    type: "Collection",
    updated: "Edited 3 days ago",
    accent: "from-[#51c7a2] to-[#a6efcf]",
    icon: Sparkles,
  },
] as const;

const COPY = {
  eyebrow: "Your workspace",
  title: "Artifacts",
  description:
    "A calm home for the files, prototypes, and ideas you create with Cohet.",
  newArtifact: "New artifact",
  recent: "Recent artifacts",
  open: "Open artifact →",
  emptyTitle: "Build something useful",
  emptyDescription:
    "Ask Cohet to turn an idea into a polished artifact, then keep it here for your next session.",
} as const;

export default function ArtifactsPage() {
  return (
    <main
      className={settingsLikeMainScrollClassName}
      data-testid="artifacts-page"
    >
      <div className="mx-auto flex w-full max-w-[1040px] flex-col gap-8">
        <header className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] text-[var(--oh-muted)]">
              <FileStack className="size-4" strokeWidth={1.7} />
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
            testId="artifacts-new-button"
            startContent={<Plus className="size-4" />}
          >
            {COPY.newArtifact}
          </BrandButton>
        </header>

        <section className="grid gap-4 md:grid-cols-3" aria-label={COPY.recent}>
          {ARTIFACTS.map(({ title, type, updated, accent, icon: Icon }) => (
            <article
              key={title}
              className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.025] transition-colors hover:border-white/[0.14] hover:bg-white/[0.045]"
            >
              <div className={`h-28 bg-gradient-to-br ${accent} p-5`}>
                <div className="flex size-9 items-center justify-center rounded-xl bg-black/15 text-white backdrop-blur-sm">
                  <Icon className="size-5" strokeWidth={1.7} />
                </div>
              </div>
              <div className="space-y-3 p-4">
                <div>
                  <h2 className="font-medium text-white">{title}</h2>
                  <p className="mt-1 text-xs text-[var(--oh-muted)]">
                    {type} · {updated}
                  </p>
                </div>
                <button
                  type="button"
                  className="text-xs font-medium text-[var(--oh-text-tertiary)] transition-colors hover:text-white"
                >
                  {COPY.open}
                </button>
              </div>
            </article>
          ))}
        </section>

        <section className="flex min-h-48 flex-col items-center justify-center rounded-2xl border border-dashed border-white/[0.09] bg-white/[0.015] px-6 text-center">
          <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-white/[0.06] text-[var(--oh-muted)]">
            <Sparkles className="size-5" strokeWidth={1.5} />
          </div>
          <h2 className="text-sm font-medium text-white">{COPY.emptyTitle}</h2>
          <p className="mt-1 max-w-md text-xs leading-5 text-[var(--oh-muted)]">
            {COPY.emptyDescription}
          </p>
        </section>
      </div>
    </main>
  );
}
