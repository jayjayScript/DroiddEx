import React from 'react'

const PageLoaderComponent = () => {
   return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm">
         <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
   )
}
export default PageLoaderComponent