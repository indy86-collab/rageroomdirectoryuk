import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import DigitalDownloadCTA from "@/components/DigitalDownloadCTA"
import GuideMeta from "@/components/GuideMeta"
import FAQ from "@/components/FAQ"
import Link from "next/link"
import { buildArticleSchema, buildBreadcrumbSchema, buildOgImageUrl } from "@/lib/seo-schema"

const GUIDE_PATH = "/guides/are-rage-rooms-safe-uk"
const OG_IMAGE = buildOgImageUrl({
  title: "Are Rage Rooms Safe in the UK?",
  subtitle: "PPE · Age limits · Insurance · Injury risks",
  badge: "Guide",
})

export const metadata: Metadata = {
  title: "Are Rage Rooms Safe in the UK? Safety Guide (2026)",
  description:
    "Independent safety guide to UK rage rooms: PPE, age limits, medical restrictions, insurance, common injuries and how to pick a safe venue. Updated 2026.",
  alternates: { canonical: GUIDE_PATH },
  openGraph: {
    title: "Are Rage Rooms Safe in the UK? Complete Safety Guide",
    description: "Everything you need to know about rage room safety, equipment, and UK regulations.",
    type: "article",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "Are rage rooms safe in the UK" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Are Rage Rooms Safe in the UK?",
    description: "Complete UK safety guide for rage rooms.",
    images: [OG_IMAGE],
  },
}

export const revalidate = 86400

const FAQS = [
  {
    question: "Are rage rooms safe in the UK?",
    answer:
      "Yes, when run by a reputable venue. UK rage rooms require full PPE — coveralls, full-face visor helmet, heavy-duty gloves and closed-toe boots — and staff conduct a safety briefing before every session. Serious injuries are extremely rare; minor cuts or bruises from not wearing equipment correctly are the most common issues.",
  },
  {
    question: "What PPE do you get at a UK rage room?",
    answer:
      "Standard PPE at UK venues includes a full-body Tyvek-style coverall, a full-face visor helmet (not just safety glasses), heavy-duty leather or cut-resistant gloves, and steel-toed boots or sturdy footwear. Some venues also provide ear protection. All PPE is mandatory and fitted by staff before you enter the smash room.",
  },
  {
    question: "What age do you have to be for a rage room in the UK?",
    answer:
      "The standard age limit at UK rage rooms is 18+. A small number of venues run dedicated 14–17 youth sessions with lighter tools, extra supervision, and mandatory parental consent forms. Under-14 participation is extremely rare and only offered at select venues with a parent present throughout. Always confirm age policy before booking.",
  },
  {
    question: "Can you go to a rage room if you are pregnant?",
    answer:
      "No. Pregnancy is a standard exclusion at all reputable UK rage rooms due to the physical exertion, vibration from impacts, risk of flying debris, and noise levels involved. Venues will ask about this on their waiver and will decline entry.",
  },
  {
    question: "Do UK rage rooms have insurance?",
    answer:
      "Yes — reputable venues carry a minimum of £5 million public liability insurance and require every participant to sign a waiver before entry. If a venue cannot confirm their insurance level, treat that as a red flag.",
  },
  {
    question: "Can you get seriously hurt at a rage room?",
    answer:
      "Serious injuries are extremely rare when PPE is worn and staff instructions are followed. The controlled environment, mandatory protective gear, and pre-session safety briefing eliminate most risk. The most common minor incidents are small cuts or bruises, usually linked to improperly worn gloves or a loose visor.",
  },
  {
    question: "What medical conditions mean you shouldn't do a rage room?",
    answer:
      "Standard UK exclusions include pregnancy, heart conditions, recent surgery (especially back, joint or abdominal), being under the influence of alcohol or drugs, severe asthma triggered by dust, and recent serious injuries. If in doubt, check with both your GP and the venue before booking.",
  },
]

export default function AreRageRoomsSafeUKPage() {
  const articleSchema = buildArticleSchema({
    url: GUIDE_PATH,
    headline: "Are Rage Rooms Safe in the UK? Complete Safety Guide",
    description:
      "Complete safety guide to UK rage rooms: PPE, age limits, medical exclusions, insurance and how to identify a reputable venue.",
    datePublished: "2025-01-01",
    keywords: [
      "are rage rooms safe",
      "rage room safety UK",
      "rage room PPE",
      "rage room age limit",
      "rage room insurance",
    ],
  })

  const breadcrumbSchema = buildBreadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Guides", url: "/guides" },
    { name: "Are Rage Rooms Safe?", url: GUIDE_PATH },
  ])

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `https://www.rageroomdirectory.co.uk${GUIDE_PATH}#faq`,
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  }

  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />

        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "Are Rage Rooms Safe in the UK?" },
          ]}
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          Are Rage Rooms Safe in the UK? Complete Safety Guide
        </h1>

        <GuideMeta
          updated="August 2026"
          readingTimeMinutes={11}
          keyTakeaways={[
            "UK rage rooms are low-risk when PPE (coveralls, full-face visor helmet, gloves, boots) is worn and staff instructions are followed.",
            "Most venues require participants to be 18+; some accept 14–17 with parental consent for dedicated youth sessions.",
            "Pregnancy, heart conditions, recent surgery, and being under the influence are standard exclusions across UK venues.",
            "Reputable venues carry at least £5 million public liability insurance and require a signed waiver before entry.",
            "The most common injuries are minor: small cuts, bruises and muscle strain — serious injuries are rare and almost always linked to not wearing PPE.",
          ]}
        />

        <div className="space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-xl text-white font-semibold">
            Yes — UK rage rooms are safe when run by a reputable venue. Full PPE (coveralls, full-face visor helmet, gloves and boots), a mandatory safety briefing, signed waivers and at least £5 million public liability insurance are standard at verified venues. Serious injuries are extremely rare when equipment is worn correctly.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              What We Check When Verifying a Venue
            </h2>
            <p>
              RageRoom Directory only marks a listing as verified after we review the operator&apos;s published safety and booking details. For each verified venue we look for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>A clear age policy and participant exclusions (pregnancy, intoxication, recent surgery)</li>
              <li>Mandatory PPE listed before booking — not optional add-ons</li>
              <li>Evidence of public liability insurance (we treat £5m+ as the expected floor)</li>
              <li>A waiver or terms page participants must accept before the session</li>
              <li>A working booking URL, current starting price where published, and a contact channel</li>
            </ul>
            <p className="mt-4">
              If a venue cannot confirm insurance, skips the safety briefing, or treats PPE as optional, we do not treat it as a safe choice — and we will not mark it verified. Browse{" "}
              <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">
                verified UK listings
              </Link>{" "}
              or open the{" "}
              <Link href="/near-me" className="text-orange-500 hover:text-orange-600 underline">
                near-me map
              </Link>{" "}
              to compare options near you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Safety Equipment Provided
            </h2>
            <p>
              Reputable rage rooms in the UK provide comprehensive safety equipment to protect participants. This typically includes:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Full-body coveralls:</strong> Durable protective suits that cover your entire body, preventing glass shards or debris from coming into contact with your skin or clothing.</li>
              <li><strong>Full-face visor helmet:</strong> Impact-resistant head and face protection. Quality venues issue a full-face visor helmet rather than open safety glasses alone — goggles without a face shield leave the face and neck exposed to flying debris.</li>
              <li><strong>Heavy-duty gloves:</strong> Leather or cut-resistant gloves that protect your hands from sharp edges, provide grip, and prevent cuts from broken glass or metal.</li>
              <li><strong>Protective footwear:</strong> Steel-toed boots or sturdy closed-toe shoes with good grip. Many venues supply boots; if they do not, closed-toe shoes are still mandatory.</li>
              <li><strong>Ear protection (optional but common):</strong> Some venues add ear defenders for louder smash packages.</li>
            </ul>
            <p className="mt-4">
              All core safety equipment is mandatory and must be worn throughout your session. Staff should fit PPE before you enter the rage room.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              UK Regulations and Standards
            </h2>
            <p>
              While there isn't a specific UK-wide licensing system for rage rooms, reputable venues operate under general health and safety regulations. The Health and Safety Executive (HSE) guidelines apply, and venues must:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Conduct risk assessments for all activities</li>
              <li>Provide adequate safety equipment and training</li>
              <li>Maintain safe premises free from unnecessary hazards</li>
              <li>Have appropriate insurance coverage</li>
              <li>Follow fire safety regulations</li>
              <li>Ensure staff are trained in first aid</li>
            </ul>
            <p className="mt-4">
              Many rage room operators also voluntarily follow industry best practices, including regular safety audits, equipment inspections, and staff training programs. When choosing a venue, look for those that clearly communicate their safety procedures and have positive reviews mentioning safety standards.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Common Safety Misconceptions
            </h2>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">"Rage rooms are dangerous and unregulated"</h3>
                <p>
                  While rage rooms are a relatively new concept in the UK, reputable venues take safety seriously. They're not unregulated—they must comply with workplace health and safety laws, public liability insurance requirements, and local authority regulations. The key is choosing a well-established venue with proper safety protocols.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">"You can get seriously injured"</h3>
                <p>
                  When proper safety equipment is worn and guidelines are followed, serious injuries are extremely rare. The most common issues are minor cuts (if equipment isn't worn properly) or muscle strain from overexertion. The controlled environment, protective gear, and staff supervision significantly minimize risks.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">"Anyone can participate regardless of age or health"</h3>
                <p>
                  Most UK rage rooms require participants to be 18+. A minority run supervised 14–17 youth sessions with parental consent and lighter tools. Under-14 participation is rare. Venues also exclude pregnancy, intoxication and several medical conditions — always confirm before booking.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">"The items you smash are dangerous"</h3>
                <p>
                  Venues carefully select breakable items that are safe to smash. Glass bottles are typically empty and cleaned, electronics are non-functional and safe, and ceramics are chosen to minimize sharp fragments. All items are inspected before use, and venues avoid items that could create dangerous shards or contain hazardous materials.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              What Makes a Rage Room Safe?
            </h2>
            <p>
              Several factors contribute to a safe rage room experience:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Controlled environment:</strong> Rage rooms are enclosed spaces designed specifically for smashing activities, with walls and floors that can withstand impacts and contain debris.</li>
              <li><strong>Staff supervision:</strong> Trained staff monitor sessions, provide safety briefings, and are available to assist if needed. They ensure rules are followed and can quickly respond to any issues.</li>
              <li><strong>Proper ventilation:</strong> Good air circulation prevents dust buildup and ensures a comfortable environment.</li>
              <li><strong>Clean, organized space:</strong> Well-maintained venues keep their rage rooms clean, remove debris between sessions, and ensure tools and items are in good condition.</li>
              <li><strong>Clear safety rules:</strong> Before your session, you'll receive a comprehensive safety briefing covering proper tool usage, safe smashing techniques, and what to do in case of emergency.</li>
              <li><strong>Appropriate tools:</strong> Venues provide tools designed for smashing that are safe to use when handled correctly. Staff will show you proper techniques.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Age Requirements and Restrictions
            </h2>
            <p>
              The standard age limit at UK rage rooms is 18+. A small number of venues run dedicated 14–17 youth sessions with lighter tools, extra supervision and mandatory parental consent. Under-14 participation is extremely rare and only offered at select venues with a parent present throughout. Always confirm the venue&apos;s age policy on the listing or booking page before you pay a deposit.
            </p>
            <p className="mt-4">
              Some venues also have maximum group sizes to ensure adequate supervision and safety. Corporate groups or large parties may need to book multiple sessions or split into smaller groups.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Health Considerations
            </h2>
            <p>
              Rage room activities involve physical exertion, so consider your health before participating:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>You should be in reasonable physical condition to handle tools and perform smashing activities</li>
              <li>If you have back problems, joint issues, or recent injuries, consult with the venue and your doctor</li>
              <li>Pregnant individuals are typically advised not to participate</li>
              <li>Those with heart conditions or other serious medical issues should seek medical advice first</li>
              <li>If you have respiratory issues, check that the venue has good ventilation</li>
            </ul>
            <p className="mt-4">
              When in doubt, contact the venue directly to discuss any health concerns. Reputable venues will be happy to advise on whether the activity is suitable for you.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              How to Choose a Safe Rage Room
            </h2>
            <p>
              When selecting a rage room venue in the UK, look for:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Clear safety information on their website or when booking</li>
              <li>Positive reviews mentioning safety and professionalism</li>
              <li>Proper insurance coverage (venues should have public liability insurance)</li>
              <li>Well-maintained facilities and equipment</li>
              <li>Responsive customer service that answers safety questions</li>
              <li>Established venues with a track record of safe operation</li>
            </ul>
            <p className="mt-4">
              Browse our directory of <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">verified rage rooms across the UK</Link> to find reputable venues. You can also check <Link href="/city/london" className="text-orange-500 hover:text-orange-600 underline">rage rooms in London</Link>, <Link href="/city/birmingham" className="text-orange-500 hover:text-orange-600 underline">Birmingham</Link>, <Link href="/city/manchester" className="text-orange-500 hover:text-orange-600 underline">Manchester</Link>, and other cities to compare safety standards and read reviews.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              What to Do If You Have Concerns
            </h2>
            <p>
              If you have any safety concerns before, during, or after your session:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Ask questions during the safety briefing—staff are there to help</li>
              <li>If something doesn't feel right during your session, stop and alert staff immediately</li>
              <li>Report any safety issues to venue management</li>
              <li>If you experience an injury, seek medical attention and report it to the venue</li>
              <li>Check that the venue has proper insurance and incident reporting procedures</li>
            </ul>
          </section>

          <div className="my-8">
            <DigitalDownloadCTA variant="firstVisit" />
          </div>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Conclusion
            </h2>
            <p>
              Rage rooms in the UK are generally safe when you choose a reputable venue, follow safety guidelines, and wear all provided protective equipment. The controlled environment, comprehensive safety gear, and staff supervision work together to minimize risks. Like any physical activity, there are inherent risks, but these are significantly reduced through proper protocols and equipment.
            </p>
            <p className="mt-4">
              The key to a safe experience is choosing an established venue with good reviews, following all safety instructions, and being honest about any health concerns. With these precautions, rage rooms offer a unique and relatively safe way to release stress and have fun.
            </p>
            <p className="mt-4">
              Ready to try a rage room? <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">Browse our directory</Link> to find safe, verified rage rooms near you, or check out our guide on <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-600 underline">rage room prices in the UK</Link> to plan your visit.
            </p>
          </section>
        </div>

        <FAQ items={FAQS.map((f) => ({ question: f.question, answer: f.answer }))} title="Safety FAQs" />

        <section aria-labelledby="related-safety-heading" className="mt-10 mb-4">
          <h2 id="related-safety-heading" className="text-2xl font-bold text-white mb-4">
            Related guides
          </h2>
          <ul className="space-y-2 text-zinc-300">
            <li>
              <Link href="/guides/what-happens-in-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                What happens in a rage room? Step-by-step guide
              </Link>
            </li>
            <li>
              <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-400 underline">
                How much do rage rooms cost in the UK?
              </Link>
            </li>
            <li>
              <Link href="/guides/what-to-wear-to-a-rage-room" className="text-orange-500 hover:text-orange-400 underline">
                What to wear to a rage room
              </Link>
            </li>
            <li>
              <Link href="/guides/rage-rooms-for-stress-relief" className="text-orange-500 hover:text-orange-400 underline">
                Do rage rooms actually relieve stress?
              </Link>
            </li>
            <li>
              <Link href="/near-me" className="text-orange-500 hover:text-orange-400 underline">
                Find a rage room near me
              </Link>
            </li>
            <li>
              <Link href="/listings" className="text-orange-500 hover:text-orange-400 underline">
                Browse UK rage rooms
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </div>
  )
}
