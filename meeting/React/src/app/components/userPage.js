import React, { useState } from "react";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";
import ScheduleClasses from "./ScheduleClasses";
import ListClasses from "./ListClasses";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import axios from "axios";
import UploadUserInfo from "./UploadUserInfo";
import { userAtom } from "../app.js";
import "./styles/userPage.scss";
import { memoizedRefreshToken } from "../utils/refreshToken";
import Cookies from "js-cookie";

function UserPage() {
  const [buttonBgColor, setButtonBgColor] = useState("DodgerBlue");
  const [activeClassIDs, setActiveClassIDs] = useState([]);
  const [conflictIDNumbers, setConflictIDNumbers] = useState([]);
  const [classList, setClassList] = useState([]);
  const [timeForClass, setTimeForClass] = useState(false);
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  const isMeetingOnNow = (sessions) => {
    const timeNowMS = Date.now().valueOf();
    let classTimeNow = false;
    // classes are sorted, so looking at the first class only
    const nextClass = sessions[0];
    const nextCBTms = new Date(nextClass.class_datetime).valueOf();
    const nextCETms = new Date(nextClass.endtime).valueOf();

    if (timeNowMS >= nextCBTms && timeNowMS < nextCETms) {
      // if meeting is going on now
      let activeIDs = activeClassIDs;
      activeIDs.push(nextClass.id);
      setTimeForClass(true);
      setButtonBgColor("green");
      setActiveClassIDs(activeIDs);
      classTimeNow = true;
    } else {
      setTimeForClass(false);
      setButtonBgColor("DodgerBlue");
    }
  };

  const getClassList = async (user) => {
    try {
      const classes = await axios.get(`Classes/`);
      console.log("Checking classes.data.length in getClassList");
      if (classes.data.length != 0) {
        setClassList(classes.data);
      }
    } catch (errors) {
        console.log("Error condition triggered in getClassList.", errors);
        const originalRequest = error.config;
        return Promise.reject(error);
    }
  };

  const UTCtoLocal = (datestring) => {
    const local = new Date(datestring);
    const options = { timeZone: 'America/New_York' };
    return local.toLocaleString('en-US', options);
  };

  const highlightConflictLines = (IDNumber) => {
    let numbers = conflictIDNumbers;
    numbers.push(IDNumber);
    setConflictIDNumbers(numbers);
  };

  const clearConflictIDNumbers = () => {
    setConflictIDNumbers([]);
  };

  const resetLRButtonColor = () => {
    setButtonBgColor("DodgerBlue");
  };
  
  return (
    <div className='userPageStyle'>
      <p className='p4'>
        Good {greetingTime()}, {user.username}{" "}
      </p>
      <ListClasses
        user={user.username}
        classList={classList}
        getClassList={getClassList}
		    UTCtoLocal={UTCtoLocal}
        isMeetingOnNow={isMeetingOnNow}
        timeForClass={timeForClass}
        activeClassIDs={activeClassIDs}
        conflictIDNumbers={conflictIDNumbers}
        resetLRButtonColor={resetLRButtonColor}
      />
      <br />
      <ScheduleClasses
        user={user.username}
        classList={classList}
        getClassList={getClassList}
		    UTCtoLocal={UTCtoLocal}
        conflictIDNumbers={conflictIDNumbers}
        highlightConflictLines={highlightConflictLines}
        clearConflictIDNumbers={clearConflictIDNumbers}
      />
      &nbsp;&nbsp;
      {user.username ? (
        <UploadUserInfo user={user.username} mtg_types={user.mtgTypes} />
      ) : null}
      <div className='VSpace50px' />
      <div className='VSpace50px' />
    </div>
  );
}

function greetingTime() {
  let today = new Date(),
    hours = today.getHours();
  if (hours < 12) {
    return "Morning";
  } else if (hours < 18) {
    return "Afternoon";
  } else {
    return "Evening";
  }
}

// Not currently using this; included for future reference.
function getDateTimeNow() {
  let now = new Date();
  const allWeekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let dateTimeString =
    allWeekdays[now.getDay()] + ", " + now.toLocaleString("en-CA");
  return dateTimeString;
}

export default UserPage;

