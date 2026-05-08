import Link from "next/link";

interface SectionHeaderProps {
  title: string;
  highlight: string;
  href?: string;
  linkLabel?: string;
}

export default function SectionHeader({ title, highlight, href, linkLabel }: SectionHeaderProps) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div
          className="w-1.5 h-8 rounded-full"
          style={{ background: "linear-gradient(to bottom, #00BC7D, #007A55)" }}
        />
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title} <span className="text-green-600">{highlight}</span>
        </h2>
      </div>
      {href && linkLabel && (
        <Link href={href} className="text-green-600 hover:text-green-700 font-medium flex items-center">
          {linkLabel} →
        </Link>
      )}
    </div>
  );
}