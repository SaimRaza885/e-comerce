import React from 'react'

const Product_Details_SkeletonLoader = () => {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4">
        <div className="skeleton-grid">
          <div className="h-96 skeleton-box"></div>
          <div className="space-y-4">
            <div className="h-8 skeleton-box w-3/4"></div>
            <div className="h-6 skeleton-box w-1/2"></div>
            <div className="h-6 skeleton-box w-1/3"></div>
            <div className="h-40 skeleton-box"></div>
            <div className="h-10 skeleton-box w-1/2"></div>
            <div className="h-10 skeleton-box w-1/3"></div>
          </div>
        </div>
      </div>
  )
}

export default Product_Details_SkeletonLoader