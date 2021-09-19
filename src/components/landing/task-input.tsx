import { useRouter } from "next/router";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import Link from "next/link";
import { useState, useEffect } from "react";
import _ from "lodash";
import axios from "axios";
import ServerConfig from "@src/server.config";

export default function Dashboard({
  setIsTokenAvailable,
  userInfo,
  setUserInfo,
  setShowTaskInput,
  setDashboardData,
}: {
  setIsTokenAvailable: Function;
  userInfo: {
    username: String;
    profileImageLink: String;
    token: String;
  };
  setUserInfo: Function;
  setShowTaskInput: Function;
  setDashboardData: Function;
}) {
  const [taskName, setTaskName] = useState("");

  const handleTaskNameChange = (event) => {
    setTaskName(event.target.value);
  };
  const saveNewTask = async () => {
    console.log(`New task name: ${taskName}`);

    const newTask = await axios({
      method: "post",
      url: `${ServerConfig.getBackendBaseUrl()}/tasks`,
      headers: {
        "Content-Type": "application/json",
      },
      data: { taskName: taskName },
    })
      .then((res) => {
        // Returns newly-added task
        console.log(res.data);

        // Updates all task displays
        setDashboardData((prevState) => ({
          ...prevState,
          totalTasks: prevState.totalTasks + 1,
          latestTasks: [...prevState.latestTasks, res.data],
        }));

        // Hides back task adding panel
        setShowTaskInput(false);
        return res.data;
      })
      .catch((err) => {
        console.log(`Failed to get dashboard data. Err: ${err?.message}`);
      });
  };

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          overflowY: "scroll",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <div
          className="bg-white"
          style={{
            position: "relative",
            margin: "10rem auto 20rem auto",
            width: "30%",
            height: "50%",
          }}
        >
          <Card className="rounded">
            <Card.Title className="pl-4 pt-3">+ New task</Card.Title>
            <Card.Body>
              <Form autoComplete="off">
                <Form.Group>
                  <Form.Control
                    type="text"
                    placeholder="Task Name"
                    id="taskName"
                    name="taskName"
                    className="rounded"
                    autoComplete="off"
                    onChange={handleTaskNameChange}
                  />
                </Form.Group>
              </Form>
              <Button
                variant="primary"
                className="rounded"
                style={{ width: "100%" }}
                onClick={() => {
                  saveNewTask();
                }}
              >
                + New Task
              </Button>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  );
}
