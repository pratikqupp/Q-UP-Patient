import React from "react";
import { useHistory } from "react-router-dom";

import { Helmet } from "react-helmet";
import "./genral-checkup.css";

// import "./genral-chekup.css";
import axios from "axios";
import {
  Button,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

const GenralCheckup = (props) => {
  var bookingDailySlotId = localStorage.getItem("opd responce onToday Click");
  var localParentBookingQueueId = localStorage.getItem("parentBookingQueueId");
  var finalappUserId = localStorage.getItem("finalappUserId");
  var CityName=localStorage.getItem("entity");
  var retrievedObject = localStorage.getItem("UserData");
  const [generalCheckups, setGeneralCheckup] = useState([]);
  const [family, setFamily] = useState([]);
  const [familyMemberData, setFamilyMemberData] = useState({});
  //   const [value, setValue] = useState("");
  const [appBook, setappBook] = useState([]);

  var userData = JSON.parse(retrievedObject);

  const handleClick = (event) => {
    setFamilyMemberData(event);
  };

  const generalCheck = async () => {
    const payload = {
      activePrimeUser: false,
      appUserId: finalappUserId,
      entityCity: CityName,
      parentBookingQueueId: localParentBookingQueueId,
    };
    const responce = await axios({
      method: "post",
      // url: `https://api.qupdev.com/aggregate-service/v2/booking/doctor/opd/today/slots`,
      url: `http://68.183.83.230:8765/aggregate-service/v2/customBooking/create/customBooking/data`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData.access_token,
      },
    })
      .then((responce) => {
        setGeneralCheckup(responce.data.checkupTypesForQueue);
        console.log("responce GeneralCheckup", generalCheckups);
        getFamilyDetails();
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log("Error api status",error.response.status);
          console.log("ERROR", error.responce);
          alert("Something Went Wrong Try Again");

          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  //   const memberId = family && family.familyMemberId;
  //   const memberFName = family && family.firstName;
  //   const memberLName = family && family.lastName;
  //   const memberMobNo = family && family.parentPatientMobileNo;
  //   const memberRelation = family && family.relationName;
  //   const memberParentMobNo = family && family.parentPatientMobileNo;
  //   const memberLocation = family && family.location;

  //   const checkUp = generalCheckups && generalCheckups.checkUpTypeId;
  //   const checkName = generalCheckups && generalCheckups.name;
  //   const checkUpTimeInSeconds =
  //     generalCheckups && generalCheckups.averageCheckUpTimeInSeconds;

  //   const getparentBookingQueueId = props.sData.parentBookingQueueId;
  //   const bookingDailySlotId = props.tSlot.bookingDailySlotId;

  //   var bookingDailySlotId = localStorage.getItem("bookingDailySlotId");
  console.log("bookingDailySlotId", bookingDailySlotId);
  const appointmentBook = async () => {
    const payload = {
      activePrimeUser: true,
      bookedFamilyMemberFirstName: familyMemberData.firstName,
      bookedFamilyMemberId: familyMemberData.familyMemberId,
      bookedFamilyMemberLastName: familyMemberData.lastName,
      bookedFamilyMemberMobileNumber: familyMemberData.parentPatientMobileNo,
      bookingInitiatedThrough: "THROUGH_APP",
      checkUpType: {
        averageCheckUpTimeInSeconds:
          generalCheckups.averageCheckUpTimeInSeconds,
        checkUpTypeId: generalCheckups.checkUpTypeId,
        name: generalCheckups.name,
      },
      //   dailyBookingSlotId: props.tSlot.bookingDailySlotId,
      dailyBookingSlotId: bookingDailySlotId,

      lastDailySlotRequest: true,
      location: familyMemberData.location,
      parentPatientId: localParentBookingQueueId, //parenttId
      parentPatientMobileNumber: familyMemberData.parentPatientMobileNo,
      //   patientBookingRequestId: "string",
      primeApplicabilityForBooking: "PRIME_USER",
      relationName: familyMemberData.relationName,
    };
    console.log("payloads", payload);
    const responce = await axios({
      method: "post",
      // url: `https://api.qupdev.com/aggregate-service/v2/booking/doctor/opd/today/slots`,
      url: `http://68.183.83.230:8765/custom-booking-service/patient-custom-appointment/`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData.access_token,
      },
    })
      .then((responce) => {
        setappBook(responce.data);
        console.log("responce appBook", appBook);
      })
      .catch(function (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          // console.log(error.response.data);
          // console.log("Error api status",error.response.status);
          console.log("ERROR", error.responce);
          alert("Something Went Wrong Try Again");

          // console.log(error.response.headers);
        } else if (error.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  const getFamilyDetails = async () => {
    const responce = await axios({
      method: "get",
      url: `https://dev-business.qupdev.com:8765/patient-service/patient/by-mobile-no/1065378638/family`,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData.access_token,
      },
    })
      .then((responce) => {
        setFamily(responce.data);
        console.log("getFamilyDetails", family);
        localStorage.setItem("setFamily", JSON.stringify(responce.data));
      })
      .catch(function (error) {
        if (error.response) {
          console.log("ERROR", error.responce);
          alert("Something Went Wrong Try Again");
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error", error.message);
        }
        console.log(error.config);
      });
  };

  useEffect(() => {
    generalCheck();
    
  }, []);

  return (
    <div>
      {Array.isArray(generalCheckups) &&
        generalCheckups.map((item, i) => (
          <div key={i}>
            <h2>{item.name}</h2>
            <p>
              {item.averageCheckUpTimeInSeconds / 60} min
            </p>
          </div>
        ))}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-evenly",
        }}
      >
        {Array.isArray(family) &&
          family.map((item, i) => (
            <div key={i}>
              <div style={{ justifyContent: "space-between" }}>
                <button
                  style={{
                    border: "1px solid black",
                    margin: "5px 0px 0px 10px",
                  }}
                  onClick={handleClick(item)}
                >
                  {item.firstName} {item.lastName}
                  <h5>{item.relationInfo.relationName}</h5>
                </button>
              </div>
            </div>
          ))}
      </div>
      {/* <h1 style={{ color: "red" }}>Book Checkup</h1> */}
      <Button
        style={{ marginTop: "100px" }}
        color="primary"
        fullWidth
        disabled={false}
        size="medium"
        variant="contained"
        className={"booking-screen-button button"}
        // onClick={appointmentBook}
        // history.push("/genral-checkup")
      >
        BOOK NOW
      </Button>
    </div>
  );
};

export default GenralCheckup;
