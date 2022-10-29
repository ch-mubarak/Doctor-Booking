import { Tabs } from "antd";
import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { toast } from "react-hot-toast";
import { setUser } from "../redux/userSlice";

function Notifications() {
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const { user } = useSelector((state) => state.user);
  async function markAllAsSeen() {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/mark-notification-as-seen",
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        dispatch(setUser(response.data.data));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Something went wrong!");
      console.error(error);
    }
  }
  async function deleteAllNotifications() {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/user/delete-all-notifications",
        { userId: user.id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        dispatch(setUser(response.data.data));
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      toast.error("Something went wrong");
    }
  }
  return (
    <Layout>
      <h1 className="page-title">Notifications</h1>
      <Tabs>
        <Tabs.TabPane tab="Unseen" key={0}>
          <div className="d-flex justify-content-end" onClick={markAllAsSeen}>
            <h2 className="anchor">Mark all as seen</h2>
          </div>
          {user?.unseenNotifications?.map((notification) => {
            return (
              <div
                key={Math.random().toString()}
                className="card m-2 p-2"
                onClick={() => Navigate(notification.onClickPath)}
              >
                <div className="card-text">{notification.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>
        <Tabs.TabPane tab="Seen" key={1}>
          <div
            className="d-flex justify-content-end"
            onClick={deleteAllNotifications}
          >
            <h2 className="anchor">Delete all</h2>
          </div>
          {user?.seenNotifications?.map((notification) => {
            return (
              <div
                key={Math.random().toString()}
                className="card m-2 p-2"
                onClick={() => Navigate(notification.onClickPath)}
              >
                <div className="card-text">{notification.message}</div>
              </div>
            );
          })}
        </Tabs.TabPane>
      </Tabs>
    </Layout>
  );
}

export default Notifications;
