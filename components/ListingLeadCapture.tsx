import LeadMagnetForm from "@/components/LeadMagnetForm"

type ListingLeadCaptureProps = {
  source: string
  className?: string
  idPrefix?: string
}

export default function ListingLeadCapture({
  source,
  className = "",
  idPrefix = "listing-lead",
}: ListingLeadCaptureProps) {
  return (
    <aside
      className={`rounded-lg border border-rage-500/30 bg-[#181818] p-4 sm:p-5 ${className}`}
      aria-label="Free first visit prep pack"
    >
      <p className="text-xs font-bold uppercase tracking-widest text-rage-500">
        Free prep pack
      </p>
      <h2 className="mt-1 text-base font-bold uppercase tracking-wide text-white">
        First rage room visit?
      </h2>
      <p className="mt-1 mb-4 text-sm text-zinc-400">
        Email for the 12-page PDF — what to wear, what to ask, and a final arrival
        checklist.
      </p>
      <LeadMagnetForm
        source={source}
        compact
        showInlinePreviewOnSuccess={false}
        idPrefix={idPrefix}
      />
    </aside>
  )
}
