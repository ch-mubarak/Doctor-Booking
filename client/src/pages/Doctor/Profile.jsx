import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DoctorForm from "../../components/DoctorForm";
import Layout from "../../components/Layout";
import { hideLoading, showLoading } from "../../redux/alertSlice";
import moment from "moment";

function Profile() {
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  const [doctor, setDoctor] = useState();
  useEffect(() => {
    getDoctorData();
  }, []);
  const getDoctorData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios({
        method: "get",
        url: "/api/doctor/get-doctor-info-by-id",
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        //setting user info
        console.log(response.data.data)
        setDoctor(response.data.data);
      } else {
        localStorage.clear();
        Navigate("/login");
      }
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
      Navigate("/login");
    }
  };
  async function onFinish(values) {
    dispatch(showLoading());
    console.log("applying doctor");
    try {
      const response = await axios.put(
        "/api/doctor/update-doctor-account-info",
        {
          ...values,
          timings: [
            moment(values.timings[0]).format("HH:mm"),
            moment(values.timings[1]).format("HH:mm"),
          ],
          doctorId: doctor?._id,
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
  console.log(doctor);
  return (
    <Layout>
      <h1 className="page-title">Doctor Profile</h1>
      <hr />
      {doctor && <DoctorForm initialValues={doctor} onFinish={onFinish} />}
    </Layout>
  );
}

export default Profile;
