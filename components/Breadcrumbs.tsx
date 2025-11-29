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
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-white">
          {items.map((item, index) => (
            <li key={index} className="flex items-center">
              {index > 0 && <span className="mx-2 text-zinc-400">/</span>}
              {item.href ? (
                <Link
                  href={item.href}
                  className="hover:text-orange-500 transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="text-white">{item.label}</span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  )
}



