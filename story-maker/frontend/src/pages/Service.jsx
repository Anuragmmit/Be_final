import React from "react";

const Service = () => {
  return (
    <div className="p-8 bg-gradient-to-r from-blue-500 to-purple-600 min-h-screen">
      <h2 className="text-4xl font-bold text-center text-white mb-10">
        Our Services
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(4)].map((_, colIndex) => (
          <div key={colIndex} className="grid gap-6">
            {[...Array(3)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="relative group overflow-hidden rounded-lg shadow-lg"
              >
                <img
                  className="h-auto max-w-full rounded-lg transition-transform transform group-hover:scale-110 duration-300"
                  src={`https://flowbite.s3.amazonaws.com/docs/gallery/masonry/image-${
                    colIndex * 3 + rowIndex
                  }.jpg`}
                  alt="Service"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-white text-lg font-semibold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
                    Explore More 🚀
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Service;
