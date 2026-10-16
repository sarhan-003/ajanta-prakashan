import { ArrowUpRight } from "lucide-react";
import type { LandingImage } from "@/types";
import { cn } from "@/utils/cn";

/**
 * Home-page image gallery — fully admin-managed (/admin/landing-images). Renders nothing if the admin hasn't added any active images, per the database-first "no hardcoded content" rule.
 *
 * Layout adapts to how many images there are: one image becomes a wide banner,
 * two sit side by side, and three or more form a "featured + supporting" grid
 * where the first (lowest display order) image gets the large tile.
 */
export function LandingGallery({ images }: { images: LandingImage[] }) {
  if (images.length === 0) return null;

  const count = images.length;
  const gridClass =
    count === 1
      ? "grid-cols-1 auto-rows-[16rem] sm:auto-rows-[22rem] lg:auto-rows-[28rem]"
      : count === 2
        ? "sm:grid-cols-2 auto-rows-[16rem] lg:auto-rows-[22rem]"
        : "sm:grid-cols-2 lg:grid-cols-3 auto-rows-[15rem] lg:auto-rows-[16rem]";

  return (
    <div className={cn("grid gap-4", gridClass)}>
      {images.map((image, i) => {
        const featured = count >= 3 && i === 0;
        const card = (
          <figure className="group relative h-full w-full overflow-hidden rounded-2xl bg-ink-100 shadow-card ring-1 ring-ink-200/60">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image.imageUrl}
              alt={image.caption}
              loading={i < 2 ? "eager" : "lazy"}
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            {(image.caption || image.linkUrl) && (
              <figcaption className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-5 pb-4 pt-12">
                <span className="text-sm font-medium leading-snug text-white sm:text-base">{image.caption}</span>
                {image.linkUrl && (
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur transition-colors group-hover:bg-brand-500">
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                )}
              </figcaption>
            )}
          </figure>
        );

        const wrapperClass = cn("block h-full", featured && "sm:col-span-2 lg:row-span-2");

        return image.linkUrl ? (
          <a key={image.id} href={image.linkUrl} target="_blank" rel="noopener noreferrer" className={wrapperClass}>
            {card}
          </a>
        ) : (
          <div key={image.id} className={wrapperClass}>
            {card}
          </div>
        );
      })}
    </div>
  );
}
