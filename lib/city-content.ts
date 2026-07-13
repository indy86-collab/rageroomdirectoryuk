interface CityContent {
  intro: string
  localContext: string
  travelTip: string
}

const cityContentMap: Record<string, CityContent> = {
  london: {
    intro:
      "London's rage room scene is one of the most established in the UK, with venues spread across multiple boroughs. The capital offers a wide range of destruction therapy experiences, from budget-friendly sessions in East London warehouses to premium experiences in central locations.",
    localContext:
      "Many of London's rage rooms are located in converted industrial spaces in areas like Hackney, Bermondsey, and Battersea. These neighbourhoods are well-connected by Tube, Overground, and bus. Several venues sit alongside escape rooms and axe-throwing bars.",
    travelTip:
      "Most venues are a short walk from a Tube or Overground station. Book ahead for weekends — Saturday afternoons fill fastest.",
  },
  manchester: {
    intro:
      "Looking for a rage room in Manchester? We list the nearest verified smash rooms within travelling distance of the city — typically neighbouring Greater Manchester and Cheshire venues that serve Manchester groups for birthdays, hen/stag weekends and corporate bookings.",
    localContext:
      "Manchester Piccadilly and Victoria put most nearby venues within an easy train or tram hop. Compare starting prices, packages and booking links below. If you know of a new Manchester venue we should list, suggest it via our submit form.",
    travelTip:
      "Trains from Liverpool, Leeds and Sheffield take under an hour. Check weekend availability early for group bookings.",
  },
  leeds: {
    intro:
      "Looking for a rage room in Leeds? We list the nearest verified smash rooms within travelling distance of West Yorkshire — venues that regularly serve Leeds groups for nights out, birthdays and team socials.",
    localContext:
      "Leeds City Station is the main arrival point for day-trippers from York, Bradford and Sheffield. Browse nearby listings below for prices, reviews and booking links. Suggest a missing Leeds venue if you know one.",
    travelTip:
      "Weekend trains from London Kings Cross take around two hours. Saturday afternoon slots fill first for groups.",
  },
  bristol: {
    intro:
      "Looking for a rage room in Bristol? We list the nearest verified smash rooms within travelling distance of the South West — venues that serve Bristol visitors from Bath, Weston-super-Mare and beyond.",
    localContext:
      "Bristol Temple Meads is the usual arrival hub. Compare nearby destruction therapy venues below for packages, safety notes and booking. Know a Bristol venue we have missed? Suggest it and we will verify it.",
    travelTip:
      "Friday evening sessions are popular with groups coming in from Bath and Swindon — book ahead where possible.",
  },
  sheffield: {
    intro:
      "Looking for a rage room in Sheffield? We list the nearest verified smash rooms within travelling distance of South Yorkshire, with competitive northern pricing compared with London.",
    localContext:
      "Sheffield station and the Supertram network make day trips from Manchester, Leeds and Nottingham straightforward. Compare nearby venues below, or suggest a Sheffield listing we should add.",
    travelTip:
      "If you are in Rotherham or Barnsley, the nearest listed venues are usually still an easy drive from Sheffield.",
  },
  nottingham: {
    intro:
      "Looking for a rage room in Nottingham? We list the nearest verified smash rooms within travelling distance of the East Midlands — popular with students and hen/stag groups.",
    localContext:
      "Nottingham station and the tram network cover most approaches. Browse nearby venues below for prices and booking links, and suggest any missing Nottingham venues.",
    travelTip:
      "Derby, Leicester and Lincoln are all within about an hour by train — handy for regional groups meeting in Nottingham.",
  },
  glasgow: {
    intro:
      "Looking for a rage room in Glasgow? We list the nearest verified smash rooms within travelling distance of Scotland’s largest city — venues serving Central Belt groups for stag parties, birthdays and stress-relief sessions.",
    localContext:
      "Glasgow Central and Queen Street are the main arrival points. Compare nearby listings below for packages and booking, or suggest a Glasgow venue we should verify.",
    travelTip:
      "Edinburgh is under an hour by train. Book ahead for Friday and Saturday evenings, especially for stag groups.",
  },
  birmingham: {
    intro:
      "Birmingham's rage room options serve the West Midlands' large population, offering destruction therapy to professionals, students, couples and corporate groups with a range of packages.",
    localContext:
      "Venues are often found in commercial districts and converted business parks such as Digbeth. Birmingham New Street puts most venues within a short taxi or bus ride.",
    travelTip:
      "If you're in Coventry or Wolverhampton, Birmingham is usually the closest major hub without travelling to London or Manchester.",
  },
  liverpool: {
    intro:
      "Liverpool's rage room scene reflects the city's appetite for unique, experience-based entertainment — popular with stag and hen parties, birthday groups and couples.",
    localContext:
      "Most venues are accessible from the city centre via Liverpool Lime Street. The Baltic Triangle and nearby creative districts are common locations for experience businesses.",
    travelTip:
      "Liverpool is a short train ride from Manchester, Chester and the Wirral. Combine a session with Albert Dock or the city's music heritage sites.",
  },
  newcastle: {
    intro:
      "Newcastle upon Tyne's rage room offerings serve the North East's demand for unique entertainment and are popular for hen and stag dos.",
    localContext:
      "Venues tend to sit around the city centre and Ouseburn Valley, accessible from Newcastle Central Station and close to Quayside bars.",
    travelTip:
      "Easily reached from Sunderland, Durham and Middlesbrough. The East Coast Main Line connects to Edinburgh, York and London.",
  },
  edinburgh: {
    intro:
      "Edinburgh's rage room options offer a physical alternative to the city's traditional tourist attractions for locals, festival-goers and visitors.",
    localContext:
      "Venues are typically found outside the historic centre in industrial areas with enough space for destruction sessions. Edinburgh Waverley is the main arrival point.",
    travelTip:
      "Book ahead during the Edinburgh Fringe in August — venues can be busier than usual.",
  },
  cardiff: {
    intro:
      "Cardiff is Wales' main hub for rage room experiences, popular with groups — from rugby weekends to birthdays and corporate events.",
    localContext:
      "Venues are generally in or around the city centre and Bay area, with Cardiff Central providing good rail access.",
    travelTip:
      "Easily reached from Swansea, Newport and Bristol. Principality Stadium visitors often add a pre-match session.",
  },
  hull: {
    intro:
      "Hull has a listed rage room venue serving East Yorkshire visitors looking for smash rooms, group nights and stress-relief sessions.",
    localContext:
      "Compare the Hull listing below for packages, prices and booking. Suggest any additional East Yorkshire venues we should verify.",
    travelTip:
      "Hull Paragon station connects well across Yorkshire. Check parking notes on the venue listing before you travel.",
  },
}

export function getCityContent(cityName: string): CityContent | null {
  const slug = cityName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")

  const directMatch = cityContentMap[slug]
  if (directMatch) return directMatch

  for (const [key, content] of Object.entries(cityContentMap)) {
    if (slug.includes(key) || key.includes(slug)) {
      return content
    }
  }

  return null
}

export function getGenericCityContent(
  cityName: string,
  listingCount: number,
  options?: { nearbyOnly?: boolean }
): CityContent {
  if (options?.nearbyOnly) {
    return {
      intro: `We do not currently list a dedicated rage room in central ${cityName}, but there ${listingCount === 1 ? "is" : "are"} ${listingCount} verified ${listingCount === 1 ? "venue" : "venues"} within travelling distance. Compare the closest options below — including prices, locations and booking links.`,
      localContext: `Rage rooms near ${cityName} provide supervised destruction therapy sessions with safety equipment and items to smash. Each venue sets its own pricing and rules, so check directly before booking. Know a missing ${cityName} venue? Suggest it and we will verify it.`,
      travelTip: `If you are travelling to a venue near ${cityName}, check the listing for directions and parking. Weekend group slots fill first.`,
    }
  }

  const countDesc =
    listingCount === 1 ? "a rage room venue" : `${listingCount} rage room venues`

  return {
    intro: `${cityName} is home to ${countDesc} listed in our directory. Whether you're a local resident or visiting the area, destruction therapy offers a unique way to relieve stress, celebrate special occasions, or try something completely different.`,
    localContext: `Rage rooms in ${cityName} provide supervised destruction therapy sessions where visitors are given safety equipment and a selection of items to break. Each venue sets its own pricing, packages, and rules — check directly before booking.`,
    travelTip: `If you're travelling to ${cityName} for a rage room session, check the venue's website for directions and parking information.`,
  }
}
