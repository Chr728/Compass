import React from 'react';
import { MdOutlineHome, MdOutlineDataExploration, MdEditNote, MdOutlineMessage, MdOutlineSettings } from 'react-icons/md';



const Navbar = () => {
  return (
    <nav className="bg-blue-500  fixed bottom-0 left-0 w-full md:w-48 lg:w-60 md:left-0 md:h-full md:flex md:flex-col md:rounded-3xl md:bg-white md:justify-start md:items-start">
      
      {/* <div className="md:rounded-3xl bg-white flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8"> */}

      <div className="text-black text-[14px] md:text-[16px]  md:font-sans  text-center p-6">
        <ul className="flex justify-around md:flex-col md:justify-start md:items-start">
          <li className="md:mt-20 md:ml-10 lg:text-2xl">
            <a href="#" className="hover:text-blue-200">
            <MdOutlineHome className="inline-block md:text-2xl text-lg lg:text-3xl " /> {MdOutlineHome}
              Home</a>
          </li>
          <li className="md:mt-16 md:ml-10 lg:text-2xl">
            <a href="#" className="hover:text-blue-200" >
            <MdOutlineDataExploration className="inline-block md:text-2xl text-lg lg:text-3xl"/>{MdOutlineDataExploration} 
              MyData</a>
          </li>
          <li className="md:mt-16 md:ml-10 lg:text-2xl">
            <a href="#" className="hover:text-blue-200">
            <MdEditNote className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdEditNote}
              Journals</a>
          </li>
          <li className="md:mt-16 md:ml-10 lg:text-2xl">
            <a href="#" className="hover:text-blue-200">
            <MdOutlineMessage className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineMessage}
              Contact</a>
          </li> 
          <li className="md:mt-16 md:ml-10 lg:text-2xl">
            <a href="#" className="hover:text-blue-200">
            <MdOutlineSettings className="inline-block md:text-2xl text-lg lg:text-3xl" /> {MdOutlineSettings}
              Settings</a>
          </li>
        </ul>
      </div>
      {/* </div> */}
    </nav>
  );
};

export default Navbar;





// import { useState } from "react";

// export const navLinks = [
//   {
//     id: "home",
//     title: "Home",
//   },
//   {
//     id: "features",
//     title: "Features",
//   },
//   {
//     id: "product",
//     title: "Product",
//   },
//   {
//     id: "clients",
//     title: "Clients",
//   },
// ];

// const Navbar = () => {
//   const [active, setActive] = useState("Home");
//   const [toggle, setToggle] = useState(false);

//   return (
//     <nav className={`flex flex-col m-auto w-full md:max-w-[800px] md:h-[600px] p-8 justify-between items-center navbar fixed bottom-0 left-0 ${toggle ? 'h-screen w-screen' : ''}`}>
//       {/* Logo */}
//       {/* Desktop Navigation */}
//       <ul className="list-none sm:flex hidden justify-end items-center flex-1">
//         {navLinks.map((nav, index) => (
//           <li
//             key={nav.id}
//             className={`font-poppins font-normal cursor-pointer text-[16px] ${
//               active === nav.title ? "text-black" : "text-dimblack"
//             } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
//             onClick={() => setActive(nav.title)}
//           >
//             <a href={`#${nav.id}`}>{nav.title}</a>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Navigation */}
//       <div className="sm:hidden flex flex-1 justify-end items-center">
//         {/* Sidebar */}
//         <div
//           className={`${
//             !toggle ? "hidden" : "flex"
//           } p-6 bg-black-gradient absolute top-0 right-0 bottom-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
//         >
//           <ul className="list-none flex justify-end items-start flex-1 flex-col">
//             {navLinks.map((nav, index) => (
//               <li
//                 key={nav.id}
//                 className={`font-poppins font-medium cursor-pointer text-[16px] ${
//                   active === nav.title ? "text-black" : "text-dimblack"
//                 } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
//                 onClick={() => setActive(nav.title)}
//               >
//                 <a href={`#${nav.id}`}>{nav.title}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//         <img
//           src="/path-to-menu-icon.png"
//           alt="menu"
//           className="w-[28px] h-[28px] object-contain"
//           onClick={() => setToggle(!toggle)}
//         />
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import { useState } from "react";


// export const navLinks = [
//   {
//     id: "home",
//     title: "Home",
//   },
//   {
//     id: "features",
//     title: "Features",
//   },
//   {
//     id: "product",
//     title: "Product",
//   },
//   {
//     id: "clients",
//     title: "Clients",
//   },
// ];

// const Navbar = () => {
//   const [active, setActive] = useState("Home");
//   const [toggle, setToggle] = useState(false);

//   return (
//     <nav className="w-full flex py-6 justify-between items-center navbar fixed bottom-0 left-0">
//       {/* Logo */}
      
//       {/* Desktop Navigation */}
//       <ul className="list-none sm:flex hidden justify-end items-center flex-1">
//         {navLinks.map((nav, index) => (
//           <li
//             key={nav.id}
//             className={`font-poppins font-normal cursor-pointer text-[16px] ${
//               active === nav.title ? "text-black" : "text-dimblack"
//             } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
//             onClick={() => setActive(nav.title)}
//           >
//             <a href={`#${nav.id}`}>{nav.title}</a>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Navigation */}
//       <div className="sm:hidden flex flex-1 justify-end items-center">
//         {/* Sidebar */}
//         <div
//           className={`${
//             !toggle ? "hidden" : "flex"
//           } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
//         >
//           <ul className="list-none flex justify-end items-start flex-1 flex-col">
//             {navLinks.map((nav, index) => (
//               <li
//                 key={nav.id}
//                 className={`font-poppins font-medium cursor-pointer text-[16px] ${
//                   active === nav.title ? "text-black" : "text-dimblack"
//                 } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
//                 onClick={() => setActive(nav.title)}
//               >
//                 <a href={`#${nav.id}`}>{nav.title}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// export const navLinks = [
//   {
//     id: "home",
//     title: "Home",
//   },
//   {
//     id: "features",
//     title: "Features",
//   },
//   {
//     id: "product",
//     title: "Product",
//   },
//   {
//     id: "clients",
//     title: "Clients",
//   },
// ];

// const Navbar = () => {
//   const [active, setActive] = useState("Home");
//   const [toggle, setToggle] = useState(false);

//   return (
//     <nav className="w-full flex py-6 justify-between items-center navbar">
//       {/* Logo */}
      
//       {/* Desktop Navigation */}
//       <ul className="list-none sm:flex hidden justify-end items-center flex-1">
//         {navLinks.map((nav, index) => (
//           <li
//             key={nav.id}
//             className={`font-poppins font-normal cursor-pointer text-[16px] ${
//               active === nav.title ? "text-white" : "text-dimWhite"
//             } ${index === navLinks.length - 1 ? "mr-0" : "mr-10"}`}
//             onClick={() => setActive(nav.title)}
//           >
//             <a href={`#${nav.id}`}>{nav.title}</a>
//           </li>
//         ))}
//       </ul>

//       {/* Mobile Navigation */}
//       <div className="sm:hidden flex flex-1 justify-end items-center">
        

//         {/* Sidebar */}
//         <div
//           className={`${
//             !toggle ? "hidden" : "flex"
//           } p-6 bg-black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] rounded-xl sidebar`}
//         >
//           <ul className="list-none flex justify-end items-start flex-1 flex-col">
//             {navLinks.map((nav, index) => (
//               <li
//                 key={nav.id}
//                 className={`font-poppins font-medium cursor-pointer text-[16px] ${
//                   active === nav.title ? "text-white" : "text-dimWhite"
//                 } ${index === navLinks.length - 1 ? "mb-0" : "mb-4"}`}
//                 onClick={() => setActive(nav.title)}
//               >
//                 <a href={`#${nav.id}`}>{nav.title}</a>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;