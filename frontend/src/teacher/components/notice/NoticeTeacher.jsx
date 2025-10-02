import React, { useEffect, useState } from "react";
import axios from "axios";
//import { baseApi } from "../../../environment";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

export default function NoticeTeacher() {
  const [notices, setNotices] = useState([]);

  // Fetch all notices
  const FetchAllNotices = () => {
    axios
      .get(`/api/notice/all`)
      .then((resp) => {
        setNotices(resp.data.data);
      })
      .catch((e) => {
        console.log("Error in fetching notices", e);
      });
  };

  useEffect(() => {
    FetchAllNotices();
  }, []);

  // Filter only teacher notices
  const teacherNotices = notices.filter(
    (notice) => notice.audience === "teacher" || notice.audience === "all"
  );

  return (
    <div className="notice-container">
      <h2 className="notice-title">📢 Teacher Notices</h2>

       <TableContainer component={Paper} className="notice-table">
      <Table sx={{ minWidth: 650 }} aria-label="teacher notices">
        <TableBody>
          {teacherNotices.length > 0 ? (
            teacherNotices.map((notice) => (
              <TableRow key={notice._id} className="notice-row">
                <TableCell className="notice-cell title-cell">
                  <b>{notice.title}</b>
                </TableCell>
                <TableCell className="notice-cell" align="right">
                  {notice.message}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={2} align="center" className="notice-cell">
                No notices available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>

      {/* Custom Styling */}
     <style>
      
  {`
  .notice-container {
    //background: url('/images/dark-wood.jpg');
    background-size: cover;
    min-height: 100vh;
    padding: 2rem;
    color: white;

    /* Centering children */
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start; /* keeps title at top */
  }

  .notice-title {
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    margin-bottom: 1.5rem;
    background: linear-gradient(90deg, #ff9800, #ff5722);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 10px rgba(0,0,0,0.6);
  }

  .notice-table {
    background: rgba(30, 30, 30, 0.7) !important;
    backdrop-filter: blur(10px);
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 4px 20px rgba(0,0,0,0.7);

    /* Center and size */
    max-width: 800px;
    width: 100%;
  }

  .notice-row {
    transition: all 0.3s ease;
  }

  .notice-row:hover {
    background: rgba(255, 152, 0, 0.1) !important;
    transform: scale(1.01);
  }

  .notice-cell {
    color: #eee !important;
    font-size: 1rem;
  }

  .title-cell b {
    background: linear-gradient(90deg, #ff9800, #ff5722);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: bold;
    text-shadow: 0 0 6px rgba(255, 87, 34, 0.5);
  }

  .notice-cell * {
    color: inherit !important;
  }
  `}
</style>

    </div>
  );
}
