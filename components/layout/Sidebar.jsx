import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
  BookOpenIcon,
  BuildingStorefrontIcon,
  ChartBarIcon,
  ChevronRightIcon,
  CircleStackIcon,
  ClipboardDocumentListIcon,
  CogIcon,
  ShoppingCartIcon,
  TruckIcon,
  UsersIcon,

} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useMemo } from "react";
import { Overview } from "components/icons";
import { useSavedState } from "hooks";
import { Button } from "components/UI";
import { useSession } from "next-auth/react";
import { getRole } from "utils/utils";


const Sidebar = React.memo(() => {
  const { data: session } = useSession();
  const admin = getRole(session, "admin")
  const store = getRole(session, "store")
  const market = getRole(session, "market")
  const router = useRouter();
  const [activeAdminSubMenu, setActiveAdminSubMenu] = useState(null);
  const [fixedSideBar, setFixedSideBar] = useSavedState(true, "store-market-fixed-side-barr-cache")


  const Links = useMemo(() => [
    {
      nameAR: "ملخص",
      nameEN: "Overview",
      href: "/",
      current: router.pathname === "/",
      icon: <Overview className="w-5 h-5" />,
      submenuOpen: false,
    },
    {
      nameAR: "المستخدمين",
      nameEN: "Users",
      href: "/users",
      current: router.pathname === "/users",
      icon: <UsersIcon className="w-5 h-5" />,
      submenuOpen: false,
      omit: !admin
    },
    {
      nameAR: "المنتجات",
      nameEN: "Products",
      icon: <CircleStackIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu === 2,
      submenu: [
        {
          nameAR: "المنتجات",
          nameEN: "Products",
          href: "/products",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/products",
        },
        {
          nameAR: "الاصناف",
          nameEN: "Categories",
          href: "/products/categories",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/products/categories",
        },
        {
          nameAR: "وحدات القياس",
          nameEN: "Units of Measurement",
          href: "/products/units",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/products/units",
        },
      ],
    },
    {
      nameAR: "المخزن",
      nameEN: "Store",
      icon: <BuildingStorefrontIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu === 3,
      omit: market,
      submenu: [
        {
          nameAR: "المشتريات",
          nameEN: "Purchase",
          href: "/store/purchase",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/store/purchase",
        },
        {
          nameAR: "مردودات المشتريات",
          nameEN: "Purchase return",
          href: "/store/purchase-return",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/store/purchase-return",
        },
        {
          nameAR: "تحويل الي الكانتين",
          nameEN: "Move to market",
          href: "/store/move-to-market",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/store/move-to-market",
        },
        {
          nameAR: "استرجاع من الكانتين",
          nameEN: "Return from market",
          href: "/store/return-from-market",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/store/return-from-market",
        }
      ],
    },
    {
      nameAR: "الكانتين",
      nameEN: "Market",
      icon: <BookOpenIcon className="w-5 h-5" />,
      submenuOpen: activeAdminSubMenu === 4,
      omit: store,
      submenu: [
        {
          nameAR: "المبيعات",
          nameEN: "Sales",
          href: "/market/sales",
          icon: <TruckIcon className="w-5 h-5" />,
          current: router.pathname === "/market/sales",
        },
        {
          nameAR: "مردودات المبيعات",
          nameEN: "Sales return",
          href: "/market/sales-return",
          icon: <ShoppingCartIcon className="w-5 h-5" />,
          current: router.pathname === "/market/sales-return",
        },
      ],
    },
    {
      nameAR: "التقارير",
      nameEN: "Reports",
      icon: <ChartBarIcon className="w-5 h-5" />,
      href: "/reports",
      current: router.pathname === "/reports",
      submenuOpen: false,
      omit: !admin
    },
    {
      nameAR: "الإعدادات",
      nameEN: "Settings",
      icon: <CogIcon className="w-5 h-5" />,
      href: "/settings",
      current: router.pathname === "/settings",
      submenuOpen: false,
      omit: !admin
    },
  ], [admin, store, market, router.pathname, activeAdminSubMenu]);



  return (
    // w-14 hover:w-64
    <div className={`flex flex-col flex-shrink-0  transition-all duration-300 bg-white border-none hover:w-64 w-14 ${fixedSideBar ? "md:w-64" : ""} sidebar text-text dark:bg-gray-900 `}>
      <div className="flex flex-col flex-grow overflow-x-hidden overflow-y-auto">
        <ul className="flex flex-col py-4 space-y-1">


          {Links?.map((tab, index) => {
            return !tab.omit ? <div key={tab.nameEN}>
              {tab.submenu ? (
                <>
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
                        <li key={subTab.href} className="tab_link cursor-pointer">
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
                </>
              ) : (
                <li className="cursor-pointer" aria-hidden="true" onClick={() => activeAdminSubMenu && setActiveAdminSubMenu(null)}>
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
            </div> : null
          })}


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