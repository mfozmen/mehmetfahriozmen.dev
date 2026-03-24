import Image from "next/image";

export default function PhotoCaption({
  src,
  alt,
  width,
  height,
  caption,
  className = "",
  imgClassName = "",
  priority = false,
}: Readonly<{
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}>) {
  return (
    <figure className={className}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`rounded-xl border border-neutral-800 ${imgClassName}`}
      />
      {caption && (
        <figcaption className="mt-2 text-xs text-neutral-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
