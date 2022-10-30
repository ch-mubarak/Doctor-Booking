import React from "react";
import "./Layout.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "antd";

function Layout({ children }) {
  const Navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const { user } = useSelector((state) => state.user);
  const userMenu = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      id: 2,
      name: "Appointments",
      path: "/appointments",
      icon: "ri-article-line",
    },
    {
      id: 3,
      name: "Apply Doctor",
      path: "/apply-doctor",
      icon: "ri-hospital-line",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const adminMenu = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      id: 2,
      name: "Users",
      path: "/admin/users",
      icon: "ri-article-line",
    },
    {
      id: 3,
      name: "Doctors",
      path: "/admin/doctors",
      icon: "ri-hospital-line",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const doctorMenu = [
    {
      id: 1,
      name: "Home",
      path: "/",
      icon: "ri-home-line",
    },
    {
      id: 2,
      name: "Appointment",
      path: "/doctor/appointments",
      icon: "ri-file-list-line",
    },
    {
      id: 3,
      name: "Profile",
      path: `/doctor/profile`,
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin
    ? adminMenu
    : user?.isDoctor
    ? doctorMenu
    : userMenu;

  const role = user?.isAdmin ? "Admin" : user?.isDoctor ? "Doctor" : "User";
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={collapsed ? "collapsed-sidebar" : "sidebar"}>
          {!collapsed && <h1 className="sidebar-title">Doctor Booking</h1>}
          {!collapsed && <span className="sidebar-role">-{role}</span>}

          <div className="menu">
            {menuToBeRendered.map((menu) => {
              const isActive = location.pathname === menu.path;
              return (
                <div
                  key={menu.id}
                  className={`d-flex menu-item ${
                    isActive && "active-menu-item"
                  }`}
                >
                  <i className={menu.icon}></i>
                  {!collapsed && <Link to={menu.path}>{menu.name}</Link>}
                </div>
              );
            })}
            <div
              className={`d-flex menu-item`}
              onClick={() => {
                localStorage.clear();
                Navigate("/login");
              }}
            >
              <i className="ri-logout-box-line"></i>
              {!collapsed && <Link to="/login">Logout</Link>}
            </div>
          </div>
        </div>
        <div className="content">
          <div className="header">
            <div>
              {!collapsed ? (
                <i
                  onClick={() => setCollapsed(true)}
                  className="ri-close-fill menu-icons"
                ></i>
              ) : (
                <i
                  onClick={() => setCollapsed(false)}
                  className="ri-menu-2-line menu-icons"
                ></i>
              )}
            </div>
            <div className="d-flex align-items-center px-3">
              <Badge
                count={user?.unseenNotifications?.length}
                onClick={() => Navigate("/notifications")}
              >
                <i className="ri-notification-line menu-icons px-3"></i>
              </Badge>
              <Link to="/profile" className="anchor">
                {user?.name}
              </Link>
            </div>
          </div>
          <div className="body">{children}</div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
