import React from 'react';
import {
  MdOutlineHome,
  MdOutlineAddBox,
  MdEditNote,
  MdOutlineMessage,
  MdOutlineSettings,
  MdLogout,
} from 'react-icons/md';
import { useAuth } from '@/app/contexts/AuthContext';

const Navbar = () => {
  const { logout } = useAuth();

  return (
    <nav className="bg-blue-500  fixed bottom-0 left-0 w-full md:w-72 lg:w-80 md:left-0 md:h-full md:flex md:flex-col md:rounded-3xl bg-white md:justify-start md:items-start">
      <div className="text-black text-[14px] md:text-[16px]  md:font-sans  text-center p-6">
        <ul className="flex justify-around md:flex-col md:justify-start md:items-start">
          <li className="md:ml-0 md:mb-4 md:mt-2 flex items-center">
            <img
              src="/icons/compass-removebg.png"
              alt="Compass"
              className="float-left hidden md:inline-block md:w-24 md:h-24 md:text-2xl text-lg lg:text-3xl mr-2"
            />
            <div>
              <p className="hidden md:inline-block md:text-lg md:ml-0 lg:text-xl">
                Christina D.
              </p>
              <p className="hidden md:inline-block md:text-xs md:ml-0">
                christina@gmail.com
              </p>
            </div>
          </li>

          <li className="md:mt-2 md:ml-10 lg:text-2xl">
            <MdOutlineHome className="inline-block md:text-2xl text-lg lg:text-3xl mr-2" />
            <span className="home-text">
              {' '}
              <a href="#" className="hover:text-blue-200">
                Home
              </a>
            </span>
          </li>

          <li className="md:mt-12 md:ml-10 lg:text-2xl">
            <MdOutlineAddBox className="inline-block md:text-2xl text-lg lg:text-3xl mr-3" />
            <span className="home-text">
              <a href="#" className="hover:text-blue-200">
                Health
              </a>
            </span>
          </li>
          <li className="md:mt-12 md:ml-10 lg:text-2xl">
            <MdEditNote className="inline-block md:text-2xl text-lg lg:text-3xl mr-2" />
            <span className="home-text">
              <a href="#" className="hover:text-blue-200">
                Journals
              </a>
            </span>
          </li>
          <li className="md:mt-12 md:ml-10 lg:text-2xl">
            <MdOutlineMessage className="inline-block md:text-2xl text-lg lg:text-3xl mr-2" />

            <span className="home-text">
              {' '}
              <a href="#" className="hover:text-blue-200">
                Contact
              </a>
            </span>
          </li>
          <li className="md:mt-12 md:ml-10 lg:text-2xl">
            <MdOutlineSettings className="inline-block md:text-2xl text-lg lg:text-3xl mr-2" />
            <span className="home-text">
              <a href="#" className="hover:text-blue-200">
                Settings
              </a>
            </span>
          </li>
          <li className="hidden md:inline-block md:mt-24  lg:mt-32 md:ml-10 lg:text-2xl md:mb-4 lg:mb-4">
            <button onClick={logout} className="hover:text-blue-200">
              <MdLogout className="inline-block md:text-2xl text-lg lg:text-3xl" />{' '}
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
