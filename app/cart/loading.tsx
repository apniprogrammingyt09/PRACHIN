import DonutLoading from "@/components/donut-loading"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <DonutLoading size="lg" message="Loading your cart..." />
    </div>
  )
}
