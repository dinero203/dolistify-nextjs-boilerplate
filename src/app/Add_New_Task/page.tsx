"use client"

import React, { useEffect, useState } from "react";
import fullTaskView from "../styles/fullTaskView.module.css";
import insertTask from "../component/backend_component/TaskBackend";
import { redirect, useRouter } from "next/navigation";
import HelperBar from "../component/reusable_component/helper_screen";

interface newTaskDataType {
  title: string;
  subtasks: Array<{ id: number; description: string }>;
  status: Array<{ id: number; completed: boolean | null; missed: boolean | null }>;
}

export default function AddNewTask() {
  const [submitCondition, setSubmitCondition] = useState("Done");
  const [save, setSave] = useState(false);
  const [activeSelection, setActiveSelection] = useState<"none" | "dashboardGroup" | "dashboardRoute">("none");
  const [dashboardBtn, setDashboardBtn] = useState<"Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task" | "">("");
  const [activeDashboardBtn, setActiveDashboardBtn] = useState<"personal" | "work" | "time_bound" | "repeated" | "">("");
  const [activeDashboardRoute, setActiveDashboardRoute] = useState<"upComing" | "high_priority" | "main" | "archived" | "time_deadline" | "date_deadline" | "">("");
  const [dashboard, setDashboard] = useState<"Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task" | "Task Group">("Task Group");
  const [dashboardRoute, setDashboardRoute] = useState<"high_priority Task" | "main Task" | "Deadline Task" | "archived Task" | "Task Category">("Task Category");
  const [userDeadline, setUserDeadline] = useState<string>("")
  const [errorSolutionMap, setErrorSolutionMap] = useState<{
    [key: number]: { error: string; solution: string };
  }>({});
  // const [addingRow, setAddingRow] = useState(false);
  const [taskDetails, setTaskDetails] = useState<newTaskDataType>({
    title: "",
    subtasks: [{ id: 1, description: "" }],
    status: [{ id: 1, completed: null, missed: null }],
  })
  const router = useRouter();
  const [theme, setTheme] = useState('light');

  const addErrorSolution = (error: string, solution: string) => {
    setErrorSolutionMap((prev) => {
      const index = Object.keys(prev).length; // Use next available index.
      const updatedMap = { ...prev, [index]: { error, solution } };

      // Automatically remove this error–solution after 3 minutes (180000 ms)
      setTimeout(() => {
        setErrorSolutionMap((current) => {
          const next = { ...current };
          delete next[index];
          return next;
        });
      }, 180000);

      return updatedMap;
    });
  }

  function handleSelection(selection: "dashboardGroup" | "dashboardRoute") {
    setActiveSelection((prevSelection) => (
      prevSelection === selection ? "none" : selection
    ));
  }

  function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const userInputTitle = event.target.value;
    setTaskDetails((prevTask) => ({
      ...prevTask,
      title: userInputTitle,
    }))
  }

  const isDeadlineValid = (deadline: string | number): boolean => {
    if (typeof deadline === "string") {
      // Check if it's non-empty and not "0000"
      return deadline.trim() !== "" && deadline !== "0000";
    }
    if (typeof deadline === "number") {
      // Check if it's not zero
      return deadline > 0;
    }
    return false; // Invalid type
  };

  function deleteRow(index: number) {
    if (taskDetails.subtasks.length > 1 && index >= 0 && index < taskDetails.subtasks.length) {
      const updatedRowIndex = [
        ...taskDetails.subtasks.slice(0, index),
        ...taskDetails.subtasks.slice(index + 1),
      ];
      const updatedStatusIndex = [
        ...taskDetails.status.slice(0, index),
        ...taskDetails.status.slice(index + 1),
      ];

      setTaskDetails((prevDetails) => ({
        ...prevDetails,
        subtasks: updatedRowIndex,
        status: updatedStatusIndex, // Fixed typo
      }));
    }
  }

  const addExtraInputColumn = (e: React.KeyboardEvent, index: number) => {
    if (index < 0 || index >= taskDetails.subtasks.length) {
      return 
    }
    if (e.key === "Enter") {
      if (taskDetails.subtasks[index].description.trim() === "") return;

      const newTask = { id: taskDetails.subtasks.length + 1, description: "" };
      const newStatus = { id: taskDetails.status.length + 1, completed: null, missed: null };
      setTaskDetails((prevDetails) => ({
        ...prevDetails, // Keep other properties unchanged
        subtasks: [...prevDetails.subtasks, newTask,],
        status: [...prevDetails.status, newStatus,],
      }));
    };
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const updatedSubtasks = taskDetails.subtasks.map((row, idx) =>
      idx === index ? { ...row, description: e.target.value } : row
    );

    setTaskDetails((prevDetails) => ({
      ...prevDetails, // Keep other properties unchanged
      subtasks: updatedSubtasks, // Update the subtasks array
    }));
  };

  function dashboardRouteOptions(category: "Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task" | "") {
    switch (category) {
      case "Personal Task":
        return {
          routeOptions: ["high_priority Task", "main Task", "archived Task"],
          activeDashboard: "personal",
          activeRouteOptions: ["high_priority", "main", "archived"],
        }
      case "Work Task":
        return {
          routeOptions: ["high_priority Task", "main Task", "archived Task"],
          activeDashboard: "work",
          activeRouteOptions: ["high_priority", "main", "archived"],
        }
      case "Time-bound Task":
        return {
          routeOptions: ["archived Task", "Time Deadline Task", "Date Deadline Task", " repeated Task"],
          activeDashboard: "time_bound",
          activeRouteOptions: ["archived", "time_deadline", "date_deadline", " repeated"],
        }
      case "Repeated Task":
        return {
          routeOptions: ["Personal Task", "Work Task", "main Task", "archived Task", "Time Deadline Task", "Date Deadline Task"],
          activeDashboard: "repeated",
          activeRouteOptions: ["personal", "work", "main", "archived", "time_deadline", "date_deadline"],
        }
      case "":
        return {
          routeOptions: [],
          activeDashboard: "",
          activeRouteOptions: [],
        }
    }
  }

  function handleDeadlineInput(event: React.ChangeEvent<HTMLInputElement>) {
    const userDeadline: string | number = event.target.value;
    setUserDeadline(userDeadline);
  }

  const handleOptionClick = (option: "Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task") => {
    const dashboard = dashboardRouteOptions(option).activeDashboard;

    if (dashboard !== "Time-bound Task") {
      setUserDeadline("");
    }

    setDashboardBtn(option);
    setDashboard(option);
    setDashboardRoute("Task Category")
    setActiveDashboardBtn(dashboard as "personal" | "work" | "time_bound" | "repeated");
    setActiveDashboardRoute("");
    setActiveSelection("none");
    setUserDeadline("")
  };

  function handleCloseSavedTask() {
    redirect("/Dashboard")
  }

  async function insertIntoDB() {
    if (activeDashboardBtn === "") {
      addErrorSolution(
        "You have not selected a Task Group.",
        "Please select a Task Group from the available options."
      );
      return
    }
    if (activeDashboardRoute === "") {
      addErrorSolution(
        "You have not selected a task category.",
        "Please select a task category from the available options."
      );
      return
    }

    if (taskDetails.title.trim() === "") {
      addErrorSolution(
        "Task title cannot be empty.",
        "Enter a valid title for your task."
      );
      return
    }

    if ((activeDashboardRoute === "date_deadline" || activeDashboardRoute === "time_deadline") &&
      userDeadline.trim() == "") {
      addErrorSolution(
        "Deadline is invalid.",
        "Enter a valid deadline (date or time) according to the task type."
      );
      return
    }

    taskDetails.subtasks.forEach((subtask, idx) => {
      if (subtask.description.trim() === "") {
        addErrorSolution(
          `Subtask ${idx + 1} is empty.`,
          "Fill in the description for each subtask."
        );
      }
      return
    });

    // storing if no error occurs
    const sentDashboardBtn = activeDashboardBtn;
    const sentDashboardRoute = activeDashboardRoute;

    try {
      if (isDeadlineValid(userDeadline)) {
        const success = await insertTask(sentDashboardBtn, sentDashboardRoute, taskDetails, userDeadline);
        setSubmitCondition(success ? "Successful" : "Failed");
        setSave(false);
        if (success) {
          router.push("/Dashboard");
        }
      } else {
        // Iterate through each row to insert each task individually
        const success = await insertTask(sentDashboardBtn, sentDashboardRoute, taskDetails);
        setSubmitCondition(success ? "Successful" : "Failed");
        setSave(false);
        if (success) {
          router.push("/Dashboard");
        }
      }
    } catch  {
      return
    }
  }
  const dashboardOptionsQuery = dashboardRouteOptions(dashboardBtn as "Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task");

  useEffect(() => {
    // Split the cookie string by semicolon (in case there are more cookies in the future)
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);


  return (
    <div className={`${fullTaskView.container} ${theme === 'light' ? fullTaskView.dashboard_body_whiteTheme : fullTaskView.dashboard_body_blackTheme}`}>
      <div className={fullTaskView.helper_guide}>
        {Object.keys(errorSolutionMap).map((key) => (
          <div key={key}>
            <div className={fullTaskView.helper_guide_error}>
              <HelperBar
                directlySentMessage={errorSolutionMap[Number(key)].error}
                directSentMessageCategory={'warning'}
              />
            </div>
            <div className={fullTaskView.helper_guide_solution}>
              <HelperBar
                directlySentMessage={errorSolutionMap[Number(key)].solution}
                directSentMessageCategory={'message'}
              />
            </div>
          </div>
        ))}
      </div>
      <div className={fullTaskView.container_items}>
        <div className={fullTaskView.clip_container}>
          <div className={fullTaskView.clip_container_items}>
            <div className={fullTaskView.clip_top_section}>
              <div className={fullTaskView.clip_top_section_circle}></div>
            </div>
            <div className={fullTaskView.clip_middle_section}>
            </div>
            <div className={fullTaskView.clip_base}></div>
          </div>
        </div>
        <div className={fullTaskView.taskView_items}>
          <div className={fullTaskView.taskHeader}>
            <div className={fullTaskView.taskSelector}>
              <div className={fullTaskView.dashboard}>
                <button
                  className={fullTaskView.dashboard_group_item}
                  onClick={() => handleSelection("dashboardGroup")}
                >
                  <div className={fullTaskView.dashboard_selector}>{dashboard}</div>
                  <div className={fullTaskView.selector_icon}>
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g id="svgBackground" strokeWidth="0"></g>
                      <g id="svgTracer" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="iconCarrier">
                        <path
                          d="M8.00003 8.1716L3.41424 3.58582L0.585815 6.41424L8.00003 13.8285L15.4142 6.41424L12.5858 3.58582L8.00003 8.1716Z"
                          fill="#000000"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
                {activeSelection === "dashboardGroup" && (
                  <div className={fullTaskView.group_selector_container}>
                    {["Personal Task", "Work Task", "Time-bound Task", "Repeated Task"].map((option) => (
                      <button
                        key={option}
                        className={fullTaskView.dashboard_options}
                        onClick={() => handleOptionClick(
                          option as "Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task"
                        )}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {/* <input type="time" name="" /> */}
              {/* <button className={fullTaskView.taskOptions_items}>Timer % Date</button> */}
              <div className={fullTaskView.dashboard_route}>
                <button
                  className={fullTaskView.dashboard_route_items}
                  onClick={() => handleSelection("dashboardRoute")}
                >
                  <div className={fullTaskView.dashboard_selector}>{dashboardRoute}</div>
                  <div className={fullTaskView.selector_icon}>
                    <svg
                      height="20"
                      width="20"
                      viewBox="0 0 16 16"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <g id="svgBackground" strokeWidth="0"></g>
                      <g id="svgTracer" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="iconCarrier">
                        <path
                          d="M8.00003 8.1716L3.41424 3.58582L0.585815 6.41424L8.00003 13.8285L15.4142 6.41424L12.5858 3.58582L8.00003 8.1716Z"
                          fill="#000000"
                        />
                      </g>
                    </svg>
                  </div>
                </button>
                {activeSelection === "dashboardRoute" && (
                  <div className={fullTaskView.route_selector_container}>
                    {dashboardOptionsQuery.routeOptions.map((route, index) => (
                      <button
                        key={route}
                        className={fullTaskView.dashboard_options}
                        onClick={() => {
                          setUserDeadline("")
                          const options = dashboardRouteOptions(dashboardBtn as "Personal Task" | "Work Task" | "Time-bound Task" | "Repeated Task"); // Ensure to fetch updated options
                          const routeOption = options.activeRouteOptions[index]; // Index matches the button
                          const dashboardRouteOption = options.routeOptions[index]
                          setActiveDashboardRoute(routeOption as "high_priority" | "main" | "archived" | "upComing");
                          setDashboardRoute(dashboardRouteOption as "high_priority Task" | "main Task" | "Deadline Task" | "archived Task");
                          setActiveSelection("none");
                        }}
                      >
                        {route}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {activeDashboardRoute === "date_deadline" && (
                <input
                  type="date"
                  required
                  className={fullTaskView.date_deadline}
                  placeholder="Time Timeline"
                  value={userDeadline}
                  onChange={(e) => handleDeadlineInput(e)}
                />
              )}
              {activeDashboardRoute === "time_deadline" && (
                <input
                  onChange={(e) => handleDeadlineInput(e)}
                  className={fullTaskView.time_deadline}
                  type="time"
                  placeholder="Date Timeline"
                  value={userDeadline}
                />
              )}
              <input
                onChange={handleTitleChange}
                type="text"
                placeholder="Enter a title for your task"
                value={taskDetails.title}
                className={fullTaskView.task_title_input}
              />
              <button
                className={fullTaskView.taskOptions_items}
                onClick={() => handleCloseSavedTask()}
              >
                close
              </button>
            </div>
          </div>
          <div className={fullTaskView.grid_section}>
            <div className={fullTaskView.paper_folded_edge}>
              <div className={fullTaskView.paper_first_folded}></div>
              <div className={fullTaskView.paper_second_folded}></div>
            </div>
            <table className={fullTaskView.task_table}>
              <tbody className={fullTaskView.table_body}>
                {taskDetails.subtasks.map((row, index) => (
                  <tr key={row.id} className={fullTaskView.content}>
                    <th className={fullTaskView.mark}>
                      <div className={fullTaskView.taskCount}> {index + 1} </div>
                    </th>
                    <td
                      className={fullTaskView.user_text}
                    >
                      <input
                        required
                        type="text"
                        value={row.description}
                        onChange={(e) => handleInputChange(e, index)}
                        onKeyPress={(e) => addExtraInputColumn(e, index)}
                        className={fullTaskView.user_input}
                      />
                    </td>
                    <td
                      className={fullTaskView.user_delete}
                      onClick={() => { deleteRow(index) }}
                    >
                      <button
                        title="remove task"
                      >
                        <svg
                          viewBox="0 0 512 512"
                          version="1.1"
                          width="20"
                          height="20"
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          fill="#ff0303"
                        >
                          <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                          <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                          <g id="SVGRepo_iconCarrier">
                            <title>error-filled</title>
                            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                              <g id="add" fill="#ff0303" transform="translate(42.666667, 42.666667)">
                                <path
                                  d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M262.250667,134.250667 L213.333333,183.168 L164.416,134.250667 L134.250667,164.416 L183.168,213.333333 L134.250667,262.250667 L164.416,292.416 L213.333333,243.498667 L262.250667,292.416 L292.416,262.250667 L243.498667,213.333333 L292.416,164.416 L262.250667,134.250667 Z"
                                  id="Combined-Shape"
                                ></path>
                              </g>
                            </g>
                          </g>
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button
            className={fullTaskView.send}
            onClick={() => insertIntoDB()}// Button disabled while pending or saving
            type="submit"
          >
            {save ? "Submitting..." : submitCondition}
          </button>
        </div>
      </div>
    </div>
  );
}