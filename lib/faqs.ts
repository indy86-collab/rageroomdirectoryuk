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

interface CityFAQData {
  priceRange: string
  popularUse: string
  bookingTip: string
}

const cityFAQOverrides: Record<string, CityFAQData> = {
  london: {
    priceRange: "£30 to £65 per person, with central London venues tending towards the higher end and outer borough venues offering more competitive rates",
    popularUse: "Friday evening stress-relief sessions for City workers and weekend group bookings for birthdays and stag/hen dos",
    bookingTip: "book at least a week in advance for weekend slots, as London venues fill up quickly due to high demand",
  },
  manchester: {
    priceRange: "£25 to £50 per person, with group discounts available at most venues across the city centre and Salford area",
    popularUse: "group celebrations, stag and hen parties, and corporate team-building events",
    bookingTip: "book ahead for Saturday sessions, which tend to be the busiest day at Manchester venues",
  },
  birmingham: {
    priceRange: "£25 to £45 per person, positioning Birmingham as a mid-range option compared to London pricing",
    popularUse: "corporate team events, birthday celebrations, and weekend activities for groups of friends",
    bookingTip: "check venue websites for midweek deals, as several Birmingham venues offer discounted rates on quieter days",
  },
  leeds: {
    priceRange: "£20 to £45 per person, making it one of the more affordable cities for rage room experiences in the north",
    popularUse: "student groups, birthday celebrations, and weekend entertainment for young professionals",
    bookingTip: "check for student discount offers, as Leeds venues often cater to the city's large university population",
  },
  liverpool: {
    priceRange: "£25 to £50 per person, with party packages that bundle sessions with extras for groups",
    popularUse: "stag and hen parties, birthday celebrations, and pre-event activities before nights out",
    bookingTip: "book early if you're visiting during major events like Grand National weekend or football match days",
  },
  bristol: {
    priceRange: "£25 to £50 per person, with some venues offering discounted rates for off-peak weekday sessions",
    popularUse: "date nights, birthday events, and weekend activities for the city's young professional population",
    bookingTip: "look for Friday evening slots which offer good availability while still capturing the weekend energy",
  },
  sheffield: {
    priceRange: "£20 to £40 per person, making Sheffield one of the more affordable cities for rage room sessions in England",
    popularUse: "student socials, birthday parties, and weekend outings for friend groups",
    bookingTip: "consider weekday sessions for the best prices, as some Sheffield venues run midweek promotions",
  },
  newcastle: {
    priceRange: "£25 to £45 per person, with group packages commonly available for parties and events",
    popularUse: "hen and stag parties (tying into Newcastle's reputation as a party city), birthday groups, and team events",
    bookingTip: "book well ahead for Saturday afternoon slots, which are particularly popular with party groups",
  },
  nottingham: {
    priceRange: "£20 to £45 per person, offering competitive pricing for the East Midlands area",
    popularUse: "student groups, birthday celebrations, and casual weekend entertainment",
    bookingTip: "check for term-time student offers if you're at the University of Nottingham or Nottingham Trent",
  },
  glasgow: {
    priceRange: "£25 to £50 per person, in line with Scottish city pricing for experience-based entertainment",
    popularUse: "group celebrations, corporate events, and weekend activities for the city's energetic social scene",
    bookingTip: "some Glasgow venues offer combined packages with other activities — check their websites for bundle deals",
  },
  edinburgh: {
    priceRange: "£30 to £55 per person, with prices at the higher end during festival season in August",
    popularUse: "tourist activities (especially during the Fringe), hen and stag parties, and birthday celebrations",
    bookingTip: "book early during August (Edinburgh Fringe) and Hogmanay periods, when demand spikes significantly",
  },
  cardiff: {
    priceRange: "£20 to £45 per person, making Cardiff one of the more affordable options in the UK for rage room sessions",
    popularUse: "rugby match day groups, birthday parties, and corporate team events",
    bookingTip: "venues near the city centre can be busier on international rugby weekends, so book ahead during the Six Nations",
  },
}

function getCityFAQData(cityName: string): CityFAQData {
  const slug = cityName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")
  
  for (const [key, data] of Object.entries(cityFAQOverrides)) {
    if (slug === key || slug.includes(key) || key.includes(slug)) {
      return data
    }
  }

  return {
    priceRange: "£25 to £50 per person, though prices vary depending on the venue, package type, and session length",
    popularUse: "stress relief, birthday celebrations, team-building events, and unique date nights",
    bookingTip: "book a few days in advance for weekend sessions, as slots can fill up, particularly on Saturdays",
  }
}

export function getCityFAQs(cityName: string): FAQItem[] {
  const data = getCityFAQData(cityName)

  return [
    {
      question: `How much does a rage room cost in ${cityName}?`,
      answer: `Rage room prices in ${cityName} typically range from ${data.priceRange}. Most venues offer a range of packages at different price points, so it's worth visiting the venue's website for their current pricing. Prices can change, and some venues run seasonal promotions.`,
    },
    {
      question: `What are rage rooms in ${cityName} most popular for?`,
      answer: `In ${cityName}, rage rooms are especially popular for ${data.popularUse}. However, anyone can book a session — whether you're visiting solo for stress relief or organising a group activity. Each venue in ${cityName} has its own character and strengths.`,
    },
    {
      question: `Do I need to book a rage room in ${cityName} in advance?`,
      answer: `It's recommended to ${data.bookingTip}. Most venues in ${cityName} accept online bookings through their websites, and some also take phone bookings. Walk-in availability varies — it's always safer to book ahead.`,
    },
    {
      question: `What age do you need to be for a rage room in ${cityName}?`,
      answer: `Age requirements vary by venue in ${cityName}, but most require participants to be at least 16 years old. Some venues allow younger visitors (typically 12+) with a parent or guardian present. Always check the specific venue's age policy before booking, as insurance requirements can affect their rules.`,
    },
    {
      question: `What should I wear to a rage room in ${cityName}?`,
      answer: `Wear comfortable clothes you can move freely in, and closed-toe shoes (this is mandatory at all venues). Avoid loose jewellery. All rage rooms in ${cityName} provide protective equipment — typically coveralls, gloves, helmets, and safety glasses — so you'll be covered up during the session.`,
    },
  ]
}
