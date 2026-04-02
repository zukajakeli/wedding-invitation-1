import dynamic from "next/dynamic";

export const Map = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full max-w-4xl mx-auto rounded-lg overflow-hidden bg-stone-200 animate-pulse flex items-center justify-center font-serif text-stone-500">
      Loading map...
    </div>
  ),
});
