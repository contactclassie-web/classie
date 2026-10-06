import { forwardRef, type VideoHTMLAttributes } from "react";
import { optimizeCloudinaryVideo } from "@/lib/cloudinary";

// <video> that plays the small Cloudinary version and falls back to the
// original file if Cloudinary is still preparing the small one.
const CloudVideo = forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement> & { src: string; width?: number }>(
  function CloudVideo({ src, width = 720, ...rest }, ref) {
    const small = optimizeCloudinaryVideo(src, width);
    return (
      <video ref={ref} {...rest}>
        {small !== src && <source src={small} type="video/mp4" />}
        <source src={src} />
      </video>
    );
  },
);

export default CloudVideo;
