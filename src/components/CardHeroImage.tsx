import { Image } from "antd";
import { resolvePhotoUrl } from "../utils/photos";

type CardHeroImageProps = {
  src?: string;
  alt?: string;
  height?: number;
};

export default function CardHeroImage({
  src,
  alt = "",
  height = 160,
}: CardHeroImageProps) {
  if (src) {
    return (
      <Image
        src={resolvePhotoUrl(src)}
        alt={alt}
        width="100%"
        height={height}
        style={{ objectFit: "cover", display: "block" }}
        preview={false}
      />
    );
  }

  return (
    <div
      style={{
        width: "100%",
        height,
        background: "#f0f0f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 36,
      }}
    >
      🏛️
    </div>
  );
}
