import { Button, Col, DatePicker, Row, TimePicker } from "antd";
import axios from "axios";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { hideLoading, showLoading } from "../redux/alertSlice";

function BookDoctor() {
  const { user } = useSelector((state) => state.user);
  const [isAvailable, setIsAvailable] = useState(false);
  const [date, setDate] = useState();
  const [time, setTime] = useState();
  const [doctor, setDoctor] = useState();
  const params = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    getDoctorInfo();
  }, []);
  console.log(params);
  async function getDoctorInfo() {
    try {
      dispatch(showLoading());
      const response = await axios({
        method: "get",
        url: `/api/user/get-doctor-info-by-id/${params.doctorId}`,
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        setDoctor(response.data.data);
      } else {
        toast.error("error doctor booking details");
      }
    } catch (err) {
      toast.error("something went wrong");
      dispatch(hideLoading());
      console.log(err);
    }
  }
  async function bookDoctor() {
    setIsAvailable(false)
    try {
      dispatch(showLoading());
      const response = await axios({
        method: "post",
        url: "/api/user/book-doctor",
        data: {
          doctorId: doctor?._id,
          doctorInfo: doctor,
          userInfo: user,
          date: date,
          time: time,
        },
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error("something went wrong");
      }
    } catch (error) {
      dispatch(hideLoading());
      toast.error("Error booking appointment");
      console.log(error);
    }
  }

  async function checkAvailability() {
    try {
      dispatch(showLoading());
      const response = await axios({
        method: "post",
        url: "/api/user/check-doctor-availability",
        data: {
          doctorId: doctor?._id,
          date,
          time,
        },
        headers: { Authorization: "Bearer " + localStorage.getItem("token") },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAvailable(true);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      dispatch(hideLoading());
      console.log(error);
      toast.error("Error checking availability");
    }
  }
  return (
    <Layout>
      <Row>
        <Col span={6} sm={24} xs={24} lg={6}>
          <h1 className="page-title">
            {doctor?.firstName + " " + doctor?.lastName}
          </h1>
          <hr />
          <p>
            {" "}
            <b>Timing: </b>
            {doctor?.timings[0]} - {doctor?.timings[1]}
          </p>
          <div className="d-flex flex-column">
            <DatePicker
              format="DD-MM-YYYY"
              onChange={(value) => {
                setIsAvailable(false);
                setDate(moment(value).format("DD-MM-YYYY"));
              }}
            />
            <TimePicker
              format="HH:mm"
              className="mt-3"
              onChange={(value) => {
                setIsAvailable(false);
                setTime(moment(value).format("HH:mm"));
              }}
            />
          </div>
          <Button
            className="primary-button mt-3 full-width-button"
            onClick={checkAvailability}
          >
            Check Availability
          </Button>

          {isAvailable && (
            <Button
              className="primary-button mt-3 full-width-button"
              onClick={bookDoctor}
            >
              Book Now
            </Button>
          )}
        </Col>
      </Row>
    </Layout>
  );
}

export default BookDoctor;
