import { useRouter } from "next/router";
import { Container, Row, Col } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import useStateMachine from "@cassiozen/usestatemachine";
import axios from "axios";

export default function AppLayout({
  children,
  profileImageLink = "",
  username = "user@gmail.com",
  setIsTokenAvailable,
}: {
  children?: React.ReactNode;
  profileImageLink?: string;
  username?: string;
  setIsTokenAvailable: Function;
}) {
  // Chk if token stored on page load
  const userInfo: {
    token: string;
    username: string;
    profileImageLink: string;
  } = JSON.parse(localStorage.getItem("userInfo"));

  const logout = () => {
    console.log(`Clearing userInfo and reloading page`);
    localStorage.clear();

    // Close dashboard
    setIsTokenAvailable(false);
  };

  return (
    <div>
      <Row className="mx-0 px-3 py-3 border border-light rounded-bottom">
        <div className="col-6 d-flex flex-row align-items-center">
          <div
            className="rounded-circle"
            style={{
              backgroundImage: `url(${
                userInfo.profileImageLink ?? profileImageLink
              })`,
              backgroundColor: "red",
              width: "5rem",
              height: "5rem",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="ml-3">
            {userInfo.username.split("@")[0] ?? username.split("@")[0]}
          </div>
        </div>
        <div className="col-6 d-flex flex-row align-items-center justify-content-end">
          <div
            style={{ cursor: "pointer" }}
            onClick={() => {
              logout();
            }}
          >
            Logout
          </div>
        </div>
      </Row>
      {children}
    </div>
  );
}
