import React from 'react'
import AlumniData from './AlumniData.js';
import LazyLoad from "react-lazy-load";

const NotableAlumni = () => {
  return (
    <>
    <div className="container mx-auto p-8">
      <h1 className="text-3xl text-center font-bold mb-8">Notable Alumni</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {AlumniData.map((alumni) => (
          <div key={alumni.key} className="bg-white p-6 rounded-lg shadow-md">
            <LazyLoad>
            <img
              src={alumni.image}
              className="w-full h-35 object-cover object-top mb-4 rounded-md"
            />  
            </LazyLoad>
            <h2 className="text-xl font-semibold mb-2">{alumni.name}</h2>
            <h2 className="text-xl font-semibold mb-2">{alumni.profession}</h2>
            <p className="text-gray-600">{alumni.discription}</p>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};

export default NotableAlumni;



