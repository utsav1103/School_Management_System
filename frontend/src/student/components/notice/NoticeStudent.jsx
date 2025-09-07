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

export default function NoticeStudent() {
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
  const studentNotices = notices.filter(
    (notice) => notice.audience === "student" || notice.audience === "all"
  );

 return (
    <div className="notice-container">
      <h2 className="notice-title">📢 Student Notices</h2>

      <TableContainer component={Paper} className="notice-table">
        <Table sx={{ minWidth: 650 }} aria-label="student notices">
          <TableBody>
            {studentNotices.length > 0 ? (
              studentNotices.map((notice) => (
                <TableRow key={notice._id} className="notice-row">
                  <TableCell className="notice-cell notice-title-cell">
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

      <style>
        {`
        .notice-container {
          background: url('/images/dark-wood.jpg');
          background-size: cover;
          min-height: 100vh;
          padding: 2rem;
          color: white;
        }

        .notice-title {
          text-align: center;
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 1.5rem;
          color: transparent;
          background: linear-gradient(90deg, #ff9800, #ff5722);
          -webkit-background-clip: text;
          background-clip: text;
          text-shadow: 0 0 8px rgba(255,152,0,0.6);
        }

        .notice-table {
          background: rgba(20, 20, 20, 0.7) !important;
          backdrop-filter: blur(8px);
          border-radius: 14px;
          overflow: hidden;
          box-shadow: 0 0 25px rgba(0,0,0,0.7);
        }

        .notice-row {
          transition: all 0.3s ease;
        }

        .notice-row:hover {
          background: rgba(255, 152, 0, 0.08) !important;
          transform: scale(1.01);
          box-shadow: 0 0 12px rgba(255, 152, 0, 0.3);
        }

        .notice-cell {
          color: #eee !important;
          font-size: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .notice-title-cell b {
          color: transparent;
          background: linear-gradient(90deg, #ff9800, #ff5722);
          -webkit-background-clip: text;
          background-clip: text;
          font-weight: bold;
        }
      `}
      </style>
    </div>
  );
}
