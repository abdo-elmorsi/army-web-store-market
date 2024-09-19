import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  ChevronRightIcon,
  TruckIcon,
  UsersIcon,

} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo } from "react";
import { Overview } from "components/icons";
import { useSavedState } from "hooks";
import { Button } from "components/UI";


const Sidebar = React.memo(() => {
  const router = useRouter();
  const [activeAdminSubMenu, setActiveAdminSubMenu] = useState(null);
  const [fixedSideBar, setFixedSideBar] = useSavedState(true, "easier-fixed-side-barr-cache")


  const Links = useMemo(() => [

    {
      nameAR: "ملخص",
      nameEN: "overView",
      href: "/",
      current: router.pathname == "/",
      icon: <Overview className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "المستخدمين",
      nameEN: "Users",
      href: "/users",
      current: router.pathname == "/users",
      icon: <UsersIcon className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "المخزن",
      nameEN: "Store",
      icon: <BuildingStorefrontIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu ==2,
      submenu: [
        {
          nameAR: "الحركات",
          nameEN: "Transactions",
          href: "/store/transactions",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/store/transactions",
        },
      ]
    },
    {
      nameAR: "الكانتين",
      nameEN: "Market",
      icon: <BookOpenIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu == 3,
      submenu: [
        {
          nameAR: "الحرمات",
          nameEN: "Transactions",
          href: "/market/transactions",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/market/transactions",
        },
      ]
    },



  ], [router.pathname, activeAdminSubMenu]);


  return (
    // w-14 hover:w-64
    <div className={`flex flex-col flex-shrink-0  transition-all duration-300 bg-white border-none hover:w-64 w-14 ${fixedSideBar ? "md:w-64" : ""} sidebar text-text dark:bg-gray-900 `}>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col py-4 space-y-1">


          {Links.map((tab, index) => (
            <React.Fragment key={tab.href}>
              {tab.submenu ? (
                <React.Fragment key={tab.href}>
                  <div className="relative flex flex-row items-center h-11">
                    <button
                      onClick={() =>
                        setActiveAdminSubMenu(() =>
                          tab.submenuOpen ? null : index
                        )
                      }
                      className={`w-full focus:outline-none relative flex h-11 flex-row items-center border-l-4 pr-6 rtl:pr-4 rtl:border-l-0 rtl:border-r-4 dark:text-white dark:hover:text-white hover:border-primary ${tab.submenuOpen ? 'border-primary' : 'border-transparent'
                        }`}
                    >
                      <span className="inline-flex items-center justify-center ml-4">
                        {tab.icon}
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                      </span>
                      <span className="absolute inset-y-0 flex items-center pl-2 duration-300 opacity-0 arrow-icon right-2 rtl:pr-2 rtl:right-auto rtl:left-2">
                        <ChevronRightIcon
                          className={`duration-200 w-5 h-5 ${tab.submenuOpen ? 'rtl:rotate-90' : 'rotate-90 rtl:-rotate-180'}`}
                        />
                      </span>
                    </button>
                  </div>
                  {tab.submenuOpen && (
                    <ul className="flex flex-col px-2 py-4 space-y-1">
                      {tab.submenu.map((subTab) => (
                        <li key={subTab.href} className="tab_link">
                          <Link href={subTab.href}>
                            <div
                              className={`${subTab.current
                                ? 'dark:text-gray-100 border-primary'
                                : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                                } text-white-600 relative flex h-11 flex-row items-center border-l-4 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-2`}
                            >
                              <span className="inline-flex items-center justify-center ml-4 duration-500 sub-menu-icon">
                                <ArrowRightCircleIcon className="w-5 h-5 rtl:rotate-180" />
                              </span>
                              <span className="ml-2 text-sm tracking-wide truncate">
                                {router.locale === 'en' ? subTab.nameEN : subTab.nameAR}
                              </span>
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </React.Fragment>
              ) : (
                <li key={tab.href} onClick={() => activeAdminSubMenu && setActiveAdminSubMenu(null)}>
                  <Link href={tab.href}>
                    <div
                      className={`${tab.current
                        ? 'dark:text-gray-100 border-primary'
                        : 'dark:text-white border-transparent hover:border-primary dark:hover:border-primary'
                        } text-white-600 relative flex h-11 flex-row items-center border-l-4 pr-6 focus:outline-none rtl:border-l-0 rtl:border-r-4 rtl:pr-4`}
                    >
                      <span className="inline-flex items-center justify-center ml-4">
                        {tab.icon}
                      </span>
                      <span className="ml-2 text-sm tracking-wide truncate">
                        {router.locale === 'en' ? tab.nameEN : tab.nameAR}
                      </span>
                    </div>
                  </Link>
                </li>
              )}
            </React.Fragment>
          ))}


        </ul>






        <Button onClick={() => setFixedSideBar(!fixedSideBar)} className="mx-auto mt-auto text-xs tracking-wide text-center truncate dark:text-primary">
          <ArrowLeftCircleIcon className={` transition-all duration-300 hover:scale-110 ${!fixedSideBar ? "-rotate-180 rtl:rotate-0" : "rtl:rotate-180"}`} width={25} />
        </Button>
        {/* <ClearStorageButton /> */}
      </div>
    </div>
  );
});
Sidebar.displayName = 'Sidebar';

export default Sidebar;