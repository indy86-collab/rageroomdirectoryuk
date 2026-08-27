export default function EmbedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" role="main" className="min-h-screen bg-dark-900">
      {children}
    </main>
  )
}
