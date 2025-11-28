export default function Container({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  )
}




