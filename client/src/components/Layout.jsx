import React from "react";
import "./Layout.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Avatar, Badge } from "antd";

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
      path: "/users",
      icon: "ri-article-line",
    },
    {
      id: 3,
      name: "Doctors",
      path: "/doctors",
      icon: "ri-hospital-line",
    },
    {
      id: 4,
      name: "Profile",
      path: "/profile",
      icon: "ri-user-line",
    },
  ];

  const menuToBeRendered = user?.isAdmin ? adminMenu : userMenu;
  return (
    <div className="main">
      <div className="d-flex layout">
        <div className={collapsed ? "collapsed-sidebar" : "sidebar"}>
          {!collapsed && <h1 className="sidebar-title">Doctor Booking</h1>}
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
              <Badge count={user?.unseenNotifications?.length}>
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
