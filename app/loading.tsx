import { AppLoader } from "@/components/ui/app-loader"

/**
 * Global loading UI — Next.js automatically wraps every route segment in a
 * <Suspense> boundary using this file. No manual <Suspense> is needed in
 * individual pages.
 */
export default function Loading() {
  return <AppLoader />
}
