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
    <nav className="bg-blue-500  fixed bottom-0 left-0 w-full  bg-white">
      <div className="text-black text-[14px]   text-center px-8 py-6">
        <ul className="flex justify-around">
          <li className="flex items-center">
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
