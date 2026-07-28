import Header from "@/components/Header"
import Footer from "@/components/Footer"

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-dark-900">
      <Header />
      <main id="main-content" role="main" className="min-h-screen">
        {children}
      </main>
      <Footer />
    </div>
  )
}
