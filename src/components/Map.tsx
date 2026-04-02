import dynamic from "next/dynamic";
import type { VenueMapProps } from "./MapClient";

const VenueMapDynamic = dynamic(() => import("./MapClient"), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden bg-stone-200 animate-pulse flex items-center justify-center font-serif text-stone-500 border border-stone-200/80">
      Loading map…
    </div>
  ),
});

export function VenueMap(props: VenueMapProps) {
  return <VenueMapDynamic {...props} />;
}
