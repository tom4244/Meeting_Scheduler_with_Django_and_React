import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import "react-tippy/dist/tippy.css";
import { Tooltip } from "react-tippy";
import axios from "axios";
import { PropTypes } from "prop-types";
import { usersListAtom } from "../app.js";
import "./styles/userPage.scss";

axios.defaults.xsrfHeaderName = 'x-csrftoken'
axios.defaults.xsrfCookieName = 'csrftoken'

function ScheduleClasses(props) {
  const [mtg_types, setMtgType] = useState("New Project");
  const [number_of_weeks, setNumberOfWeeks] = useState(1);
  const [month, setMonth] = useState("January"); // selected month as a word
  const [classDate, setClassDate] = useState(1);
  const [classMonth, setClassMonth] = useState(0); // selected month as a number from 0 to 11
	const currentYear = new Date().getFullYear();
  const [classYear, setClassYear] = useState(currentYear + 1);
  const [classWeekday, setClassWeekday] = useState(""); 
  const [selected_weekdays, setSelected_weekdays] = useState([""]);
  const [weekdaysString, setWeekdaysString] = useState("");
  const [classHour, setClassHour] = useState(8);
  const [classMinutes, setClassMinutes] = useState("00");
  const [classAMPM, setClassAMPM] = useState("a.m.");
  const [classEndHour, setClassEndHour] = useState(9);
  const [classEndMinutes, setClassEndMinutes] = useState("00");
  const [classEndAMPM, setClassEndAMPM] = useState("a.m.");
  const [student1, setStudent1] = useState("None");
  const [student2, setStudent2] = useState("");
  const [student3, setStudent3] = useState("");
  const [student4, setStudent4] = useState("");
  const [student5, setStudent5] = useState("");
  const [students_string, setStudents_string] = useState(
    "(please select participants above)"
  );
  const [first_names_string, setFirst_names_string] = useState("");
  const [allStudents, setAllStudents] = useState([]);
  const [allFirstNames, setAllFirstNames] = useState([]);
  const [allLastNames, setAllLastNames] = useState([]);
  const [chosenFirstNames, setChosenFirstNames] = useState([ "", "", "", "", "" ]);
  const [chosenLastNames, setChosenLastNames] = useState(["", "", "", "", ""]);
  const [showConflictButtons, setShowConflictButtons] = useState(false);
  const [conflictChoiceMade, setConflictChoiceMade] = useState(false);
  const [warningText, setWarningText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [usersList, setUsersList] = useAtom(usersListAtom);

  const getParticipantsListFromDB = () => {
    return axios.get('user/');
  };

  useEffect(() => {
    getParticipantsListFromDB()
      .then((usersListData) => {
        console.log("ScheduleClasses usersListData: ", usersListData)
        let sList = usersListData.data.map((obj) => {
          obj.key = obj.id;
          return obj;
        });
        sList.unshift({
          id: 0,
          email: "None",
          username: "None",
          firstname: "None",
          lastname: "None",
          roomname: "None",
        });
        console.log("sList in useEffect: ", sList)
        setUsersList(sList);
        setAllStudents(
          sList.map((obj) => {
            return obj.username;
          })
        );
        setAllFirstNames(
          sList.map((obj) => {
            return obj.firstname;
          })
        );
        setAllLastNames(
          sList.map((obj) => {
            return obj.lastname;
          })
        );
	      const defaultWeekday = getClassWeekday(currentYear + 1, 1, 1);
        setWeekdaysString(defaultWeekday);
        setClassWeekday(defaultWeekday); 
        setSelected_weekdays([defaultWeekday]);
      })
      .catch((errors) => {
        console.log("Error copying students list to state: ", errors);
      });
  }, []);

  const changeArray = (array, index, value) => {
    let newArray = array;
    newArray[index] = value;
    return newArray;
  };

  const update_students_string = (newArray) => {
    let new_students_string = "";
    for (let student of newArray) {
      if (student !== "None" && student !== "") {
        new_students_string = new_students_string + ", " + student;
      }
    }
    while (new_students_string.substr(0, 2) === ", ") {
      new_students_string = new_students_string.substr(2);
    }
    setStudents_string(new_students_string);
  };

  const update_first_names_string = (newArray) => {
    let new_first_names_string = "";
    for (let student of newArray) {
      if (student !== "None" && student !== "") {
        new_first_names_string = new_first_names_string + ", " + student;
      }
    }
    while (new_first_names_string.substr(0, 2) === ", ") {
      new_first_names_string = new_first_names_string.substr(2);
    }
    setFirst_names_string(new_first_names_string);
  };

  const handleChangeStudent1 = (event) => {
    setSubmittedText("");
    console.log("usersList contents in handleChangeStudent1: ", usersList)
    if (!students_string.includes(event.target.value)) {
      setStudent1(event.target.value);
      // Display the first and last names under the name selects
      if (event.target.value === "None") {
        setChosenFirstNames(changeArray(chosenFirstNames, 0, ""));
        setChosenLastNames(changeArray(chosenLastNames, 0, ""));
      } else {
        setChosenFirstNames(
          changeArray(
            chosenFirstNames,
            0,
            usersList[event.target.selectedIndex].first_name
          )
        );
        setChosenLastNames(
          changeArray(
            chosenLastNames,
            0,
            usersList[event.target.selectedIndex].last_name
          )
        );
      }
      update_students_string([
        event.target.value,
        student2,
        student3,
        student4,
        student5,
      ]);
      update_first_names_string(chosenFirstNames);
    }
  };

  const handleChangeStudent2 = (event) => {
    setSubmittedText("");
    if (!students_string.includes(event.target.value)) {
      if (student1 === "None") {
        handleChangeStudent1(event);
      } else {
        setStudent2(event.target.value);
        if (event.target.value === "None") {
          setChosenFirstNames(changeArray(chosenFirstNames, 1, ""));
          setChosenLastNames(changeArray(chosenLastNames, 1, ""));
        } else {
          setChosenFirstNames(
            changeArray(
              chosenFirstNames,
              1,
              usersList[event.target.selectedIndex].first_name
            )
          );
          setChosenLastNames(
            changeArray(
              chosenLastNames,
              1,
              usersList[event.target.selectedIndex].last_name
            )
          );
        }
      }
      update_students_string([
        student1,
        event.target.value,
        student3,
        student4,
        student5,
      ]);
      update_first_names_string(chosenFirstNames);
    }
  };

  const handleChangeStudent3 = (event) => {
    setSubmittedText("");
    if (!students_string.includes(event.target.value)) {
      if (student1 === "None") {
        handleChangeStudent1(event);
      } else {
        setStudent3(event.target.value);
        if (event.target.value === "None") {
          setChosenFirstNames(changeArray(chosenFirstNames, 2, ""));
          setChosenLastNames(changeArray(chosenLastNames, 2, ""));
        } else {
          setChosenFirstNames(
            changeArray(
              chosenFirstNames,
              2,
              usersList[event.target.selectedIndex].first_name
            )
          );
          setChosenLastNames(
            changeArray(
              chosenLastNames,
              2,
              usersList[event.target.selectedIndex].last_name
            )
          );
        }
      }
      update_students_string([
        student1,
        student2,
        event.target.value,
        student4,
        student5,
      ]);
      update_first_names_string(chosenFirstNames);
    }
  };

  const handleChangeStudent4 = (event) => {
    setSubmittedText("");
    if (!students_string.includes(event.target.value)) {
      if (student1 === "None") {
        handleChangeStudent1(event);
      } else {
        setStudent4(event.target.value);
        if (event.target.value === "None") {
          setChosenFirstNames(changeArray(chosenFirstNames, 3, ""));
          setChosenLastNames(changeArray(chosenLastNames, 3, ""));
        } else {
          setChosenFirstNames(
            changeArray(
              chosenFirstNames,
              3,
              usersList[event.target.selectedIndex].first_name
            )
          );
          setChosenLastNames(
            changeArray(
              chosenLastNames,
              3,
              usersList[event.target.selectedIndex].last_name
            )
          );
        }
      }
      update_students_string([
        student1,
        student2,
        student3,
        event.target.value,
        student5,
      ]);
      update_first_names_string(chosenFirstNames);
    }
  };

  const handleChangeStudent5 = (event) => {
    setSubmittedText("");
    if (!students_string.includes(event.target.value)) {
      if (student1 === "None") {
        handleChangeStudent1(event);
      } else {
        setStudent5(event.target.value);
        if (event.target.value === "None") {
          setChosenFirstNames(changeArray(chosenFirstNames, 4, ""));
          setChosenLastNames(changeArray(chosenLastNames, 4, ""));
        } else {
          setChosenFirstNames(
            changeArray(
              chosenFirstNames,
              4,
              usersList[event.target.selectedIndex].first_name
            )
          );
          setChosenLastNames(
            changeArray(
              chosenLastNames,
              4,
              usersList[event.target.selectedIndex].last_name
            )
          );
        }
      }
      update_students_string([
        student1,
        student2,
        student3,
        student4,
        event.target.value,
      ]);
      update_first_names_string(chosenFirstNames);
    }
  };

  const handleWeekdaySelection = (e) => {
    setSubmittedText("");
    const newSelection = e.target.value;
    let newSelectionArray;
    if (selected_weekdays.indexOf(newSelection) > -1) {
      newSelectionArray = selected_weekdays.filter((s) => s !== newSelection);
    } else {
      newSelectionArray = [...selected_weekdays, newSelection];
    }
    const sortedOrder = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let sortedArray = [];
    for (let n of sortedOrder) {
      if (newSelectionArray.includes(n)) sortedArray.push(n);
    }
    setSelected_weekdays(sortedArray);
    setWeekdaysString(sortedArray.toString().replace(/,/g, ", "));
  };

  const handleChangeMtgType = (event) => {
    setSubmittedText("");
    setMtgType(event.target.value);
  };

  const handleChangeWeeks = (event) => {
    setSubmittedText("");
    setNumberOfWeeks(parseInt(event.target.value, 10));
  };

  const handleChangeMonth = (event) => {
    setSubmittedText("");
    const newMonth = getMonthNumber(event.target.value);
    const newYear = getClassYear(
      newMonth,
      classDate,
      classHour,
      classMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, newMonth, classDate);
    setMonth(event.target.value);
    setClassMonth(newMonth);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeDate = (event) => {
    setSubmittedText("");
    const newDate = parseInt(event.target.value, 10);
    const newYear = getClassYear(
      classMonth,
      newDate,
      classHour,
      classMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, newDate);
    setClassDate(newDate);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeHour = (event) => {
    setSubmittedText("");
    const newHour = parseInt(event.target.value, 10);
    const newYear = getClassYear(
      classMonth,
      classDate,
      newHour,
      classMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassHour(newHour);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeMinute = (event) => {
    setSubmittedText("");
    const newMinutes = event.target.value;
    const newYear = getClassYear(
      classMonth,
      classDate,
      classHour,
      newMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassMinutes(newMinutes);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeClassAMPM = (event) => {
    setSubmittedText("");
    const newAMPM = event.target.value;
    const newYear = getClassYear(
      classMonth,
      classDate,
      classHour,
      classMinutes,
      newAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassAMPM(newAMPM);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeEndHour = (event) => {
    setSubmittedText("");
    const endHour = parseInt(event.target.value, 10);
    const newYear = getClassYear(
      classMonth,
      classDate,
      classHour,
      classMinutes,
      classAMPM,
      endHour,
      classEndMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassEndHour(endHour);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeEndMinutes = (event) => {
    setSubmittedText("");
    const endMinutes = event.target.value;
    const newYear = getClassYear(
      classMonth,
      classDate,
      classHour,
      classMinutes,
      classAMPM,
      classEndHour,
      endMinutes,
      classEndAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassEndMinutes(endMinutes);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const handleChangeClassEndAMPM = (event) => {
    setSubmittedText("");
    const endAMPM = event.target.value;
    const newYear = getClassYear(
      classMonth,
      classDate,
      classHour,
      classMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      endAMPM
    );
    const newWeekday = getClassWeekday(newYear, classMonth, classDate);
    setClassEndAMPM(endAMPM);
    setClassWeekday(newWeekday);
    setSelected_weekdays([newWeekday]);
    setWeekdaysString(newWeekday);
  };

  const getClassEntryString = () => {
    return (
      mtg_types + " meeting with " + students_string + " on " +
weekdaysString + " at " + classHour.toString() + ":" + classMinutes +
" " + classAMPM + " until " + classEndHour + ":" + classEndMinutes + " " +
classEndAMPM + " beginning on " + classWeekday + ", " + month + " " +
classDate + " for " + number_of_weeks + " week(s)");
  };

  var timerId = 0;
	// Debounce function: Input as function which needs to be debounced 
  // and delay is the debounced time in milliseconds
  const debounceTouch = (func, delay) => {
  	// Cancels the setTimeout method execution
  	clearTimeout(timerId);
  	// Executes the func after delay time.
  	timerId  =  setTimeout(() => func, delay);
  }
	
  // Confirm Appointment(s) button
  const handleSubmit = (event) => {
    event.preventDefault();
    // Check for a time conflict with already scheduled meetings
    setShowConflictButtons(false);
    let classHour24 = classHour;
    if (classAMPM == "p.m.") {
      classHour24 = classHour24 + 12;
    }
    let newClassBeginTime = new Date(
      classYear,
      classMonth,
      classDate,
      classHour24,
      parseInt(classMinutes, 10)
    );
    console.log(
      "newCBT: ",
      newClassBeginTime,
      "  LocaleString: ",
      newClassBeginTime.toLocaleString("en-US")
    );

    let newClassEndTime = new Date(newClassBeginTime);
    let endHour = classEndHour;
    if (classEndAMPM == "p.m.") {
    }
    // Handle cases where the class end time is actually the next day; max class length 23:59
    console.log(
      "endHour: ",
      endHour,
      "  newCBT.getHours: ",
      newClassBeginTime.getHours()
    );
    let hoursInterval = endHour - newClassBeginTime.getHours();
    if (hoursInterval < 0) {
      hoursInterval = hoursInterval + 24;
    }
    newClassEndTime.setHours(
      newClassBeginTime.getHours() + hoursInterval,
      parseInt(classEndMinutes, 10)
    );
    // Now newCBT and newCET are set properly
    console.log("newCET: ", newClassEndTime);
    // Conflict check
    // Look through meeting list for meeting times that conflict with the new meeting time
    if (props.classList.length != 0) {
      let conflictFound = false;
      for (let nextClass of props.classList) {
        // For class conflict check, only consider existing classes starting within one day of the new one
        const oneDayMS = 24 * 60 * 60 * 1000;
        const newCBTms = newClassBeginTime.valueOf();
        const nextCBTms = new Date(nextClass.class_datetime).valueOf();
        if (Math.abs(newCBTms - nextCBTms) < oneDayMS) {
          console.log(
            "Dates are within one day of each other; doing conflict check"
          );

          const nextCETms = new Date(nextClass.endtime).valueOf();
          const newCETms = newClassEndTime.valueOf();
          // Take care of new meeting entry conflicts.
          if (
            (newCBTms >= nextCBTms && newCBTms < nextCETms) ||
            (newCETms > nextCBTms && newCETms <= nextCETms)
          ) {
						console.log("conflict was found");
            conflictFound = true;
            handleConflict(nextClass.id);
            break; // conflict found, so after handling it conflict search can be exited
            //   Are we past one day of difference in times in sorted lines?
            //   If so we can stop looking for a conflict.
          } else if (newCBTms > nextCBTms + oneDayMS) {
            break;
          }
        }
      }
      if (!conflictFound) {
        debounceTouch(sendNewClassToDB(props), 1000);
        setSubmittedText("Meeting registered. Meeting details will appear in the Upcoming Meeting list above in a moment, after it has been entered in the database.");
      }
    } else {
      // classList.length == 0; no conflict check needed
      debounceTouch(sendNewClassToDB(props), 1000);
      setSubmittedText("Meeting registered. Meeting details will appear in the Upcoming Meeting list above in a moment, after it has been entered in the database.");
    }
  };

  const handleConflict = async (classID) => {
    props.highlightConflictLines(classID);
    console.log("New meeting entry conflicts with existing meeting");
    setWarningText(
      "The new meeting time conflicts with a previously entered meeting in the meeting list above. Part or all of the new meeting goes on during a previous one. Schedule it anyway?"
    );
    setShowConflictButtons(true);
    try {
      await waitForConflictChoice();
    } catch (errors) {
      console.log("Error in handleConflict  ", errors);
    }
    setConflictChoiceMade(false);
    setWarningText("");
    setShowConflictButtons(false);
    props.clearConflictIDNumbers();
  };

  const waitForConflictChoice = async () => {
    const timeoutPromise = (timeout) =>
      new Promise((resolve) => setTimeout(resolve, timeout));
    while (!conflictChoiceMade) {
      try {
        await timeoutPromise(1000);
      } catch (errors) {
        console.log("Error in waitForConflictChoice  ", errors);
      }
    }
    return false;
  };
  
  const handleConflictOK = (event) => {
    sendNewClassToDB(props);
    setConflictChoiceMade(true);
    setSubmittedText("Meeting registered. Meeting details will appear in the Upcoming Meeting list above in a moment, after it has been entered in the database.");
  };

  const handleConflictCancel = (event) => {
    setConflictChoiceMade(true);
  };

  const sendNewClassToDB = async (props) => {
    // Send new meeting appointment to database
    props.clearConflictIDNumbers();
		const addPMHours = (classAMPM == 'p.m.') ? 12 : 0;
    const classHourAMPM = ((classHour === 12) ? 0 : classHour) + addPMHours;
		const addEndPMHours = (classEndAMPM == 'p.m.') ? 12 : 0;
    const classEndHourAMPM = ((classEndHour === 12) ? 0 : classEndHour) + addEndPMHours;
	  const classFirstDay = new Date(classYear, classMonth, classDate, classHourAMPM, (parseInt(classMinutes, 10)));
    const timezoneOffset = classFirstDay.getTimezoneOffset();
		const classEndTime = new Date(classYear, classMonth, classDate, classEndHourAMPM, (parseInt(classEndMinutes, 10))); 
    let classData = {
			mtg_types,
      number_of_weeks,
      selected_weekdays,
      weekdaysString,
      classDate,
      classMonth,
      classWeekday,
      classYear,
      classHour,
      classMinutes,
      classAMPM,
      classEndHour,
      classEndMinutes,
      classEndAMPM,
      students_string,
      first_names_string,
      timezoneOffset,
			classFirstDay,
			classEndTime
    };
    classData.user = props.user;
		console.log("just before await meetingAppointmentsToDB");
		let classEntryIDKey = 0;
    try {
      let msg = await meetingAppointmentsToDB(classData);
    } catch (errors) {
      console.log("Error in meetingAppointmentsToDB: ", errors);
    }
    // Record meeting appointment string for later reference
    let entryString = getClassEntryString();
    entryString =
      '{"user":"' + props.user + '", "entry":"' + entryString + '"}';
    try {
      let msg = await meetingEntryToDB(JSON.parse(entryString));
    } catch (errors) {
      console.log("Error during meetingEntryToDB call in handleSubmit: ", errors);
    }
    // Update the meeting list on the user's page
    try {
      setTimeout(async () => {
        let msg = await props.getClassList(props.user);
      }, 1000);
			  console.log("Getting meeting list");
    } catch (errors) {
      console.log("Error in getClassList in ScheduleClasses: ", errors);
    }
  };

  const getClassWeekday = (year, month, date) => {
    const allWeekdays = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    const localClassWeekday = allWeekdays[new Date(year, month, date).getDay()];
    return localClassWeekday;
  };
  
	// Calculate meeting year automatically; use next year if
  //   the date and time of the meeting has past already this year
  const getClassYear = (
    classMonth,
    classDate,
    classHour,
    classMinutes,
    classAMPM,
    classEndHour,
    classEndMinutes,
    classEndAMPM
  ) => {
    const timeNowMS = Date.now().valueOf();
    const now = new Date();
    const thisYear = now.getFullYear();
    const nextYear = thisYear + 1;
    const thisMonth = now.getMonth();
    const thisDate = now.getDate();
    if (thisMonth < classMonth) {
      setClassYear(thisYear);
      return thisYear;
    } else if (thisMonth > classMonth) {
      setClassYear(nextYear);
      return nextYear;
    } else if (thisMonth == classMonth) {
      if (thisDate < classDate) {
        setClassYear(thisYear);
        return thisYear;
      } else if (thisDate > classDate) {
        setClassYear(nextYear);
        return nextYear;
      } else if (thisDate == classDate) {
        // Any entered date and time in the past is automatically assumed to be 
        // a meeting for next year; however, if the current date has been entered,
        // the year is assumed to be the present year in case a user just 
        // forgot to enter the meeting data before the meeting time.
          setClassYear(thisYear);
          return thisYear;
      }
    }
  };

  // Get students' names from database.
  const listItems1 = allStudents.map((student1) => (
    <option key={student1}>{student1}</option>
  ));
  const listItems2 = allStudents.map((student2) => (
    <option key={student2}>{student2}</option>
  ));
  const listItems3 = allStudents.map((student3) => (
    <option key={student3}>{student3}</option>
  ));
  const listItems4 = allStudents.map((student4) => (
    <option key={student4}>{student4}</option>
  ));
  const listItems5 = allStudents.map((student5) => (
    <option key={student5}>{student5}</option>
  ));

  const CheckboxOrRadioGroup = (props) => (
    <div>
      <label>{props.title}</label>
      <div>
        {props.options.map(option => {
          return (
            <div key={option}>
              <input
                name={props.groupName}
                onChange={props.controlFunc}
                value={option}
                checked={props.selectedOptions.indexOf(option) > -1} 
                type={props.type} /> {option}
                <br/>
            </div>
          );  
        })} 
      </div>
    </div>
  );
  
  CheckboxOrRadioGroup.propTypes = { 
    title: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['checkbox', 'radio']).isRequired,
    groupName: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    selectedOptions: PropTypes.array,
    controlFunc: PropTypes.func.isRequired
  };

  return (
    <form onSubmit={handleSubmit} className='formLeft'>
      <Tooltip
        theme="light"
        title="Making an appointment here will automatically send a message to the participant's personal log-in page to remind him or her of the meeting time."
      >
        <h2>
          <b>Schedule new meetings:</b>
        </h2>
      </Tooltip>
      <h3>
         Participants 
      </h3>
      <p className='p3mt0'>
        (click the button and then type the first part of a registered person's
        username to find it easily)
      </p>
      <div className='vSpace10px' />

      <div className='flexRow'>
        <div className='flexColumn'>
          <label className='label7'>Participant 1</label>
          <select className='selectWide' value={student1} onChange={handleChangeStudent1}>
            {listItems1}
          </select>
          <label className='nameLabel'>
            {chosenFirstNames[0] + " " + chosenLastNames[0]}
          </label>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='label7'>Participant 2</label>
          <select className='selectWide' value={student2} onChange={handleChangeStudent2}>
            {listItems2}
          </select>
          <label className='nameLabel'>
            {chosenFirstNames[1] + " " + chosenLastNames[1]}
          </label>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='label7'>Participant 3</label>
          <select className='selectWide' value={student3} onChange={handleChangeStudent3}>
            {listItems3}
          </select>
          <label className='nameLabel'>
            {chosenFirstNames[2] + " " + chosenLastNames[2]}
          </label>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='label7'>Participant 4</label>
          <select className='selectWide' value={student4} onChange={handleChangeStudent4}>
            {listItems4}
          </select>
          <label className='nameLabel'>
            {chosenFirstNames[3] + " " + chosenLastNames[3]}
          </label>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='label7'>Participant 5</label>
          <select className='selectWide' value={student5} onChange={handleChangeStudent5}>
            {listItems5}
          </select>
          <label className='nameLabel'>
            {chosenFirstNames[4] + " " + chosenLastNames[4]}
          </label>
          &nbsp;
        </div>
      </div>

      <div className='flexRow' >
        <div className='flexColumn'>
          <label className='label8'>Month</label>
          <select className='selectSmallFont' value={month} onChange={handleChangeMonth}>
            Month
            <option>January</option>
            <option>February</option>
            <option>March</option>
            <option>April</option>
            <option>May</option>
            <option>June</option>
            <option>July</option>
            <option>August</option>
            <option>September</option>
            <option>October</option>
            <option>November</option>
            <option>December</option>
          </select>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='label2'>Date</label>
          <select className='selectNarrowSmallFont40'
            value={classDate}
            onChange={handleChangeDate}
          >
            Date
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
            <option>27</option>
            <option>28</option>
            <option>29</option>
            <option>30</option>
            <option>31</option>
          </select>
        </div>
        <label className='labelCenter' >
          ({classWeekday})
        </label>
      </div>

      <div className='flexRow'>
        <div className='flexColumnRt'>
          <label className='label9'>Hour</label>
          <select className='select3'
            value={classHour}
            onChange={handleChangeHour}
          >
            Hour
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>

        <div className='colon' >:</div>

        <div className='flexColumn'>
          <label className='label9'>Minute</label>
          <select className='select4'
            value={classMinutes}
            onChange={handleChangeMinute}
          >
            Minute
            <option>00</option>
            <option>05</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
            <option>25</option>
            <option>30</option>
            <option>35</option>
            <option>40</option>
            <option>45</option>
            <option>50</option>
            <option>55</option>
          </select>
          &nbsp;
        </div>

        <div className='flexColumn'>
          <label className='ampm' >
            a.m./p.m.
          </label>
          <select className='selectNarrowSmallFont40'
            value={classAMPM}
            onChange={handleChangeClassAMPM}
          >
            <option>a.m.</option>
            <option>p.m.</option>
          </select>
          <br />
          <br />
        </div>
      </div>
      <div className='p6'>
        Note: 12:00 a.m. is midnight. 12:00 p.m. is noon.
      </div>
      <label className='label260' >
        Meeting End Time:
      </label>

      <div className='flexRow'>
        <div className='flexColumnRt'>
          <label className='label9'>Hour</label>
          <select className='select3'
            value={classEndHour}
            onChange={handleChangeEndHour}
          >
            Hour
            <option>0</option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
          </select>
        </div>

        <div className='colon' >:</div>

        <div className='flexColumn'>
          <label className='label9'>Minute</label>
          <select className='select4'
            value={classEndMinutes}
            onChange={handleChangeEndMinutes}
          >
            Minute
            <option>00</option>
            <option>05</option>
            <option>10</option>
            <option>15</option>
            <option>20</option>
            <option>25</option>
            <option>30</option>
            <option>35</option>
            <option>40</option>
            <option>45</option>
            <option>50</option>
            <option>55</option>
          </select>
          <br />
        </div>

        <div className='flexColumn'>
          <label className='ampm'>
            a.m./p.m.
          </label>
          <select className='selectNarrowSmallFont40'
            value={classEndAMPM}
            onChange={handleChangeClassEndAMPM}
          >
            <option>a.m.</option>
            <option>p.m.</option>
          </select>
          <br />
          <br />
        </div>
      </div>

      <div className='flexColumn'>
        <label className='label200'>Topic</label>
        <select className='selectWide' value={mtg_types} onChange={handleChangeMtgType} >
          MtgType
          <option>New Project</option>
          <option>QA</option>
          <option>Daily Scrum</option>
          <option>Test Engineering</option>
          <option>Firmware</option>
        </select>
      </div>
      <div className='vSpace10px' />

      <Tooltip
        theme="light"
        title="The Month and Date selected above should be for your <strong>first </strong>(earliest) meeting."
      >
        <p className='p5'>
          Here you can enter days and number of weeks for continuing sessions.
          <br/>
		      Dates will be automatically calculated and added to the schedule.
        </p>
      </Tooltip>
      <div className='vSpace10px' />

      <div className='flexRow'>
        <div className='flexColumn20'>
          <label>Number of Weeks</label>
          <select value={number_of_weeks} onChange={handleChangeWeeks}>
            Date
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
            <option>6</option>
            <option>7</option>
            <option>8</option>
            <option>9</option>
            <option>10</option>
            <option>11</option>
            <option>12</option>
            <option>13</option>
            <option>14</option>
            <option>15</option>
            <option>16</option>
            <option>17</option>
            <option>18</option>
            <option>19</option>
            <option>20</option>
            <option>21</option>
            <option>22</option>
            <option>23</option>
            <option>24</option>
            <option>25</option>
            <option>26</option>
          </select>
        </div>
        <div className='vSpace10px' />

        <div className='flexColumn'>
          <label className='label11'>Weekdays</label>
          <br />
          <div className='checkboxGroup'>
            <CheckboxOrRadioGroup
              title={""}
              groupName={"weekdays"}
              type={"checkbox"}
              controlFunc={handleWeekdaySelection}
              options={[
                "Sunday",
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
              ]}
              selectedOptions={selected_weekdays}
            />
          </div>
          <br />
        </div>
      </div>
      <div className='vSpace10px' />

      <h2 className='h2mt0'>
        <strong>Current entry:</strong>
      </h2>
      <p className='p3mt0'>(please check and confirm)</p>
      <p className='p5'>
        <b>{getClassEntryString()}</b>
      </p>
      <div className='vSpace10px' />
      <div className='flexRow80' >
        <button className='buttonRounded240'
          type="submit"
        >
		    Confirm appointment(s)
        </button>
        <p className='pOrange'>
          <strong>{warningText}</strong>
        </p>
      </div><br/>
        <div className='centeredTextGreen'>
          <strong>{submittedText}</strong>
        </div>
      {showConflictButtons && (
        <ConflictButtons
          handleConflictOK={handleConflictOK}
          handleConflictCancel={handleConflictCancel}
        />
      )}
    </form>
  );
}

const ConflictButtons = (props) => (
  <div className='flexRow80' >
    <button className='buttonRounded60'
      onClick={props.handleConflictOK}
    >
      Conflict OK
    </button>
    &nbsp;&nbsp;
    <button className='buttonRounded40'
      onClick={props.handleConflictCancel}
    >
      Cancel
    </button>
    &nbsp;&nbsp;
  </div>
);

export default ScheduleClasses;

function meetingAppointmentsToDB(meetingData) {
  return axios.post("meeting", meetingData);
}

function meetingEntryToDB(meetingEntry) {
  return axios.post("meetingEntry", meetingEntry);
}

function mapKeysIntoDBArray(dbArray) {
  return dbArray.map((obj) => {
    obj.key = obj.id;
  });
}

function getMonthNumber(month) {
  let monthNumber = 0;
  switch (month) {
    case "January":
      monthNumber = 0;
      break;
    case "February":
      monthNumber = 1;
      break;
    case "March":
      monthNumber = 2;
      break;
    case "April":
      monthNumber = 3;
      break;
    case "May":
      monthNumber = 4;
      break;
    case "June":
      monthNumber = 5;
      break;
    case "July":
      monthNumber = 6;
      break;
    case "August":
      monthNumber = 7;
      break;
    case "September":
      monthNumber = 8;
      break;
    case "October":
      monthNumber = 9;
      break;
    case "November":
      monthNumber = 10;
      break;
    case "December":
      monthNumber = 11;
      break;
    default:
      monthNumber = 0;
  }
  return monthNumber;
}

