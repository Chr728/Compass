import React from 'react';
import {
  MdOutlineHome,
  MdOutlineAddBox,
  MdEditNote,
  MdOutlineMessage,
  MdOutlineSettings,
  MdLogout,
} from 'react-icons/md';

const Navbar = () => {
  return (
    <nav className="bg-eggshell fixed bottom-0 left-0 w-full md:w-72 lg:w-80 md:left-0 md:h-full md:flex md:flex-col md:rounded-3xl md:justify-start md:items-start">
      <div className="text-black text-[14px] md:text-[16px]  md:font-sans  text-center px-8 py-6">
        <ul className="flex justify-around md:flex-col md:justify-start md:items-start">
          <li className="md:ml-0 md:mb-4 md:mt-2 flex items-center">
            <img
              src="/icons/compass-removebg.png"
              alt="Compass"
              className="float-left hidden  text-lg  mr-2"
            />
          </li>

          <div className="grid grid-cols-5 gap-6 place-items-center ml-1">
          
          <div>
          <li>
            <MdOutlineHome className="inline-block text-lg" />
            <span className="home-text">
              {' '}
              <a href="/" className="hover:text-blue-200">
                Home
              </a>
            </span>
          </li>
          </div>

          <div>
          <li>
            <MdOutlineAddBox className="inline-block  text-lg" />
            <span className="home-text">
              <a href="#" className="hover:text-blue-200">
                Health
              </a>
            </span>
          </li>
          </div>

          <div>
          <li >
            <MdEditNote className="inline-block  text-lg " />
            <span className="home-text">
              <a href="#" className="hover:text-blue-200">
                Journals
              </a>
            </span>
          </li>
          </div>

          <div>
          <li >
            <MdOutlineMessage className="inline-block  text-lg" />

            <span className="home-text">
              {' '}
              <a href="#" className="hover:text-blue-200">
                Contact
              </a>
            </span>
          </li>
          </div>

          <div>
          <li>
            <MdOutlineSettings className="inline-block  text-lg lg:text-3xl" />
            <span className="home-text">
              <a href="/settings" className="hover:text-blue-200" id="settings">
                Settings
              </a>
            </span>
          </li>
          </div>

          </div>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
