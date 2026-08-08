interface GuideCityContent {
  intro: string
  sceneDescription: string
  whatToLookFor: string
  localTip: string
}

const guideCityContentMap: Record<string, GuideCityContent> = {
  birmingham: {
    intro: "Birmingham has multiple verified rage rooms in the city, plus additional options elsewhere in the West Midlands. This guide separates in-city venues from nearby choices so you can compare the journey as well as the session price.",
    sceneDescription: "Current Birmingham listings include venues around the B8 and B12 postcode areas, with packages starting from the mid-£30s in our latest directory data. Because session length, breakable quantities and minimum ages vary, compare the full package rather than choosing on headline price alone.",
    whatToLookFor: "Check the postcode, minimum age, session length and number of breakables included. For group bookings, confirm whether everyone smashes together and whether the quoted price is per person or per room. Use the comparison table for a shortlist, then verify the final package on the venue page.",
    localTip: "Do not assume every venue is within walking distance of Birmingham New Street. Check the listed postcode before booking and compare public transport with driving or taxi time, especially for evening and weekend sessions.",
  },
  bristol: {
    intro: "Bristol's independent spirit makes it one of the more interesting cities in England for rage room experiences. While dedicated in-city venues are limited, the South West's largest city is well served by nearby smash rooms — particularly in Weston-super-Mare, roughly 20 miles away.",
    sceneDescription: "Rage rooms near Bristol often reflect the region's DIY ethos — expect character over polish in repurposed industrial spaces. Bristol's student population and young professional demographic keep demand strong for day trips and weekend sessions at nearby venues.",
    whatToLookFor: "Bristol venues can vary quite a bit in style and atmosphere. Some lean into the party vibe with music and group energy, while others offer a more focused, individual experience. If you have a preference, it's worth checking each venue's website or social media to get a feel for their style before booking.",
    localTip: "Parking in central Bristol can be challenging. If you're driving, check whether your chosen venue has its own parking. Temple Meads station is the main rail hub, and many venues are reachable from there by bus or a short taxi ride.",
  },
  leeds: {
    intro: "Leeds offers a growing range of rage room experiences for West Yorkshire's large population. While dedicated in-city venues are still limited, nearby options — including Huddersfield, roughly 15 miles away — make destruction therapy accessible for Leeds residents and visitors.",
    sceneDescription: "The rage room scene serving Leeds caters to a mix of students, young professionals, and corporate groups. Nearby venues tend to be well connected by rail and road from Leeds city centre, making them practical for post-work sessions or weekend outings.",
    whatToLookFor: "Look for venues that match your reason for visiting. If you're after a social, high-energy experience (birthday, stag/hen do), check whether the venue offers group packages with extras. If you're going for personal stress relief, a venue with private sessions might suit you better.",
    localTip: "Leeds city centre is compact and walkable. Combine a rage room session with dinner on Call Lane or drinks in the Northern Quarter area. If you're coming from Bradford, Harrogate, or York, the train into Leeds is quick and frequent.",
  },
  liverpool: {
    intro: "Liverpool is a natural fit for the rage room concept — a city known for its energy, humour, and love of a good time. The city's rage room venues tap into Liverpool's existing culture of group celebrations and nights out, making destruction therapy sessions a popular addition to stag and hen parties, birthdays, and team events.",
    sceneDescription: "Liverpool's rage room scene benefits from the city's status as a popular weekend destination. The Baltic Triangle area, already home to bars, street food markets, and creative businesses, is a common location for experience venues. Merseyside residents from Wirral, St Helens, and Southport also travel into Liverpool for sessions.",
    whatToLookFor: "If you're booking as part of a larger celebration, check whether the venue offers party packages or can accommodate your group size. Some Liverpool venues are better set up for big groups than others. For quieter sessions, weekday bookings tend to offer more availability and sometimes lower prices.",
    localTip: "Liverpool Lime Street is the main station, within easy reach of most rage room areas. If you're making a day of it, the Baltic Triangle and Albert Dock areas offer plenty of restaurants and bars within walking distance of most venues.",
  },
  manchester: {
    intro: "Manchester is one of northern England's top destinations for group entertainment, and rage rooms are a popular add-on for nights out — even though dedicated in-city venues remain limited. The nearest verified smash rooms are in Chesterfield and Huddersfield, both within reasonable travelling distance.",
    sceneDescription: "Visitors from Manchester typically combine a rage room session with food and drinks in the Northern Quarter or Deansgate. Nearby venues are experienced with group bookings and corporate events, making them a practical option for Manchester-based celebrations.",
    whatToLookFor: "Manchester has enough venues to give you genuine choice. Compare not just prices but also what's included in each package — some venues offer more breakable items or longer sessions at similar price points. Reviews from other visitors can help distinguish between venues that are similar on paper.",
    localTip: "Both Piccadilly and Victoria stations serve Manchester. If you're coming from Liverpool, Leeds, or Sheffield, the train is typically the quickest option. For groups, booking a restaurant near your chosen venue in advance is a good idea — Manchester's popular spots fill up on weekends.",
  },
  newcastle: {
    intro: "Newcastle is one of the North East's strongest cities for hen, stag and birthday smash sessions. Verified in-city inventory sits alongside nearby options that Sunderland, Durham and Gateshead groups also use for weekend plans.",
    sceneDescription: "Rage rooms in Newcastle serve both locals and visitors who come for Quayside nights out. City-centre and Ouseburn venues keep the session close to Metro links and bars, so groups can smash first and crawl afterwards without a long taxi. Compare starting prices, age policies and booking links on the Newcastle city page before you deposit.",
    whatToLookFor: "Book Saturday afternoon and evening slots early for stag and hen parties. Check whether the package price is per person or per room, how many breakables are included, and the minimum age — most UK venues are 18+, with youth sessions uncommon. Weekday slots are usually quieter for couples or first-timers.",
    localTip: "Newcastle Central is on the East Coast Main Line from Edinburgh, York and London. Pair the session with Quayside food, then use the near-me map if you are travelling from elsewhere in the North East.",
  },
  nottingham: {
    intro: "Nottingham serves the East Midlands with strong demand for alternative activities like destruction therapy. While dedicated in-city venues are limited, nearby Derby — roughly 15 miles away — has an established rage room that Nottingham residents and visitors regularly use.",
    sceneDescription: "Many Nottingham visitors are trying rage rooms for the first time, often as a birthday activity or group outing. The short trip to Derby makes a combined session and city-centre dinner in Nottingham or Derby a popular weekend plan.",
    whatToLookFor: "If you're new to rage rooms, Nottingham is a good starting point — venues here often cater to beginners with clear safety briefings and approachable staff. Check whether a venue offers a first-timer package or smaller session option if you want to try it without committing to a full group booking.",
    localTip: "Nottingham station provides connections across the East Midlands. If you're coming from Derby, Leicester, or Lincoln, the journey is typically under an hour. The city's tram system covers additional areas if your chosen venue is outside the immediate city centre.",
  },
  sheffield: {
    intro: "Sheffield's industrial heritage gives its rage room scene an authentic edge. While dedicated in-city venues are limited, nearby Chesterfield — roughly 12 miles away — offers established smash rooms that South Yorkshire residents use regularly.",
    sceneDescription: "Rage rooms serving Sheffield draw from the city's mix of university students, young professionals, and South Yorkshire residents. Nearby venues tend to offer straightforward, no-frills experiences at fair prices compared to larger cities.",
    whatToLookFor: "Sheffield's strength is value for money. Prices here tend to be lower than Manchester, Leeds, or London for comparable experiences. When comparing venues, look at what's included in the base price — the number of items, session length, and whether tools are unlimited or allocated per person can vary.",
    localTip: "Sheffield station sits between Manchester and Leeds on the trans-Pennine rail route. For visitors from Rotherham, Barnsley, Doncaster, or Chesterfield, Sheffield is the nearest city with established rage room venues.",
  },
  london: {
    intro: "London has verified rage room options in the city as well as nearby choices in areas such as Croydon and Romford. This guide keeps those groups separate so a venue outside central London is not presented as an in-city option.",
    sceneDescription: "The latest directory prices span budget and premium sessions, but location can matter as much as price in London. Compare the postcode, journey time, minimum age and what each package includes before booking; a cheaper venue may not be better value after travel and add-ons.",
    whatToLookFor: "Start with the comparison table, then check session length, breakable quantities, minimum age and the venue's own booking terms. London search results often mix central venues with outer-borough and nearby options, so verify the postcode and realistic travel time from your starting point.",
    localTip: "Plan the journey before paying. Check the exact postcode against your starting station, allow for weekend engineering works, and confirm the venue's arrival-time policy because safety briefings normally begin before the booked smash session.",
  },
  edinburgh: {
    intro: "Edinburgh's rage room options offer an alternative to the city's more traditional tourist attractions. The Scottish capital has verified destruction therapy venues that serve locals, festival-goers, and visitors looking for a hands-on activity beyond the historic sights.",
    sceneDescription: "Rage rooms in Edinburgh are typically found outside the historic city centre, in areas with the space needed for smash rooms. Edinburgh Waverley station is the main arrival point, with venues generally reachable by bus or a short taxi ride.",
    whatToLookFor: "When choosing a rage room near Edinburgh, check session length, group size limits, and whether the venue offers extras like axe throwing. During the Edinburgh Fringe (August), book well ahead as experience venues fill up faster than usual.",
    localTip: "Edinburgh is a short train ride from Glasgow and well-connected to England via the East Coast Main Line. Combine your session with a walk along the Royal Mile or dinner in Leith for a full day out.",
  },
  leicester: {
    intro: "Leicester is the East Midlands hub for rage room experiences, with multiple verified venues in the city. Two universities and a large local population create steady demand for destruction therapy as a group activity, date night, or stress-relief session.",
    sceneDescription: "Leicester's rage room venues cater to a broad audience — students, young professionals, and corporate groups from across Leicestershire. Pricing tends to sit below London rates, making Leicester a good value option for first-timers.",
    whatToLookFor: "Compare what's included in each Leicester package — session length, number of breakables, and whether tools are unlimited. Group packages often offer better per-person value than solo bookings.",
    localTip: "Leicester station connects to Nottingham, Derby, and Birmingham within an hour. If you're visiting from the wider East Midlands, Leicester is likely your nearest city with multiple rage room options.",
  },
  derby: {
    intro: "Derby has an established rage room scene that also serves nearby Nottingham, 15 miles away. The city is a practical choice for East Midlands residents wanting destruction therapy without travelling to Birmingham or Leicester.",
    sceneDescription: "Derby's rage room venues welcome first-timers and groups alike. Many Nottingham visitors make the short trip for weekend sessions, often combining a smash room visit with dinner in Derby's Cathedral Quarter.",
    whatToLookFor: "Derby venues are generally approachable for beginners — look for clear safety briefings and first-timer packages if you're new to rage rooms. Check age policies before booking for mixed-age groups.",
    localTip: "Derby is centrally placed between Nottingham and Leicester, with frequent train connections to both. If you're planning a rage room as part of a larger celebration, book restaurant tables in advance — Derby's popular spots fill up on weekends.",
  },
  brighton: {
    intro: "Brighton is one of the South Coast's best cities for alternative entertainment, and its verified rage room venue makes destruction therapy accessible for locals, London day-trippers, and hen-party groups visiting the seaside.",
    sceneDescription: "Brighton's rage room scene fits the city's creative, party-friendly character. Sessions are popular with groups celebrating birthdays and hen dos, as well as couples looking for an unconventional date activity away from the usual Brighton pier attractions.",
    whatToLookFor: "Brighton venues can fill up on summer weekends when tourism peaks. Compare group packages if you're booking for a celebration — some venues offer extras like personalised smash items or extended sessions.",
    localTip: "Brighton is under 90 minutes from London by train, making it a popular day trip. Combine your rage room session with dinner in the Lanes or drinks on the seafront for a full Brighton experience.",
  },
  glasgow: {
    intro:
      "Glasgow is Scotland's largest city and a natural destination for stag parties, birthdays and stress-relief sessions — even when the nearest verified smash rooms sit within travelling distance of the centre.",
    sceneDescription:
      "Central Belt groups often travel from Glasgow for destruction therapy, then head back to Merchant City or West End bars. Nearby venues are used to Friday and Saturday group bookings.",
    whatToLookFor:
      "Confirm group capacity and alcohol rules before booking a stag. Compare session length and what's included in the base price.",
    localTip:
      "Glasgow Central and Queen Street connect easily to Edinburgh (under an hour). Book weekend slots early for stag groups.",
  },
  cardiff: {
    intro:
      "Cardiff is Wales' main hub for rage room experiences, with verified venues serving South Wales groups for rugby weekends, birthdays and corporate socials.",
    sceneDescription:
      "Venues around the city centre and Bay area make it easy to pair a smash session with food and drinks. Visitors from Swansea, Newport and Bristol regularly use Cardiff as their nearest hub.",
    whatToLookFor:
      "Check group packages and parking if you are driving in for a match weekend. Compare starting prices against Bristol options if you are flexible on location.",
    localTip:
      "Cardiff Central is well connected across South Wales. Principality Stadium visitors often book a pre-match afternoon slot.",
  },
  hull: {
    intro:
      "Hull has a verified rage room venue serving East Yorkshire — a practical option for locals and visitors who want destruction therapy without travelling to Leeds or Sheffield.",
    sceneDescription:
      "Hull's smash room scene is smaller than the big metros but convenient for regional groups. Compare packages, starting prices and booking links in the ranked list below.",
    whatToLookFor:
      "Confirm session length, group size limits and whether BYO smashables are allowed. Weekday slots are usually quieter for first-timers.",
    localTip:
      "Hull Paragon station connects well across Yorkshire. Check the listing for parking notes before you travel.",
  },
}

export function getGuideCityContent(cityName: string): GuideCityContent | null {
  const key = cityName.toLowerCase().replace(/\s+/g, "-")
  return guideCityContentMap[key] || null
}
