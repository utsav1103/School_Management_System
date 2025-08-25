import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseApi } from "../../../environment";
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
      .get(`${baseApi}/notice/all`)
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
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Title</b></TableCell>
            <TableCell><b>Message</b></TableCell>
            <TableCell><b>Audience</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {teacherNotices.length > 0 ? (
            teacherNotices.map((notice) => (
              <TableRow key={notice._id}>
                <TableCell>{notice.title}</TableCell>
                <TableCell>{notice.message}</TableCell>
                <TableCell>{notice.audience}</TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={3} align="center">
                No notices available
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
