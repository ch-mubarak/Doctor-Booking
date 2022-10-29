import React from "react";
import { useNavigate } from "react-router-dom";

function Doctor({ doctor }) {
  const navigate = useNavigate();
  return (
    <div
      className="card p-2"
      onClick={() => navigate(`/book-doctor/${doctor._id}`)}
    >
      <h1 className="card-title">
        {doctor.firstName} {doctor.lastName}
      </h1>
      <hr />
      <p>
        <b>Phone: </b>
        {doctor.phone}{" "}
      </p>
      <p>
        <b>Address: </b>
        {doctor.address}
      </p>
      <p>
        <b>Fees: </b>
        {doctor.fees}
      </p>
      <p>
        <b>Timing: </b>
        {doctor.timings[0]}-{doctor.timings[1]}
      </p>
    </div>
  );
}

export default Doctor;
