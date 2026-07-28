export default function RageResetLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <main id="main-content" role="main" className="min-h-[100dvh] bg-dark-950">
      {children}
    </main>
  )
}
