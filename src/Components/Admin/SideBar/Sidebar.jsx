import React, { useState, useEffect } from 'react';
import '../SideBar/pages.css';
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import { Link } from 'react-router-dom';

import {
  Book,
  Calendar,
  ChevronDown,
  Clock,
  Filter,
  LayoutDashboard,
  Library,
  LogOut,
  Search,
  Settings,
  Users,
} from "lucide-react"
import {
  Person as PersonIcon
} from "@mui/icons-material";

import Button from '@mui/material/Button';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setIsOpen(false); // Close sidebar if screen size increases past mobile
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isMobile) {
      if (!isOpen) {
        document.body.classList.add('overlay');
      } else {
        document.body.classList.remove('overlay');
      }
    }
  };

  // Function to close sidebar when a link is clicked, only on mobile
  const handleLinkClick = () => {
    if (isMobile) {
      setIsOpen(false);
      document.body.classList.remove('overlay');
    }
  };

  return (
    <>
      {/* Sidebar Open Button */}
      {!isOpen && (
        <div className="open_sidebar" onClick={toggleSidebar}>
          <i className="bi bi-list"></i>
        </div>
      )}

      {/* Sidebar Container */}
      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        {/* Close Button */}
        <div className="btns" onClick={toggleSidebar}>
          <i className="bi bi-x-square p-2"></i>
        </div>

        {/* Sidebar Content */}
        <div className="sidebar-content">
          <ul>
            <Link to='/admin/profile' className='text-black links'>
            <li>
            <div className='admin d-flex'>
            <PersonIcon sx={{ fontSize: 50}}/>
            <div className='more_pro'>
               <span>admin</span>
               <h5>Profile</h5>
            </div>
          </div>
            </li>
            </Link>
           
            <li><Link to='/admin/dashboard' className='links text-black' onClick={handleLinkClick}>Dashboard</Link></li>
            <li><Link to='/admin/books' className='links text-black' onClick={handleLinkClick}>Manage Books</Link></li>
            <li><Link to='/admin/user_accounts' className='links text-black' onClick={handleLinkClick}>Manage Accounts</Link></li>
            <li><Link to='/admin/reservations' className='links text-black' onClick={handleLinkClick}>Reservations</Link></li>
          </ul>

          <ul className='logout_ul'>
          <div className="mt-auto p-4">
            <Link to='/admin/logout'>
            <Button variant="outline" className="w-full justify-start gap-2">
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
            </Link>
          </div>
          </ul>
        </div>
      </div>
    </>
  );
}

export default Sidebar;