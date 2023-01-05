import React, { Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Helmet } from "react-helmet";
import axios from "axios";
import "./booking-screen.css";
import moment from "moment";
import MomentUtils from "@date-io/moment";
import ReactDatePicker from "react-datepicker";
import DatePicker from "react-datepicker";

//

import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { Box, Button, Grid } from "@mui/material";
import { forwardRef } from "react";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
// import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
// import Stack from "@mui/material/Stack";
// import dayjs from "dayjs";
import dayjs from "dayjs";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { height } from "@mui/system";
// import {
//   KeyboardDatePicker,
//   MuiPickersUtilsProvider,
// } from "@material-ui/pickers";

import generalCheck from "./genral-checkup";

const BookingScreen = (props) => {
  // const isBackgroundRed = true;
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
  // const [value, setValue] = React.useState(dayjs('2014-08-18T21:11:54'));

  //today select
  const [selectedData, setSelectedData] = React.useState([]);

  const handleChange1 = (newValue) => {
    setStartDate(newValue);
    onSelectDateClick();
  };

  const handleChange = (event) => {
    setValue(event.target.value);
    // alert(event.target.value);
  };

  useEffect(() => {
    // doctors(entityArea[0]);
    console.log(doctors);
  }, [doctors]);

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

  const handleEntityClick = event => {
    if (event != null) {
      setDoc(event);
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

  const handleBookingIdClick = (event) => {
    localStorage.setItem("bookingDailySlotIds", event);

    history.push("/genral-checkup");
  };

  const getDoctorAggregateDetails = async () => {
    const payload = {
      appUserId: doctor.userInfo.appUserId,
      doctorId: drId,
      entityId: doc,
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
      localStorage.setItem("finalappUserId",finalappUserId);
        console.log("appId", finalappUserId);
        setDoctor(responce.data);
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
      entityId: doc,
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
    <div className="booking-screen-container">
      <Helmet>
        <title>Booking-Screen - Planical modern template</title>
        <meta
          property="og:title"
          content="Booking-Screen - Planical modern template"
        />
      </Helmet>
      <section className="booking-screen-section">
        <div className="booking-screen-hero">
          <div className="booking-screen-content">
            <main className="booking-screen-main">
              <header className="booking-screen-header">
                <div className="booking-screen-author">
                  <img
                    alt="image"
                    src={photourl}
                    className="booking-screen-avatar"
                  />
                  <div className="booking-screen-details">
                    <h1 className="booking-screen-author1">{drName}</h1>
                    <label className="booking-screen-position">
                      {specality}
                    </label>
                    <div className="booking-screen-author2">
                      <a
                        href="https://goo.gl/maps/p774Cx2B6XB6zb2h6"
                        target="_blank"
                        rel="noreferrer noopener"
                        className="booking-screen-link"
                      >
                        <div className="booking-screen-author3">
                          <img
                            alt="image"
                            src="https://www.pngall.com/wp-content/uploads/9/Location-PNG-Clipart.png"
                            className="booking-screen-image"
                          />
                          <label className="booking-screen-position1">
                            {doctor.registrationYear}
                          </label>
                        </div>
                      </a>
                      <a href="tel:9766996640" className="booking-screen-link1">
                        <div className="booking-screen-author4">
                          <img
                            alt="image"
                            src="https://www.pngmart.com/files/22/Phone-Icon-PNG-Transparent.png"
                            className="booking-screen-image1"
                          />
                          <label className="booking-screen-position2">
                            Contact
                          </label>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </header>
            </main>
          </div>
        </div>
      </section>
      <section className="booking-screen-section1">
        <div className="booking-screen-hero1">
          <div className="booking-screen-content1">
            <main className="booking-screen-main1">
              <header className="booking-screen-header1">
                {Array.isArray(doctors) &&
                  doctors.map((item, i) => (
                    <div key={item.entityId}>
                      <Button
                        variant="contained"
                        className={"booking-screen-button button"}
                        onClick={() => handleEntityClick(item.entityId)}
                      >
                        <button
          
                        >
                          {item.entityArea}
                        </button>
                      </Button>
                    </div>
                  ))}
              </header>
            </main>
            <main className="booking-screen-main1">
              <header className="booking-screen-header1">
                {Array.isArray(queueData) &&
                  queueData.map((item, i) => (
                    <div key={item.bookingQueueId}>
                      <Button
                        variant="outlined"
                        // color="secondary"
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
            </main>
            <Box
              value={value}
              onChange={handleChange}
              style={{ display: "flex" }}
            >
              <Button
                color="success"
                disabled={false}
                size="medium"
                variant="outlined"
                onClick={onTodayClick}
                className={"booking-screen-button button"}
                style={{ marginRight: "10px" }}
              >
                Today
              </Button>
              <Button
                color="success"
                disabled={false}
                size="medium"
                variant="outlined"
                onClick={onTomorrowClick}
                className={"booking-screen-button button"}
                style={{ marginRight: "10px" }}
              >
                Tomaarow
              </Button>
              <Box
                sx={{ width: "100px", height: "10px", borderColor: "white" }}
              >
                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "0px", height: "0px" }}
                >
                  <Stack spacing={1}>
                    <DesktopDatePicker
                      sx={{
                        color: "white",
                        width: "0px",
                        color: "success",
                      }}
                      // label="Date desktop"
                      inputFormat="MM/DD/YYYY"
                      value={timerMiniSlot}
                      // value={selectedData}
                      onChange={handleChange1}
                      onClick={onSelectDateClick}
                      renderInput={(params) => (
                        <TextField {...params} color="success" />
                      )}
                      InputAdornmentProps={{ position: "start" }}
                    />
                  </Stack>
                </LocalizationProvider>
              </Box>
            </Box>
            {/* <div className="e-btn-group">
              <input type="radio" id="radioleft" name="align" value="left" />
              <label className="e-btn" htmlFor="radioleft">
                Left
              </label>
              <input
                type="radio"
                id="radiomiddle"
                name="align"
                value="middle"
              />
              <label className="e-btn" htmlFor="radiomiddle">
                Center
              </label>
              <input type="radio" id="radioright" name="align" value="right" />
              <label className="e-btn" htmlFor="radioright">
                Right
              </label>
            </div> */}
            {/* <FormControl>
              <RadioGroup
                row
                aria-labelledby="demo-row-radio-buttons-group-label"
                name="row-radio-buttons-group"
                value={value}
                onChange={handleChange}
              >
                <FormControlLabel
                  style={{ color: "white" }}
                  value="Today"
                  control={<Radio />}
                  label="Today"
                  onClick={onTodayClick}
                />
                <FormControlLabel
                  style={{ color: "white" }}
                  value="Tomaarow"
                  control={<Radio />}
                  label="Tomaarow"
                  onClick={onTomorrowClick}
                />

                <FormControlLabel
                  style={{ color: "white" }}
                  value="Select date"
                  control={<Radio />}
                  label="Select date"
                />

                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  customInput={<ExampleCustomInput />}
                />

                <LocalizationProvider
                  dateAdapter={AdapterDayjs}
                  sx={{ width: "0px", height: "0px" }}
                >
                  <Stack spacing={3} sx={{ width: "0px" }}>
                    <DesktopDatePicker
                      sx={{
                        color: "white",
                        width: "0px",
                      }}
                      value={timerMiniSlot}
                      onChange={handleChange1}
                      onClick={onSelectDateClick}
                      renderInput={(params) => <TextField {...params} />}
                      InputAdornmentProps={{ position: "start" }}
                    />
                  </Stack>
                </LocalizationProvider>
              </RadioGroup>
            </FormControl> */}
            {/* <main className="booking-screen-main1">
              <header className="booking-screen-header1">
                {Array.isArray(timerMiniSlot) &&
                  timerMiniSlot.map((item, i) => (
                    <div key={item.mainSlotId}>
                      <button
                        onClick={() => handleOPDClick(item.mainSlotId)}
                        className={"booking-screen-button button"}
                      >
                        {item.opdSlotStatusDisplayName}
                      </button>
                    </div>
                  ))}

              
              </header>
            </main> */}
            {<generalCheck sData={selectedData} tSlot={timerMiniSlot} />}
            <div>
              {Array.isArray(timerMiniSlot) &&
                timerMiniSlot.map((person, index) => {
                  return (
                    <div
                      key={index}
                      style={{
                        display: "inline-flex",
                        flexWrap: "wrap",
                        justifyContent: "space-around",
                      }}
                    >
                      <label className="booking-screen-position2">
                        {person.opdSlotStatusDisplayName}
                      </label>

                      {person.slotDetails.map((pet, index) => {
                        return (
                          <div key={index}>
                            <button
                              style={{
                                backgroundColor: setisBackgroundRed
                                  ? "lightblue"
                                  : "red",
                              }}
                              onClick={() =>
                                handleBookingIdClick(pet.bookingDailySlotId)
                              }
                              className={"booking-screen-button button"}
                            >
                              {pet.opdStartTimeSecsFromMidnight / 60 / 60}-
                              {pet.opdEndTimeSecsFromMidnight / 60 / 60}
                              {/* {"\n"+pet.opdSlotStatus} */}
                            </button>
                          </div>
                        );
                      })}

                      <hr />
                    </div>
                  );
                })}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
export default BookingScreen;
