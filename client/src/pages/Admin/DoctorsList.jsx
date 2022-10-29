import { Table } from "antd";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertSlice";

function DoctorsList() {
  const [doctors, setDoctors] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getDoctors();
  }, []);
  async function getDoctors() {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/admin/get-all-doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctors([...response.data.data]);
      } else {
        toast.success(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
    }
  }

  async function changeStatus(record, action) {
    try {
      dispatch(showLoading());
      const response = await axios.post(
        "/api/admin/change-doctor-status",
        { doctorId: record._id, userID: record.userId, action },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctors();
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      dispatch(hideLoading());
      console.error(error);
      toast.error("Error changing status");
    }
  }
  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text, record) => {
        return (
          <>
            {record.firstName} {record.lastName}
          </>
        );
      },
    },
    {
      title: "phone",
      dataIndex: "phone",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text, record) => {
        const date = new Date(record.createdAt);
        return <span>{date.toDateString()}</span>;
      },
    },
    {
      title: "status",
      dataIndex: "status",
    },
    {
      title: "Actions",
      dataIndex: "actions",
      render: (text, record) => {
        return (
          <div key={record.id} className="d-flex">
            {record.status === "approved" ? (
              <span
                className="action badge bg-danger"
                onClick={() => changeStatus(record, "reject")}
              >
                Reject
              </span>
            ) : (
              <span
                className="action badge bg-success"
                onClick={() => changeStatus(record, "approve")}
              >
                Approve
              </span>
            )}
          </div>
        );
      },
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">Doctor List</h1>
      <Table dataSource={doctors} columns={columns} />
    </Layout>
  );
}

export default DoctorsList;
