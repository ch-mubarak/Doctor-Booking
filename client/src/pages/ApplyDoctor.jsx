import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Layout from "../components/Layout";
import { toast } from "react-hot-toast";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../components/DoctorForm";
import moment from "moment";

function ApplyDoctor() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  async function onFinish(values) {
    dispatch(showLoading());
    console.log("applying doctor");
    try {
      const response = await axios.post(
        "/api/user/apply-doctor-account",
        {
          ...values,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
          userId: user.id,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      dispatch(hideLoading());
      console.log(response);
      if (response.data.success) {
        toast.success("Successfully Applied for doctor account");
        Navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error("Error applying doctor");
      dispatch(hideLoading());
      console.error(error);
    }
  }
  return (
    <Layout>
      <h1 className="page-title">Apply Doctor</h1>
      <hr />
      <DoctorForm onFinish={onFinish} />
    </Layout>
  );
}

export default ApplyDoctor;
