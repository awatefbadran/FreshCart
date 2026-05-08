import Image from "next/image";

export default function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="flex flex-col items-center gap-6 rounded-3xl bg-white p-8 shadow-[0_32px_90px_-60px_rgba(20,184,166,0.45)]">
        <div className="rounded-full bg-white p-6 shadow-lg">
          <div className="animate-beat inline-flex items-center justify-center">
            <Image
              src="/freshcart-logo.svg"
              alt="FreshCart"
              width={140}
              height={40}
              className="object-contain"
              priority
            />
          </div>
        </div>
        <div className="text-center text-sm text-slate-600 animate-fade">
          Loading FreshCart...
        </div>
      </div>
    </div>
  );
}
