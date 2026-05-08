import Link from "next/link";
import { getProduct } from "@/components/services/apiCall";
import ProductGallery from "@/components/products/ProductGallery/ProductGallery";
import ProductActions from "@/components/products/ProductActions/ProductActions";
import ProductReviews from "@/components/products/ProductReviews/ProductReviews";
import ProductSuggest from "@/components/products/ProductSuggest/ProductSuggest";
interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function productDetailsPage({ params }: PageProps) {
  const { productId } = await params;
  let product = null;

  try {
    product = await getProduct(productId);
  } catch (error) {
    console.error("Unable to load product:", error);
  }

  if (!product) {
    return (
      <div className="py-20 text-center text-2xl font-bold">
        Product not found!
      </div>
    );
  }
  const images = product?.images || [];
  return (
    <>
      <nav className="py-4">
        <div className="container">
          <ol className="flex items-center flex-wrap gap-1 text-sm">
            <li className="flex items-center">
              <Link
                href="/"
                className="text-gray-500 group hover:text-green-600 transition flex items-center gap-1.5"
              >
                <svg
                  width="15"
                  height="12"
                  viewBox="0 0 15 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="group-hover:fill-green-600"
                >
                  <path
                    d="M8.01091 0.20155C7.72263 -0.0656372 7.27732 -0.0656372 6.99138 0.20155L1.74138 5.07655C1.51638 5.28749 1.44138 5.61327 1.55388 5.89921C1.66638 6.18514 1.9406 6.37499 2.24998 6.37499H2.62498V10.5C2.62498 11.3273 3.29763 12 4.12498 12H10.875C11.7023 12 12.375 11.3273 12.375 10.5V6.37499H12.75C13.0594 6.37499 13.3359 6.18514 13.4484 5.89921C13.5609 5.61327 13.4859 5.28514 13.2609 5.07655L8.01091 0.20155ZM7.12498 7.49999H7.87498C8.49607 7.49999 8.99998 8.00389 8.99998 8.62499V10.875H5.99998V8.62499C5.99998 8.00389 6.50388 7.49999 7.12498 7.49999Z"
                    fill="currentColor"
                  />
                </svg>
                Home
              </Link>
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 text-xs mx-2"
              >
                <path
                  d="M11.0415 5.4703C11.3344 5.76327 11.3344 6.23905 11.0415 6.53202L6.54146 11.032C6.24849 11.325 5.77271 11.325 5.47974 11.032C5.18677 10.7391 5.18677 10.2633 5.47974 9.9703L9.45005 5.99999L5.48208 2.02968C5.18911 1.73671 5.18911 1.26093 5.48208 0.967957C5.77505 0.674988 6.25083 0.674988 6.5438 0.967957L11.0438 5.46796L11.0415 5.4703Z"
                  fill="#99A1AF"
                />
              </svg>
            </li>
            <li className="flex items-center">
              <Link
                className="text-gray-500 hover:text-green-600 transition flex items-center gap-1.5"
                href={
                  product?.category?._id
                    ? `/categories/${product.category._id}`
                    : "/categories"
                }
              >
                {product?.category?.name}
              </Link>
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 text-xs mx-2"
              >
                <path
                  d="M11.0415 5.4703C11.3344 5.76327 11.3344 6.23905 11.0415 6.53202L6.54146 11.032C6.24849 11.325 5.77271 11.325 5.47974 11.032C5.18677 10.7391 5.18677 10.2633 5.47974 9.9703L9.45005 5.99999L5.48208 2.02968C5.18911 1.73671 5.18911 1.26093 5.48208 0.967957C5.77505 0.674988 6.25083 0.674988 6.5438 0.967957L11.0438 5.46796L11.0415 5.4703Z"
                  fill="#99A1AF"
                />
              </svg>
            </li>
            <li className="flex items-center">
              <Link
                href={
                  product?.brand?._id
                    ? `/brands/${product.brand._id}`
                    : "/brands"
                }
                className="text-gray-500 hover:text-green-600 transition flex items-center gap-1.5"
              >
                {product?.brand?.name}
              </Link>
              <svg
                width="15"
                height="12"
                viewBox="0 0 15 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-gray-400 text-xs mx-2"
              >
                <path
                  d="M11.0415 5.4703C11.3344 5.76327 11.3344 6.23905 11.0415 6.53202L6.54146 11.032C6.24849 11.325 5.77271 11.325 5.47974 11.032C5.18677 10.7391 5.18677 10.2633 5.47974 9.9703L9.45005 5.99999L5.48208 2.02968C5.18911 1.73671 5.18911 1.26093 5.48208 0.967957C5.77505 0.674988 6.25083 0.674988 6.5438 0.967957L11.0438 5.46796L11.0415 5.4703Z"
                  fill="#99A1AF"
                />
              </svg>
            </li>
            <li className="text-gray-900 font-medium truncate max-w-xs">
              {product?.title}
            </li>
          </ol>
        </div>
      </nav>
      <section className="py-6">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              <ProductGallery images={images} />
            </div>
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Link
                    href={
                      product?.category?._id
                        ? `/categories/${product.category._id}`
                        : "/categories"
                    }
                    className="bg-green-50 text-green-700 text-xs px-3 py-1.5 rounded-full hover:bg-green-100 transition"
                  >
                    {product?.category?.name}
                  </Link>
                  <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-full">
                    {product?.brand?.name}
                  </span>
                </div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                  {product?.title}
                </h1>
                <div className="flex items-center gap-3 mb-4">
                  <div className="text-yellow-400 flex">
                    <svg
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6718 0.409375C10.5437 0.159375 10.2843 0 10.0031 0C9.72183 0 9.46246 0.159375 9.33433 0.409375L7.03433 4.91563L2.03746 5.70937C1.75933 5.75312 1.52808 5.95 1.44058 6.21875C1.35308 6.4875 1.42496 6.78125 1.62183 6.98125L5.19683 10.5594L4.40933 15.5562C4.36558 15.8344 4.48121 16.1156 4.70933 16.2812C4.93746 16.4469 5.23746 16.4719 5.49058 16.3438L10.0031 14.05L14.5125 16.3438C14.7625 16.4719 15.0656 16.4469 15.2937 16.2812C15.5218 16.1156 15.6375 15.8375 15.5937 15.5562L14.8031 10.5594L18.3781 6.98125C18.5781 6.78125 18.6468 6.4875 18.5593 6.21875C18.4718 5.95 18.2437 5.75312 17.9625 5.70937L12.9687 4.91563L10.6718 0.409375Z"
                        fill="#FCC800"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6718 0.409375C10.5437 0.159375 10.2843 0 10.0031 0C9.72183 0 9.46246 0.159375 9.33433 0.409375L7.03433 4.91563L2.03746 5.70937C1.75933 5.75312 1.52808 5.95 1.44058 6.21875C1.35308 6.4875 1.42496 6.78125 1.62183 6.98125L5.19683 10.5594L4.40933 15.5562C4.36558 15.8344 4.48121 16.1156 4.70933 16.2812C4.93746 16.4469 5.23746 16.4719 5.49058 16.3438L10.0031 14.05L14.5125 16.3438C14.7625 16.4719 15.0656 16.4469 15.2937 16.2812C15.5218 16.1156 15.6375 15.8375 15.5937 15.5562L14.8031 10.5594L18.3781 6.98125C18.5781 6.78125 18.6468 6.4875 18.5593 6.21875C18.4718 5.95 18.2437 5.75312 17.9625 5.70937L12.9687 4.91563L10.6718 0.409375Z"
                        fill="#FCC800"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6718 0.409375C10.5437 0.159375 10.2843 0 10.0031 0C9.72183 0 9.46246 0.159375 9.33433 0.409375L7.03433 4.91563L2.03746 5.70937C1.75933 5.75312 1.52808 5.95 1.44058 6.21875C1.35308 6.4875 1.42496 6.78125 1.62183 6.98125L5.19683 10.5594L4.40933 15.5562C4.36558 15.8344 4.48121 16.1156 4.70933 16.2812C4.93746 16.4469 5.23746 16.4719 5.49058 16.3438L10.0031 14.05L14.5125 16.3438C14.7625 16.4719 15.0656 16.4469 15.2937 16.2812C15.5218 16.1156 15.6375 15.8375 15.5937 15.5562L14.8031 10.5594L18.3781 6.98125C18.5781 6.78125 18.6468 6.4875 18.5593 6.21875C18.4718 5.95 18.2437 5.75312 17.9625 5.70937L12.9687 4.91563L10.6718 0.409375Z"
                        fill="#FCC800"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6718 0.409375C10.5437 0.159375 10.2843 0 10.0031 0C9.72183 0 9.46246 0.159375 9.33433 0.409375L7.03433 4.91563L2.03746 5.70937C1.75933 5.75312 1.52808 5.95 1.44058 6.21875C1.35308 6.4875 1.42496 6.78125 1.62183 6.98125L5.19683 10.5594L4.40933 15.5562C4.36558 15.8344 4.48121 16.1156 4.70933 16.2812C4.93746 16.4469 5.23746 16.4719 5.49058 16.3438L10.0031 14.05L14.5125 16.3438C14.7625 16.4719 15.0656 16.4469 15.2937 16.2812C15.5218 16.1156 15.6375 15.8375 15.5937 15.5562L14.8031 10.5594L18.3781 6.98125C18.5781 6.78125 18.6468 6.4875 18.5593 6.21875C18.4718 5.95 18.2437 5.75312 17.9625 5.70937L12.9687 4.91563L10.6718 0.409375Z"
                        fill="#FCC800"
                      />
                    </svg>
                    <svg
                      width="20"
                      height="17"
                      viewBox="0 0 20 17"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10.6718 0.409375C10.5437 0.159375 10.2843 0 10.0031 0C9.72183 0 9.46246 0.159375 9.33433 0.409375L7.03433 4.91563L2.03746 5.70937C1.75933 5.75312 1.52808 5.95 1.44058 6.21875C1.35308 6.4875 1.42496 6.78125 1.62183 6.98125L5.19683 10.5594L4.40933 15.5562C4.36558 15.8344 4.48121 16.1156 4.70933 16.2812C4.93746 16.4469 5.23746 16.4719 5.49058 16.3438L10.0031 14.05L14.5125 16.3438C14.7625 16.4719 15.0656 16.4469 15.2937 16.2812C15.5218 16.1156 15.6375 15.8375 15.5937 15.5562L14.8031 10.5594L18.3781 6.98125C18.5781 6.78125 18.6468 6.4875 18.5593 6.21875C18.4718 5.95 18.2437 5.75312 17.9625 5.70937L12.9687 4.91563L10.6718 0.409375ZM9.25308 3.86875V12.7469L6.12496 14.3375L6.74371 10.4156C6.78121 10.1781 6.70308 9.9375 6.53433 9.76875L3.72808 6.95937L7.64996 6.33437C7.88746 6.29688 8.09058 6.14687 8.19996 5.93437L9.25621 3.86562L9.25308 3.86875ZM10.7531 12.7469V3.86875L11.8093 5.9375C11.9187 6.15 12.1218 6.3 12.3593 6.3375L16.2812 6.9625L13.475 9.77188C13.3062 9.94063 13.2281 10.1812 13.2656 10.4187L13.8843 14.3406L10.7562 12.75L10.7531 12.7469Z"
                        fill="#FCC800"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-600">
                    <span>{product?.ratingsAverage}</span> (
                    <span>{product?.ratingsQuantity}</span> reviews)
                  </span>
                </div>
                <div className="flex items-center flex-wrap gap-3 mb-6">
                  {product?.priceAfterDiscount ? (
                    <>
                      <span className="text-3xl font-bold text-gray-900">
                        {product.priceAfterDiscount} EGP
                      </span>
                      <span className="text-lg text-gray-400 line-through">
                        {product.price} EGP
                      </span>
                      <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium">
                        Save{" "}
                        {Math.round(
                          ((product.price - product.priceAfterDiscount) /
                            product.price) *
                            100,
                        )}
                        %
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">
                      {product?.price} EGP
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mb-6">
                  <span className="flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-full bg-green-50 text-green-700">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    In Stock
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-5 mb-6">
                  <p className="text-gray-600 leading-relaxed">
                    {product?.description}
                  </p>
                </div>
                <ProductActions product={product} />
                <div className="border-t border-gray-100 pt-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M2 3C2 1.89688 2.89687 1 4 1H13C14.1031 1 15 1.89688 15 3V4H16.5844C17.1156 4 17.625 4.20937 18 4.58437L19.4156 6C19.7906 6.375 20 6.88438 20 7.41563V12C20 13.1031 19.1031 14 18 14H17.8969C17.5719 15.1531 16.5094 16 15.25 16C13.9906 16 12.9312 15.1531 12.6031 14H9.39688C9.07188 15.1531 8.00937 16 6.75 16C5.49062 16 4.43125 15.1531 4.10313 14H4C2.89687 14 2 13.1031 2 12V10.5H0.75C0.334375 10.5 0 10.1656 0 9.75C0 9.33438 0.334375 9 0.75 9H4.25C4.66563 9 5 8.66563 5 8.25C5 7.83437 4.66563 7.5 4.25 7.5H0.75C0.334375 7.5 0 7.16563 0 6.75C0 6.33437 0.334375 6 0.75 6H6.25C6.66563 6 7 5.66563 7 5.25C7 4.83437 6.66563 4.5 6.25 4.5H0.75C0.334375 4.5 0 4.16563 0 3.75C0 3.33437 0.334375 3 0.75 3H2ZM18 9V7.41563L16.5844 6H15V9H18ZM8 13.25C8 12.9185 7.8683 12.6005 7.63388 12.3661C7.39946 12.1317 7.08152 12 6.75 12C6.41848 12 6.10054 12.1317 5.86612 12.3661C5.6317 12.6005 5.5 12.9185 5.5 13.25C5.5 13.5815 5.6317 13.8995 5.86612 14.1339C6.10054 14.3683 6.41848 14.5 6.75 14.5C7.08152 14.5 7.39946 14.3683 7.63388 14.1339C7.8683 13.8995 8 13.5815 8 13.25ZM15.25 14.5C15.5815 14.5 15.8995 14.3683 16.1339 14.1339C16.3683 13.8995 16.5 13.5815 16.5 13.25C16.5 12.9185 16.3683 12.6005 16.1339 12.3661C15.8995 12.1317 15.5815 12 15.25 12C14.9185 12 14.6005 12.1317 14.3661 12.3661C14.1317 12.6005 14 12.9185 14 13.25C14 13.5815 14.1317 13.8995 14.3661 14.1339C14.6005 14.3683 14.9185 14.5 15.25 14.5Z"
                            fill="#16A34A"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          Free Delivery
                        </h4>
                        <p className="text-xs text-gray-500">Orders over $50</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10 2C8.225 2 6.62813 2.77187 5.52813 4H7C7.55312 4 8 4.44688 8 5C8 5.55312 7.55312 6 7 6H3C2.44687 6 2 5.55312 2 5V1C2 0.446875 2.44687 0 3 0C3.55313 0 4 0.446875 4 1V2.70937C5.46563 1.05 7.60938 0 10 0C14.4187 0 18 3.58125 18 8C18 12.4187 14.4187 16 10 16C7.28125 16 4.87813 14.6437 3.43438 12.5719C3.11875 12.1187 3.22812 11.4969 3.68125 11.1781C4.13438 10.8594 4.75625 10.9719 5.075 11.425C6.1625 12.9812 7.9625 13.9969 10 13.9969C13.3125 13.9969 16 11.3094 16 7.99687C16 4.68437 13.3125 2 10 2Z"
                            fill="#16A34A"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          30 Days Return
                        </h4>
                        <p className="text-xs text-gray-500">Money back</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center shrink-0">
                        <svg
                          width="20"
                          height="16"
                          viewBox="0 0 20 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M9.99982 0C10.1436 0 10.2873 0.03125 10.4186 0.090625L16.3061 2.5875C16.9936 2.87813 17.5061 3.55625 17.5029 4.375C17.4873 7.475 16.2123 13.1469 10.8279 15.725C10.3061 15.975 9.69982 15.975 9.17794 15.725C3.79044 13.1469 2.51857 7.475 2.50294 4.375C2.49982 3.55625 3.01232 2.87813 3.69982 2.5875L9.58419 0.090625C9.71544 0.03125 9.85607 0 9.99982 0ZM9.99982 2.0875V13.9031C14.3123 11.8156 15.4717 7.19063 15.4998 4.42188L9.99982 2.09063V2.0875Z"
                            fill="#16A34A"
                          />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 text-sm">
                          Secure Payment
                        </h4>
                        <p className="text-xs text-gray-500">100% Protected</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ProductReviews product={product} />
      <ProductSuggest
        categoryId={product.category._id}
        currentProductId={product._id}
      />
    </>
  );
}
