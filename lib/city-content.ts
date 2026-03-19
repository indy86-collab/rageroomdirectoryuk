interface CityContent {
  intro: string
  localContext: string
  travelTip: string
}

const cityContentMap: Record<string, CityContent> = {
  london: {
    intro: "London's rage room scene is one of the most established in the UK, with venues spread across multiple boroughs. The capital offers a wide range of destruction therapy experiences, from budget-friendly sessions in East London warehouses to premium experiences in central locations. London's diverse population means rage rooms here cater to a broad audience — from City workers blowing off steam after a tough week to tourists looking for a memorable activity.",
    localContext: "Many of London's rage rooms are located in converted industrial spaces in areas like Hackney, Bermondsey, and Battersea. These neighbourhoods are well-connected by Tube, Overground, and bus, making them easy to reach from most parts of the city. Several venues sit alongside other experience-based businesses like escape rooms and axe-throwing bars, so visitors can combine activities for a full day out.",
    travelTip: "If you're visiting from outside London, most rage room venues are within a short walk from a Tube or Overground station. Book ahead for weekends — London venues tend to fill up fast, especially on Saturday afternoons.",
  },
  manchester: {
    intro: "Manchester has become one of the north of England's go-to cities for rage room experiences. The city's industrial heritage provides the backdrop for several warehouse-style destruction therapy venues, with most clustered around the city centre and surrounding areas like Ancoats and Salford. Manchester's venues tend to be well-suited for group bookings, reflecting the city's strong culture of nights out and group activities.",
    localContext: "Rage rooms in Manchester are typically found in the city's repurposed industrial and commercial spaces. The Northern Quarter and surrounding areas offer easy access to most venues, with Piccadilly and Victoria stations nearby for those arriving by train. Many visitors combine a rage room session with other activities in the city centre, including restaurants and bars within walking distance.",
    travelTip: "Manchester Piccadilly is well-connected by rail from across the UK. If you're coming from Liverpool, Leeds, or Sheffield, the train journey is under an hour, making a Manchester rage room session an easy day trip.",
  },
  birmingham: {
    intro: "Birmingham's rage room options serve the West Midlands' large population, offering destruction therapy to everyone from stressed professionals in the Jewellery Quarter to students from the city's universities. As the UK's second-largest city, Birmingham has growing demand for alternative entertainment, and its rage room venues have responded with a range of packages for individuals, couples, and corporate groups.",
    localContext: "Venues in Birmingham are often found in the city's commercial districts and converted business parks. The Digbeth area, known for its creative and entertainment scene, is a common location for experience-based businesses. Birmingham New Street station puts most of the city's rage rooms within a short taxi or bus ride, and the tram network extends coverage to some outer venues.",
    travelTip: "Birmingham is centrally located in England with excellent rail links. If you're in the West Midlands, Coventry, or Wolverhampton, Birmingham's rage rooms are the closest options without travelling to London or Manchester.",
  },
  leeds: {
    intro: "Leeds offers a growing number of rage room experiences for West Yorkshire residents and visitors. The city's vibrant entertainment scene extends beyond its famous nightlife to include alternative activities like destruction therapy, which has gained popularity with the city's young professional population and university students.",
    localContext: "Rage room venues in Leeds are generally located in or near the city centre, within easy reach of Leeds City Station. The city's compact centre means most venues are walkable from the main shopping and dining areas. Visitors can pair a rage room session with a visit to Leeds Kirkgate Market or the bars and restaurants of Call Lane.",
    travelTip: "Leeds is easily reached by train from York, Bradford, Harrogate, and Sheffield. Weekend trains from London Kings Cross take around two hours, making a Leeds rage room session feasible as part of a weekend trip to Yorkshire.",
  },
  liverpool: {
    intro: "Liverpool's rage room scene reflects the city's appetite for unique, experience-based entertainment. With a reputation for big personalities and a love of fun, the city's destruction therapy venues attract a lively crowd — from stag and hen parties to birthday groups and couples. Liverpool's venues often reflect the city's character with energetic atmospheres and music-friendly setups.",
    localContext: "Most rage room venues in Liverpool are accessible from the city centre, with Liverpool Lime Street station providing good rail connections. The Baltic Triangle and nearby creative districts are common locations for experience businesses, sitting alongside street food markets, galleries, and live music venues.",
    travelTip: "Liverpool is a short train ride from Manchester, Chester, and the Wirral. If you're on Merseyside, Liverpool's rage rooms are the nearest option. Consider combining a session with a visit to the nearby Albert Dock or the city's music heritage sites.",
  },
  bristol: {
    intro: "Bristol's alternative culture and creative energy make it a natural home for rage rooms in the South West. The city attracts a diverse crowd to its destruction therapy venues — from the creative types in Stokes Croft to professionals in Clifton and students from the University of Bristol and UWE. Bristol's venues tend to embrace the city's independent spirit with unique touches and relaxed atmospheres.",
    localContext: "Rage rooms in Bristol are often situated in the city's industrial and creative quarters, with areas like St Philips and Bedminster being common locations. Bristol Temple Meads station provides access from across the region, and the city's bus network covers most venue locations. Parking can be limited in the city centre, so public transport or cycling is often the better option.",
    travelTip: "Bristol is well-connected from Bath, Swindon, Cardiff, and Exeter by rail. For South West residents, it's often the closest city with established rage room venues. Book ahead for Friday evening slots, which tend to be popular.",
  },
  sheffield: {
    intro: "Sheffield, known for its steel industry heritage, has embraced the rage room concept with venues that tap into the city's industrial roots. Destruction therapy here appeals to South Yorkshire's mix of university students, young professionals, and families looking for unconventional weekend activities. Sheffield's venue prices tend to be competitive compared to larger cities like Manchester and London.",
    localContext: "Rage room venues in Sheffield are typically found in the city's industrial estates and commercial areas. Sheffield station provides good rail access, and the Supertram network extends to various parts of the city. Kelham Island, with its mix of bars, restaurants, and creative businesses, is a popular area for combining a rage room session with other activities.",
    travelTip: "Sheffield sits between Manchester, Leeds, and Nottingham, making it reachable within an hour by train from any of these cities. If you're in South Yorkshire, Rotherham, or Barnsley, Sheffield's rage rooms are the most convenient option.",
  },
  newcastle: {
    intro: "Newcastle upon Tyne's rage room offerings serve the North East's demand for unique entertainment. The Geordie spirit is well-suited to the high-energy nature of destruction therapy, and the city's venues attract a mix of locals and visitors from across the region. Newcastle's rage rooms have become popular for hen and stag dos, capitalising on the city's existing reputation as a destination for group celebrations.",
    localContext: "Venues in Newcastle tend to be located around the city centre and Ouseburn Valley area, both accessible from Newcastle Central Station. The city's compact layout means most rage rooms are within walking distance of the Quayside restaurants and bars, making it easy to build an evening around a rage room session.",
    travelTip: "Newcastle is the North East's transport hub, easily reached from Sunderland, Durham, and Middlesbrough. The East Coast Main Line connects the city to Edinburgh, York, and London. If you're visiting the North East, Newcastle is likely the nearest city with rage room options.",
  },
  nottingham: {
    intro: "Nottingham's rage room scene caters to the East Midlands, drawing visitors from across the region. The city's strong student population from the University of Nottingham and Nottingham Trent University has helped drive interest in alternative entertainment like destruction therapy. Venues in Nottingham tend to be welcoming to first-timers, making the city a good starting point for anyone curious about rage rooms.",
    localContext: "Rage rooms in Nottingham are often located in the city's commercial districts and industrial parks. Nottingham station provides rail connections across the East Midlands, and the city's tram system covers additional areas. The Lace Market and Hockley areas are popular for combining a rage room visit with an evening out.",
    travelTip: "Nottingham is centrally placed between Derby, Leicester, and Lincoln, with all three within an hour by train. For East Midlands residents, Nottingham is the most likely city to find an established rage room venue.",
  },
  glasgow: {
    intro: "Glasgow brings its famously energetic character to the rage room experience. Scotland's largest city has seen growing interest in destruction therapy as an alternative to traditional entertainment, with venues catering to Glasgow's mix of young professionals, students, and groups looking for an adrenaline-fuelled activity. The city's rage rooms often reflect Glasgow's no-nonsense, fun-first attitude.",
    localContext: "Rage room venues in Glasgow are generally accessible from the city centre, with Glasgow Central and Queen Street stations serving as main arrival points. The city's excellent underground and bus network make reaching venues straightforward. Many visitors combine their session with a trip to the nearby Merchant City or West End restaurants and pubs.",
    travelTip: "Glasgow is well-connected from Edinburgh (under an hour by train), Stirling, and the wider Central Belt. For visitors from the Scottish Highlands or Borders, Glasgow is likely the nearest city offering rage room experiences.",
  },
  edinburgh: {
    intro: "Edinburgh's rage room options offer an alternative to the city's more traditional tourist attractions. While the Scottish capital is best known for its historic architecture and festivals, its destruction therapy venues provide locals and visitors with a physical, hands-on activity that contrasts with the city's cultural offerings. Edinburgh's venues tend to attract a mix of festival-goers, tourists, and residents.",
    localContext: "Rage rooms in Edinburgh are typically found outside the historic city centre, in more industrial areas with the space needed for destruction venues. Edinburgh Waverley station is the main arrival point, with venues generally reachable by bus or a short taxi ride. Leith and the surrounding areas are common locations for experience-based businesses.",
    travelTip: "Edinburgh is a short train ride from Glasgow and well-connected to England via the East Coast Main Line. During the Edinburgh Fringe (August), rage room venues can be busier than usual, so booking ahead during festival season is recommended.",
  },
  cardiff: {
    intro: "Cardiff serves as Wales' main hub for rage room experiences. The Welsh capital's growing entertainment scene now includes destruction therapy venues that attract visitors from across South Wales. Cardiff's rage rooms are popular with groups — from rugby match after-parties to birthday celebrations and corporate events that take advantage of the city's central location in Wales.",
    localContext: "Venues in Cardiff are generally located in or around the city centre and Bay area, with Cardiff Central station providing good rail access. The proximity to Cardiff Bay's restaurants and entertainment venues makes it easy to combine a rage room session with other activities. Street parking and multi-story car parks are available near most venues.",
    travelTip: "Cardiff is easily reached from Swansea, Newport, and Bristol by train. For anyone in South Wales, Cardiff's rage rooms are likely the closest option. Fans attending events at the Principality Stadium can add a pre-match rage room session to their day.",
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

export function getGenericCityContent(cityName: string, listingCount: number): CityContent {
  const countDesc = listingCount === 1 ? "a rage room venue" : `${listingCount} rage room venues`

  return {
    intro: `${cityName} is home to ${countDesc} listed in our directory. Whether you're a local resident or visiting the area, destruction therapy offers a unique way to relieve stress, celebrate special occasions, or try something completely different from typical entertainment options. Browse the listings below to find venues, compare starting prices, and visit their websites for the latest availability and booking information.`,
    localContext: `Rage rooms in ${cityName} provide supervised destruction therapy sessions where visitors are given safety equipment and a selection of items to break. Each venue sets its own pricing, packages, and rules, so we recommend checking directly with the venue before booking. Most rage rooms require advance booking, especially for weekend sessions and group events.`,
    travelTip: `If you're travelling to ${cityName} for a rage room session, check the venue's website for directions and parking information. Many rage rooms are located in industrial or commercial areas with dedicated parking.`,
  }
}
