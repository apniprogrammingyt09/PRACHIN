import DonutLoading from "@/components/donut-loading"

export default function CouponsLoading() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <DonutLoading size="lg" />
        <p className="text-[#4A7C59] mt-4">Loading coupons...</p>
      </div>
    </div>
  )
}
