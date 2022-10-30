import { Table } from "antd";
import axios from "axios";
import React, { useState } from "react";
import { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertSlice";

function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    getDoctorAppointments();
  }, []);
  async function getDoctorAppointments() {
    try {
      dispatch(showLoading());
      const response = await axios({
        method: "get",
        url: "/api/doctor/get-doctor-appointments",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setAppointments([...response.data.data]);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      dispatch(hideLoading());
      toast.error("Error fetching appointment");
      console.log(err);
    }
  }
  async function changeAppointmentStatus(appointmentInfo, status) {
    try {
      dispatch(showLoading());
      const response = await axios({
        url: "/api/doctor/change-appointment-status",
        method: "post",
        data: {
          appointmentInfo,
          status,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        getDoctorAppointments();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error changing status");
      console.log(error);
    }
  }
  const columns = [
    {
      title: "Id",
      dataIndex: "_id",
    },
    {
      title: "Patient",
      dataIndex: "name",
      render: (text, record) => {
        return <span>{record.userId.name}</span>;
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
      title: "Action",
      dataIndex: "status",
      render: (text, record) =>
        record.status === "approved" ? (
          <span
            key={record._id}
            className="badge bg-danger action"
            onClick={() => changeAppointmentStatus(record, "rejected")}
          >
            Reject
          </span>
        ) : (
          <span
            key={record._id}
            className="badge bg-success action"
            onClick={() => changeAppointmentStatus(record, "approved")}
          >
            Approve
          </span>
        ),
    },
  ];
  return (
    <Layout>
      <h1 className="page-title">My Appointments </h1>
      <Table dataSource={appointments} columns={columns} />
    </Layout>
  );
}

export default DoctorAppointments;
