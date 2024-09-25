import React, { useState, useEffect, useRef, useReducer } from "react";
import axios from "axios";
import WelcomePagePic from "../img/meeting.jpg";
import "./styles/userPage.scss";
import { useAtom } from "jotai";
import { mtgTypesAtom } from "../app.js";
import { userAtom } from "../app.js";
import { userPhotoAtom } from "../app.js";

function UploadUserInfo(props) {
  const [selectedPhotoFile, setSelectedPhotoFile] = useState({});
  const [selfIntroUpdated, setSelfIntroUpdated] = useState(false);
  const [updatedIndicator, setUpdatedIndicator] = useState("");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [introText, setIntroText] = useState("");
  const [changedPhoto, setChangedPhoto] = useState(false);
  const [changedMtgTypes, setChangedMtgTypes] = useState(false);
  const [beginningSelfIntroText, setBeginningSelfIntroText] = useState("");
  const [mtgTypes, setMtgTypes] = useAtom(mtgTypesAtom);
  const [user, setUser] = useAtom(userAtom);
  const [userPhoto, setUserPhoto] = useAtom(userPhotoAtom);
  
  const tick = () => {
    setEndTime(new Date());
  };

  const getSelfIntro = (user) => {
    return axios.get(`selfIntros/${user}`);
  };

  const fetchSelfIntroText = () => {
    getSelfIntro(user.username)
      .then((data) => {
				setBeginningSelfIntroText(data.data);
      })
      .catch((error) => console.log("Error in fetchSelfIntroText: ", error));
  };
 
  const getMtgTypes = (user) => {
    return axios.get(`mtg_types/${user}`);
  };

  const fetchMtgTypes = () => {
    getMtgTypes(user.username)
      .then((data) => {
				setMtgTypes(data.data);
      })
      .catch((error) => console.log("Error in getMtgTypes: ", error));
  };

  const getUserPhoto = (user) => {
    console.log("user in getUserPhoto: ", user, "   typeof(user): ", typeof(user));
    return axios.get(`get_user_photo/${user}`, {responseType: 'blob'});
  };

  const fetchUserPhoto = () => {
    getUserPhoto(user.username)
      .then((response) => {
          console.log("response.data): ", response.data);
          const imageBlob = response.data;
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setUserPhoto(imageObjectURL)})
      .catch((error) => console.log("Error in fetchUserPhoto: ", error))
  };

  useEffect(() => {
    fetchUserPhoto();
    fetchSelfIntroText();
    fetchMtgTypes();
  }, [beginningSelfIntroText, mtgTypes]); 

  const inputRef = useRef(null);

  const handleIntroTextChange = (event) => {
    setIntroText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const dataString = { user: user.username, selfIntro: introText };
    console.log("introText at handleSubmit: ", dataString.selfIntro, "   user: ", dataString.user)
    return axios
      .post("/postSelfInfoText", dataString)
      .then((result) => {setSelfIntroUpdated(true)})
      .catch((errors) => console.log("Errors in handleSubmit: ", errors));
  };
  
  const handleMtgTypesChange = (event) => {
    setUser({...user, mtg_types: event.target.value});
  };

  const handleMtgTypesClick = (event) => {
    event.preventDefault();
    const dataString = { user: user.username, mtg_types: user.mtg_types };

    axios
      .put("/update_mtg_types", dataString)
      .then((result) => {
				setChangedMtgTypes(true);
      })
      .catch((errors) =>
        console.log("Errors in handleMtgTypesClick: ", errors)
      );
  };

  const importAll = (r) => {
    return r.keys().map(r);
  };

  const Fragment = React.Fragment;

  const handleChoosePhotoClick = (e) => {
	inputRef.current.click();
  };

  // The changed photo will update the next time the webpack bundle is created. 
  // That will normally be the next time the user logs into the site.
  const handleImgFileChange = event => {
    let selectedPhoto = event.target.files && event.target.files[0];
    console.log("selectedPhoto in UploadUserInfo: ", selectedPhoto)
	if (selectedPhoto) {
    setChangedPhoto(true);
  }
  else {
	  return;
	}
	event.target.value = null;
	let userImgName = user.username + ".jpg";
    let formData = new FormData();
    // selectedPhoto['name'] = user.username + ".jpg"; <- can't change the filename here like this; 
    // it's read only. The filename for the new photo must be changed on the back end.
    formData.set("user", user.username);
    formData.set("name", userImgName);
    formData.set("selectedPhotoFile", selectedPhoto);
    axios
      .post("/uploadPhoto", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .catch((errors) => {
         console.log("Errors in handleImgFileChange: ", errors)
      });
  }

	return (
	<>
    <div>
      <h2 className='h2mt0'>Personal Photo and Self-Introduction</h2>
      <div className='vSpace5px' />
      <img key={Date.now()} src= {userPhoto} className='photoImg'/>
	  <div>
        <input 
          type="file"
          label="Select Photo File" 
	      id="file-upload"
	  	  ref={inputRef}
          onChange={handleImgFileChange}
		  style={{display: 'none'}}
        />
      </div>
	  <div className='flexRow'>
        <button onClick={handleChoosePhotoClick} className='buttonRounded200' >
        Choose personal Photo </button>&nbsp;&nbsp; {changedPhoto ? (<h4> Your new photo will be visible the next time you visit the site.</h4>) : null }
	  </div>
          <div className='vSpace5px' />
        &nbsp;&nbsp;
    </div>
	<div>
      <form onSubmit={handleSubmit} name="selfIntroForm" encType="multipart/form-data" >
        <div className='inputColumn'>
          <textarea 
            name="selfIntro"
		        className="mtgTypesTextArea"
		        rows="6"
		        columns="30"
            form="selfIntroForm"
            defaultValue={beginningSelfIntroText}
            onChange={handleIntroTextChange}
        />
        <div className='vSpace5px' />
		<div className='flexRow'>
           <button className='buttonRounded200' type="submit">
           Enter Self-Intro
              </button>&nbsp;&nbsp; {selfIntroUpdated ? (<h4> Self-intro text has been updated.</h4>) : null }
          </div>
        </div>
      </form>
	</div>
	<div>
      <div className='vSpace10px'/>
      <div className='vSpace10px'/>

      <form onSubmit={handleMtgTypesClick} name="mtgTypesForm">
        <div className='inputColumn'>
            <h3>
              Typical meetings:
            </h3>
            <textarea 
		          className='mtgTypesTextArea'
              name="mtgTypesArea"
	            rows="6"
	            columns="30"
              form="mtgTypesForm"
              defaultValue={mtgTypes}
              onChange={handleMtgTypesChange}
            />
          <div className='vSpace5px' />
            <button className='buttonRounded200' type="submit" >
              Enter Meeting Types 
            </button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
		        {changedMtgTypes ? (
				  		<h3>Meeting types updated.</h3>
				  	) : null}
        </div>
        <div className='vSpace5px' />
        <div className='vSpace5px' />
        <div className='vSpace5px' />
      </form>
    </div>
	</>
  );
}

export default UploadUserInfo;
