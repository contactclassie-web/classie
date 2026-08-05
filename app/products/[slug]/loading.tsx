export default function ProductLoading() {
  return (
    <div className="overflow-x-hidden animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 pt-5 pb-4">
        <div className="h-3 w-48 bg-gray-200 rounded" />
      </div>

      {/* Product section */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-14 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[52%_48%] gap-0">
          {/* Left — image */}
          <div className="pr-0 md:pr-12 mb-8 md:mb-0">
            <div className="bg-gray-200 rounded-sm w-full" style={{ aspectRatio: "1/1" }} />
            {/* Thumbnails */}
            <div className="flex gap-2 mt-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-[68px] h-[68px] bg-gray-200 rounded-md flex-shrink-0" />
              ))}
            </div>
          </div>

          {/* Right — product info */}
          <div className="flex flex-col gap-4">
            {/* Category label */}
            <div className="h-3 w-20 bg-gray-200 rounded" />
            {/* Title */}
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="h-7 w-1/2 bg-gray-200 rounded" />
            {/* Price */}
            <div className="flex gap-3 mt-2">
              <div className="h-8 w-24 bg-gray-200 rounded" />
              <div className="h-8 w-16 bg-gray-100 rounded" />
            </div>
            {/* Color swatches */}
            <div className="flex gap-2 mt-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-10 h-10 bg-gray-200 rounded-full" />
              ))}
            </div>
            {/* Size buttons */}
            <div className="flex gap-2 mt-2">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="w-12 h-12 bg-gray-200 rounded-md" />
              ))}
            </div>
            {/* Add to cart */}
            <div className="h-14 bg-gray-300 rounded mt-4" />
          </div>
        </div>
      </div>
    </div>
  );
}
