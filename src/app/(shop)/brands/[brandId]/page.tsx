import Image from "next/image";
import Link from "next/link";
import { getBrandById, getProducts } from "@/components/services/apiCall";
import { Brand, Product } from "@/types/index";

interface BrandPageProps {
  params: Promise<{
    brandId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function BrandPage({ params }: BrandPageProps) {
  const { brandId } = await params;
  const [brand, products] = await Promise.all([
    getBrandById(brandId),
    getProducts(50),
  ]);
  const brandProducts = products.filter(
    (product: Product) => product.brand?._id === brandId,
  );

  if (!brand) {
    return (
      <section className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="rounded-[2rem] bg-white p-12 shadow-xl border border-gray-100 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Brand not found
            </h1>
            <p className="text-gray-500 mb-6">
              The brand you are looking for does not exist.
            </p>
            <Link
              href="/brands"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Back to Brands
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] overflow-hidden shadow-xl mb-8">
          <div className="bg-linear-to-br from-purple-600 via-violet-500 to-fuchsia-500 text-white px-8 py-12 sm:px-12 sm:py-16">
            <nav className="flex flex-wrap items-center gap-2 text-sm text-white/80 mb-6">
              <Link className="hover:text-white transition-colors" href="/">
                Home
              </Link>
              <span>/</span>
              <Link
                className="hover:text-white transition-colors"
                href="/brands"
              >
                Brands
              </Link>
              <span>/</span>
              <span className="font-medium">{brand.name}</span>
            </nav>

            <div className="grid gap-8 lg:grid-cols-[auto_1fr] lg:items-center">
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
                  {brand.name}
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-white/90">
                  Explore the latest products from {brand.name}. Browse the
                  brand collection, bestsellers and exclusive finds.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/15 px-4 py-2 text-sm text-white">
                    {brandProducts.length} products
                  </span>
                  <Link
                    href="/products"
                    className="rounded-full bg-white/20 px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition"
                  >
                    Browse all products
                  </Link>
                </div>
              </div>
              <div className="relative h-56 rounded-[2rem] overflow-hidden bg-white/10 border border-white/20">
                <Image
                  src={brand.image}
                  alt={brand.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading="eager"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {brandProducts.map((product: Product, index: number) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              className="group overflow-hidden rounded-[1.85rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-72 bg-gray-50 p-6">
                <Image
                  src={product.imageCover}
                  alt={product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  loading={index === 0 ? "eager" : "lazy"}
                  unoptimized
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-sm font-semibold text-green-600 mb-2">
                  {product.category.name}
                </p>
                <h2 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
                  {product.title}
                </h2>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-bold text-gray-900">
                    {product.price} EGP
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                    {product.ratingsAverage?.toFixed(1) || "0.0"}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
