import { Metadata } from "next"
import Breadcrumbs from "@/components/Breadcrumbs"
import Link from "next/link"

export const metadata: Metadata = {
  title: "What Happens in a Rage Room? Complete First-Time Guide",
  description: "Step-by-step guide to your first rage room experience. Learn what to expect, how to prepare, and what happens during a rage room session in the UK.",
  openGraph: {
    title: "What Happens in a Rage Room? First-Time Visitor Guide",
    description: "Complete guide to rage room experiences: from arrival to smashing, everything you need to know for your first visit.",
    type: "article",
  },
}

export default function WhatHappensInARageRoomPage() {
  return (
    <div className="py-6 sm:py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: "Guides", href: "/guides" },
            { label: "What Happens in a Rage Room?" },
          ]}
        />

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 sm:mb-6 mt-4">
          What Happens in a Rage Room? Complete First-Time Guide
        </h1>

        <div className="space-y-6 text-base sm:text-lg text-zinc-300">
          <p className="text-xl text-white font-semibold">
            If you're curious about rage rooms but unsure what to expect, this step-by-step guide will walk you through everything that happens during a typical rage room session in the UK, from booking to cleanup.
          </p>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Before You Arrive: Booking and Preparation
            </h2>
            <p>
              Most rage rooms in the UK require advance booking, especially for weekends and group sessions. When you book, you'll typically:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Choose your session length (usually 30 or 60 minutes)</li>
              <li>Select a package (basic, standard, or premium)</li>
              <li>Pay a deposit or full amount</li>
              <li>Receive confirmation with arrival instructions</li>
            </ul>
            <p className="mt-4">
              Before your visit, wear comfortable clothes you don't mind getting dirty (though you'll wear coveralls). Closed-toe shoes with good grip are essential—some venues provide protective footwear, but it's best to check. Avoid loose jewelry or accessories that could get caught on equipment.
            </p>
            <p className="mt-4">
              Arrive 10-15 minutes early to allow time for check-in, safety briefing, and getting suited up. Most venues have parking available, but check their website or confirmation email for specific directions and parking information.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 1: Arrival and Check-In
            </h2>
            <p>
              When you arrive at the venue, you'll check in at the reception desk. Staff will:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Confirm your booking and verify your details</li>
              <li>Ask you to sign a waiver (standard liability form)</li>
              <li>Check your age (most venues require participants to be 16+)</li>
              <li>Answer any questions you have</li>
              <li>Provide information about facilities (toilets, lockers, etc.)</li>
            </ul>
            <p className="mt-4">
              This is a good time to ask about anything you're unsure about, such as what items are included in your package, whether you can bring your own music, or if video recording is available.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 2: Safety Briefing
            </h2>
            <p>
              Before entering the rage room, all participants receive a comprehensive safety briefing. This typically covers:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Safety equipment:</strong> How to properly wear and use all protective gear</li>
              <li><strong>Tool usage:</strong> How to safely handle sledgehammers, baseball bats, crowbars, and other tools</li>
              <li><strong>Smashing techniques:</strong> Safe ways to break items without risking injury</li>
              <li><strong>Room rules:</strong> What you can and cannot do during your session</li>
              <li><strong>Emergency procedures:</strong> What to do if you need help or have concerns</li>
              <li><strong>Item selection:</strong> Which items are safe to smash and how to handle them</li>
            </ul>
            <p className="mt-4">
              Pay close attention during the briefing—it's designed to keep you safe and ensure you get the most out of your experience. Don't hesitate to ask questions if anything is unclear.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 3: Getting Suited Up
            </h2>
            <p>
              After the safety briefing, you'll be fitted with protective equipment. Staff will help you with:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Coveralls:</strong> Full-body protective suits that prevent debris from contacting your skin or clothes</li>
              <li><strong>Safety glasses or goggles:</strong> Impact-resistant eye protection that must be worn at all times</li>
              <li><strong>Helmet:</strong> Hard hat or protective helmet to shield your head</li>
              <li><strong>Gloves:</strong> Heavy-duty gloves for grip and hand protection</li>
              <li><strong>Footwear:</strong> Some venues provide steel-toed boots, or you'll use your own closed-toe shoes</li>
            </ul>
            <p className="mt-4">
              All equipment is mandatory and must be worn throughout your session. Staff will ensure everything fits properly and is secured correctly. Once you're suited up, you'll be ready to enter the rage room.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 4: Entering the Rage Room
            </h2>
            <p>
              The rage room itself is a controlled, enclosed space designed specifically for smashing activities. When you enter, you'll typically find:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Breakable items:</strong> A selection of glass bottles, ceramics, electronics, and other items arranged for smashing</li>
              <li><strong>Tools:</strong> Sledgehammers, baseball bats, crowbars, or other smashing implements</li>
              <li><strong>Walls and floors:</strong> Reinforced surfaces designed to contain debris and withstand impacts</li>
              <li><strong>Lighting:</strong> Good visibility so you can see what you're doing</li>
              <li><strong>Music system:</strong> Many venues have speakers so you can play your favorite tracks</li>
              <li><strong>Ventilation:</strong> Proper air circulation to keep the environment comfortable</li>
            </ul>
            <p className="mt-4">
              The room is designed to be safe and functional. Staff may show you around briefly, point out where items are located, and remind you of key safety points before leaving you to your session.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 5: Your Smashing Session
            </h2>
            <p>
              Once you're in the room and ready, it's time to start smashing! Here's what typically happens:
            </p>
            
            <div className="space-y-4 mt-4">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Choosing Your Tools</h3>
                <p>
                  You'll select from available tools—sledgehammers are popular for maximum impact, baseball bats offer good control, and crowbars are great for prying and breaking. Start with what feels comfortable, and you can switch tools during your session.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Selecting Items to Smash</h3>
                <p>
                  Items are typically arranged around the room. You might find glass bottles, ceramic plates, old electronics (monitors, keyboards, printers), furniture pieces, or other breakable objects. Choose items that appeal to you—some people prefer the satisfying shatter of glass, while others enjoy the impact of breaking larger items.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">The Smashing Experience</h3>
                <p>
                  There's no right or wrong way to smash—it's about releasing stress and having fun. Some people go all out from the start, while others build up intensity. You can smash items individually, create combinations, or focus on specific objects. Many people find the physical act of breaking things surprisingly therapeutic and energizing.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Music and Atmosphere</h3>
                <p>
                  Many venues allow you to play your own music or choose from playlists. The right soundtrack can enhance the experience, whether you want high-energy rock, aggressive metal, or something more personal. The combination of music, physical activity, and the satisfying sound of breaking items creates a unique, immersive experience.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Staff Monitoring</h3>
                <p>
                  While you're in the room, staff monitor your session through windows or cameras to ensure safety. They're there to help if needed but won't interfere unless there's a safety concern. If you need anything or have questions, you can signal staff or they may check in periodically.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 6: During Your Session
            </h2>
            <p>
              As your session progresses, you'll likely notice:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Physical exertion:</strong> Smashing is a workout! You'll work up a sweat and may feel tired, especially if you're going all out. Take breaks if needed—there's no pressure to smash continuously.</li>
              <li><strong>Emotional release:</strong> Many people find rage rooms genuinely therapeutic. The act of breaking things can help release pent-up stress, frustration, or anger in a safe, controlled way.</li>
              <li><strong>Time awareness:</strong> Sessions typically last 30 or 60 minutes. Staff may give you a time warning (like "10 minutes remaining") so you can finish up, or you can track time yourself.</li>
              <li><strong>Debris buildup:</strong> As you smash items, debris accumulates on the floor. This is normal and expected—the room is designed to contain it safely.</li>
              <li><strong>Variety of experiences:</strong> Some people prefer methodical, controlled smashing, while others enjoy the chaos of rapid, energetic breaking. Both approaches are valid—do what feels right for you.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 7: Ending Your Session
            </h2>
            <p>
              When your time is up, staff will let you know. You'll:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Stop smashing and set down your tools</li>
              <li>Exit the rage room carefully (there may be debris on the floor)</li>
              <li>Remove your protective equipment with staff assistance</li>
              <li>Clean up if needed (some venues have wash stations)</li>
              <li>Return any borrowed equipment</li>
            </ul>
            <p className="mt-4">
              Many venues allow you to take photos after your session (some even offer video recording for an additional fee). You might feel energized, relaxed, or a combination of both—reactions vary from person to person.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Step 8: After Your Session
            </h2>
            <p>
              After you've finished and cleaned up, you can:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li>Take photos in designated areas (some venues have photo spots)</li>
              <li>Purchase video footage if available</li>
              <li>Buy merchandise or souvenirs</li>
              <li>Book another session if you enjoyed it</li>
              <li>Leave feedback or reviews</li>
            </ul>
            <p className="mt-4">
              Staff are usually happy to answer questions about your experience or discuss booking future visits. Many people find rage rooms addictive and return for additional sessions.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              What to Expect: Common Experiences
            </h2>
            <p>
              Everyone's rage room experience is unique, but here are common things people notice:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Physical workout:</strong> You'll likely work up a sweat and feel physically tired afterward</li>
              <li><strong>Emotional release:</strong> Many people feel a sense of relief, relaxation, or catharsis</li>
              <li><strong>Adrenaline rush:</strong> The excitement and physical activity can create an adrenaline high</li>
              <li><strong>Laughter and fun:</strong> Despite the name "rage room," many people find the experience fun and even hilarious</li>
              <li><strong>Surprise at effectiveness:</strong> People often report feeling better than expected after a session</li>
              <li><strong>Desire to return:</strong> Many first-time visitors become repeat customers</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Tips for First-Time Visitors
            </h2>
            <p>
              To get the most out of your first rage room experience:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Start slow:</strong> You don't need to go full force immediately—build up intensity as you get comfortable</li>
              <li><strong>Try different tools:</strong> Experiment with different implements to find what you enjoy</li>
              <li><strong>Focus on fun:</strong> Don't overthink it—just enjoy the experience</li>
              <li><strong>Stay hydrated:</strong> Bring water if allowed, or drink before/after your session</li>
              <li><strong>Wear appropriate clothing:</strong> Comfortable, breathable clothes work best</li>
              <li><strong>Ask questions:</strong> Staff are there to help—don't hesitate to ask if unsure about anything</li>
              <li><strong>Take breaks:</strong> If you get tired, pause and catch your breath</li>
              <li><strong>Enjoy the moment:</strong> Put away your phone and be present in the experience</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Group vs Solo Sessions
            </h2>
            <p>
              Rage rooms can be enjoyed solo or with others:
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4 mt-4">
              <li><strong>Solo sessions:</strong> Perfect for personal stress relief, reflection, or when you want a private experience</li>
              <li><strong>Group sessions:</strong> Great for couples, friends, team building, or celebrations. You may share a room or have separate sessions depending on the venue</li>
              <li><strong>Mixed experiences:</strong> Some venues allow you to take turns or smash together in the same space</li>
            </ul>
            <p className="mt-4">
              Both options offer unique benefits. Solo sessions provide privacy and personal focus, while group sessions add social fun and shared memories.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-white mt-8 mb-4">
              Conclusion
            </h2>
            <p>
              A rage room session is a structured, safe, and controlled experience designed to help you release stress through smashing items. From arrival and safety briefing to getting suited up, smashing, and cleanup, the entire process is designed to be both safe and satisfying.
            </p>
            <p className="mt-4">
              Whether you're looking for stress relief, a unique date activity, team building, or just something different to try, rage rooms offer a memorable experience. The combination of physical activity, emotional release, and the unique satisfaction of breaking things creates an experience many people find surprisingly therapeutic and enjoyable.
            </p>
            <p className="mt-4">
              Ready to try it yourself? <Link href="/listings" className="text-orange-500 hover:text-orange-600 underline">Browse our directory of rage rooms</Link> across the UK to find a venue near you. Check out our guides on <Link href="/guides/are-rage-rooms-safe-uk" className="text-orange-500 hover:text-orange-600 underline">rage room safety</Link> and <Link href="/guides/how-much-do-rage-rooms-cost-uk" className="text-orange-500 hover:text-orange-600 underline">pricing</Link> to prepare for your visit. You can also explore rage rooms by city, such as <Link href="/city/london" className="text-orange-500 hover:text-orange-600 underline">London</Link>, <Link href="/city/birmingham" className="text-orange-500 hover:text-orange-600 underline">Birmingham</Link>, or <Link href="/city/manchester" className="text-orange-500 hover:text-orange-600 underline">Manchester</Link>.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
