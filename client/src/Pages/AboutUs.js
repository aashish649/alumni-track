import React from 'react';



const AboutUs = () => {
  return (
    <div className="container mx-auto p-8 ">
      <div className='flex flex-col justify-center'>
      <h1 className="text-3xl font-bold mb-8 text-center">Welcome Alumni of NIT Patna</h1>
      <p >
        This is a platform aimed to connect the alumni of our elite Institute. It offers the following features:
      </p>
      <ul className="list-disc ml-8">
        <li>Receive frequent updates about college</li>
        <li>Get to know fellow alumni</li>
        <li>Send messages to other alumni</li>
        <li>Raise funds for a cause</li>
      </ul>
      </div>
      

      <h2 className="text-2xl font-bold my-8 text-center">Contributors</h2>
      <div className="flex justify-around p-2">
        <div className="text-center">
          <img
            src="/img1.jpg"
            alt=" 1"
            className="w-28 h-28 object-cover object-top rounded-full mb-3 m-3"
          />
          <p>Aashish Anand</p>
          <a href="https://www.linkedin.com/in/aashish-anand-07934822a/" target="_blank" rel="noopener noreferrer">
            <span className='text-red-500'>LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>

        
        <div className="text-center">
          <img
            src="/img2.jpg"
            alt="Contributor 2"
            className="w-28 h-28 object-cover  object-top rounded-full mb-3 m-3"
          />
          <p>Chandra Kishor Yadav</p>
          <a href="linkedin_url_2" target="_blank" rel="noopener noreferrer">
          <span className='text-red-500'>LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>

        
        <div className="text-center">
          <img
            src="https://m.media-amazon.com/images/M/MV5BNzlmZWI2YjAtOGQ3ZC00NTFjLThkMzItYTRiOGFiNzFjOTdlXkEyXkFqcGdeQXVyMTQ3Mzk2MDg4._V1_.jpg"
            alt="Contributor"
            className="w-28 h-28 object-cover rounded-full mb-2 m-3"
          />
          <p>Neha kumari</p>
          <a href="linkedin_url_3" target="_blank" rel="noopener noreferrer">
          <span className='text-red-500'>LinkedIn</span>
          </a>
          <p>Full Stack Developer</p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
