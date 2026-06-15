"use client";

import React, { useEffect, useState } from "react";
import icons from "./components/icon";
import { SidebarContent, HamburgerIcon } from "./components/sideBar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import Navigation, {NavItemData} from "./components/navigation";



import { useSelector } from "react-redux";
import type { RootState } from "@/app/redux/store";

import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/app/redux/store";
import { logout } from "@/app/redux/features/userSlice";
import Link from "next/link";

const Nav = new Navigation();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const user = useSelector(
    (state: RootState) => state.user
  );


  const router = useRouter();
  const pathname = usePathname();
  
  const dispatch = useDispatch<AppDispatch>();
  const handleLogout = async () => {
        try {
          await dispatch(logout()).unwrap();
        } catch (error) {
          console.error("Logout Failed:", error);
        }
  };
  useEffect(() => {
      if (user.isInstall === false) {
        handleLogout();
        router.push("/signup");
        return;
      }
      if (user.isLogin === false) {
        handleLogout();
        router.push("/login");
      }
    }, [user, dispatch, router]);

  const [active, setActive] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const arr = [];
    arr.push(Nav.navMain)
    arr.push(Nav.navFeatures)
    arr.push(Nav.navGeneral)
    if (pathname) {
   const result: NavItemData | undefined = arr.flat().find(item => item.link === pathname);
      if(result){
      setActive(result.label);
      }
    }
  }, [pathname]);

  const handleSelect = (label: string, link: string) => {
    setActive(label);
    router.push(link);
    setSidebarOpen(false);
  };

  return (
    <div
      className="flex h-screen w-full antialiased overflow-hidden"
      style={{ fontFamily: "'DM Sans', sans-serif", background: "#F3F4F6" }}
    >
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-white flex flex-col py-4 px-3
          border-r border-gray-100 shadow-lg z-30
          transition-transform duration-300 ease-in-out
          md:hidden
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <SidebarContent active={active} onSelect={handleSelect} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-52 min-w-[208px] h-full bg-white flex-col py-4 px-3 border-r border-gray-100 shadow-sm z-10">
        <SidebarContent active={active} onSelect={handleSelect} />
      </aside>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden min-w-0">

        {/* Top bar */}
        <header className="flex items-center justify-between px-3 sm:px-6 py-3 bg-white border-b border-gray-100 shadow-sm flex-shrink-0">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">

            {/* Mobile hamburger */}
            <button
              className="p-1.5 rounded-lg hover:bg-gray-100 transition md:hidden flex-shrink-0"
              onClick={() => setSidebarOpen(true)}
            >
              <HamburgerIcon open={false} />
            </button>

            {/* Breadcrumb */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-sm min-w-0">
              <span className="text-gray-400 font-medium hidden sm:inline truncate">myDashboard</span>
              <span className="text-gray-300 hidden sm:inline">
                {icons.chevronRight()}
              </span>
              <span className="text-gray-800 font-semibold truncate">{active}</span>
            </div>
          </div>

          {/* Right header icons */}
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            

            <div className="flex items-center gap-1 ml-0.5">
              <Link href={"/dashboard/about"}><Image
                src="/images/profile-image.jpg"
                alt="My uploaded image"
                width={40}
                height={40}
                className="w-8 h-8 rounded-full object-cover border-2 border-gray-200"
              />
            </Link>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto px-4 sm:px-8 pt-5 sm:pt-7 pb-8 bg-gray-50">
            {children}
        </main>

      </div>
    </div>
  );
}