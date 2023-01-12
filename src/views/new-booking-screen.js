import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";

import './new-booking-screen.css'
import moment from "moment";
import DatePicker from "react-datepicker";
import { Box, Button, Grid } from "@mui/material";
import { forwardRef } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

const NewBookingScreen = (props) => {
  var retrievedObject = localStorage.getItem("UserData");
  const history = useHistory();

  const [doctor, setDoctor] = React.useState(new Array());
  const [doctors, setDoctors] = React.useState([]);
  const [queueData, setqueueData] = React.useState([]);
  const [slotData, setSlotData] = React.useState([]);
  const [timerMiniSlot, setTimerMiniSlot] = React.useState([]);
  const [secoundtimerMiniSlot, setSecoundTimerMiniSlot] = React.useState([]);
  const [doc, setDoc] = React.useState("");
  const [slot, setSlot] = React.useState("");
  const [isBackgroundRed, setisBackgroundRed] = React.useState("true");
  const [startDate, setStartDate] = React.useState(
    dayjs("2014-08-18T21:11:54")
  );
  const [value, setValue] = React.useState("Today");

  //today select
  const [selectedData, setSelectedData] = React.useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const handleChange1 = (newValue) => {
    setStartDate(newValue);
    onSelectDateClick();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    // alert(event.target.value);
  };

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <button className="example-custom-input" onClick={onClick} ref={ref}>
      {value}
    </button>
  ));
  var userData = JSON.parse(retrievedObject);

  var finalappUserId = "";
  var doctorId = "";
  var entityIdkey = "";

  var drId = localStorage.getItem("drId");
  var drName = localStorage.getItem("drName");
  var specality = localStorage.getItem("specality");
  var photourl =
    "http://68.183.83.230:8765/provider-service/doctor/" + drId + "/photo";
  function getTimeFromSeconds(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${(hours % 12).toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  }


  const handleEntityClick = (event) => {
    if (event != null) {
      setDoc(event);
      if (isVisible == false) {
        setIsVisible(!isVisible)
      }
      localStorage.setItem("entity", event.entityCity);
      console.log("event ", event);
      if (!event == "") {
        getDoctorAggregateDetails();
      }
    }
  };
  const handelDatePiker = (event) => {
    return (
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
      />
    );
  };
  const handleOPDClick = (event) => {
    if (event != null) {
      setSlot(event);

      console.log("eventsetSlot ", event);
      if (!event == "") {
        onTodayClick();
      }
    }
  };

  const handleBookingIdClick = (item) => {

    if (item.opdSlotStatus == "CLOSED") {
      alert("Booking Closed", "Booking Closed")
    } else {
      localStorage.setItem("bookingDailySlotIds", item.bookingDailySlotId);
      history.push("/genral-checkup");
    }
  };

  const getDoctorAggregateDetails = async () => {
    const payload = {
      appUserId: doctor.userInfo.appUserId,
      doctorId: drId,
      entityId: doc.entityId,
    };
    const responce = await axios({
      method: "post",
      // url: `https://api.qupdev.com/aggregate-service/v2/booking/doctor/opd/today/slots`,
      url: `http://68.183.83.230:8765/aggregate-service/v2/booking/doctor/opd/today/slots`,
      data: payload,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData.access_token,
      },
    })
      .then((responce) => {
        setqueueData(responce.data.bookingQueueList);
        setTimerMiniSlot(responce.data.selectedQueueSlotData.mainSlotDetails);
        setSelectedData(responce.data.selectedQueueSlotData);
        localStorage.setItem(
          "parentBookingQueueId",
          responce.data.selectedQueueSlotData.parentBookingQueueId
        );
        console.log("queueData", queueData);
        console.log("responce.data", responce.data);
        console.log("setSelectedData", responce.data.selectedQueueSlotData);
        // setSecoundTimerMiniSlot(responce.data.mainSlotDetails.slotDetails);
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

  const getDoctordetailsById = async () => {
    const responce = await axios({
      method: "get",
      // url: `https://api.qupdev.com/provider-service/doctor/by-id/`+drId,
      url: `http://68.183.83.230:8765/provider-service/doctor/by-id/` + drId,
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + userData.access_token,
      },
    })
      .then((responce) => {
        finalappUserId = responce.data.userInfo.appUserId;

        localStorage.setItem("finalappUserId", finalappUserId);
        console.log("appId", finalappUserId);
        setDoctor(responce.data);
        setDoc(responce.data.conductsOPDAtEntity[0]);
        setDoctors(responce.data.conductsOPDAtEntity);
        localStorage.setItem("setDoctors", JSON.stringify(responce.data));
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

  const parenteId = selectedData && selectedData?.parentBookingQueueId;
  // const parenteId = timerMiniSlot;
  console.log("parenteId", parenteId);
  const onTodayClick = async () => {
    const new_date = moment().add();
    const time = moment.utc(moment(new_date).startOf("day")).format();

    const payload = {
      parentBookingQueueId: parenteId,
      entityId: doc.entityId,
    };
    console.log("payload", payload);
    console.log("time", time);
    const responce = await axios({
      method: "post",
      // url: `https://api.qupdev.com/aggregate-service/v2/booking/custom/queue/slots/for-passed-day`,

      url: `http://68.183.83.230:8765/aggregate-service/v2/booking/entity/custom/queue/today/slots`,
      data: payload,
      headers: {
        Authorization: "Bearer " + userData.access_token,
        "Content-Type": "application/json",
      },
    })
      .then((responce) => {
        // setSelectedData(responce.data);
        setTimerMiniSlot(responce.data.selectedQueueSlotData.mainSlotDetails);
        console.log("opd responce ", responce.data);
        // localStorage.setItem(
        //   "opd responce onToday Click",
        //   JSON.stringify(responce.data)
        // );
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
  const onTomorrowClick = async () => {
    const new_date = moment().add(1, "days");
    console.log("new_date", new_date);
    const time = moment.utc(moment(new_date).startOf("day")).format();
    const nTime = time;

    const payload = {
      parentBookingQueueId: parenteId,
      // entityId: doc,

      bookingDailySlotDatePerUTCMidnight: nTime,
      // "parentBookingQueueId": "5e006b441c27cf000ba6173e"
    };
    console.log("onTomorrowClick", payload);
    console.log("time", time);
    const responce = await axios({
      method: "post",
      // url: `https://api.qupdev.com/aggregate-service/v2/booking/custom/queue/slots/for-passed-day`,
      // url: `http://68.183.83.230:8765/aggregate-service/v2/booking/queue/slots/for-passed-day`,
      url: `http://68.183.83.230:8765/aggregate-service/v2/booking/custom/queue/slots/for-passed-day`,
      data: payload,
      headers: {
        Authorization: "Bearer " + userData.access_token,
        "Content-Type": "application/json",
      },
    })
      .then((responce) => {
        // setSelectedData(responce.data);
        setTimerMiniSlot(responce.data);
        console.log("opd responce ", responce.data);
        localStorage.setItem(
          "opd responce onTomorrowClick",
          JSON.stringify(responce.data)
        );
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

  const onSelectDateClick = async () => {
    const firstdate = moment().format("yyyy-MM-DD") + "T18:30:00.000Z";
    const new_date = moment(firstdate).add();
    console.log("new_date", new_date);

    const payload = {
      bookingDailySlotDatePerUTCMidnight: new_date,
      parentBookingQueueId: slot,
    };
    console.log("payload", payload);

    const responce = await axios({
      method: "post",
      url: "http://68.183.83.230:8765/aggregate-service/v2/booking/custom/queue/slots/for-passed-day",
      data: payload, // you are sending body instead

      headers: {
        Authorization: "Bearer " + userData.access_token,
        // 'Content-Type': 'application/json'
      },
    });

    console.log("responce", responce.data);
    // setSelectedData(responce.data);
    setTimerMiniSlot(responce.data.mainSlotDetails);
    localStorage.setItem(
      "opd responce onSelectDateClick",
      JSON.stringify(responce.data)
    );

    // console.log("selectedData", selectedData);
  };

  useEffect(() => {
    getDoctordetailsById();
  }, []);
  return (
    <div className="new-booking-screen-container">
      <Helmet>
        <title>exported project</title>
      </Helmet>
      <div className="new-booking-screen-booking-main-layout">
        <img
          alt="Rectangle6974101"
          src="/playground_assets/rectangle6974101-ut9q-200h.png"
          className="new-booking-screen-tittle-gradient"
        />
        <img
          alt="Vector2294101"
          src="/playground_assets/vector2294101-tg0u.svg"
          className="new-booking-screen-back-button"
        />
        <span className="new-booking-screen-page-heading-tittle">
          <span>Appointment</span>
        </span>
        {/* <img
          alt="Rectangle6984101"
          src="/playground_assets/rectangle6984101-8h8l-500h.png"
          className="new-booking-screen-rectangle698"
        /> */}
        {/* <div className="new-booking-screen-normal-slot-book-now-button">
          <span className="new-booking-screen-text01">
            <span>Prepaid Booking</span>
          </span>
        </div>
        <img
          alt="Line814102"
          src="/playground_assets/line814102-4tp8.svg"
          className="new-booking-screen-line81"
        />
        <img
          alt="Line834102"
          src="/playground_assets/line834102-y09o.svg"
          className="new-booking-screen-line83"
        />
        <div className="new-booking-screen-group1364"></div>
        <img
          alt="Rectangle4484103"
          src="/playground_assets/rectangle4484103-kium-200h.png"
          className="new-booking-screen-rectangle448"
        />
        <span className="new-booking-screen-normal-slot-duration-time">
          <span>11:00 AM - 01:00 PM</span>
        </span>
        <div className="new-booking-screen-normal-slot-duration-time1">
          <img
            alt="Ellipse484103"
            src="/playground_assets/ellipse484103-uiy9-200h.png"
            className="new-booking-screen-ellipse48"
          />
          <span className="new-booking-screen-text04">
            <span>Open</span>
          </span>
        </div>
        <span className="new-booking-screen-normal-slot-name">
          <span>Morning</span>
        </span>
        <img
          alt="Vector2264103"
          src="/playground_assets/vector2264103-7i2s.svg"
          className="new-booking-screen-vector226"
        /> */}
        <img
          alt="Rectangle6994101"
          src="/playground_assets/rectangle6994101-yve9-200h.png"
          className="new-booking-screen-rectangle699"
        />
        <img
          alt="Rectangle7034103"
          src="/playground_assets/rectangle7034103-p276-200h.png"
          className="new-booking-screen-rectangle703"
        />
        <img
          alt="Line864101"
          src="/playground_assets/line864101-dpdo.svg"
          className="new-booking-screen-line86"
        />
        <span style={{ display: isVisible ? 'block' : 'none' }}className="new-booking-screen-today">
          <span onClick={onTodayClick}>Today</span>
        </span>
        <span style={{ display: isVisible ? 'block' : 'none' }} className="new-booking-screen-tomorrow">
          <span onClick={onTomorrowClick}>Tomorrow</span>
        </span>
        <div className="new-booking-screen-opd-item">
          <header className="booking-screen-header1">
            {Array.isArray(queueData) &&
              queueData.map((item, i) => (
                <div key={item.bookingQueueId}>
                  <Button
                    // color="secondary"
                    // variant="outlined"
                    className={"booking-screen-button button"}
                    onClick={() => handleOPDClick(item.bookingQueueId)}
                    style={{ backgroundColor: "white" }}
                  // xs={{ backgroundColor: "secondary" }}
                  >
                    <button>{item.name}</button>
                  </Button>
                </div>
              ))}
          </header>
        </div>
        <div className="new-booking-screen-entity-select-item">
          <span className="new-booking-screen-entity-name">
            {Array.isArray(doctors) &&
              doctors.map((item, i) => (
                <div
                variant="contained"
                // style={{ margin:"10px" }}
                 key={item.entityId}>
                  <span
                    onClick={() => handleEntityClick(item)}
                  >{item.entityArea}</span>

                </div>
              ))}
          </span>
        </div>
        <img
        style={{ display: isVisible ? 'block' : 'none' }}
          alt="Rectangle7004102"
          src="/playground_assets/rectangle7004102-lnal-200h.png"
          className="new-booking-screen-rectangle700"
        />
        <span style={{ display: isVisible ? 'block' : 'none' }} className="new-booking-screen-text15">
          <span>Select queue to join</span>
        </span>
        <div className="new-booking-screen-select-clinic-heading-text">
          <span className="new-booking-screen-select-clinic-text-view">
            <span>Select Clinic</span>
          </span>
        </div>
        <img
          alt="Rectangle7024102"
          src="/playground_assets/rectangle7024102-c5zj-200h.png"
          className="new-booking-screen-rectangle702"
        />
        {/* <span className="new-booking-screen-date-name">
          <span>Date</span>
        </span> */}
       
        <span className="new-booking-screen-clinic-name-text">
          <span>Skin Clinic Pune Clinic</span>
        </span>
        <span className="new-booking-screen-doctor-degrees-text">
          <span>{specality}</span>
        </span>
        <span className="new-booking-screen-doctor-name-text">
          <span>{drName}</span>
        </span>
        <div className="new-booking-screen-entity-call-button">
          <img
            alt="Vector4103"
            src="/playground_assets/vector4103-yfx8.svg"
            className="new-booking-screen-call-icon"
          />
          <div className="new-booking-screen-entity-call-name-layout">
            <span className="new-booking-screen-entity-call-name-text">
              <span>Contact</span>
            </span>
          </div>
        </div>
        <img
          alt="Vector2254103"
          src="/playground_assets/vector2254103-wwi.svg"
          className="new-booking-screen-vector225"
        />
        <img
          alt="Vector2244103"
          src="/playground_assets/vector2244103-zjk.svg"
          className="new-booking-screen-vector224"
        />
        <div className="new-booking-screen-entity-location-button">
          <div className="new-booking-screen-group1789">
            <span className="new-booking-screen-text23">
              <span>Aurangabad</span>
            </span>
          </div>
          <div className="new-booking-screen-group">
            <img
              alt="Vector4103"
              src="/playground_assets/vector4103-qojk.svg"
              className="new-booking-screen-vector"
            />
            <img
              alt="Vector4103"
              src="/playground_assets/vector4103-rruki.svg"
              className="new-booking-screen-vector1"
            />
          </div>
        </div>
        <img
          alt="Ellipse834102"
          src={photourl}
          className="new-booking-screen-ellipse83"
        />


        <span className="new-booking-screen-custom-slot-duration-time">
          <div style={{ display: isVisible ? 'block' : 'none' }} >

            <label className="booking-screen-position2">
              {drName + " online booking opens at " + getTimeFromSeconds(selectedData.onlineBookingStartTimeSecsFromMidnight)}
            </label>
          </div>
          {Array.isArray(timerMiniSlot) &&
            timerMiniSlot.map((person, index) => {
              return (
                <div
                  key={index}

                >
                  <div style={{ display: isVisible ? 'block' : 'none' }} >

                    <label className="booking-screen-position2">
                      {getTimeFromSeconds(person.mainSlotOpdEndTimeSecsFromMidnight)}-
                      {getTimeFromSeconds(person.mainSlotOpdStartTimeSecsFromMidnight)}

                    </label>
                  </div>
                  <label className="booking-screen-position2">
                    {person.opdSlotStatusDisplayName + "\n"}
                  </label>

                  <div style={{ height: "4px" }} />
                  <div
                    key={index}
                    style={{
                      display: "inline-flex",
                      flexWrap: "wrap",

                    }}
                  >
                    {person.slotDetails.map((pet, index) => {
                      return (
                        <div key={index}>
                          <button
                            style={{
                              marginLeft: "10px",
                              backgroundColor: setisBackgroundRed
                                ? "lightblue"
                                : "red",
                            }}
                            onClick={() =>
                              handleBookingIdClick(pet)
                            }
                            className={"booking-screen-button button"}
                          >
                            {/* <div className="new-booking-screen-custom-mini-slot-layout">
                              <span className="new-booking-screen-custom-mini-slot-time">
                                <span>12:00 PM-12:15 PM</span>
                              </span>
                              <span className="new-booking-screen-custom-mini-slot-status">
                                <span>FULL</span>
                              </span>
                            </div> */}
                            {getTimeFromSeconds(pet.opdStartTimeSecsFromMidnight)}-
                            {getTimeFromSeconds(pet.opdEndTimeSecsFromMidnight)}
                            <label >
                              {pet.opdSlotStatus}
                            </label>


                          </button>
                        </div>
                      );
                    })}
                    <hr />
                  </div>
                </div>

              );
            })}
        </span>


      </div>
    </div>
  )
}

export default NewBookingScreen
