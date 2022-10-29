import React, { useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { useDispatch } from "react-redux";
import { hideLoading, showLoading } from "../redux/alertSlice";
import { useState } from "react";
import Doctor from "../components/Doctor";
import toast from "react-hot-toast";
import { Col, Row } from "antd";

function Home() {
  const dispatch = useDispatch();
  const [allDoctors, setAllDoctors] = useState([]);
  const getData = async () => {
    try {
      dispatch(showLoading());
      const response = await axios.get("/api/user/get-all-approved-doctors", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      dispatch(hideLoading());
      if (response.data.success) {
        toast("all data fetched");
        setAllDoctors(response?.data?.data);
      }
    } catch (err) {
      dispatch(hideLoading());
      console.error(err);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  return (
    <Layout>
      <Row gutter={20}>
        {allDoctors.map((doctor) => {
          return (
            <Col span={8} xs={24} sm={24} lg={8}>
              <Doctor key={doctor?._id} doctor={doctor} />
            </Col>
          );
        })}
      </Row>
    </Layout>
  );
}

export default Home;
