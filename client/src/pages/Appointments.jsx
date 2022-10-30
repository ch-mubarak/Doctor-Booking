import { Table } from "antd";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertSlice";

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getAppointments();
  }, []);
  async function getAppointments() {
    try {
      dispatch(showLoading());
      const response = await axios({
        url: "/api/user/get-user-appointments",
        method: "get",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments([...response.data.data]);
      } else {
        toast.error("there is no appointment");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error getting appointments");
    }
  }
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Doctor",
      dataIndex: "doctor",
      render: (text, record) => {
        return (
          <span>
            {record?.doctorId?.firstName} {record?.doctorId?.lastName}
          </span>
        );
      },
    },
    {
      title: "Phone",
      dataIndex: "phone",
      render: (text, record) => {
        return <span>{record?.doctorId?.phone}</span>;
      },
    },
    {
      title: "Date & Time",
      dataIndex: "date",
      render: (text, record) => {
        return (
          <span>
            {record.date} {record.time}
          </span>
        );
      },
    },
    {
      title: "status",
      dataIndex: "status",
      render: (text, record) =>
        record.status === "approved" ? (
          <span className="badge bg-success">Status</span>
        ) : record.status === "pending" ? (
          <span className="badge bg-warning">Pending</span>
        ) : (
          <span className="badge bg-danger">Rejected</span>
        ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">Appointments </h1>
      <Table dataSource={appointments} columns={columns} />
    </Layout>
  );
}

export default Appointments;
