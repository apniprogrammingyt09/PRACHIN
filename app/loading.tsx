import { DonutLoading } from "@/components/donut-loading"

export default function Loading() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#FFF9F0]">
      <DonutLoading size="lg" message="Loading our bakery..." />
    </div>
  )
}
