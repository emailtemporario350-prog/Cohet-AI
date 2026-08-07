const brandName = "Cohet";
const brandLogoAlt = "Cohet logo";

export function HomeHeaderTitle() {
  return (
    <div
      className="flex items-center justify-center gap-4 py-2 text-[#f2f2f2]"
      aria-label={brandName}
    >
      <img
        src="/cohet-logo.png"
        alt={brandLogoAlt}
        className="size-14 object-contain"
      />
      <span className="text-5xl font-semibold tracking-[-0.04em]">
        {brandName}
      </span>
    </div>
  );
}
