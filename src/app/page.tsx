import dynamic from "next/dynamic";
import PageLoader from "@/components/ui/PageLoader";

const MainSlider = dynamic(() => import("@/components/home/MainSlider"), {
  loading: () => <PageLoader />,
});
const Features = dynamic(() => import("@/components/home/Features"), {
  loading: () => <PageLoader />,
});
const Categories = dynamic(() => import("@/components/home/Categories"), {
  loading: () => <PageLoader />,
});
const PromoCards = dynamic(() => import("@/components/home/PromoCards"), {
  loading: () => <PageLoader />,
});
const FeaturedProducts = dynamic(
  () => import("@/components/home/FeaturedProducts"),
  { loading: () => <PageLoader /> },
);
const Newsletter = dynamic(() => import("@/components/home/Newsletter"), {
  loading: () => <PageLoader />,
});

export default function Home() {
  return (
    <>
      <MainSlider />
      <Features />
      <Categories />
      <PromoCards />
      <FeaturedProducts />
      <Newsletter />
    </>
  );
}
