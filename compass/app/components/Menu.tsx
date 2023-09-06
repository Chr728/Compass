import React from 'react';
import { MdOutlineHome, MdOutlineDataExploration, MdEditNote, MdOutlineMessage, MdOutlineSettings, MdLogout } from 'react-icons/md';
import {CSSProperties} from 'react'


const Navbar = () => {
  return (
    <nav className="bg-blue-500  fixed bottom-0 left-0 w-full md:w-72 lg:w-80 md:left-0 md:h-full md:flex md:flex-col md:rounded-3xl md:bg-white md:justify-start md:items-start">
      <div className="text-black text-[14px] md:text-[16px]  md:font-sans  text-center p-6">
        <ul className="flex justify-around md:flex-col md:justify-start md:items-start">  
        <li className="md:ml-0 md:mb-4 md:mt-2 flex items-center">
          <img src="/icons/compass-removebg.png" alt="Compass" className="float-left hidden md:inline-block md:w-24 md:h-24 md:text-2xl text-lg lg:text-3xl mr-2" />
          <div>
            <p className="hidden md:inline-block md:text-lg md:ml-0 lg:text-xl">Christina D.</p>
            <p className="hidden md:inline-block md:text-xs md:ml-0">christina@gmail.com</p>
          </div>
        </li>

        <li className="md:mt-2 md:ml-10 lg:text-2xl"> 
        <MdOutlineHome className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineHome}
        <span className="home-text"> <a href="#" className="hover:text-blue-200">Home</a></span>
        </li>

          <li className="md:mt-12 md:ml-10 lg:text-2xl">   
          <MdOutlineDataExploration className="inline-block md:text-2xl text-lg lg:text-3xl"/>{MdOutlineDataExploration} 
          <span className="home-text"><a href="#" className="hover:text-blue-200" >
              MyData</a></span>
          </li>
          <li className="md:mt-12 md:ml-10 lg:text-2xl"> 
        <MdEditNote className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdEditNote}
        <span className="home-text"><a href="#" className="hover:text-blue-200">
              Journals</a></span>
          </li>
          <li className="md:mt-12 md:ml-10 lg:text-2xl">  
          <MdOutlineMessage className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineMessage}

          <span className="home-text">  <a href="#" className="hover:text-blue-200">
              Contact</a></span>
          </li> 
          <li className="md:mt-12 md:ml-10 lg:text-2xl">   
          <MdOutlineSettings className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineSettings}
          <span className="home-text"><a href="#" className="hover:text-blue-200">
              Settings</a></span>
          </li>
          <li className="hidden md:inline-block md:mt-28  lg:mt-32 md:ml-10 lg:text-2xl md:mb-4 lg:mb-4">
            <a href="#" className="hover:text-blue-200">
            <MdLogout className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdLogout}
              Logout</a>
          </li>

        </ul>
      </div>
    </nav>
  );
};

export default Navbar;





// import React from 'react';
// import { MdOutlineHome, MdOutlineDataExploration, MdEditNote, MdOutlineMessage, MdOutlineSettings, MdLogout } from 'react-icons/md';


// const Navbar = () => {
//   return (
//     <nav className="bg-blue-500  fixed bottom-0 left-0 w-full md:w-72 lg:w-80 md:left-0 md:h-full md:flex md:flex-col md:rounded-3xl md:bg-white md:justify-start md:items-start">
//       <div className="text-black text-[14px] md:text-[16px]  md:font-sans  text-center p-6">
//         <ul className="flex justify-around md:flex-col md:justify-start md:items-start">  
//         <li className="md:ml-0 md:mb-4 md:mt-2 flex items-center">
//           <img src="/icons/compass-removebg.png" alt="Compass" className="float-left hidden md:inline-block md:w-24 md:h-24 md:text-2xl text-lg lg:text-3xl mr-2" />
//           <div>
//             <p className="hidden md:inline-block md:text-lg md:ml-0 lg:text-xl">Christina D.</p>
//             <p className="hidden md:inline-block md:text-xs md:ml-0">christina@gmail.com</p>
//           </div>
//         </li>
//           <li className="md:mt-2 md:ml-10 lg:text-2xl"> 
//           <MdOutlineHome className="inline-block md:text-2xl text-lg lg:text-3xl " /> {MdOutlineHome}
//             <a href="#" className="hover:text-blue-200">Home</a>
//           </li>
//           <li className="md:mt-12 md:ml-10 lg:text-2xl">
//             <a href="#" className="hover:text-blue-200" >
//             <MdOutlineDataExploration className="inline-block md:text-2xl text-lg lg:text-3xl"/>{MdOutlineDataExploration} 
//               MyData</a>
//           </li>
//           <li className="md:mt-12 md:ml-10 lg:text-2xl">
//             <a href="#" className="hover:text-blue-200">
//             <MdEditNote className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdEditNote}
//               Journals</a>
//           </li>
//           <li className="md:mt-12 md:ml-10 lg:text-2xl">
//             <a href="#" className="hover:text-blue-200">
//             <MdOutlineMessage className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineMessage}
//               Contact</a>
//           </li> 
//           <li className="md:mt-12 md:ml-10 lg:text-2xl">
//             <a href="#" className="hover:text-blue-200">
//             <MdOutlineSettings className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineSettings}
//               Settings</a>
//           </li>
//           <li className="hidden md:inline-block md:mt-28  lg:mt-32 md:ml-10 lg:text-2xl md:mb-4 lg:mb-4">
//             <a href="#" className="hover:text-blue-200">
//             <MdLogout className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdLogout}
//               Logout</a>
//           </li>

//         </ul>

        
//       </div>
//       {/* </div> */}
//     </nav>
//   );
// };

// export default Navbar;