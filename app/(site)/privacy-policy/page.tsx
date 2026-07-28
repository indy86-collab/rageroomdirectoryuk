import { redirect } from "next/navigation"

// Redirect /privacy-policy to /privacy for consistency
export default function PrivacyPolicyPage() {
  redirect("/privacy")
}
