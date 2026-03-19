interface GuideCityContent {
  intro: string
  sceneDescription: string
  whatToLookFor: string
  localTip: string
}

const guideCityContentMap: Record<string, GuideCityContent> = {
  birmingham: {
    intro: "Birmingham is home to some of the Midlands' best rage room experiences. As the UK's second city, Birmingham has seen steady growth in alternative entertainment, and its rage room venues benefit from a large local population and strong transport links from across the West Midlands.",
    sceneDescription: "Birmingham's rage room scene tends to cater to a broad audience. Corporate bookings are common, with businesses in the Jewellery Quarter and city centre using sessions for team bonding. The Digbeth and Bordesley areas are popular locations for experience venues. Pricing in Birmingham typically sits below London rates, making it good value for what you get.",
    whatToLookFor: "When choosing a rage room in Birmingham, consider how easy the venue is to reach from your location — the city is spread out, and some venues are in industrial areas away from the centre. Check whether the venue caters to your group size, as some Birmingham venues specialise in smaller private sessions while others focus on larger groups.",
    localTip: "If you're visiting Birmingham from elsewhere in the Midlands, New Street station puts you within a short taxi ride of most venues. Combine your session with dinner in the Bullring or a drink in Digbeth for a full evening out.",
  },
  bristol: {
    intro: "Bristol's independent spirit makes it one of the more interesting cities in England for rage room experiences. The South West's largest city has a creative, slightly counter-cultural energy that extends to its alternative entertainment offerings, including destruction therapy venues that tend to feel less corporate and more grassroots.",
    sceneDescription: "Rage rooms in Bristol often reflect the city's DIY ethos — expect character over polish. Venues are typically found in repurposed industrial spaces in areas like St Philips and Bedminster. Bristol's student population and young professional demographic keep demand strong, particularly for Friday evening and weekend sessions.",
    whatToLookFor: "Bristol venues can vary quite a bit in style and atmosphere. Some lean into the party vibe with music and group energy, while others offer a more focused, individual experience. If you have a preference, it's worth checking each venue's website or social media to get a feel for their style before booking.",
    localTip: "Parking in central Bristol can be challenging. If you're driving, check whether your chosen venue has its own parking. Temple Meads station is the main rail hub, and many venues are reachable from there by bus or a short taxi ride.",
  },
  leeds: {
    intro: "Leeds offers a growing range of rage room experiences for West Yorkshire's large population. As one of the UK's major cities with two universities and a thriving professional sector, Leeds has strong demand for the kind of alternative, high-energy entertainment that rage rooms provide.",
    sceneDescription: "The rage room scene in Leeds caters to a mix of students, young professionals, and corporate groups. Venues tend to be in or near the city centre, making them accessible for post-work sessions or weekend outings. Pricing in Leeds is generally competitive — lower than London and comparable to other northern cities like Manchester and Sheffield.",
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
    intro: "Manchester's rage room scene is one of the strongest in northern England. The city's population, combined with its reputation as a destination for group entertainment and nights out, means rage rooms here do consistent business — particularly on Friday evenings and weekends.",
    sceneDescription: "Venues in Manchester are spread across the city centre and surrounding areas like Ancoats, Salford, and Trafford. The Northern Quarter and Deansgate areas are popular starting or ending points for groups combining a rage room session with food and drinks. Manchester venues tend to be well-run and experienced, having benefited from the city's early adoption of the rage room concept.",
    whatToLookFor: "Manchester has enough venues to give you genuine choice. Compare not just prices but also what's included in each package — some venues offer more breakable items or longer sessions at similar price points. Reviews from other visitors can help distinguish between venues that are similar on paper.",
    localTip: "Both Piccadilly and Victoria stations serve Manchester. If you're coming from Liverpool, Leeds, or Sheffield, the train is typically the quickest option. For groups, booking a restaurant near your chosen venue in advance is a good idea — Manchester's popular spots fill up on weekends.",
  },
  newcastle: {
    intro: "Newcastle upon Tyne's rage room offerings cater to the North East's demand for unique group activities. The city's reputation as one of the UK's top party destinations means its experience-based venues — including rage rooms — attract a lively, social crowd, particularly around weekends.",
    sceneDescription: "Rage rooms in Newcastle serve both the local Geordie population and the steady stream of visitors who come to the city for celebrations. The Ouseburn Valley area, already a creative and entertainment hub, is a natural home for experience businesses. Sunderland, Durham, and Gateshead residents also use Newcastle as their nearest rage room city.",
    whatToLookFor: "Newcastle's rage rooms tend to be popular with groups, so if you're planning a visit for a stag, hen, or birthday party, book well in advance — especially for Saturday afternoon and evening slots. For solo or couples visits, weekday sessions typically offer more flexibility and quieter atmospheres.",
    localTip: "Newcastle Central station is on the East Coast Main Line, making the city accessible from Edinburgh, York, and further south. The Quayside and Ouseburn areas are within walking distance for pre- or post-session food and drinks.",
  },
  nottingham: {
    intro: "Nottingham's rage room scene serves the East Midlands, drawing visitors from across the region. With two large universities and a city centre that punches above its weight for entertainment, Nottingham has a natural audience for alternative activities like destruction therapy.",
    sceneDescription: "Venues in Nottingham tend to be welcoming to first-timers, which fits the city's student-heavy demographic. Many visitors are trying rage rooms for the first time, often as a birthday activity or group outing. The Hockley and Lace Market areas are popular for combining a session with dinner or drinks afterwards.",
    whatToLookFor: "If you're new to rage rooms, Nottingham is a good starting point — venues here often cater to beginners with clear safety briefings and approachable staff. Check whether a venue offers a first-timer package or smaller session option if you want to try it without committing to a full group booking.",
    localTip: "Nottingham station provides connections across the East Midlands. If you're coming from Derby, Leicester, or Lincoln, the journey is typically under an hour. The city's tram system covers additional areas if your chosen venue is outside the immediate city centre.",
  },
  sheffield: {
    intro: "Sheffield's industrial heritage gives its rage room scene an authentic edge. The Steel City's blue-collar roots make the concept of picking up a sledgehammer and breaking things feel oddly fitting, and local venues have embraced this connection. Sheffield offers competitive pricing compared to larger cities, making it an affordable entry point for rage room newcomers.",
    sceneDescription: "Rage rooms in Sheffield draw from the city's mix of university students, young professionals, and South Yorkshire residents. Kelham Island, with its bars and independent businesses, is a popular area for pairing a rage room session with other activities. Sheffield's venues tend to offer straightforward, no-frills experiences at fair prices.",
    whatToLookFor: "Sheffield's strength is value for money. Prices here tend to be lower than Manchester, Leeds, or London for comparable experiences. When comparing venues, look at what's included in the base price — the number of items, session length, and whether tools are unlimited or allocated per person can vary.",
    localTip: "Sheffield station sits between Manchester and Leeds on the trans-Pennine rail route. For visitors from Rotherham, Barnsley, Doncaster, or Chesterfield, Sheffield is the nearest city with established rage room venues.",
  },
  london: {
    intro: "London has the UK's most established and varied rage room scene, with venues spread across multiple boroughs. The capital's size and diversity mean you can find everything from budget-friendly sessions in East London warehouses to premium experiences with extended packages. London's fast-paced lifestyle creates constant demand for stress-relief activities, making the city's rage rooms consistently busy.",
    sceneDescription: "Rage rooms in London are found in converted industrial spaces across areas like Hackney, Bermondsey, Battersea, and Tottenham. The competition between venues means standards are generally high, and many London rage rooms have developed distinct identities — some focusing on the party atmosphere, others on the therapeutic angle. Corporate bookings are a significant part of the London market, with City and Canary Wharf workers making up a notable customer base.",
    whatToLookFor: "With more choice than any other UK city, London lets you be selective. Compare not just price but location convenience (check the nearest Tube station), what's included in each package, and how recent the venue's reviews are. Some London venues also offer additional activities like axe throwing or paint rooms, which can add value if you're looking for a longer experience.",
    localTip: "Book at least a week ahead for weekend sessions — London venues fill up fast. If you're flexible on timing, weekday evening sessions (typically Tuesday-Thursday) often have better availability and sometimes promotional pricing.",
  },
}

export function getGuideCityContent(cityName: string): GuideCityContent | null {
  const key = cityName.toLowerCase().replace(/\s+/g, "-")
  return guideCityContentMap[key] || null
}
