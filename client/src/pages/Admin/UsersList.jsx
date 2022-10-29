import { Table } from "antd";
import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertSlice";

function UsersList() {
  const [allUsers, setUsers] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getUsers();
  }, []);

  async function getUsers() {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-users", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      setUsers([...response.data.data]);
    } catch (error) {
      dispatch(hideLoading());
      toast.success("Something went wrong");
      console.log(error);
    }
  }
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => {
        const date = new Date(record.createdAt);
        return <>{date.toDateString()}</>;
      },
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div className="d-flex">
            <span className="badge action bg-danger">Block</span>
          </div>
        );
      },
    },
  ];

  return (
    <Layout>
      <h1 className="page-title">User List</h1>
      <Table dataSource={allUsers} columns={columns} />
    </Layout>
  );
}

export default UsersList;
