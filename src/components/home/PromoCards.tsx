import Link from "next/link";

export default function PromoCards() {
  return (
    <section className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-emerald-500 to-emerald-700 p-8 text-white">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
            🔥 Deal of the Day
          </span>

          <h2 className="text-3xl font-bold mb-2">Fresh Organic Fruits</h2>
          <p className="text-white/80 mb-4">
            Get up to 40% off on selected organic fruits
          </p>

          <p className="text-3xl font-bold mb-1">
            40% OFF
            <span className="text-sm font-normal">Use code: ORGANIC40</span>
          </p>

          <Link
            href="/products"
            className="mt-4 relative z-10 cursor-pointer bg-white text-green-700 font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            Shop Now →
          </Link>

          <div className="absolute -left-10 -bottom-20 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -right-8 -top-16 w-32 h-32 rounded-full bg-white/10" />
        </div>

        <div className="relative rounded-2xl overflow-hidden bg-linear-to-br from-orange-400 to-rose-500 p-8 text-white">
          <span className="inline-flex items-center gap-1 bg-white/20 text-white text-sm px-3 py-1 rounded-full mb-4">
            ✨ New Arrivals
          </span>

          <h2 className="text-3xl font-bold mb-2">Exotic Vegetables</h2>
          <p className="text-white/80 mb-4">
            Discover our latest collection of premium vegetables
          </p>

          <p className="text-3xl font-bold mb-1">
            25% OFF{" "}
            <span className="text-sm font-normal">Use code: FRESH25</span>
          </p>

          <Link
            href="/products"
            className="mt-4 relative z-10 cursor-pointer bg-white text-orange-500 font-semibold px-6 py-2 rounded-full hover:bg-gray-200 transition inline-flex items-center gap-2"
          >
            Explore Now →
          </Link>

          <div className="absolute -left-10 z-0 -bottom-20 w-48 h-48 rounded-full bg-white/10" />
          <div className="absolute -right-8 z-0 -top-16 w-32 h-32 rounded-full bg-white/10" />
        </div>
      </div>
    </section>
  );
}
