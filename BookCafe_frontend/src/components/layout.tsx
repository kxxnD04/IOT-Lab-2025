
import websiteLogo from "../assets/website-logo.png";
import { NavLink } from "react-router-dom"; 
import { IconBrandGithub, IconBrandFacebook, IconBrandYoutube } from '@tabler/icons-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  
  // ✨ Style สำหรับลิงก์เมนู เพื่อจัดการ Active State
  const linkStyles = `
    flex items-center h-full px-4 no-underline text-gray-600 font-semibold text-sm 
    relative after:absolute after:bottom-0 after:left-1/2 after:w-0 after:h-0.5 after:bg-teal-500
    after:transition-all after:duration-300 after:-translate-x-1/2
    hover:text-teal-600 hover:after:w-full
  `;

  const activeLinkStyles = `
    text-teal-600 after:w-full
  `;

  return (
    <div className="flex flex-col min-h-screen bg-gray-50/50">

      <header 
        className="sticky top-0 z-50 h-16 px-8 shadow-sm 
                   bg-white/80 backdrop-blur-md transition-all duration-300"
      >
        <div className="flex justify-between items-center h-full max-w-screen-xl mx-auto">

          <NavLink to="/">
            <img 
              src={websiteLogo} 
              alt="IoT Library & Cafe Logo" 
              className="h-12 w-auto transition-transform duration-300 hover:scale-105" 
            />
          </NavLink>

          {/* ✨ 2. Navigation Links ที่ใช้ NavLink และมี Animation */}
          <nav className="flex items-center h-full">
            <NavLink 
              to={"/"} 
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              หน้าหลัก
            </NavLink>
            <NavLink 
              to={"/books"} 
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              หนังสือ
            </NavLink>
            <NavLink 
              to={"/cafe"} 
              className={({ isActive }) => `${linkStyles} ${isActive ? activeLinkStyles : ''}`}
            >
              เครื่องดื่ม
            </NavLink>
          </nav>


          <div></div>
        </div>
      </header>
      

      <main className="flex-grow">
        {children}
      </main>


      <footer className="bg-gray-800 text-gray-300 py-6">
        <div className="container mx-auto px-6 text-center">
          <p className="font-semibold text-lg mb-2 text-white">IoT Library & Cafe</p>
          <p className="text-sm mb-4">
            A place to learn, create, and enjoy quality coffee.
          </p>
          <div className="flex justify-center gap-6 mb-4">
            <a href="https://www.facebook.com/karn.suddee.2024" className="text-gray-400 hover:text-teal-400 transition-colors">
              <IconBrandFacebook size={24} />
            </a>
            <a href="https://github.com/kxxnD04/IOT-Lab-2025" className="text-gray-400 hover:text-teal-400 transition-colors">
              <IconBrandGithub size={24} />
            </a>
            <a href="https://www.youtube.com/watch?v=4bwnO0FQp1s&list=RD4bwnO0FQp1s&start_radio=1" className="text-gray-400 hover:text-teal-400 transition-colors">
              <IconBrandYoutube size={24} />
            </a>
          </div>
          <p className="text-xs text-gray-500 border-t border-gray-700 pt-4 mt-4">
            © {new Date().getFullYear()} IoT Library & Cafe. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}