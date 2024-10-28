import React, { useEffect, useState } from "react";
import { IconButton } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import excel from "../Component/assets/excels.png";
import pdf from "../Component/assets/PDF_file_icon.svg.png"
import DeleteIcon from "@mui/icons-material/Delete";
import { useContext } from "react";
import AuthContext from "../Component/context/AuthProvider";
import PopupModel from "./Model/PopupModel";
import api from "../Component/context/api";
import word from "../Component/assets/word.png"

function FileRepo(props) {

  const getName = (name) => {
    let text = name;
    const myarrayName = text.split(".");
    return myarrayName[0];
  };
  const getExtension = (name) => {
    let text = name;
    const myarrayName = text.split(".");
    return myarrayName[1];
  }
  const getData = ()=>{
    props.getData()
  }
  return (
    <div
      className="border border border-1 rounded  m-3 row bg-light"
      style={{
        height: "100px",
        position: "relative",
      }}
     
    >
      <div className="col-4 p-0">
        {getExtension(props.filename) === 'xlsx' && <img
          src={excel}
          className=" rounded-start img-fluid mt-2"
          alt="..."
          
        />}
        {
          getExtension(props.filename) === 'pdf' && <img
          src={pdf}
          class=" rounded-start mt-2"
          alt="..."
          style={{ width: "65px", marginLeft:'32px' }}
        />
        }
        {
          getExtension(props.filename) === 'docx' && <img
          src={word}
          class=" rounded-start p-2"
          alt="..."
          style={{ width: "127px" }}
        />
        }
        
      </div>
      <div className="col-7 ">
        <b className="fs-6">{getName(props.filename)}</b>
      </div>
      <div className="col-1">
      <IconButton
        sx={{ "&:hover": { color: "green" } }}
        style={{
          bottom: "0px",
          position: "absolute",
          right: "15px",
          width: "24px",
        }}
        onClick={ () => {
           api.get(`/api/files/${props.id}/download/`,{
            responseType:"blob"
          })
            .then((blob) => {
              const response = blob.data
              const url = window.URL.createObjectURL(response);
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", `${props.filename}`);
              document.body.appendChild(link);
              link.click();
              link.parentNode.removeChild(link);
            });
          // window.open()
        }}
      >
        <DownloadIcon color="primary" />
      </IconButton>
      </div>
      
      <div style={{
          top: "0px",
          position: "absolute",
          right: "46px",
          width: "24px",
        }}>
        <PopupModel getData={getData} id={props.id} title="Are you sure to delete this Document?"/>
      </div>
    </div>
  );
}
export default FileRepo;
