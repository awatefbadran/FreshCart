import Image from "next/image";
import Link from "next/link";
import { getProducts } from "@/components/services/apiCall";
import { Product } from "@/types/index";

interface CategoryPageProps {
  params: Promise<{
    categoryId: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { categoryId } = await params;
  const products: Product[] = await getProducts(50);
  const filteredProducts = products.filter(
    (product) => product.category._id === categoryId,
  );
  const categoryName = filteredProducts[0]?.category.name || "Category";

  return (
    <section className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4">
        <div className="rounded-[2rem] bg-white p-8 shadow-xl border border-gray-100 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">
                {categoryName}
              </h1>
              <p className="text-gray-600 mt-2">
                Browse all products in this category.
              </p>
            </div>
            <Link
              href="/categories"
              className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-green-50 px-5 py-3 text-sm font-semibold text-green-700 hover:bg-green-100 transition"
            >
              Back to categories
            </Link>
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-3xl bg-white p-12 text-center shadow-sm border border-gray-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-3">
              No products found
            </h2>
            <p className="text-gray-500 mb-6">
              There are no products available for this category right now.
            </p>
            <Link
              href="/products"
              className="inline-flex items-center justify-center rounded-full bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition"
            >
              Browse all products
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group overflow-hidden rounded-[1.75rem] border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-72 bg-gray-50">
                  <Image
                    src={product.imageCover}
                    alt={product.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    loading={index === 0 ? "eager" : "lazy"}
                    unoptimized
                    className="object-contain p-6 transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                    {product.description || product.title}
                  </p>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-green-700 font-bold text-lg">
                      {product.price} EGP
                    </span>
                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {product.ratingsAverage?.toFixed(1) || "-"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
