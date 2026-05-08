import Link from "next/link";
import FeaturedProducts from "@/components/home/FeaturedProducts";

export default function ShopPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <section className="rounded-[2rem] overflow-hidden shadow-xl border border-gray-100 mb-8">
          <div className="bg-linear-to-br from-green-600 via-green-500 to-green-400 text-white px-8 py-12 sm:px-12 sm:py-16">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white/80 mb-6">
              <Link className="hover:text-white transition-colors" href="/">
                Home
              </Link>
              <span>/</span>
              <span className="text-white font-medium">Shop</span>
            </nav>
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  FreshCart Shop
                </h1>
                <p className="mt-4 max-w-2xl text-lg leading-8 text-white/90">
                  Discover featured products, top deals, and the hottest items
                  in one place.
                </p>
              </div>
              <div className="rounded-[2rem] bg-white/10 border border-white/15 p-6 text-sm text-white shadow-lg backdrop-blur-md">
                <p className="font-semibold">Shop curated collections</p>
                <p className="mt-2 text-white/85">
                  Browse the freshest items, new arrivals and trending products
                  from your favourite brands.
                </p>
              </div>
            </div>
          </div>
        </section>
        <FeaturedProducts />
      </div>
    </main>
  );
}
