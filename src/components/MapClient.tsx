"use client";

export type VenueMapProps = {
  position: [number, number];
  zoom?: number;
  markerTitle: string;
  markerSubtitle?: string;
  mapContainerProps?: { id?: string };
};

export default function MapClient({
  position,
  zoom = 14,
  markerTitle,
  mapContainerProps,
}: VenueMapProps) {
  const [lat, lng] = position;
  const embedSrc = `https://www.google.com/maps?q=${lat},${lng}&z=${zoom}&output=embed`;
  const openInGoogleMaps = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;

  return (
    <div className="h-[400px] w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-md border border-stone-200/80">
      <iframe
        {...mapContainerProps}
        title={`${markerTitle} map`}
        src={embedSrc}
        className="h-full w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <a
        href={openInGoogleMaps}
        target="_blank"
        rel="noopener noreferrer"
        className="sr-only"
      >
        Open in Google Maps
      </a>
    </div>
  );
}
