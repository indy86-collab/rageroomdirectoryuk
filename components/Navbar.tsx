import Link from "next/link"

export default function Navbar() {
  return (
    <nav className="relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex justify-center items-center space-x-8">
          <Link
            href="/"
            className="text-white uppercase font-display text-xl tracking-wider hover:text-orange-500 transition-colors"
          >
            RAGE
          </Link>
          <Link
            href="/"
            className="text-white uppercase font-display text-xl tracking-wider hover:text-orange-500 transition-colors"
          >
            DIRECTORY
          </Link>
        </div>
      </div>
    </nav>
  )
}




