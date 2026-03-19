interface RegionContent {
  description: string
  coverageNote: string
}

const regionContentMap: Record<string, RegionContent> = {
  "greater-london": {
    description: "Greater London has the largest concentration of rage rooms in the UK, with venues spread across both central and outer boroughs. From converted warehouses in East London to experience centres in South London, the capital offers more variety in pricing, packages, and atmospheres than any other region.",
    coverageNote: "Venues in Greater London are well-served by the Tube, Overground, and bus networks. Whether you're in North, South, East, or West London, there's likely a rage room within a reasonable commute.",
  },
  "north-west": {
    description: "The North West of England — anchored by Manchester and Liverpool — has a thriving rage room scene. The region's industrial heritage provides plenty of warehouse-style spaces suited to destruction therapy, and the cities' social cultures drive strong demand for group bookings, party packages, and corporate events.",
    coverageNote: "Manchester and Liverpool are the main hubs, with both cities well-connected by rail and motorway. Visitors from Preston, Blackpool, Chester, and Warrington can reach North West rage rooms within an hour.",
  },
  "west-midlands": {
    description: "The West Midlands region, centred on Birmingham, offers rage room experiences for a population of over 2.9 million people. Birmingham's venues benefit from the city's central location in England, drawing visitors from Coventry, Wolverhampton, Solihull, and beyond.",
    coverageNote: "Birmingham New Street station provides excellent rail connections across the region. The West Midlands Metro and bus network extend access to venues in surrounding areas.",
  },
  "yorkshire-and-the-humber": {
    description: "Yorkshire and the Humber region encompasses rage room venues in Leeds, Sheffield, and surrounding areas. The region's mix of university cities and industrial towns creates steady demand for alternative entertainment, with competitive pricing compared to London and the South East.",
    coverageNote: "Leeds and Sheffield are the main rage room hubs in Yorkshire. Both cities are easily reached by train from York, Bradford, Hull, and Doncaster.",
  },
  "south-west": {
    description: "The South West of England has a growing rage room presence, with Bristol serving as the region's main hub. The South West's independent, creative culture aligns well with the alternative entertainment that rage rooms provide, and venues here often have a more relaxed, community-minded feel.",
    coverageNote: "Bristol is the most accessible South West city for rage rooms, with Temple Meads station providing connections from Bath, Exeter, Swindon, and Cardiff across the border in Wales.",
  },
  "north-east": {
    description: "The North East of England, led by Newcastle upon Tyne, offers rage room experiences for the region's energetic population. Newcastle's reputation as a party destination means its destruction therapy venues attract a lively crowd, with strong demand for group bookings and celebration packages.",
    coverageNote: "Newcastle Central station is the main arrival point, with connections from Sunderland, Durham, Middlesbrough, and further afield via the East Coast Main Line.",
  },
  "east-midlands": {
    description: "The East Midlands region includes rage room venues serving Nottingham, Derby, Leicester, and surrounding areas. With several large universities in the region, there's a steady stream of younger visitors interested in alternative entertainment, and pricing tends to be competitive.",
    coverageNote: "Nottingham is the primary rage room hub in the East Midlands. The city is centrally located with good rail links to Leicester, Derby, and Lincoln.",
  },
  "south-east": {
    description: "The South East of England, outside of Greater London, has a developing rage room market. The region's proximity to the capital means some visitors travel into London for their sessions, but local venues offer the convenience of avoiding London crowds and pricing.",
    coverageNote: "Rage rooms in the South East are typically accessible by car or train from major towns. Venues tend to be in commercial or industrial parks with dedicated parking.",
  },
  "scotland": {
    description: "Scotland's rage room scene is concentrated in Glasgow and Edinburgh, the country's two largest cities. Both cities offer destruction therapy experiences that reflect their distinct characters — Glasgow's energetic, direct approach and Edinburgh's mix of local and tourist clientele.",
    coverageNote: "Glasgow and Edinburgh are well-connected by rail (under an hour between them). For visitors from the Scottish Highlands, Central Belt, or Borders, one of these two cities will be the nearest option.",
  },
  "wales": {
    description: "Wales's rage room offerings are centred in Cardiff, the country's capital and largest city. Cardiff's growing entertainment scene includes destruction therapy venues that serve both the local South Wales population and visitors from across the country.",
    coverageNote: "Cardiff Central station provides the main rail access, with connections from Swansea, Newport, and Bristol. For much of South Wales, Cardiff's rage rooms are the most accessible option.",
  },
  "east-of-england": {
    description: "The East of England has a developing rage room market, with venues serving the region's mix of commuter towns and university cities. Cambridge, Norwich, and surrounding areas provide a base of potential visitors looking for alternative entertainment closer to home than London.",
    coverageNote: "Rail connections from across the East of England typically feed into London, but local venues save the trip into the capital. Check individual venue locations for parking and public transport access.",
  },
}

export function getRegionContent(regionName: string): RegionContent | null {
  const slug = regionName.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "")

  const directMatch = regionContentMap[slug]
  if (directMatch) return directMatch

  for (const [key, content] of Object.entries(regionContentMap)) {
    if (slug.includes(key) || key.includes(slug)) {
      return content
    }
  }

  return null
}

export function getGenericRegionContent(regionName: string, listingCount: number): RegionContent {
  const countDesc = listingCount === 1 ? "a rage room venue" : `${listingCount} rage room venues`

  return {
    description: `The ${regionName} region has ${countDesc} listed in our directory. Rage rooms in this area provide supervised destruction therapy sessions where visitors can safely break items in a controlled environment. Browse the venues below to compare options and find the right experience for you.`,
    coverageNote: `Check each venue's listing for directions, parking information, and the best way to reach them from your location within ${regionName}.`,
  }
}
