import { useRouter } from "next/router";
import { Container, Row, Col, Card, Form } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import ServerConfig from "@src/server.config";
import moment from "moment";
import AppLayout from "@src/components/app-layout/app-layout";
import LoginForm from "@src/components/landing/login-form";
import TaskInput from "@src/components/landing/task-input";
import Dashboard from "@src/components/landing/dashboard";

export default function Landing({
  isTabletOrMobileDevice,
  windowWidth,
  windowHeight,
}: {
  isTabletOrMobileDevice: boolean;
  windowWidth: number;
  windowHeight: number;
}) {
  const router = useRouter();
  const [isTokenAvailable, setIsTokenAvailable] = useState(false);
  const [userInfo, setUserInfo] = useState({
    username: "",
    profileImageLink: "",
    token: "",
  });
  const [showTaskInput, setShowTaskInput] = useState(false);
  const [showDashboard, setShowDashboard] = useState(true);
  const [dashboardData, setDashboardData] = useState({
    latestTasks: [],
    tasksCompleted: 0,
    totalTasks: 0,
  });

  useEffect(() => {
    // Chk if token stored on page load
    const userInfo: {
      token: string;
      username: string;
      profileImageLink: string;
    } = JSON.parse(localStorage.getItem("userInfo"));

    const getDashboardData = async () => {
      console.log(`Getting dashboard data for token ${userInfo?.token}`);

      const newDashboardData = await axios({
        method: "get",
        url: `${ServerConfig.getBackendBaseUrl()}/dashboard`,
        headers: {
          "Content-Type": "application/json",
        },
        data: {},
      })
        .then((res) => {
          // Returns for any user. If required, need to filter by token/userId
          console.log(res.data);

          // Force user to input dashboard data if no latestTasks available
          if (!res.data.latestTasks?.length) {
            setShowDashboard(false);
            setShowTaskInput(true);
          }

          return res.data;
        })
        .catch((err) => {
          console.log(`Failed to get dashboard data. Err: ${err?.message}`);
        });

      setDashboardData((prevState) => ({
        ...prevState,
        latestTasks: [...newDashboardData?.latestTasks],
        tasksCompleted: newDashboardData?.tasksCompleted,
        totalTasks: newDashboardData?.totalTasks,
      }));
    };

    if (userInfo?.token) {
      setIsTokenAvailable(true);
      getDashboardData();
    }
  }, []);

  return (
    <>
      {!isTokenAvailable && (
        <LoginForm
          setIsTokenAvailable={setIsTokenAvailable}
          setUserInfo={setUserInfo}
        />
      )}
      {isTokenAvailable && (
        <>
          <AppLayout
            username={userInfo.username}
            profileImageLink={userInfo.profileImageLink}
            setIsTokenAvailable={setIsTokenAvailable}
          >
            <div
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.05)",
                minHeight: "100vh",
              }}
            >
              {showTaskInput && (
                <TaskInput
                  userInfo={userInfo}
                  setUserInfo={setUserInfo}
                  setIsTokenAvailable={setIsTokenAvailable}
                  setShowTaskInput={setShowTaskInput}
                  setDashboardData={setDashboardData}
                />
              )}
              {showDashboard && (
                <Dashboard
                  dashboardData={dashboardData}
                  setShowTaskInput={setShowTaskInput}
                  setDashboardData={setDashboardData}
                />
              )}
            </div>
          </AppLayout>
        </>
      )}
    </>
  );
}
