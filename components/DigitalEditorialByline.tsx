import Link from "next/link"

type DigitalEditorialBylineProps = {
  className?: string
  align?: "left" | "center"
}

export default function DigitalEditorialByline({
  className = "",
  align = "left",
}: DigitalEditorialBylineProps) {
  return (
    <p
      className={`text-xs leading-relaxed text-zinc-500 ${
        align === "center" ? "text-center" : ""
      } ${className}`}
    >
      Made by the RageRoom Directory editorial team ·{" "}
      <Link
        href="/about"
        className="font-semibold text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
      >
        About
      </Link>{" "}
      ·{" "}
      <Link
        href="/editorial-policy"
        className="font-semibold text-zinc-400 underline-offset-2 hover:text-zinc-200 hover:underline"
      >
        Editorial policy
      </Link>
    </p>
  )
}
