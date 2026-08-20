export interface FAQItem {
  question: string
  answer: string
}

export const globalFAQs: FAQItem[] = [
  {
    question: "Are rage rooms safe?",
    answer: "Rage rooms use venue-specific safety rules, protective equipment and briefings. Check the selected venue's published requirements and follow staff instructions; equipment and supervision arrangements are not identical everywhere.",
  },
  {
    question: "What should I wear to a rage room?",
    answer: "Wear comfortable clothes and check the venue's footwear and clothing rules before travelling. Protective-equipment requirements differ, so use the venue's own booking guidance as the final source.",
  },
  {
    question: "Are rage rooms good for stress relief?",
    answer: "People often book rage rooms as entertainment or an outlet, but a commercial rage-room session is not medical treatment. If you need help with anxiety, anger or mental health, seek advice from a qualified professional.",
  },
  {
    question: "Can kids join rage rooms?",
    answer: "Age restrictions vary materially by venue and sometimes by package. Use the rage-room-specific minimum age and supervision note on the listing, then confirm it on the venue's own booking page.",
  },
  {
    question: "How much does a rage room cost?",
    answer: "Some venues charge per person, while others charge per room or group. Our price table preserves that published unit so unlike rates are not presented as directly comparable; confirm the live package before paying.",
  },
  {
    question: "Do I need to bring anything to a rage room?",
    answer: "Package contents and bring-your-own policies differ. Check what the selected package includes and never bring an item unless the venue explicitly permits it.",
  },
  {
    question: "How long is a typical rage room session?",
    answer: "Published durations may mean smash time, total booking time or a shared session. Listings label the duration type where the venue makes it clear; otherwise, ask the venue how much active time is included.",
  },
  {
    question: "Is there a maximum group size for rage rooms?",
    answer: "Group limits vary, and a booking capacity does not always mean everyone enters the smash room together. Check the listing's group note and confirm the operating format with the venue.",
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
  return [
    {
      question: `How much does a rage room cost in ${cityName}?`,
      answer: `Published prices near ${cityName} may be per person, room or group. Compare the labelled unit on each listing and visit the venue's own page for its live package price.`,
    },
    {
      question: `What are rage rooms in ${cityName} most popular for?`,
      answer: `Use the occasion labels to find ${cityName} venues that explicitly advertise birthdays, corporate groups, date nights or other uses. An absent label means we do not currently have direct evidence for that claim.`,
    },
    {
      question: `Do I need to book a rage room in ${cityName} in advance?`,
      answer: `Booking methods near ${cityName} vary. Use a direct booking link only when one is published, and treat walk-ins as available only where the venue explicitly confirms them.`,
    },
    {
      question: `What age do you need to be for a rage room in ${cityName}?`,
      answer: `Age requirements near ${cityName} vary by venue and package. Check the rage-room-specific minimum age and supervision note, then reconfirm it before booking.`,
    },
    {
      question: `What should I wear to a rage room in ${cityName}?`,
      answer: `Check the selected ${cityName} venue's clothing, footwear and protective-equipment instructions before travelling, because requirements differ by operator.`,
    },
  ]
}
