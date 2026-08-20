interface FAQItem {
  question: string
  answer: string
}

interface FAQProps {
  items: FAQItem[]
  title?: string
  id?: string
}

export default function FAQ({ items, title = "Frequently Asked Questions", id = "faq-heading" }: FAQProps) {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <section aria-labelledby={id} className="mt-12">
        <h2 id={id} className="mb-6 text-2xl font-bold text-white">
          {title}
        </h2>
        <div className="space-y-3">
          {items.map((item, index) => (
            <details
              key={index}
              className="group rounded-lg border border-zinc-800 bg-[#181818] px-4"
            >
              <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-3 py-3 text-base font-semibold text-white sm:text-lg [&::-webkit-details-marker]:hidden">
                <span className="min-w-0 pr-2">{item.question}</span>
                <svg
                  className="h-4 w-4 shrink-0 text-rage-500 transition-transform group-open:rotate-180"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.17l3.71-3.94a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </summary>
              <p className="pb-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </>
  )
}
