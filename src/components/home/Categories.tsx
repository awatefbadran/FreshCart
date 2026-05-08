"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getCategories } from "@/components/services/apiCall";
import Image from "next/image";

import { Category } from "@/types/index";
import Loader from "@/components/ui/Loader";
import SectionHeader from "./SectionHeader";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader />;

  return (
    <section className="container mx-auto py-8">
      <div className="container mx-auto py-8 px-4">
        <SectionHeader title="Shop By" highlight="Category" href="/categories" linkLabel="View All Categories" />


        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <Link key={cat._id} href={`/categories/${cat._id}`}>
              <div className="bg-white rounded-lg p-4 text-center shadow-sm hover:shadow-md transition group cursor-pointer flex items-center flex-col justify-center gap-3">
                
                <div className="w-24 h-24 rounded-full overflow-hidden border border-gray-200">
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-sm text-gray-700 font-medium text-center">
                  {cat.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
