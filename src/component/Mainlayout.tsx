"use client";
import { HiUsers, HiSpeakerphone } from "react-icons/hi";
import { useState, useEffect } from "react";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import {
  FiHome,
  FiBriefcase,
  FiMessageSquare,
  FiMail,
  FiMessageCircle,
  FiSearch,
  FiMenu,
  FiX,
  FiChevronLeft,
  FiUser,
  FiSettings,
  FiLogOut,
  FiLayers,
  FiHelpCircle,
  FiInfo,
  FiFileText,
  FiCreditCard,
} from "react-icons/fi";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMobileMenuOpen(false); // Close mobile menu on route change
  }, [pathname]);

  const toggleSidebar = () => setIsOpen(!isOpen);
  const toggleMobileMenu = () => setMobileMenuOpen(!mobileMenuOpen);

  const menuItems = [
    { href: "/", label: "Dashboard", icon: <FiHome /> },
    { href: "/montage-headers", label: "Header", icon: <FiLayers /> },
    { href: "/montage-abouts", label: "Abouts", icon: <FiInfo /> },
    { href: "/montage-blogs", label: "Blogs", icon: <FiFileText /> },
    // { href: "/montage-services", label: "Services", icon: <FiSettings /> },
    { href: "/montage-works", label: "Works", icon: <FiBriefcase /> },
    { href: "/montage-member-influncer", label: "Members", icon: <HiUsers /> },
    {
      href: "/montage-campaing",
      label: "Campaign Application",
      icon: <HiSpeakerphone />,
    }, // changed to better suit campaign
    { href: "/montage-pricing", label: "Prices", icon: <FiCreditCard /> },
    { href: "/montage-faqs", label: "FAQs", icon: <FiHelpCircle /> },
    {
      href: "/montage-testimonials",
      label: "Testimonials",
      icon: <FiMessageSquare />,
    },
    { href: "/montage-contacts", label: "Contacts", icon: <FiMail /> },
    // { href: "/montage-chat", label: "Chat", icon: <FiMessageCircle /> },
  ];

  return (
    <div className="flex flex-col h-screen ">
      {/* Header */}
      <header className="w-full mt-5  backdrop-blur-sm border-b border-[#58585833] shadow-sm sticky top-0 z-30">
        <div className="h-16 px-6 flex justify-between items-center max-w-[1920px] mx-auto">
          <div className="flex items-center space-x-4">
            {/* Desktop sidebar toggle */}
            <button
              onClick={toggleSidebar}
              className="hidden md:flex p-2 rounded-md hover:bg-[#1FB5DD]/10 transition"
            >
              <FiMenu className="w-5 h-5 text-[#1FB5DD]" />
            </button>

            {/* Mobile sidebar toggle */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden flex p-2 rounded-md hover:bg-[#1FB5DD]/10 transition"
            >
              {mobileMenuOpen ? (
                <FiX className="w-5 h-5 text-[#1FB5DD]" />
              ) : (
                <FiMenu className="w-5 h-5 text-[#1FB5DD]" />
              )}
            </button>

            <Link
              href="/"
              className="text-xl font-semibold text-[#1FB5DD] hover:opacity-80 transition"
            >
              Montage Motion
            </Link>
          </div>

          {/* Search input (desktop only) */}
          <div className="hidden md:flex items-center relative w-96">
            <FiSearch className="absolute left-3 text-[#58585833]" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-[#58585833] focus:outline-none focus:ring-2 focus:ring-[#1FB5DD] placeholder:text-[#58585833]"
            />
          </div>
        </div>
      </header>

      {/* Main layout container */}
      <>
        {" "}
        <div className="flex flex-1  max-w-[1920px] mx-auto w-full">
          {/* Desktop Sidebar */}
          <aside
            className={`hidden md:block sticky top-0 md:h-[800px]   border-r border-[#58585833] shadow-sm transition-all duration-300 ${
              isOpen ? "w-72" : "w-20"
            }`}
          >
            <div className="p-4 flex flex-col h-full">
              <nav className="flex-1 flex flex-col space-y-1 mt-6">
                {menuItems.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center p-3 rounded-lg transition ${
                      pathname === href
                        ? "bg-[#1FB5DD]/10 text-[#1FB5DD] font-medium"
                        : "text-[#585858] hover:bg-[#1FB5DD]/5 hover:text-[#1FB5DD]"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 ${
                        isOpen ? "mr-3" : "mx-auto"
                      } transition`}
                    >
                      {icon}
                    </span>
                    {isOpen && <span>{label}</span>}
                  </Link>
                ))}
              </nav>
              <div className="mt-auto">
                <div className="border-t border-[#58585833] pt-2">
                  {/* <Link
                    href="/settings"
                    className={`flex items-center p-3 rounded-lg transition ${
                      pathname === "/settings"
                        ? "bg-[#1FB5DD]/10 text-[#1FB5DD] font-medium"
                        : "text-[#585858] hover:bg-[#1FB5DD]/5 hover:text-[#1FB5DD]"
                    }`}
                  >
                    <FiSettings
                      className={`w-5 h-5 ${isOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isOpen && <span>Settings</span>}
                  </Link> */}

                  <button
                    onClick={() => {
                      signOut();
                      toast.success("Logout success");
                      redirect("/signin");
                    }}
                    className="flex cursor-pointer items-center w-full p-3 rounded-lg text-[#585858] hover:bg-[#1FB5DD]/5 hover:text-[#1FB5DD] transition"
                  >
                    <FiLogOut
                      className={`w-5 h-5 ${isOpen ? "mr-3" : "mx-auto"}`}
                    />
                    {isOpen && <span>Logout</span>}
                  </button>
                </div>

                <button
                  onClick={toggleSidebar}
                  className="w-full mt-4 p-3 rounded-lg hover:bg-[#1FB5DD]/10 text-[#585858] hover:text-[#1FB5DD] flex items-center justify-center"
                >
                  <FiChevronLeft
                    className={`w-5 h-5 transition-transform duration-300 ${
                      isOpen ? "" : "rotate-180"
                    }`}
                  />
                  {isOpen && <span className="ml-2">Collapse</span>}
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          <div
            className={`md:hidden fixed inset-0 z-20 transition-opacity min-h-screen duration-300 ${
              mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
          >
            <div
              className="absolute inset-0 bg-black/50"
              onClick={toggleMobileMenu}
            ></div>
            <div className="absolute left-0 top-0 h-full w-64   p-4 shadow-lg overflow-y-auto">
              <nav className="space-y-4 mt-6">
                {menuItems.map(({ href, label, icon }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center p-3 rounded-lg transition ${
                      pathname === href
                        ? "bg-[#1FB5DD]/10 text-[#1FB5DD] font-medium"
                        : "text-[#585858] hover:bg-[#1FB5DD]/5 hover:text-[#1FB5DD]"
                    }`}
                  >
                    <span className="w-5 h-5 mr-3">{icon}</span>
                    <span>{label}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <main className="flex-1  max-w-[1530px] md:mt-8 mx-auto  min-h-screen ">
            {children}
          </main>
        </div>
        <footer className="text-white mt-5 text-center mb-5">
          &copy; {new Date().getFullYear()} All Rights Reserved by Montage
          Motion.
        </footer>
      </>
    </div>
  );
};

export default MainLayout;
