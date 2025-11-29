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
        <h2 id={id} className="text-2xl font-bold text-white mb-6">
          {title}
        </h2>
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={index}>
              <h3 className="text-lg font-semibold text-white mb-2">
                {item.question}
              </h3>
              <p className="text-zinc-300">
                {item.answer}
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}



