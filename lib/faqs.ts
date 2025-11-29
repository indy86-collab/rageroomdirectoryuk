/**
 * Global and city-specific FAQ content for SEO and GEO optimization
 */

export interface FAQItem {
  question: string
  answer: string
}

export const globalFAQs: FAQItem[] = [
  {
    question: "Are rage rooms safe?",
    answer: "Yes, rage rooms are designed with safety as the top priority. All venues provide comprehensive protective gear including coveralls, helmets, safety glasses, and gloves. The rooms are specifically designed to contain flying debris, and trained staff supervise all sessions. Participants receive safety briefings before entering, and all equipment is regularly inspected and maintained.",
  },
  {
    question: "What should I wear to a rage room?",
    answer: "Wear comfortable, old clothes that you don't mind getting dirty. Closed-toe shoes are required for safety - avoid open-toed sandals or flip-flops. Most rage rooms provide protective coveralls that go over your clothes, but wearing something you can move freely in is recommended. Avoid loose jewelry or accessories that could get caught.",
  },
  {
    question: "Are rage rooms good for stress relief?",
    answer: "Yes, rage rooms are an effective and fun way to relieve stress. The physical act of smashing items releases endorphins and provides a healthy outlet for pent-up frustration and anger. Many people find it more engaging than traditional stress-relief methods, and it's been shown to help with anxiety, anger management, and overall mental well-being.",
  },
  {
    question: "Can kids join rage rooms?",
    answer: "Age restrictions vary by venue, but most rage rooms require participants to be at least 16-18 years old. Some venues allow younger participants (12-15 years) when accompanied by a parent or guardian. It's always best to check with the specific venue when booking, as age policies can differ. Safety is the primary concern, so venues set age limits based on their equipment and supervision capabilities.",
  },
  {
    question: "How much does a rage room cost?",
    answer: "Rage room prices in the UK typically range from £25 to £50 per person. Most venues offer 30-minute sessions starting around £30, with premium packages including additional items and extended time available for £40-50. Group bookings often receive discounts, and some venues offer special packages for couples or corporate events.",
  },
  {
    question: "Do I need to bring anything to a rage room?",
    answer: "No, you don't need to bring anything. All rage rooms provide protective gear (coveralls, helmets, gloves, safety glasses), smashing tools (hammers, bats, crowbars), and breakable items. Just bring yourself and wear appropriate clothing. Some venues allow you to bring your own items to smash (check with the venue first), but it's not required.",
  },
  {
    question: "How long is a typical rage room session?",
    answer: "Most rage room sessions last 30 minutes, which is usually enough time to break all provided items. Some venues offer extended 45-60 minute sessions for larger groups or premium packages. The actual smashing time is typically 20-25 minutes, with the remaining time allocated for safety briefing, gear setup, and cleanup.",
  },
  {
    question: "Is there a maximum group size for rage rooms?",
    answer: "Group sizes vary by venue, but most rage rooms can accommodate 2-6 people per session. Some larger venues can handle groups of 8-12 people, making them ideal for corporate team building events. It's best to book in advance for larger groups, as venues may need to prepare additional items and ensure adequate supervision.",
  },
]

export function getCityFAQs(cityName: string): FAQItem[] {
  return [
    {
      question: `How much does a rage room cost in ${cityName}?`,
      answer: `Rage room prices in ${cityName} typically range from £25 to £50 per person, depending on the package and session duration. Most venues offer 30-minute sessions starting around £30, with premium packages including additional items and extended time available for £40-50. Prices may vary slightly between venues, so it's worth comparing options.`,
    },
    {
      question: `What age restrictions apply in ${cityName}?`,
      answer: `Most rage rooms in ${cityName} require participants to be at least 16-18 years old, with some venues allowing younger participants (12+) when accompanied by an adult. Age restrictions vary by venue, so it's best to check with the specific rage room when booking. Safety regulations and insurance requirements determine these limits.`,
    },
    {
      question: `Are rage rooms worth it in ${cityName}?`,
      answer: `Yes, rage rooms in ${cityName} offer excellent value for a unique stress-relief experience. Whether you're looking for a fun date night, team building activity, or simply need to let off steam, rage rooms provide a safe, controlled environment that you can't replicate at home. The combination of protective gear, professional equipment, and supervised sessions makes it a worthwhile investment in your mental well-being.`,
    },
    {
      question: `What do I wear to a rage room in ${cityName}?`,
      answer: `Wear comfortable, old clothes that you don't mind getting dirty. Closed-toe shoes are required for safety. Most rage rooms in ${cityName} provide protective gear including coveralls, helmets, and safety glasses, but wearing clothes you can move freely in is recommended. Avoid loose jewelry or accessories.`,
    },
    {
      question: `How do I book a rage room in ${cityName}?`,
      answer: `You can book a rage room in ${cityName} by visiting the venue's website directly, calling them, or using online booking platforms. Many venues offer online booking with instant confirmation. It's recommended to book in advance, especially for weekends and group sessions, as rage rooms are becoming increasingly popular.`,
    },
  ]
}



