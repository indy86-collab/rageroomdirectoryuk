import Link from "next/link"
import BreadcrumbSchema from "./BreadcrumbSchema"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <>
      <BreadcrumbSchema items={items} />
      <nav aria-label="Breadcrumb" className="mb-4 sm:mb-6">
        <ol className="flex flex-wrap items-center gap-y-1 text-sm text-white">
          {items.map((item, index) => (
            <li key={index} className="flex min-w-0 items-center">
              {index > 0 && <span className="mx-2 shrink-0 text-zinc-400">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="min-h-11 inline-flex items-center hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="line-clamp-2 text-white">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}
