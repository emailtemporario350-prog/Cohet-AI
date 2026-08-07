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
      <span
        className="text-5xl font-normal tracking-[-0.02em]"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        {brandName}
      </span>
    </div>
  );
}
