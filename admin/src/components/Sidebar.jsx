import React, { useContext, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { AdminContext } from '../context/AdminContext';
import { DoctorContext } from '../context/DoctorContext';
import { useTheme } from '../context/ThemeContext';
import { Menu, X, LayoutDashboard, Calendar, UserPlus, Users, User } from 'lucide-react';

const Sidebar = () => {
  const { aToken } = useContext(AdminContext);
  const { dToken } = useContext(DoctorContext);
  const { theme, toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const NavItem = ({ to, icon, children }) => {
    return (
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center gap-3 py-3 px-4 rounded-lg transition-all duration-200 ${
            isActive
              ? (theme === 'dark'
                  ? 'bg-gray-800 text-blue-400 font-medium border-r-4 border-blue-400'
                  : 'bg-blue-50 text-blue-600 font-medium border-r-4 border-blue-600')
              : (theme === 'dark'
                  ? 'text-gray-200 hover:bg-gray-800'
                  : 'text-gray-600 hover:bg-gray-100')
          }`
        }
        onClick={() => setIsOpen(false)}
      >
        <div className="flex items-center gap-3">
          {/* Switch icon color according to theme */}
          {React.cloneElement(icon, {
            color: theme === 'dark' ? '#60A5FA' : '#2563EB',
            stroke: theme === 'dark' ? '#60A5FA' : '#2563EB',
          })}
          <span>{children}</span>
        </div>
      </NavLink>
    );
  };

  return (
    <>
      {/* Mobile toggle button - High contrast and always visible */}
      <div className="block fixed top-4 right-4 z-50 md:hidden">
        <button
          className="p-3 rounded-full bg-blue-600 text-white shadow-lg"
          onClick={toggleSidebar}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 dark:text-white shadow-xl z-40 transition-all duration-300 
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:relative md:h-screen`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 border-b dark:border-gray-700">
          {aToken && <span className="text-xl font-bold ml-2 text-[#0f172a] dark:text-gray-200">Admin Panel</span>}
          {dToken && <span className="text-xl font-bold ml-2 text-[#0f172a] dark:text-gray-200">Doctor Panel</span>}
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2 overflow-y-auto">
          {aToken && (
            <div className="space-y-2">
              <NavItem to="/admin-dashboard" icon={<LayoutDashboard size={20} />}>
                Dashboard
              </NavItem>
              <NavItem to="/all-appointments" icon={<Calendar size={20} />}>
                Appointments
              </NavItem>
              <NavItem to="/add-doctor" icon={<UserPlus size={20} />}>
                Add Doctor
              </NavItem>
              <NavItem to="/doctor-list" icon={<Users size={20} />}>
                Doctors List
              </NavItem>
            </div>
          )}
          
          {dToken && (
            <div className="space-y-2">
              <NavItem to="/doctor-dashboard" icon={<LayoutDashboard size={20} />}>
                Dashboard
              </NavItem>
              <NavItem to="/doctor-appointments" icon={<Calendar size={20} />}>
                Appointments
              </NavItem>
              <NavItem to="/doctor-profile" icon={<User size={20} />}>
                Profile
              </NavItem>
            </div>
          )}
          {/* Only show these in mobile sidebar (hamburger menu) */}
          {isOpen && (
            <div className="mt-8 space-y-2">
              {/* Dark Mode Toggle */}
              <button
                className="flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                onClick={() => { if (typeof window !== 'undefined') { document.activeElement.blur(); } theme && theme !== '' && typeof theme === 'string' && theme.length > 0 && window.setTimeout(() => {}, 0); toggleTheme(); }}
              >
                {theme === 'dark' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.07l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.93l-.71-.71M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" /></svg>
                )}
                <span>Dark Mode</span>
              </button>
              {/* Logout Button */}
              <button
                className="flex items-center gap-3 w-full py-3 px-4 rounded-lg transition-all duration-200 bg-gradient-to-r from-indigo-500 to-indigo-700 text-white font-semibold shadow hover:from-indigo-600 hover:to-indigo-800"
                onClick={() => {
                  window.location.href = '/';
                  aToken && localStorage.removeItem('aToken');
                  dToken && localStorage.removeItem('dToken');
                }}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                Logout
              </button>
            </div>
          )}
        </nav>

        {/* Empty Footer */}
        <div className="absolute bottom-0 w-full p-4 border-t">
          <div className="text-sm text-center">
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;