const Product_Details_SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-cream/20 pt-24">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col lg:flex-row gap-16 items-start animate-pulse">
          <div className="lg:w-1/2 w-full">
            <div className="bg-white rounded-[2.5rem] p-4 border border-gray-100">
              <div className="aspect-square bg-gray-100 rounded-2xl" />
            </div>
          </div>
          <div className="lg:w-1/2 w-full space-y-6">
            <div className="h-4 bg-gray-100 rounded w-24" />
            <div className="h-10 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/2" />
            <div className="h-16 bg-gray-100 rounded w-full" />
            <div className="h-8 bg-gray-100 rounded w-1/3" />
            <div className="h-20 bg-gray-100 rounded w-full" />
            <div className="h-14 bg-gray-100 rounded w-1/2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Product_Details_SkeletonLoader;
