import { useRouter } from "next/router";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import ServerConfig from "@src/server.config";

export default function LoginForm({
  setIsTokenAvailable,
  setUserInfo,
}: {
  setIsTokenAvailable: Function;
  setUserInfo: Function;
}) {
  const getUserInfo = async () => {
    // Use this method instead of onChange on each input because
    // it works with browser autocomplete
    const username = (document.getElementById("username") as HTMLInputElement)
      .value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    if (!username) {
      alert(`Please enter a username`);
      return;
    }

    const userInfo = await axios
      .post(`${ServerConfig.getBackendBaseUrl()}/login`, {
        username: username,
        password: password,
      })
      .then((res) => {
        return res.data;
      })
      .catch((err) => {
        console.log(`Unable to get user info. Err: ${err?.message}`);
      });

    console.log(`Checking userinfo`);
    console.log(JSON.stringify(userInfo, null, 2));
    if (!userInfo?.token?.token) {
      return `Login failed: Cannot retrive token`;
    }

    // Save userInfo in localStorage
    localStorage.setItem(
      "userInfo",
      JSON.stringify({
        token: userInfo.token.token,
        username: userInfo.token.name,
        profileImageLink: userInfo.image,
      })
    );

    // Reveal the dashboard and set post-login info
    setUserInfo((prevState) => ({
      ...prevState,
      username: userInfo.token.name,
      profileImageLink: userInfo.image,
      token: userInfo.token.token,
    }));
    setIsTokenAvailable(true);
  };

  return (
    <>
      <div
        style={{
          minHeight: "95vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          overflowY: "scroll",
        }}
      >
        <div
          id="login-input"
          style={{
            position: "relative",
            margin: "20rem auto 20rem auto",
            width: "30%",
            height: "50%",
          }}
        >
          <Card className="rounded">
            <Card.Title className="pl-4 pt-3">Login</Card.Title>
            <Card.Body>
              <Form autoComplete="on">
                <Form.Group>
                  <Form.Control
                    type="email"
                    placeholder="id"
                    id="username"
                    name="username"
                    autoComplete="on"
                  />
                </Form.Group>
                <Form.Group>
                  <Form.Control
                    type="password"
                    placeholder="password"
                    id="password"
                    name="password"
                    autoComplete="on"
                  />
                </Form.Group>
              </Form>
              <Button
                variant="primary"
                className="rounded"
                style={{ width: "100%" }}
                onClick={() => {
                  getUserInfo();
                }}
              >
                Login
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
