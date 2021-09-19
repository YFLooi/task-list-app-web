import { useRouter } from "next/router";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  InputGroup,
  FormControl,
} from "react-bootstrap";
import { useState, useEffect } from "react";
import _ from "lodash";
import { PieChart } from "react-minimal-pie-chart";
import axios from "axios";
import ServerConfig from "@src/server.config";

export default function Dashboard({
  dashboardData,
  setShowTaskInput,
  setDashboardData,
}: {
  dashboardData: {
    latestTasks: { name: string; completed: boolean }[];
    tasksCompleted: number;
    totalTasks: number;
  };
  setShowTaskInput: Function;
  setDashboardData: Function;
}) {
  const [taskStatus, setTaskStatus] = useState([]);

  useEffect(() => {
    console.log(`first latestTasks`);
    console.log(dashboardData.latestTasks[0]);

    setTaskStatus(dashboardData.latestTasks);
  }, []);

  const toggleTask = async (event) => {
    const taskName = event.target.name;
    const taskCompleted = event.target.value;

    console.log(
      `Name of task to delete: "${taskName}" && it's current "completed" status: ${taskCompleted}`
    );

    const toggledTask = await axios
      .put(
        `${ServerConfig.getBackendBaseUrl()}/tasks/${encodeURI(taskName)}`,
        {
          newTaskName: "",
          completed: !taskCompleted,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        // Returns newly-added task
        console.log(res.data);

        // Updates all task displays
        setDashboardData((prevState) => ({
          ...prevState,
          totalTasks: prevState.totalTasks - 1,
          tasksCompleted: taskCompleted
            ? prevState.totalTasks + 1
            : prevState.totalTasks - 1,
          latestTasks: prevState.latestTasks.map(
            (task: { name: string; completed: boolean }) => {
              if ((task.name = taskName)) {
                return {
                  name: task.name,
                  completed: !task.completed,
                };
              } else {
                return task;
              }
            }
          ),
        }));

        // Hides back task adding panel
        return res.data;
      })
      .catch((err) => {
        console.log(`Failed to get dashboard data. Err: ${err?.message}`);
      });
  };
  const deleteTask = async (taskName: string) => {
    console.log(`Name of task to delete: ${taskName}`);

    const deletedTask = await axios({
      method: "delete",
      url: `${ServerConfig.getBackendBaseUrl()}/tasks/${encodeURI(taskName)}`,
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
          totalTasks: prevState.totalTasks - 1,
          latestTasks: prevState.latestTasks.filter(
            (task: { name: string; completed: boolean }) =>
              task.name != taskName
          ),
        }));

        // Hides back task adding panel
        return res.data;
      })
      .catch((err) => {
        console.log(`Failed to get dashboard data. Err: ${err?.message}`);
      });
  };

  return (
    <Container>
      <Row className="d-flex justify-content-around align-items-center">
        <Col md={4}>
          <Card
            className="round mx-2 my-2 px-3 py-3"
            style={{ height: "30vh" }}
          >
            <Card.Title>Tasks Completed</Card.Title>
            <Card.Body>
              {dashboardData.tasksCompleted}/{dashboardData.totalTasks}
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="round mx-2 my-2 px-3 py-3"
            style={{ height: "30vh" }}
          >
            <Card.Title>Latest Created Tasks</Card.Title>
            <Card.Body className="px-1 py-1" style={{ overflowY: "scroll" }}>
              <ul>
                {dashboardData.latestTasks.map((task, i) => {
                  if (task.completed) {
                    return (
                      <li key={`task-${i}`}>
                        <del>{task.name}</del>
                      </li>
                    );
                  } else {
                    return <li key={`task-${i}`}>{task.name}</li>;
                  }
                })}
              </ul>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card
            className="round mx-2 my-2 px-3 py-3"
            style={{ height: "30vh" }}
          >
            <Card.Body>
              <PieChart
                viewBoxSize={[100, 100]}
                center={[50, 50]}
                data={[
                  {
                    title: "Completed Tasks",
                    label: "Completed Tasks",
                    value: dashboardData.tasksCompleted,
                    color: "#E38627",
                  },
                  {
                    title: "Incomplete Tasks",
                    value:
                      dashboardData.totalTasks - dashboardData.tasksCompleted,
                    color: "#C13C37",
                  },
                ]}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Container fluid className="mt-5 px-0">
        <Row className="pb-3">
          <div className="col-md-6 py-2">
            <b>Tasks</b>
          </div>
          <div className="col-md-3 py-2">
            <Form className="" style={{ width: "100%" }}>
              <InputGroup>
                <InputGroup.Text>&#x1F50D;</InputGroup.Text>
                <FormControl
                  type="text"
                  placeholder="Search by task name"
                  name="taskName"
                  autoComplete="off"
                />
              </InputGroup>
            </Form>
          </div>
          <div className="col-md-3 py-2">
            <button
              className="round btn btn-primary"
              style={{ width: "100%" }}
              onClick={() => {
                setShowTaskInput(true);
              }}
            >
              + New Task
            </button>
          </div>
        </Row>
        <div>
          <Card className="round">
            <Card.Body>
              {dashboardData.latestTasks.map((task, i) => {
                // Starts from zero
                const numTasks = dashboardData.latestTasks?.length - 1;

                return (
                  <div className="" key={`task-${i}`}>
                    <Row className="px-4">
                      <div className="col-6 d-flex">
                        <input
                          type="checkbox"
                          className="mt-2"
                          id={`task-${i}`}
                          name={task.name}
                          value={
                            taskStatus.filter(
                              (item) => item.name == task.name
                            )[0]?.completed
                          }
                          checked={task.completed}
                          autoComplete="off"
                          onChange={toggleTask}
                        />
                        <label htmlFor={`task-${i}`}>
                          {task.completed && (
                            <del
                              className="pl-2"
                              style={{ overflowWrap: "break-word" }}
                            >
                              {task.name}
                            </del>
                          )}
                          {!task.completed && (
                            <div
                              className="pl-2"
                              style={{ overflowWrap: "break-word" }}
                            >
                              {task.name}
                            </div>
                          )}
                        </label>
                      </div>
                      <div className="col-6 d-flex justify-content-end">
                        <span className="pr-3">EDIT</span>
                        <span
                          onClick={() => {
                            deleteTask(task.name);
                          }}
                        >
                          DELETE
                        </span>
                      </div>
                    </Row>
                    {i != numTasks && <hr />}
                  </div>
                );
              })}
            </Card.Body>
          </Card>
        </div>
      </Container>
    </Container>
  );
}
