import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/home.scss";

const Home = () => {
  const navigate = useNavigate();
		return (
    	<div className='home'>
	      <div className='titlesDiv'>
		       <h3 className='h3'>Meeting Scheduler</h3>
	         <div className='text' style={{margin: 0}}>Keep track of multiple meetings or classes</div>
	      </div>
    	  <SchedulerIntro />
    	</div>
    );
}

export default Home;

const SchedulerIntro = () => (
	<div className='schedulerIntro'>
	  <div className='meetingImg'/>
	  <MeetingText/> 
	</div>
)	

const MeetingText = () => (
	<div className='homecolumn'>
	  <div className='text'>
	  * <strong>Meetings</strong> can be scheduled. <br/>* Meeting participants can <strong>view schedules</strong> of meetings they are scheduled to attend.
	  </div>
	  <br/><br/>
	  <div className='smalltext'>
	    Try it by logging in as "Bill" with password "bb".	
	  </div>
	</div>
)



	
