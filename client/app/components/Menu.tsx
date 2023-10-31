'use client'
import React from 'react';
import {usePathname} from 'next/navigation';
import {
  MdOutlineHome,
  MdOutlineAddBox,
  MdEditNote,
  MdOutlineMessage,
  MdOutlineSettings,
  MdHome,
  MdAddBox,
  MdNote,
  MdMessage,
  MdSettings,
} from 'react-icons/md';
import Link from 'next/link';


const navs = [
  { href: '/tpage', label: 'Home', iconActive: <MdHome/>, iconInactive: <MdOutlineHome/> },
  { href: '/health', label: 'Health', iconActive: <MdAddBox  />, iconInactive: <MdOutlineAddBox  /> },
  { href: '/journals', label: 'Journals', iconActive: <MdNote  />, iconInactive: <MdEditNote  /> },
  { href: '/tpage', label: 'Contact', iconActive: <MdMessage  />, iconInactive: <MdOutlineMessage  /> },
  { href: '/settings', label: 'Settings', iconActive: <MdSettings  />, iconInactive: <MdOutlineSettings  /> },
];

const Navbar = () => {
  const pathname = usePathname();
  return (
    <><style jsx>
      {`
          @media (min-width: 768px) {
            /* Hide the menu on medium (tablet) screens and above */
            .menu-hidden {
              display: none;
            }
          }
        `}
    </style><nav className="border-t-[0.1px]  menu-hidden border-grey bg-white fixed bottom-0 w-full  pb-4">

        <div className="text-darkgrey text-[14px] md:text-[16px]  md:font-sans  text-center py-3">
          <ul className="flex justify-around md:flex-col md:justify-start md:items-start px-8">
            <li className="md:ml-0 md:mb-4 md:mt-2 flex items-center">
              <img
                src="/icons/compass-removebg.png"
                alt="Compass"
                className="float-left hidden  text-lg  mr-2" />
            </li>
            <div className="flex justify-center  w-full space-x-3">
              {navs.map((nav) => (
                <li key={nav.href} className={'w-full border-1 border-blue'}>
                  <span className="home-text">
                    <Link href={nav.href} className="hover:text-blue-200 flex flex-col items-center">
                      <div className={'text-3xl'}>
                        {pathname === nav.href ? nav.iconActive : nav.iconInactive}
                      </div>
                      <span className={`text-sm font-light`}>{nav.label}</span>
                    </Link>
                  </span>
                </li>
              ))}
            </div>
          </ul>
        </div>
      </nav></>
  );
};

export default Navbar;