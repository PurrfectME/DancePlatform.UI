import React from "react";
import '../../styles/workshopForm.css'
 
export default function Popup(props) {
  return (
    <div className="popup-box">
      <div className="box">
        {props.content}
      </div>
    </div>
  );
};