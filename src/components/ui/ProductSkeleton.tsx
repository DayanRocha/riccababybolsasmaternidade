const ProductSkeleton = () => {
  return (
    <div className="product-card animate-pulse">
      <div className="aspect-square bg-gray-300 rounded-lg mb-4"></div>
      <div className="space-y-2">
        <div className="bg-gray-300 h-6 rounded mb-2 w-3/4"></div>
        <div className="bg-gray-300 h-4 rounded mb-1 w-full"></div>
        <div className="bg-gray-300 h-4 rounded mb-1 w-5/6"></div>
        <div className="bg-gray-300 h-4 rounded mb-4 w-2/3"></div>
        <div className="bg-gray-300 h-10 rounded-full w-full"></div>
      </div>
    </div>
  );
};

export default ProductSkeleton;