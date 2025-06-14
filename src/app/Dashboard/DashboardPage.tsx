"use client";
import React, { useState, useEffect, useCallback, JSX } from 'react';
import Image from 'next/image';
import Logo from "../../../public/logo/logo.png";
import { useRouter } from 'next/navigation';

export interface DashboardPageProps {
  profileDetails: React.ReactElement;
  userTask: React.ReactElement;
  userDeletedFiles: React.ReactElement;
  weeklyData: React.ReactElement;
  helperViewTab: JSX.Element;
  userFullTaskDetailsPreview: React.ReactElement;
  userTaskQueryPath: (dashboardBtn: string, dashboardRoute: string) => void;
  showSearchFullResult: (taskId: string, dashboardBtn: string) => void;
}

export default function DashboardPage({
  profileDetails,
  userTask,
  userDeletedFiles,
  weeklyData,
  helperViewTab,
  userFullTaskDetailsPreview,
  userTaskQueryPath,
  showSearchFullResult,
}: DashboardPageProps) {
  const [theme, setTheme] = useState('light');
  // const [coordinates, setCoordinates] = useState<{ latitude: number; longitude: number, timeZone: string } | null>(null);
  // const [weatherCondition, setWeatherCondition] = useState<WeatherConditionDataType | null>();
  const [activeDashboardBtn, setActiveDashboardBtn] = useState<"personal" | "work" | "time_bound" | "completed" | "missed" | "repeated">("personal");
  // const [showNotification, setShowNotification] = useState<boolean>(false)
  const [activeDashboardBtnRoute, setActiveDashboardBtnRoute] = useState("high_priority");
  const [dashboardBtnRoute, setDashboardBtnRoute] = useState("High riority");
  const router = useRouter()
  // const [notificationCount, setNotificationCount] = useState<number>(0)
  const [results, setResults] = useState<[{ id: string, title: string }]>([{ id: "", title: "" }]);
  const [query, setQuery] = useState("");
  const [dashboardBtnType, setDashboardBtnType] = useState("Personal")
  const [dashboardDropdown, setDashboardDropdown] = useState(false)
  const [activeSearchBarDashboard, setSearchBarActiveDashboard] = useState("personal")
  const [userSearchQuery, setUserSearchQuery] = useState("")
  const [searchDisplay, setSearchDisplay] = useState(false)
  const handleClick = (dashboardBtn: string, dashboardRoute: string) => {
    userTaskQueryPath(dashboardBtn, dashboardRoute);
  };

  const fullDataSearch = (id: string, userDashboardSearch: string) => {
    showSearchFullResult(id, userDashboardSearch)
  }

  function ThemeChange() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  }


  function dashboardRouteOptions(category: "personal" | "work" | "time_bound" | "completed" | "missed" | "repeated") {
    switch (category) {
      case "personal":
        return {
          routeOptions: ["High-Priority", "Primary Task", "Completed Task", "Missed Task", "Archived Task"],
          activeRouteOptions: ["high_priority", "main", "completed", "missed", "archived"],
        }
      case "work":
        return {
          routeOptions: ["High-Priority", "Primary Task", "Completed Task", "Missed Task", "Archived Task"],
          activeRouteOptions: ["high_priority", "main", "completed", "missed", "archived"],
        }
      case "time_bound":
        return {
          routeOptions: ["UpComing Tasks", "Deadline Task", "Missed Task", "Completed Task", "Archived Task", "Time Deadline Task", "Date Deadline Task"],
          activeRouteOptions: ["upComing", "deadline", "missed", "completed", "archived", "time_deadline", "date_deadline"],
        }
      case "completed":
        return {
          routeOptions: ["Personal Task", "Work Task", "Time Bound Task"],
          activeRouteOptions: ["personal", "work", "time_bound"],
        }
      case "missed":
        return {
          routeOptions: ["Personal Task", "Work Task", "Time Bound Task"],
          activeRouteOptions: ["personal", "work", "time_bound"],
        }
      case "repeated":
        return {
          routeOptions: ["Personal Tasks", "Work Task", "Time bound Task", "High Priority Task", "Primary Task", "Missed Task", "Completed Task", "Archived Task"],
          activeRouteOptions: ["personal", "work", "time_bound", "high_priority", "main", "missed", "completed", "archived"],
        }
    }
  }

  const handleSearch = useCallback(async (query: string, userSearchBarDashboardBtn: string) => {
    if (!query) {
      return;
    }

    // Example: Fetch results from an API endpoint
    try {
      setUserSearchQuery(query)
      const response = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userSearchBarDashboardBtn })
      });
      const searchResult = await response.json();
      if (searchResult.success) {
        setQuery("");
        setResults(searchResult.data);
        setSearchDisplay(true)
      }
    } catch {
      setQuery("");
    }
  }, [])

  function handleOptionClick(taskType: "Personal" | "Work" | "Time-bound" | "Repeated") {
    switch (taskType) {
      case "Personal":
        setDashboardBtnType("Personal");
        setSearchBarActiveDashboard("personal");
        setDashboardDropdown(false);
        setSearchDisplay(false)
        break;
      case "Work":
        setDashboardBtnType("Work");
        setSearchBarActiveDashboard("work");
        setDashboardDropdown(false);
        setSearchDisplay(false)
        break;
      case "Time-bound":
        setDashboardBtnType("Time-bound");
        setSearchBarActiveDashboard("time_bound");
        setDashboardDropdown(false);
        setSearchDisplay(false)
        break;
      case "Repeated":
        setDashboardBtnType("Repeated");
        setSearchBarActiveDashboard("repeated");
        setDashboardDropdown(false);
        setSearchDisplay(false)
        break;
      default:
        break;
    }
  }

  async function userLogOut() {
    try {

      const response = await fetch("/api/auth/logout", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include"
      });
      const data = await response.json();
      if (data.success) {
        router.push("/")
      } else {
        return
      }

    } catch {
      return
    }
  }

  const dashboardRouteOptionsQuery = dashboardRouteOptions(activeDashboardBtn);


  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleSearch(query, activeSearchBarDashboard);
    }, 3000);

    return () => clearTimeout(delayDebounce);
  }, [handleSearch, query, activeSearchBarDashboard]);

  return (
    <div className={theme === 'light' ? "dashboard-body-whiteTheme" : 'dashboard-body-blackTheme'}>
      <section className={theme === 'light' ? "side-nav-container-whiteTheme" : "side-nav-container-blackTheme"}>
        <div className="side-nav">
          <div className="profile">
            {profileDetails}
            <div className="profile-options">
              <button className="add-sub-profile" aria-label="Add Sub Profile">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round">
                  </g><g id="SVGRepo_iconCarrier">
                    <path fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 22C7.28595 22 4.92893 22 3.46447 20.5355C2 19.0711 2 16.714 2 12C2 7.28595 2 4.92893 3.46447 3.46447C4.92893 2 7.28595 2 12 2C16.714 2 19.0711 2 20.5355 3.46447C22 4.92893 22 7.28595 22 12C22 16.714 22 19.0711 20.5355 20.5355C19.0711 22 16.714 22 12 22ZM12 8.25C12.4142 8.25 12.75 8.58579 12.75 9V11.25H15C15.4142 11.25 15.75 11.5858 15.75 12C15.75 12.4142 15.4142 12.75 15 12.75H12.75L12.75 15C12.75 15.4142 12.4142 15.75 12 15.75C11.5858 15.75 11.25 15.4142 11.25 15V12.75H9C8.58579 12.75 8.25 12.4142 8.25 12C8.25 11.5858 8.58579 11.25 9 11.25H11.25L11.25 9C11.25 8.58579 11.5858 8.25 12 8.25Z"
                      fill="white">
                    </path>
                  </g>
                </svg>
              </button>
              <button className="edit-sub-profile" aria-label="edit-sub-profile">
                <svg fill="currentColor" viewBox="0 0 24 24" id="edit-user" data-name="Flat Color" xmlns="http://www.w3.org/2000/svg" className="icon flat-color">
                  <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                  <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                  <g id="SVGRepo_iconCarrier">
                    <path id="primary"
                      d="M6,7a5,5,0,1,1,5,5A5,5,0,0,1,6,7Zm5,12.61a2,2,0,0,1,.59-1.41l4-4A6.26,6.26,0,0,0,14,14H8a6,6,0,0,0-6,6,2,2,0,0,0,2,2h6a1,1,0,0,0,1-1Z"></path>
                    <path id="secondary"
                      d="M20.31,12.29l1.4,1.4a1,1,0,0,1,0,1.4L15.1,21.71a1.05,1.05,0,0,1-.71.29H13a1,1,0,0,1-1-1V19.61a1.05,1.05,0,0,1,.29-.71l6.62-6.61A1,1,0,0,1,20.31,12.29Z"></path>
                  </g>
                </svg>
              </button>
            </div>
          </div>
          <div className="date">
            <div>
              <div className="date-switch">
                <button title="previous day" className="date-left">
                  <svg
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="_x32_"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    fill="currentColor"
                    transform="rotate(180)matrix(-1, 0, 0, 1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path
                          className="st0"
                          d="M154.52,265.848l90.964,69.014c2.329,1.766,4.674,2.702,6.78,2.702c2.148,0,4.022-0.974,5.276-2.741 c1.199-1.688,1.807-3.99,1.807-6.844v-26.424c0-6.952,5.656-12.608,12.607-12.608h75.036c8.705,0,15.788-7.085,15.788-15.788 v-34.313c0-8.703-7.083-15.788-15.788-15.788h-75.036c-6.951,0-12.607-5.656-12.607-12.608v-26.425 c0-7.065-3.659-9.584-7.082-9.584c-2.106,0-4.451,0.936-6.78,2.702l-90.964,69.014c-3.416,2.59-5.297,6.087-5.297,9.849 C149.223,259.762,151.103,263.259,154.52,265.848z"
                        ></path>
                        <path
                          className="st0"
                          d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256 S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256 S151.667,66.785,256,66.785z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </button>
                <div
                  className="fulldate"
                >
                  <input type="date" title="Choose date" className="user-selected-date" />
                </div>
                <button title="next Day" className="date-right">
                  <svg
                    height="200px"
                    width="200px"
                    version="1.1"
                    id="_x32_"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 512 512"
                    xmlSpace="preserve"
                    fill="currentColor"
                    transform="rotate(0)matrix(-1, 0, 0, -1, 0, 0)"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g>
                        <path
                          className="st0"
                          d="M154.52,265.848l90.964,69.014c2.329,1.766,4.674,2.702,6.78,2.702c2.148,0,4.022-0.974,5.276-2.741 c1.199-1.688,1.807-3.99,1.807-6.844v-26.424c0-6.952,5.656-12.608,12.607-12.608h75.036c8.705,0,15.788-7.085,15.788-15.788 v-34.313c0-8.703-7.083-15.788-15.788-15.788h-75.036c-6.951,0-12.607-5.656-12.607-12.608v-26.425 c0-7.065-3.659-9.584-7.082-9.584c-2.106,0-4.451,0.936-6.78,2.702l-90.964,69.014c-3.416,2.59-5.297,6.087-5.297,9.849 C149.223,259.762,151.103,263.259,154.52,265.848z"
                        ></path>
                        <path
                          className="st0"
                          d="M256,0C114.842,0,0.002,114.84,0.002,256S114.842,512,256,512c141.158,0,255.998-114.84,255.998-256 S397.158,0,256,0z M256,66.785c104.334,0,189.216,84.879,189.216,189.215S360.334,445.215,256,445.215S66.783,360.336,66.783,256 S151.667,66.785,256,66.785z"
                        ></path>
                      </g>
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="search_container">
            <input
              type="text"
              placeholder="Search"
              className="input_search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {(results[0].id !== "" && results[0].title !== "" && searchDisplay) &&
              <div className="search_result_container">
                <button
                  className="close_search_result"
                  onClick={() => setSearchDisplay(false)}
                >
                  close
                </button>
                <fieldset className="search_fieldset" >
                  <legend>Search result for {`"${userSearchQuery}"`}  </legend>
                  {(results[0].id !== "" && results[0].title !== "") && results.map((item, index) => (
                    <div
                      onClick={() => fullDataSearch(item.id, dashboardBtnType)}
                      key={index}
                      className="result"
                    >
                      <h2 className="result_index" >{index + 1} </h2>
                      <h2 className="result_title" >{item.title} </h2>
                    </div>
                  ))}
                </fieldset>
              </div>
            }
            <div className="dashboard">
              <button
                className="dashboard_group_item"
                onClick={() => setDashboardDropdown(true)}
              >
                <div
                  className="dashboard_selector"
                >
                  {dashboardBtnType}
                </div>
                <div className="selector_icon">
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
                        fill="white"
                      />
                    </g>
                  </svg>
                </div>
              </button>
              {dashboardDropdown && (
                <div className="group_selector_container">
                  {["Personal", "Work", "Time-bound", "Repeated"].map((option) => (
                    <button
                      key={option}
                      className="dashboard_options"
                      onClick={() => {
                        handleOptionClick(option as "Personal" | "Work" | "Time-bound" | "Repeated")
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="side-nav-items">
            <div className="side-nav-overview">
              <div className="dropbtn">
                <span>
                  <svg
                    fill="#0000"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    id="dashboard"
                    className="icon glyph"
                  >
                    <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <rect x="2" y="2" width="9" height="11" rx="2"></rect>
                      <rect x="13" y="2" width="9" height="7" rx="2"></rect>
                      <rect x="2" y="15" width="9" height="7" rx="2"></rect>
                      <rect x="13" y="11" width="9" height="11" rx="2"></rect>
                    </g>
                  </svg>
                </span>
                <h1 className="dashboard_heading" >Dashboard</h1>
              </div>
              <div id="myDropdown" className="dropdown-content">
                <button
                  onClick={() => {
                    setActiveDashboardBtn("personal");
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0];
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)

                    handleClick("personal", activeDefaultRoute)
                  }}
                  className={activeDashboardBtn === "personal" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      viewBox="0 0 1024 1024"
                      fill="#000000"
                      className="icon"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M512 0C229.611606 0 0 229.611606 0 512s229.611606 512 512 512 512-229.611606 512-512S794.258081 0 512 0z m309.102571 815.890048c-9.773479-52.776788-32.83889-102.686689-67.502164-144.386867a38.937541 38.937541 0 0 0-54.99211-4.951896 38.937541 38.937541 0 0 0-4.951896 54.99211c35.184525 42.351743 54.601171 95.91041 54.601171 151.032833 0 0.912191 0.260626 1.824383 0.260626 2.736574-68.023416 44.436752-149.20845 70.369051-236.518198 70.369051s-168.364469-25.932298-236.518198-70.369051c0-0.912191 0.260626-1.69407 0.260626-2.736574 0-130.182744 105.944515-236.257572 236.257572-236.257572 121.712395 0 220.750318-99.037923 220.750318-220.750318s-99.037923-220.750318-220.750318-220.750318-220.750318 99.037923-220.750318 220.750318c0 70.499364 33.229829 133.179944 84.8338 173.576992-89.003818 42.872996-154.811911 126.533978-173.186053 226.614405C125.7521 737.571901 78.187834 630.193942 78.187834 512 78.187834 272.745228 272.745228 78.187834 512 78.187834s433.812166 194.557394 433.812166 433.812166c-0.130313 118.193942-47.694579 225.571901-124.709595 303.890048zM369.307203 415.698651c0-78.578773 63.983711-142.562484 142.562484-142.562484s142.562484 63.983711 142.562484 142.562484c0 78.709086-63.983711 142.562484-142.562484 142.562484S369.307203 494.277424 369.307203 415.698651z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  <h2>Personal</h2>
                </button>
                <button
                  onClick={() => {
                    setActiveDashboardBtn("work")
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0]
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)
                    handleClick("work", activeDefaultRoute);
                  }}
                  className={activeDashboardBtn === "work" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      fill="#000000"
                      height="200px"
                      width="200px"
                      version="1.1"
                      id="Capa_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 369.946 369.946"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M330.15,343.082c0,4.971-4.029,9-9,9h-39.073c-4.971,0-9-4.029-9-9s4.029-9,9-9h39.073 C326.121,334.082,330.15,338.112,330.15,343.082z M153.671,49.164c0-17.261,14.042-31.303,31.302-31.303 s31.302,14.042,31.302,31.303s-14.042,31.303-31.302,31.303S153.671,66.425,153.671,49.164z M171.671,49.164 c0,7.335,5.967,13.303,13.302,13.303s13.302-5.968,13.302-13.303s-5.967-13.303-13.302-13.303S171.671,41.828,171.671,49.164z M122.076,171.876c4.567,1.97,9.86-0.132,11.83-4.695l13.719-31.776c7.452-17.259,15.638-24.298,28.252-24.298h18.195 c12.614,0,20.8,7.04,28.252,24.298l13.719,31.777c1.468,3.401,4.784,5.435,8.268,5.435c1.189,0,2.4-0.238,3.563-0.74 c4.563-1.97,6.666-7.267,4.695-11.83l-13.719-31.777c-6.519-15.095-18.252-35.163-44.777-35.163h-18.195 c-26.525,0-38.259,20.068-44.777,35.163l-13.719,31.777C115.41,164.609,117.512,169.905,122.076,171.876z M369.207,339.516 l-13.718-31.779c-6.52-15.095-18.253-35.162-44.774-35.162h-18.197c-26.523,0-38.259,20.067-44.779,35.164l-13.717,31.777 c-1.971,4.563,0.133,9.86,4.696,11.83c1.162,0.501,2.372,0.739,3.563,0.739c3.482,0,6.799-2.034,8.267-5.436l13.717-31.775 c7.454-17.259,15.641-24.299,28.254-24.299h18.197c12.611,0,20.796,7.04,28.249,24.297l13.718,31.777 c1.969,4.563,7.26,6.667,11.83,4.696C369.075,349.376,371.177,344.08,369.207,339.516z M270.31,228.633 c0-17.26,14.044-31.302,31.306-31.302c17.26,0,31.301,14.042,31.301,31.302c0,17.261-14.041,31.303-31.301,31.303 C284.354,259.936,270.31,245.894,270.31,228.633z M288.31,228.633c0,7.335,5.969,13.303,13.306,13.303 c7.334,0,13.301-5.968,13.301-13.303c0-7.335-5.967-13.302-13.301-13.302C294.279,215.331,288.31,221.298,288.31,228.633z M122.208,307.739c-6.516-15.095-18.247-35.164-44.775-35.164H59.234c-26.523,0-38.257,20.067-44.776,35.164L0.74,339.516 c-1.971,4.563,0.132,9.86,4.695,11.83c4.567,1.968,9.861-0.133,11.83-4.696l13.718-31.776c7.453-17.259,15.639-24.299,28.251-24.299 h18.199c12.615,0,20.8,7.04,28.25,24.297L119.4,346.65c1.468,3.401,4.783,5.436,8.267,5.436c1.19,0,2.4-0.238,3.562-0.739 c4.563-1.97,6.667-7.267,4.696-11.83L122.208,307.739z M87.873,334.082H48.796c-4.971,0-9,4.029-9,9s4.029,9,9,9h39.076 c4.971,0,9-4.029,9-9S92.843,334.082,87.873,334.082z M196.704,334.082h-23.461c-4.971,0-9,4.029-9,9s4.029,9,9,9h23.461 c4.971,0,9-4.029,9-9S201.674,334.082,196.704,334.082z M37.031,228.633c0-17.26,14.042-31.302,31.302-31.302 c17.261,0,31.304,14.042,31.304,31.302c0,17.261-14.043,31.303-31.304,31.303C51.073,259.936,37.031,245.894,37.031,228.633z M55.031,228.633c0,7.335,5.967,13.303,13.302,13.303c7.336,0,13.304-5.968,13.304-13.303c0-7.335-5.968-13.302-13.304-13.302 C60.998,215.331,55.031,221.298,55.031,228.633z M204.511,172.612c4.971,0,9-4.029,9-9s-4.029-9-9-9h-39.076c-4.971,0-9,4.029-9,9 s4.029,9,9,9H204.511z M153.671,228.633c0-17.26,14.042-31.302,31.302-31.302s31.302,14.042,31.302,31.302 c0,17.261-14.042,31.303-31.302,31.303S153.671,245.894,153.671,228.633z M171.671,228.633c0,7.335,5.967,13.303,13.302,13.303 s13.302-5.968,13.302-13.303c0-7.335-5.967-13.302-13.302-13.302S171.671,221.298,171.671,228.633z M221.513,282.298 c-7.667-6.451-16.899-9.722-27.441-9.722h-18.195c-10.545,0-19.778,3.271-27.441,9.724c-3.803,3.201-4.29,8.878-1.089,12.681 c1.78,2.114,4.326,3.204,6.89,3.204c2.046,0,4.104-0.694,5.792-2.115c4.39-3.696,9.574-5.493,15.849-5.493h18.195 c6.272,0,11.458,1.797,15.852,5.495c3.806,3.2,9.481,2.711,12.682-1.092C225.805,291.175,225.316,285.498,221.513,282.298z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  <h2>Work</h2>
                </button>
                <button
                  onClick={() => {
                    setActiveDashboardBtn("time_bound")
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0]
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)
                    handleClick("time_bound", activeDefaultRoute);
                  }}
                  className={activeDashboardBtn === "time_bound" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      fill="#000000"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          d="M6.108,20H4a1,1,0,0,0,0,2H20a1,1,0,0,0,0-2H17.892c-.247-2.774-1.071-7.61-3.826-9,2.564-1.423,3.453-4.81,3.764-7H20a1,1,0,0,0,0-2H4A1,1,0,0,0,4,4H6.17c.311,2.19,1.2,5.577,3.764,7C7.179,12.39,6.355,17.226,6.108,20ZM9,16.6c0-1.2,3-3.6,3-3.6s3,2.4,3,3.6V20H9Z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  <h2>Time-bound</h2>
                </button>
                <button
                  onClick={() => {
                    setActiveDashboardBtn("completed")
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0]
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)
                    handleClick("completed", activeDefaultRoute);
                  }}
                  className={activeDashboardBtn === "completed" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      viewBox="0 0 1024 1024"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="white"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <path
                          fill="white"
                          d="M512 64a448 448 0 1 1 0 896 448 448 0 0 1 0-896zm-55.808 536.384-99.52-99.584a38.4 38.4 0 1 0-54.336 54.336l126.72 126.72a38.272 38.272 0 0 0 54.336 0l262.4-262.464a38.4 38.4 0 1 0-54.272-54.336L456.192 600.384z"
                        ></path>
                      </g>
                    </svg>
                  </span>
                  <h2>Completed</h2>
                </button>
                <button
                  onClick={() => {
                    setActiveDashboardBtn("missed")
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0];
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)
                    handleClick("missed", activeDefaultRoute);
                  }}
                  className={activeDashboardBtn === "missed" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      viewBox="0 0 512 512"
                      version="1.1"
                      width="25"
                      height="25"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      fill="white"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                      <g id="SVGRepo_iconCarrier">
                        <title>error-filled</title>
                        <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                          <g id="add" fill="white" transform="translate(42.666667, 42.666667)">
                            <path
                              d="M213.333333,3.55271368e-14 C331.136,3.55271368e-14 426.666667,95.5306667 426.666667,213.333333 C426.666667,331.136 331.136,426.666667 213.333333,426.666667 C95.5306667,426.666667 3.55271368e-14,331.136 3.55271368e-14,213.333333 C3.55271368e-14,95.5306667 95.5306667,3.55271368e-14 213.333333,3.55271368e-14 Z M262.250667,134.250667 L213.333333,183.168 L164.416,134.250667 L134.250667,164.416 L183.168,213.333333 L134.250667,262.250667 L164.416,292.416 L213.333333,243.498667 L262.250667,292.416 L292.416,262.250667 L243.498667,213.333333 L292.416,164.416 L262.250667,134.250667 Z"
                              id="Combined-Shape"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <h2>Missed</h2>
                </button>
                <button
                  onClick={() => {
                    setActiveDashboardBtn("repeated")
                    const activeDefaultRoute = dashboardRouteOptionsQuery.activeRouteOptions[0];
                    const defaultRouteOption = dashboardRouteOptionsQuery.routeOptions[0];
                    setActiveDashboardBtnRoute(defaultRouteOption)
                    handleClick("repeated", activeDefaultRoute);
                  }}
                  className={activeDashboardBtn === "repeated" ? "activeBtn" : ""}
                >
                  <span>
                    <svg
                      fill="#000000"
                      height="30px"
                      width="30px"
                      version="1.1"
                      id="Layer_1"
                      xmlns="http://www.w3.org/2000/svg"
                      xmlnsXlink="http://www.w3.org/1999/xlink"
                      viewBox="0 0 512 512"
                      xmlSpace="preserve"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></g>
                      <g id="SVGRepo_iconCarrier">
                        <g>
                          <g>
                            <path
                              d="M512,76.228L435.915,0.143L330.168,105.891c-33.73-20.164-72.115-30.766-111.8-30.766C97.959,75.123,0,173.083,0,293.49 c0,58.33,22.714,113.166,63.956,154.41c41.243,41.244,96.08,63.956,154.41,63.956c58.33,0,113.168-22.714,154.41-63.956 s63.956-96.081,63.956-154.41c0-39.533-10.528-77.796-30.548-111.448L512,76.228z M435.915,44.392l31.836,31.836l-19.744,19.744 l-31.836-31.836L435.915,44.392z M394.046,86.26l31.836,31.836l-122.201,122.2l-31.432-32.24L394.046,86.26z M269.485,291.808 c0.017,0.559,0.033,1.119,0.033,1.682c0,28.206-22.946,51.152-51.152,51.152s-51.152-22.946-51.152-51.152 c0-28.206,22.946-51.152,51.152-51.152c0.686,0,1.372,0.016,2.055,0.043l-21.839,71.181L269.485,291.808z M245.797,266.346 l9.475-30.884l20.996,21.535L245.797,266.346z M232.257,203.801l-2.47,8.051c-3.766-0.524-7.578-0.802-11.42-0.802 c-45.458,0-82.441,36.983-82.441,82.441c0,45.457,36.982,82.441,82.441,82.441s82.441-36.983,82.441-82.441 c0-3.723-0.259-7.415-0.749-11.063l8.284-2.542l25.352-25.352c4.208,12.487,6.403,25.669,6.403,38.957 c0,67.123-54.608,121.731-121.731,121.731S96.635,360.613,96.635,293.49s54.608-121.731,121.731-121.731 c13.449,0,26.778,2.243,39.386,6.546L232.257,203.801z M218.367,480.568c-103.155,0-187.078-83.923-187.078-187.078 s83.923-187.078,187.078-187.078c31.323,0,61.69,7.707,88.86,22.418l-25.413,25.413c-19.805-9.026-41.508-13.772-63.449-13.772 c-84.376,0-153.02,68.645-153.02,153.02s68.645,153.02,153.02,153.02s153.02-68.645,153.02-153.02 c0-21.779-4.686-43.345-13.596-63.052l25.441-25.441c14.577,27.082,22.214,57.321,22.214,88.492 C405.445,396.645,321.522,480.568,218.367,480.568z"
                            ></path>
                          </g>
                        </g>
                      </g>
                    </svg>
                  </span>
                  <h2>Repeated</h2>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="file-import">
          {userFullTaskDetailsPreview}
        </div>
      </section>
      <section className="full-body" id="root">
        <header id="header">
          <div id="company-logo" >
            <Image src={Logo} alt="Dolistify-logo" placeholder="blur" height="40" width="150" />
          </div>
          <div className="helper-screen">
            {helperViewTab}
          </div>
          <nav className="setting" >
            <button
              className="display-mode"
              aria-label="display-mode"
              onClick={ThemeChange}
            >
              {
                theme === "light" ? (<svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 24 24"
                >
                  <path d="M 11 0 L 11 3 L 13 3 L 13 0 L 11 0 z M 4.2226562 2.8085938 L 2.8085938 4.2226562 L 4.9296875 6.34375 L 6.34375 4.9296875 L 4.2226562 2.8085938 z M 19.777344 2.8085938 L 17.65625 4.9296875 L 19.070312 6.34375 L 21.191406 4.2226562 L 19.777344 2.8085938 z M 12 5 A 7 7 0 0 0 5 12 A 7 7 0 0 0 12 19 A 7 7 0 0 0 19 12 A 7 7 0 0 0 12 5 z M 0 11 L 0 13 L 3 13 L 3 11 L 0 11 z M 21 11 L 21 13 L 24 13 L 24 11 L 21 11 z M 4.9296875 17.65625 L 2.8085938 19.777344 L 4.2226562 21.191406 L 6.34375 19.070312 L 4.9296875 17.65625 z M 19.070312 17.65625 L 17.65625 19.070312 L 19.777344 21.191406 L 21.191406 19.777344 L 19.070312 17.65625 z M 11 21 L 11 24 L 13 24 L 13 21 L 11 21 z"></path>
                </svg>) :
                  (<svg fill="white" version="1.1" id="Capa_
                           1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 0 107.112 107.112" xmlSpace="preserve"
                  ><g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                    <g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g>
                    <g id="SVGRepo_iconCarrier">
                      <g> <g>
                        <path d="M44.375,62.244c-0.05-0.268-0.104-0.529-0.208-0.831c-0.143,0.578-1.08,0.785-0.809,1.364 c0.209,0.447,0.063,1.104,0.604,1.395c0.105-0.328,0.449-0.475,0.68-0.617c0.229-0.145,0.541,0.319,0.91,0.349 c0.203,0.016,0.107,0.267,0.082,0.428c-0.032,0.204-0.05,0.412-0.074,0.618c0.26,0.354,0.667,0.385,1.039,0.49 c0.172-0.082,0.325-0.199,0.527-0.086c0.344,0.262,0.272,0.606,0.195,0.953c-0.01,0.028-0.021,0.055-0.031,0.082 c0.009-0.021,0.021-0.037,0.029-0.059c0.186-0.168,0.32-0.012,0.469,0.062c0.203-0.517,0.318-1.065,0.549-1.571 c-0.365-0.298-0.594-0.71-0.838-1.095c-0.289-0.451-0.684-0.603-1.162-0.621c-0.518-0.018-0.957-0.178-1.291-0.559 C44.656,62.821,44.452,62.656,44.375,62.244z"></path> <path d="M44.492,34.422c0.037-0.052,0.068-0.099,0.059-0.11c-0.547-0.65,0.271-1.668-0.609-2.23 c-0.291-0.185-0.156-0.292,0.093-0.423c0.221-0.116,0.748-0.007,0.63-0.31c-0.158-0.404-0.104-0.976-0.58-1.207 c-0.382-0.184-0.795-0.634-1.184,0.103c-0.115,0.217-0.689,0.101-0.873,0.487c-0.059,0.575-0.422,0.974-0.767,1.382 c0.012,0.02,0.026,0.032,0.037,0.054c0.091,0.302-0.043,0.582-0.107,0.86c-0.075,0.329-0.325,0.471-0.669,0.428 c-0.675-0.083-0.949,0.227-0.78,0.896c0.044,0.179,0.163,0.345-0.001,0.518c0.314,0.12,0.604,0.136,0.77-0.35 c0.186-0.141,0.393-0.21,0.625-0.193c0.579,0.273,0.053,0.522-0.017,0.781c-0.034,0.014-0.069,0.027-0.104,0.041 c-0.245,0.068-0.392,0.19-0.491,0.339c0.074,0.281,0.059,0.583,0.052,0.881c0.001-0.002,0.001-0.003,0.002-0.005 c0.11-0.535,0.532-0.813,1.062-0.742c0.41,0.055,0.658,0.498,0.604,1.058c-0.034,0.346-0.002,0.707-0.369,0.987 c0.473,0.043,0.367-0.302,0.365-0.438c-0.006-0.451,0.079-0.859,0.355-1.212c0.141-0.178,0.129-0.325,0.029-0.515 c-0.232-0.441-0.146-0.854,0.298-0.992C43.425,34.354,43.966,34.084,44.492,34.422z"></path> <path d="M34.336,56.791c-0.099,0.088-0.202,0.139-0.304,0.169c0.033-0.002,0.063,0.001,0.099-0.004 c0.388-0.052,0.625,0.162,0.756,0.521c0.122,0.332,0.175,0.697,0.435,0.967c-0.098-0.689,0.268-1.161,0.91-1.223 c-0.281-0.067-0.538-0.276-0.776-0.424C35.046,56.541,34.742,56.438,34.336,56.791z"></path> <path d="M36.714,57.172c-0.051,0.024-0.1,0.039-0.148,0.051c0.02,0.002,0.036,0,0.057,0.004c0.327,0.045,0.697,0.119,0.938,0.324 c0.327,0.277,0.638,0.323,0.983,0.203c-0.09-0.052-0.182-0.107-0.25-0.183C37.857,57.08,37.388,56.842,36.714,57.172z"></path> <path d="M35.079,50.392c0.131-0.033,0.25-0.072,0.34-0.105C35.335,50.32,35.202,50.342,35.079,50.392z"></path> <path d="M38.544,57.754c0.008,0.004,0.014,0.01,0.02,0.014c0.025,0.013,0.037,0.015,0.041-0.002 c0.002-0.004,0.002-0.002,0.004-0.006c-0.011,0-0.021,0-0.042-0.013C38.56,57.75,38.552,57.75,38.544,57.754z"></path> <path d="M46.531,17.439c0.037-0.411-0.038-0.587-0.512-0.497c-0.529,0.1-0.835-0.264-0.758-0.811 c-0.023,0.027-0.047,0.045-0.079,0.067c-0.526,0.038-0.56-0.364-0.646-0.724c0.197-0.338,0.426-0.624,0.881-0.614 c0.231,0.005,0.366-0.146,0.371-0.39c0.046-0.106,0.121-0.19,0.186-0.272c-0.584-0.099-1.21,0.027-1.706-0.397 c-0.071-0.053-0.122-0.128-0.191-0.182c-0.46-0.36-0.38-0.802-0.195-1.265c0.077-0.193,0.19-0.312,0.415-0.313 c0.54-0.004,0.563-0.325,0.428-0.727c-0.099-0.292-0.16-0.572-0.033-0.793c-0.217,0.223-0.328,0.496-0.182,0.884 c0.129,0.343-0.039,0.492-0.347,0.552c-0.271,0.053-0.544-0.012-0.817,0.005c-0.688,0.043-0.749,0.101-0.843,0.817 c-0.055,0.216-0.149,0.407-0.329,0.545c-0.669,0.117-1.096-0.367-1.43-0.761c-0.368-0.435-0.521-0.457-0.768,0.02 c-0.139,0.268-0.356,0.39-0.654,0.415c-1.164,0.1-1.605,0.993-2.038,1.886c-0.087,0.178-0.005,0.368,0.038,0.552 c0.204,0.86,0,1.177-0.852,1.448c-0.51,0.162-1.09,0.304-1.539,0.165c-0.604-0.189-1.281-0.289-1.797-0.728 c-0.156-0.134-0.309-0.368-0.442,0.016c-0.158,0.288,0.181,0.742-0.309,0.918c-0.56,0.202-1.095,0.552-1.724,0.189 c-0.422-0.242-0.875-0.264-1.329-0.081c-0.227,0.091-0.441,0.169-0.563-0.141c-0.914,0.18-1.741,0.604-2.583,0.968 c-0.004,0.002-0.007,0.005-0.012,0.006c-0.951,1.508-1.823,3.062-2.63,4.653c0.962-0.097,1.893-0.333,2.754-0.942 c-0.285-0.217-0.648-0.117-0.817-0.393c-0.012-0.018-0.027-0.034-0.034-0.054c-0.258-0.694,0.421-0.868,0.715-1.246 c0.2-0.256,0.497-0.411,0.833-0.186c0.322,0.216,0.312,0.771-0.043,1.111c-0.163,0.156-0.385,0.25-0.581,0.372 c0.643,0.308,1.182-0.103,1.741-0.28c0.757-0.241,1.484-0.579,2.297-0.603c0.321,0.006,0.597-0.147,0.884-0.254 c0.508-0.227,0.89,0.138,0.998,0.46c0.138,0.414,0.352,0.375,0.629,0.357c0.243-0.015,0.459,0.033,0.646,0.19 c0.139,0.027,0.245,0.089,0.258,0.249c0.293,0.002,0.586,0.005,0.881,0.008c0.033-0.023,0.064-0.053,0.103-0.066 c0.327-0.116,0.319-0.692,0.71-0.621c0.324,0.059,0.584,0.358,0.869,0.557c0.068,0.046,0.143,0.082,0.211,0.127 c0.125,0.001,0.25,0.002,0.375,0.002c0.296,0.216,0.59,0.208,0.884-0.003l0.001-0.001c0.271-0.162,0.48-0.451,0.875-0.338 c0.342,0.098,0.593,0.234,0.669,0.619c0.08,0.406-0.306,0.361-0.536,0.548c0.548,0.282,1.22-0.066,1.637,0.447 c0.012,0.196,0.095,0.316,0.313,0.285c0.309-0.045,0.559,0.127,0.832,0.214c0.252,0.039,0.458,0.361,0.754,0.121 c0.004-0.25,0.008-0.499,0.012-0.748c0.054-0.041,0.088-0.042,0.115-0.032c-0.006-0.136-0.102-0.262-0.061-0.405l0,0 c-0.086-0.086-0.092-0.252-0.19-0.325c-0.409-0.207-0.509-0.469-0.163-0.831c0.084-0.088,0.172-0.21,0.182-0.324 c0.113-1.473,1.143-1.979,2.381-2.176c0.653-0.105,1.211-0.551,1.871-0.602C46.464,17.894,46.509,17.657,46.531,17.439z"></path> <path d="M55.195,30.406c-0.105,0.056-0.281,0.173-0.426,0.082c-0.002,0.002-0.006,0.004-0.008,0.007 c-0.039,0.019-0.08,0.024-0.119,0.031c-0.025,0.345-0.021,0.67,0.463,0.801c0.143,0.038,0.371,0.209,0.424,0.133 c0.254-0.366,0.736-0.207,1.008-0.486c0.092-0.095,0.061-0.214-0.055-0.252C56.064,30.583,55.734,30.128,55.195,30.406z"></path> <path d="M47.26,66.461c0.009-0.025,0.021-0.047,0.03-0.072c-0.012,0.025-0.025,0.047-0.039,0.071 C47.255,66.46,47.257,66.461,47.26,66.461z"></path> <path d="M46.286,73.874c-0.051-0.021-0.104-0.034-0.153-0.051c-0.044,0.006-0.085,0.021-0.13,0.024 c-0.145,0.024-0.281,0.072-0.404,0.152c0.004,0.041,0.014,0.08,0.016,0.123c0.006,0.203,0.109,0.367,0.297,0.443 c0.276,0.109,0.619,0.369,0.821-0.025C46.925,74.165,46.597,73.988,46.286,73.874z"></path> <path d="M51.724,33.743c-0.244-0.061-0.447-0.162-0.604-0.358c0.262,0.2,0.229,0.379-0.021,0.586 c-0.193,0.161-0.387,0.378-0.234,0.651c0.172,0.309,0.49,0.302,0.781,0.216c0.271-0.079,0.711-0.108,0.713-0.397 C52.363,34.146,52.083,33.833,51.724,33.743z"></path> <path d="M25.084,63.485c-0.031-0.087-0.044-0.179-0.068-0.267c-0.024-0.029-0.053-0.05-0.064-0.1 c-0.262-1.162-0.597-2.309-0.728-3.495c-0.026-0.231-0.084-0.452-0.213-0.651c-0.326-0.498-0.583-0.506-0.878,0.014 c-0.222,0.389-0.447,0.463-0.778,0.137c-0.14-0.139-0.385-0.261-0.511-0.143c-0.322,0.307-0.702,0.25-1.068,0.269 c0.113,0.399,0.147,0.813,0.084,1.216c-0.095,0.602,0.13,1.119,0.332,1.646c0.168,0.437,0.535,0.558,0.979,0.503 c0.198-0.023,0.454-0.201,0.536,0.152c0.269-0.459,0.647-0.312,0.952-0.104c0.38,0.262,0.737,0.545,1.162,0.743 c0.213,0.099,0.397,0.28,0.416,0.56c0.006,0.09,0.026,0.153,0.054,0.204c0.002-0.009,0.004-0.017,0.007-0.024 c-0.027-0.062-0.047-0.135-0.057-0.232C25.227,63.766,25.154,63.619,25.084,63.485z"></path> <path d="M22.715,62.781c-0.001-0.008-0.006-0.008-0.007-0.016h-0.001C22.713,62.768,22.715,62.783,22.715,62.781z"></path> <path d="M32.837,53.062c0.375-0.021,0.5-0.122,0.502-0.458c0.174-0.408,0.427-0.784,0.484-1.237 c0.395-0.186,0.785-0.357,1.016-0.783c0.053-0.099,0.145-0.153,0.24-0.192c-0.103,0.026-0.211,0.049-0.326,0.055 c-0.334,0.017-0.477-0.277-0.67-0.464c-0.168-0.161-0.367-0.227-0.564-0.245c-0.25-0.022-0.395-0.141-0.449-0.353 c-0.061-0.227,0.051-0.393,0.256-0.519c0.248-0.151,0.543-0.33,0.451-0.667c-0.043-0.16-0.244-0.277-0.121-0.487 c-0.061,0.292-0.256,0.349-0.522,0.321c-0.188-0.02-0.288-0.158-0.425-0.25c-0.461-0.312-1.131-0.212-1.48,0.213 c-0.721,0.877-1.332,1.074-2.397,0.738c-0.348-0.109-0.698-0.15-1.055-0.137c0.017,0.034,0.039,0.065,0.041,0.11 c0.01,0.052,0.001,0.087,0.004,0.132c0.536,0.208,0.367,0.843,0.612,1.287c0.439-0.419,0.853-0.373,1.277,0.048 c0.153,0.151,0.415,0.192,0.626,0.285c0.189,0.084,0.436,0.14,0.428,0.399c-0.008,0.214-0.227,0.298-0.397,0.363 c-0.239,0.09-0.427-0.044-0.51-0.252c-0.131-0.324-0.3-0.507-0.662-0.33c-0.072,0.035-0.182,0.088-0.188,0.143 c-0.021,0.19,0.118,0.46-0.229,0.466c-0.328,0.006-0.694,0.131-0.97-0.134c-0.319-0.306-0.756-0.31-1.201-0.606 c0.086,0.213,0.126,0.305,0.16,0.399c0.082,0.225,0.591,0.378,0.152,0.689c-0.357,0.253-0.889,0.087-1.089-0.295 c-0.019-0.037-0.037-0.077-0.046-0.117c-0.082-0.36-0.043-0.893-0.478-0.931c-0.162-0.014-0.294,0.048-0.417,0.134 c-0.02,0.096-0.024,0.209-0.015,0.339c0.009,0.127-0.111,0.221-0.155,0.338c-0.106,0.29-0.037,0.487,0.282,0.574 c0.263,0.072,0.518,0.171,0.772,0.266c0.435,0.161,0.487,0.487,0.136,0.802c-0.153,0.138-0.333,0.246-0.44,0.446 c0.798,0.003,0.802,0.003,0.848,0.846c0.019,0.35,0.225,0.527,0.521,0.635c0.284,0.104,0.554,0.235,0.816,0.383 c-0.026-0.608,0.208-0.696,1.002-0.631c0.841,0.07,1.729,0.236,2.431-0.49c0.126-0.131,0.309-0.252,0.51-0.172 c0.245,0.096,0.082,0.334,0.142,0.494c0.005,0.014,0.003,0.023,0.007,0.037C31.753,53.605,32.146,53.1,32.837,53.062z"></path> <path d="M44.691,10.521c0.099-0.101,0.211-0.195,0.344-0.278C44.859,10.317,44.754,10.412,44.691,10.521z"></path> <path d="M31.904,56.672c-0.184-0.021-0.264-0.119-0.299-0.262c-0.002,0.363,0.062,0.745,0.57,0.879 c0.146,0.037,0.135,0.271,0.148,0.294c-0.037-0.144,0.064-0.508,0.217-0.786C32.326,56.895,32.114,56.699,31.904,56.672z"></path> <path d="M32.54,56.797c0.064-0.029,0.13-0.084,0.195-0.182c0.055-0.081,0.121-0.141,0.191-0.18 c-0.025,0.006-0.049,0.004-0.073,0.013C32.744,56.49,32.632,56.627,32.54,56.797z"></path> <path d="M34.033,56.96c-0.143,0.007-0.264-0.022-0.369-0.091C33.777,56.982,33.903,56.998,34.033,56.96z"></path> <path d="M31.745,54.545c0.01,0.053,0.035,0.102,0.058,0.15c0.011-0.135-0.003-0.279-0.058-0.441 C31.745,54.352,31.728,54.443,31.745,54.545z"></path> <path d="M31.57,55.855c0.003,0.107,0.008,0.217,0.009,0.324c0.001,0.09,0.011,0.164,0.026,0.23 c0.001-0.074,0.004-0.148,0.006-0.219C31.619,56.034,31.601,55.928,31.57,55.855z"></path> <path d="M31.778,54.98c0.093-0.115,0.063-0.201,0.025-0.284c-0.026,0.31-0.205,0.555-0.54,0.75 c-0.121,0.071-0.194,0.218-0.244,0.387c0.265-0.106,0.467-0.164,0.551,0.022C31.559,55.547,31.568,55.243,31.778,54.98z"></path> <path d="M32.927,56.436c0.215-0.043,0.406,0.064,0.533,0.24c0.063,0.088,0.131,0.146,0.203,0.193 c-0.058-0.059-0.113-0.131-0.162-0.242C33.395,56.385,33.141,56.316,32.927,56.436z"></path> <path d="M47.337,58.283c-0.005-0.021-0.006-0.044-0.008-0.064c-0.002,0.004-0.004,0.004-0.004,0.01 C47.322,58.264,47.32,58.278,47.337,58.283z"></path> <path d="M47.35,58.287c-0.009,0.001-0.009-0.004-0.013-0.005c0.003,0.017,0,0.036,0.006,0.052 C47.331,58.379,47.434,58.282,47.35,58.287z"></path> <path d="M53.556,0C24.025,0,0,24.025,0,53.557c0,29.531,24.025,53.556,53.556,53.556c29.53,0,53.556-24.024,53.556-53.556 C107.112,24.025,83.086,0,53.556,0z M85.277,22.288c0.275,0.09,0.566,0.136,0.809,0.333c0.393,0.318,0.439,0.539-0.123,0.664 c-0.088-0.084-0.174-0.168-0.262-0.251c-0.139-0.162-0.309-0.195-0.514-0.162c-0.258,0.042-0.346-0.108-0.318-0.337 C84.896,22.287,85.059,22.217,85.277,22.288z M73.281,15.431c0.221-0.101,0.195-0.289,0.215-0.479 c0.08-0.856,0.605-1.498,1.287-1.851c0.375-0.195,0.912,0.245,1.258,0.612c0.129,0.135,0.213,0.311,0.318,0.468 c0.135-0.054,0.268-0.117,0.408-0.159c0.25-0.076,0.396-0.189,0.162-0.432c-0.105-0.109-0.238-0.208-0.146-0.369 c0.103-0.169,0.293-0.142,0.457-0.122c0.121,0.014,0.248,0.055,0.353,0.117c0.385,0.227,0.709,0.541,1.227,0.523 c0.189-0.006,0.539,0.128,0.484,0.572c-0.047,0.369,0.594,0.341,0.619,0.751l0.002,0.001c0.44-0.042,0.709,0.244,0.983,0.518 c0.138,0.103,0.299,0.188,0.448,0.212c0.355,0.058,0.558,0.235,0.699,0.56c0.111,0.249,0.289,0.445,0.601,0.541 c0.437,0.133,0.573,0.544,0.471,0.938c-0.104,0.401-0.004,0.676,0.244,0.968c0.613,0.72,0.541,2.103-0.155,2.732 c-0.244,0.219-0.386,0.556-0.73,0.665c-0.064-0.012-0.129-0.004-0.193-0.008c-0.248,0.202-0.592,0.021-0.875,0.084 c-0.016-0.013-0.031-0.018-0.047-0.03c-0.311,0.042-0.621,0.07-0.934,0.007c0.016,0.055,0.014,0.113-0.043,0.182 c-0.086,0.105-0.236,0.146-0.34,0.079c-0.572-0.379-1.375-0.342-1.789-0.999l-0.002-0.001c-0.605-0.123-1.068-0.562-1.644-0.754 c-0.039-0.003-0.078-0.005-0.117-0.008c-0.254-0.115-0.471-0.3-0.741-0.391c-0.129-0.042-0.271-0.211-0.183-0.331 c0.511-0.668-0.149-0.769-0.478-1.035c-0.041-0.001-0.08-0.004-0.121-0.008c-0.067-0.167-0.131-0.334,0.003-0.501 c-0.003-0.041-0.007-0.082-0.007-0.122c0,0,0,0-0.002,0c-0.51,0.204-0.575-0.357-0.879-0.509 c-0.574-0.506-1.133-1.011-1.057-1.894C73.061,15.73,73.055,15.535,73.281,15.431z M67.615,16.118 c0.109-0.3,0.393-0.285,0.645-0.217c0.324,0.087,0.512,0.286,0.457,0.472c-0.162,0.604,0.26,0.796,0.361,1.131 c0.057,0.192,0.266,0.368,0.072,0.572c-0.18,0.188-0.344,0.045-0.496-0.072c-0.168-0.129-0.383-0.009-0.549-0.091 c-0.23-0.114-0.771-0.126-0.238-0.574c0.215-0.182,0.061-0.314-0.102-0.377C67.249,16.755,67.512,16.406,67.615,16.118z M51.156,84.361c-0.262-0.006-0.449-0.119-0.445-0.408c0.004-0.213,0.131-0.371,0.348-0.363c0.289,0.008,0.398,0.252,0.512,0.461 C51.525,84.303,51.357,84.365,51.156,84.361z M94.044,44.114c-0.385-0.035-0.364-0.474-0.627-0.638 c-0.094,0.09-0.114,0.224-0.049,0.287c0.813,0.756,0.731,1.739,0.533,2.648c-0.175,0.804-0.875,1.257-1.646,1.533 c-0.242-0.029-0.312-0.204-0.298-0.401c0.043-0.582-0.327-0.868-0.764-1.118c-0.962-0.551-1.015-0.707-0.671-1.771 c0.115-0.357,0.263-0.707,0.308-1.085c0.022-0.19,0.074-0.379,0.283-0.446c0.248-0.08,0.313,0.162,0.45,0.276 c-0.002-0.011,0.011-0.017-0.006-0.029c-0.369-0.275-0.104-0.63-0.119-0.949c-0.004-0.086-0.012-0.171-0.016-0.257 c0.164-0.303,0.176-0.609-0.088-0.849c-0.189-0.175-0.104-0.381-0.146-0.572c-0.002-0.024-0.01-0.04-0.012-0.062 c-0.24-0.025-0.479-0.047-0.711-0.1c-0.166-0.038-0.309-0.108-0.414-0.216c-0.053,0.001-0.106,0.006-0.16,0.019 c-0.049,0.03-0.1,0.049-0.151,0.068c-0.078-0.011-0.136,0.012-0.19,0.037c-0.05,0.233-0.062,0.473-0.054,0.717 c-0.205-0.042-0.323-0.169-0.412-0.329c-0.034,0.019-0.063,0.046-0.104,0.051c-0.541-0.083-0.924,0-0.975,0.681 c-0.027,0.369-0.326,0.503-0.628,0.212c-0.567-0.55-1.221-0.87-2.018-0.873c-0.171,0-0.244-0.146-0.337-0.259 c-0.271-0.307-0.465-0.626-0.188-1.031c0.041-0.061,0.091-0.116,0.138-0.172c-0.047-0.097-0.095-0.193-0.154-0.279 c-0.229-0.325-0.527-0.347-0.777-0.054c-0.197,0.233-0.24,0.744-0.637,0.598c-0.383-0.142-0.344-0.62-0.336-0.999 c0.002-0.063,0.006-0.125,0.008-0.187c0.062-0.183,0.234-0.191,0.389-0.23c-0.01-0.007-0.023-0.005-0.031-0.013 c-0.01-0.034-0.008-0.068-0.016-0.103c-0.406,0.164-0.947,0.052-1.236-0.299c0.008-0.195-0.065-0.368-0.16-0.532 c-0.123-0.215-0.313-0.428-0.08-0.674c0.234-0.248,0.529-0.414,0.873-0.442c0.298-0.024,0.261,0.263,0.341,0.444 c0.077-0.176,0.116-0.318,0.131-0.443c-0.172-0.529-0.459-0.645-1.194-0.514c-0.468-0.27-0.89-0.607-1.482-0.615 c-0.398-0.005-0.346-0.387-0.389-0.672c-0.097-0.655-0.185-1.313-0.343-1.958c-0.006,0.207-0.018,0.413-0.053,0.617 c-0.035,0.192-0.021,0.398-0.302,0.479c-0.268,0.077-0.381-0.052-0.514-0.214c-0.031-0.09-0.057-0.183-0.094-0.266 c-0.236,0-0.475-0.002-0.713,0.005c-0.123,0.004-0.326,0.011-0.354,0.075c-0.187,0.44-0.392,0.521-0.756,0.159 c-0.154-0.153-0.244,0.077-0.314,0.188c-0.217,0.343-0.426,0.524-0.736,0.079c-0.123-0.176-0.348-0.226-0.559-0.262 c-0.041-0.003-0.082-0.005-0.123-0.005c-0.359,0.34-0.773,0.487-1.266,0.376c-0.654-0.089-0.588,0.377-0.359,0.636 c0.445,0.51,0.031,1.214,0.482,1.685c0.01,0.011,0.006,0.047-0.004,0.061c-0.761,1.025,0.309,1.776,0.397,2.673 c0.12,0.044,0.241,0.089,0.362,0.134c0.388,0.225,0.627,0.543,0.66,1.007c0.008,0.121,0.043,0.281,0.125,0.348 c0.764,0.617,0.631,1.637,1.09,2.389c0.103,0.166,0.086,0.478,0.396,0.346c0.233-0.1,0.155-0.308,0.041-0.479 c-0.076-0.116-0.117-0.235,0.019-0.33c0.147-0.104,0.244,0.036,0.313,0.119c0.629,0.736,1.319,0.679,2.16,0.339 c0.403-0.164,0.901-0.594,1.428-0.142c0.082,0.07,0.185-0.048,0.256-0.128c0.113-0.125,0.052-0.467,0.314-0.375 c0.223,0.077,0.125,0.368,0.145,0.568c0,0.012,0,0.024,0,0.036c0.039,0,0.078,0,0.117-0.001c0.317,0.109,0.681,0.084,0.963,0.299 c0.024,0.035,0.031,0.076,0.039,0.117c0.037-0.021,0.074-0.039,0.113-0.057c0.135-0.133,0.34-0.162,0.5-0.256 c0.184-0.019,0.401-0.048,0.407,0.217c0.006,0.281,0.121,0.5,0.291,0.698c0.16,0.186,0.097,0.374-0.03,0.499 c-0.293,0.289-0.119,0.438,0.127,0.591c0.526,0.529,0.496,1.357,1.012,1.892c0.011,0.285,0.123,0.541,0.313,0.733 c0.431,0.436,0.437,1.084,0.826,1.549c0.174,0.205-0.076,0.424-0.309,0.503c-0.26,0.088-0.529,0.089-0.797-0.005 c-0.146-0.052-0.311-0.259-0.443-0.101c-0.15,0.178,0.064,0.333,0.162,0.484h-0.004c-0.26,0.197,0.023,0.573-0.252,0.765 l-0.001,0.001c-0.174,0.153-0.387,0.231-0.575,0.083c-0.365-0.285-0.802-0.282-1.197-0.245c-0.609,0.056-1.088-0.356-1.666-0.356 c-0.068,0-0.127-0.05-0.154-0.095c-0.404-0.658-1.09-0.989-1.646-1.468c-0.336-0.289-0.518-0.801-0.371-1.395 c0.189-0.759,0.342-1.541,0.396-2.328c-0.056-0.062-0.104-0.129-0.181-0.168c-0.178-0.137-0.387-0.148-0.598-0.157 c-0.139-0.006-0.246-0.053-0.342-0.113c-0.131-0.043-0.262-0.098-0.395-0.166c-0.635-0.326-0.814-0.188-0.851,0.522 c-0.008,0.146-0.008,0.295-0.028,0.44c-0.037,0.271-0.174,0.501-0.445,0.55c-0.287,0.051-0.389-0.216-0.473-0.423 c-0.244-0.596-0.652-0.959-1.31-1.036c-0.138-0.017-0.287-0.089-0.396-0.18c-0.375-0.316-0.692-0.059-0.723,0.224 c-0.064,0.619-0.83,0.429-0.955,0.947c-0.02,0.087-0.227-0.07-0.201-0.199c0.072-0.377-0.061-0.651-0.354-0.878 c-0.057-0.044-0.111-0.16-0.092-0.217c0.232-0.708-0.438-0.579-0.73-0.757c-0.346-0.21-0.691-0.136-0.898,0.308 c-0.139-0.269-0.059-0.501-0.086-0.724c-0.256-0.248-0.082-0.52,0.021-0.734c0.08-0.172,0.125-0.273-0.019-0.405 c-0.004-0.042-0.006-0.083-0.01-0.123c0.402-0.206,0.851-0.005,1.26-0.135c0.002-0.038,0.005-0.075,0.005-0.112 c-0.355-0.182-0.574-0.523-0.882-0.762c-0.039-0.003-0.078-0.006-0.116-0.008c-0.285-0.271-0.521-0.583-0.731-0.912 c0,0.217-0.248,0.327-0.48,0.412c-0.369,0.133-0.73,0.213-1.029,0.525c-0.223,0.234-0.551,0.076-0.807-0.08 c-0.615-0.379-0.965-0.328-1.506,0.18c-0.176,0.166-0.332,0.399-0.629,0.386c-0.871,0.042-0.871,0.042-0.867-0.792 c0-0.172-0.104-0.454-0.223-0.322c-0.423,0.462-0.595-0.024-0.855-0.155c-0.148-0.075-0.287-0.169-0.43-0.255 c-0.316,0.021-0.666-0.074-0.896,0.252c-0.381,0.641-0.379,0.639-0.854,0.006c-0.072-0.096-0.166-0.2-0.273-0.242 c-0.42-0.164-0.469-0.385-0.146-0.694c0.15-0.144,0.287-0.383,0.053-0.462c-0.768-0.26-0.778-1.3-1.647-1.486 c-0.373-0.08-0.041-0.496,0.024-0.753c-0.717-0.014-1.364-0.301-2.057-0.198c-0.197,0.029-0.271-0.135-0.289-0.333 c-0.045-0.505,0.389-0.715,0.644-1.022c0.092-0.113,0.317,0.038,0.356,0.23c0.043,0.21,0.152,0.235,0.314,0.15 c0.092-0.047,0.221-0.099,0.244-0.175c0.059-0.192-0.139-0.216-0.252-0.301c-0.322-0.245-0.807-0.346-0.912-0.792 c-0.02-0.008-0.039-0.015-0.057-0.022c-0.058-0.008-0.113-0.014-0.172-0.02c-0.099-0.077-0.17-0.157-0.228-0.24 c-0.063-0.027-0.119-0.07-0.146-0.163c-0.063-0.225,0.086-0.387,0.246-0.525c0.043-0.037,0.088-0.073,0.131-0.11 c0.029-0.096,0.053-0.194,0.076-0.292c-0.549,0.246-0.934,0.664-1.176,1.239c-0.053,0.125-0.188,0.195-0.328,0.124 c0.193,0.156,0.383,0.342,0.586,0.511c0.096,0.08,0.195,0.169,0.248,0.283c0.08,0.168,0.305,0.446,0.119,0.514 c-0.623,0.228-0.148,1.218-0.908,1.257c-0.43,0.022-0.541,0.173-0.383,0.541c0.117,0.273,0.053,0.553,0.064,0.829 c0.062,0,0.127,0.013,0.186,0.049c0.348,0.216,0.709,0.458,0.734,0.933c0.023,0.429-0.146,0.706-0.578,0.884 c-0.699,0.29-1.072,0.885-1.26,1.603c-0.014,0.004-0.025,0.001-0.039,0.002c0.34,0.806-0.504,1.961-1.375,1.758 c-0.229-0.053-0.459-0.034-0.689-0.003c-0.811,0.11-1.098,0.798-0.605,1.461c0.221,0.297,0.527,0.461,0.869,0.596 c0.646,0.255,0.701,0.467,0.324,1.047c-0.211,0.326-0.092,0.587,0.311,0.763c0.193,0.084,0.408,0.139,0.531,0.37 c0.062,0.111,0.176,0.228,0.076,0.305c-0.277,0.215-0.551,0.42-0.799,0.678c-0.15,0.158-0.369,0.042-0.566-0.031 c0,0.004,0,0.008,0,0.012c0.006,0.077-0.006,0.151-0.006,0.227c0.129,0.333,0.295,0.29,1.006,0.093 c0.063,0.157,0.207,0.234,0.328,0.331c0.34,0.269,0.32,0.583-0.072,1.054c-0.196,0.108-0.452,0.13-0.583,0.34 c-0.105,0.168-0.412,0.226-0.33,0.482c0.076,0.236,0.367-0.104,0.525,0.235c-0.467,0.081-0.887,0.291-1.355,0.323 c-0.084,0.09-0.178,0.177-0.268,0.251c-0.396,0.033-0.813,0.349-1.191-0.059c-0.004-0.07,0.002-0.136,0.004-0.203 c-0.396-0.073-0.795,0.013-1.193,0.022c-0.039,0.078-0.078,0.156-0.127,0.25c-0.346,0.096-0.68,0.209-0.883,0.539 c-0.033,0.055-0.08,0.131-0.127,0.133c-0.779,0.049-1.512,0.615-2.324,0.274c-0.002,0.003-0.003,0.006-0.004,0.009 c0.012,0.029,0.025,0.06,0.035,0.085c0.189,0.478,0.54,0.617,0.997,0.544c0.651-0.103,1.067,0.128,1.222,0.784 c0.123,0.404,0.037,0.724-0.332,0.98c-0.443,0.309-0.776,0.809-1.424,0.707c-0.221-0.035-0.232,0.143-0.244,0.301 c0,0.26-0.231,0.334-0.383,0.473c-0.27,0.103-0.383,0.35-0.512,0.572c-0.268,0.469-0.232,0.537,0.299,0.59 c0.398,0.041,0.743,0.252,1.14,0.314c0.317,0.051,0.22,0.348,0.243,0.598c0.039-0.293,0.279-0.246,0.469-0.27 c0.609-0.072,1.211,0.09,1.82,0.047c0.186-0.013,0.357,0.092,0.348,0.285c-0.043,0.854,0.633,1.139,1.193,1.453 c1.047,0.59,1.064,0.559,1.287,1.672c0.283-0.344,0.291-0.805,0.646-1.081c0.453-0.353,0.605-0.349,0.801,0.179 c0.068,0.188,0.285,0.328,0.201,0.57c-0.004,0.09-0.002,0.18-0.022,0.268c-0.011,0.006-0.017,0.017-0.024,0.021 c0.518,0.216,0.834,0.58,1.077,1.164c0.396,0.943,0.354,1.794,0.007,2.689c-0.113,0.289-0.188,0.627-0.548,0.627 c0,0.002,0.002,0.004,0.002,0.006c-0.01,0.096-0.006,0.187-0.01,0.279c0.144,0.37,0.129,0.821,0.532,1.061 c0.197,0.115,0.369,0.271,0.554,0.408c0.692,0.022,1.271,0.234,1.59,0.916c0.146,0.304,0.408,0.438,0.752,0.488 c0.41,0.061,0.834,0.117,1.191,0.367c-0.101,0.826-0.072,1.072,0.293,1.973c0.147,0.367,0.225,0.713-0.037,1.057 c0,0.025-0.002,0.054-0.002,0.08c0.041-0.004,0.08-0.014,0.121,0.002c0.312,0.543,0.25,0.98-0.341,1.455 c-0.405,0.328-0.731,0.752-1.209,0.998c-0.297,0.152-0.34,0.33-0.143,0.652c0.166,0.273,0.635,0.625,0.055,0.979 c-0.123,0.111-0.268,0.209-0.367,0.339c-0.36,0.461-0.797,0.633-1.381,0.476c-0.551-0.146-1.073-0.074-1.524,0.325 c-0.254,0.226-0.418,0.42,0.063,0.537c0.174,0.041,0.355,0.063,0.304,0.299c-0.046,0.19-0.218,0.265-0.392,0.248 c-0.205-0.021-0.406-0.088-0.608-0.135c-0.313-0.072-0.621-0.052-0.76,0.269c-0.215,0.495-0.611,0.475-1.002,0.377 c-0.51-0.129-1.016-0.265-1.545-0.185c-0.307,0.047-0.439-0.33-0.74-0.276c-0.24-0.025-0.465-0.135-0.695-0.213 c0.025,0.01,0.053,0.018,0.076,0.03c0.199,0.103,0.42,0.176,0.604,0.313c0.145,0.231,0.234,0.492,0.314,0.754 c0.01,0.176,0.078,0.303,0.27,0.342c0.17,0.033,0.229,0.148,0.213,0.316c-0.018,0.186-0.146,0.237-0.295,0.271 c-0.203,0.047-0.398,0.123-0.6,0.172c-0.309,0.073-0.523,0.181-0.529,0.56c-0.004,0.229-0.195,0.401-0.363,0.563 c-0.148,0.142-0.357,0.303-0.225,0.524c0.121,0.201,0.338,0.07,0.516,0.033c0.49-0.102,1.004-0.148,1.244-0.699 c0.033-0.08,0.146-0.059,0.23-0.059c0.547-0.092,0.881,0.17,1.049,0.666c0.207,0.607-0.053,0.938-0.709,0.986 c-0.613,0.045-1.156,0.346-1.721,0.559c-0.254,0.096-0.314,0.42-0.168,0.592c0.639,0.752,0.313,1.424-0.102,2.105 c-0.084,0.082-0.168,0.166-0.25,0.248c-0.293-0.287-0.629-0.484-1.051-0.498c-0.742-0.023-0.963-0.713-1.396-1.121 c-0.149-0.141,0.1-0.225,0.226-0.27c0.359-0.125,0.369-0.351,0.2-0.637c-0.247-0.423-0.41-0.869-0.382-1.369 c-0.39-0.093-0.641-0.211-0.231-0.625c0.23-0.232,0.509-0.494,0.141-0.877c-0.176-0.185-0.12-0.455,0.106-0.593 c0.15-0.091,0.285-0.208,0.43-0.308c-0.354,0-0.677-0.053-0.852-0.551c-0.107-0.307-0.541-0.276-0.85-0.162 c-0.228,0.086-0.531,0.179-0.508,0.484c0.025,0.344,0.262,0.57,0.609,0.627c0.199,0.033,0.349,0.133,0.502,0.246 c0.328,0.24,0.302,0.477-0.077,0.568c-0.362,0.088-0.619,0.219-0.687,0.607c0,0.002-0.039,0.002-0.055-0.006 c-0.018-0.009-0.029-0.029-0.044-0.043c-0.821,0.036-0.854,0.073-0.877,1.004c0.001,0.041,0.003,0.082,0.005,0.123 c0.266-0.056,0.504,0.063,0.75,0.129c0.393,0.896,0.334,0.975-0.754,1.012c0.002,0.123,0.004,0.248,0.006,0.371 c0.476,0.084,0.854,0.125,0.707,0.856c-0.101,0.498,0.084,1.138,0.701,1.425c0.178,0.082,0.367,0.2,0.268,0.422 c-0.101,0.223-0.25-0.056-0.374-0.019c-0.694,0.213-1.417-0.174-2.122,0.153c-0.462,0.217-1.24,0.041-1.637-0.25 c-0.007-0.004-0.015-0.008-0.021-0.014c-0.073-0.056-0.137-0.113-0.177-0.176c-0.002-0.039-0.004-0.078-0.007-0.119 c-0.042,0.094-0.117,0.184-0.122,0.279c-0.052,1.096-0.268,1.277-1.395,1.148c-0.082-0.01-0.163-0.027-0.244-0.043 c-0.152-0.498-0.503-0.73-1.01-0.754c-0.406-0.029-0.786-0.117-1.018-0.502c-0.475-0.209-0.951-0.412-1.421-0.631 c-0.088-0.041-0.215-0.148-0.21-0.216c0.046-0.606-0.382-0.635-0.809-0.731c-0.578-0.133-0.875-0.685-1.33-1.008 c-0.172-0.121-0.061-0.367,0.039-0.521c0.22-0.339,0.105-0.562-0.161-0.812c-0.37-0.346-0.546-1.496-0.347-1.949 c0.138-0.312,0.438-0.271,0.695-0.332c-0.422-0.211-0.668-0.53-0.748-1.014c-0.07-0.426-0.512-0.592-0.837-0.32 c-0.169,0.142-0.31,0.23-0.493,0.121c-0.289-0.172-0.401,0.021-0.453,0.228c-0.052,0.213,0.045,0.371,0.311,0.342 c0.333-0.036,0.328,0.125,0.25,0.386c-0.276,0.922-0.268,0.922-1.232,0.682c-0.436-0.107-0.665,0.059-0.586,0.52 c0.08,0.465,0.24,0.928,0.078,1.398c-0.124,0.363-0.234,0.762-0.785,0.426c-0.39-0.24-0.55,0.002-0.5,0.379 c0.039,0.301-0.021,0.449-0.352,0.406c-0.193-0.023-0.295,0.125-0.419,0.24c-0.517,0.471-0.584,0.445-0.734-0.256 c-0.017-0.084-0.036-0.166-0.054-0.248c-0.182-0.56-0.621-0.963-0.888-1.479c-0.283-0.545-0.897-0.685-1.509-0.664 c-0.107,0.229-0.238,0.438,0.022,0.679c0.171,0.155,0.224,0.396,0.175,0.746c-0.742-0.607-1.558-0.906-2.469-0.916 c1.357,2.869,2.94,5.604,4.751,8.207c5.829,8.371,12.625,13.359,20.385,14.975C21.471,103.266,0.75,80.787,0.75,53.557 c0-27.258,20.76-49.755,47.299-52.519C40.623,2.569,34.08,7.193,28.42,14.911c0.638,0.104,1.218-0.22,1.828-0.325 c0.368-0.063,0.694-0.153,0.918-0.476c0.035-0.051,0.12-0.13,0.134-0.122c0.623,0.401,1.084-0.205,1.631-0.26 c0.154-0.015,0.257,0.065,0.26,0.208c0.011,0.708,0.352,0.309,0.581,0.165c0.173-0.108,0.31-0.272,0.511-0.456 c-0.319-0.182-0.604-0.346-0.891-0.507c-0.112-0.064-0.223-0.134-0.223-0.28c0-0.18,0.133-0.266,0.282-0.288 c0.563-0.086,1.014-0.565,1.706-0.292c0.449,0.177,1.008-0.048,1.197-0.652c0.164-0.523,0.664-0.603,1.067-0.804 c0.44-0.22,0.951-0.312,1.166-0.864c0.118-0.304,0.484-0.304,0.755-0.402c1.118-0.41,2.238-0.816,3.363-1.209 c0.383-0.134,0.791-0.079,1.189-0.094c0.249-0.009,0.52,0.025,0.697-0.207c0.139-0.181,0.317-0.366,0.516-0.192 c0.252,0.22,0.697,0.269,0.715,0.718c0.008,0.188-0.005,0.378-0.008,0.567c0.93,0.733,1.135,1.997,2.021,2.764 c0.229,0.199,0.193,0.453,0.042,0.682c-0.103,0.154-0.241,0.284-0.368,0.421c-0.178,0.189-0.493,0.314-0.388,0.649 c0.042,0.132,0.12,0.211,0.212,0.27c0.082-0.056,0.167-0.108,0.247-0.167c0.308-0.154,0.612-0.029,0.917,0.011 c0.166,0.021,0.395,0.144,0.484,0.027c0.295-0.392,0.793-0.469,1.117-0.757c0.326-0.292,0.525-0.299,0.803-0.036 c0.211,0.201,0.418,0.395,0.525,0.692c0.117,0.324,0.535,0.35,0.705,0.06c0.119-0.206,0.365-0.197,0.531-0.381 c-0.074-0.279-0.502-0.392-0.422-0.768c0.049-0.243,0.24-0.387,0.359-0.582c0.166-0.277,0.441-0.291,0.719-0.293 c0.455-0.003,0.875-0.099,1.211-0.434c0.656-0.144,1.018,0.357,1.391,0.714c0.717,0.684,1.438,1.058,2.439,0.604 c0.373-0.169,0.732,0.125,1.008,0.381c0.193,0.178,0.148,0.371-0.129,0.478c-0.359,0.14-0.709,0.261-1.098,0.097 c-0.146-0.062-0.306-0.168-0.48-0.022c0.074,0.271,0.344,0.349,0.514,0.521c-0.082,0.125-0.162,0.25-0.244,0.375 c-0.315,0.082-0.664,0.215-0.549,0.598c0.098,0.326,0.479,0.25,0.762,0.247c0.185-0.002,0.384-0.242,0.545,0.04 c-0.594,0.091-1.149,0.354-1.774,0.32c-0.282-0.015-0.539-0.045-0.771-0.207c-0.229-0.161-0.438-0.181-0.692-0.017 c-0.403,0.257-0.918,0.101-1.147-0.313c-0.063-0.109-0.093-0.239-0.166-0.336c-0.131-0.17-0.321-0.185-0.517-0.119 c-0.105,0.036-0.197,0.111-0.178,0.228c0.057,0.317,0.342,0.003,0.49,0.2c-0.393,0.437-0.297,0.79,0.253,1.038 c0.224,0.101,0.328,0.258,0.328,0.543c0,0.685,0.258,0.919,0.957,0.93c0.693,0.011,1.39-0.026,2.08,0.005 c0.354,0.016,0.779,0.001,0.717,0.616c-0.012,0.106,0.466,0.303,0.736,0.389c0.324,0.102,0.656,0.182,0.977,0.303 c0.06-0.052,0.13-0.095,0.228-0.105c0.181-0.002,0.359-0.023,0.529,0.054c0.368,0.09,0.606,0.431,0.978,0.521 c0.137,0.122,0.344,0.222,0.436,0.047c0.316-0.602,0.779-0.303,1.199-0.236c0.354,0.058,0.692,0.303,0.869-0.317 c0.09-0.32,0.534-0.243,0.812-0.065c0.168,0.108,0.291,0.252,0.477,0.053c0.631,0,1.232,0.063,1.512,0.761 c0.056,0.114,0.107,0.229,0.166,0.341c0.132,0.25,0.191,0.665,0.566,0.55c0.416-0.127,1.043,0.047,1.164-0.639v-0.002 c0.592,0.152,1.125,0.517,1.764,0.511c-0.063,0.108-0.106,0.237-0.194,0.319c-0.224,0.207-0.556,0.354-0.367,0.751 c0.19,0.412,0.519,0.643,0.976,0.683c0.25,0.021,0.51,0.01,0.748,0.076c0.422,0.118,0.864,0.253,1.008,0.748 c0.188,0.649,0.621,0.844,1.248,0.706c0.41-0.134,0.799-0.181,1.178,0.128c0.182,0.149,0.443,0.113,0.672,0.066 c0.736-0.153,1.346,0.063,1.768,0.673c0.285,0.412,0.563,0.433,0.926,0.145c0.64,0.017,1.244,0.14,1.754,0.561 c0.23,0.188,0.507,0.178,0.775,0.189c0.24,0.297,0.59,0.291,0.916,0.312c0.359,0.023,0.645,0.149,0.846,0.451 c0.83,0.324,1.656,0.654,2.49,0.97c0.109,0.042,0.219,0.083,0.32,0.136c0.049-0.13,0.094-0.261,0.123-0.399 c0.066-0.308,0.234-0.554,0.596-0.508c0.359,0.046,0.514-0.098,0.615-0.435c0.094-0.306,0.354-0.43,0.691-0.412 c0.309,0.016,0.485,0.126,0.588,0.429c0.057,0.164,0.193,0.314,0.381,0.535c-0.537-0.671-0.725-1.406-1.027-2.078 c-0.205-0.46-0.762-0.494-0.887-0.969c-0.123-0.467-0.047-1.015-0.459-1.374c-0.441-0.384-0.213-0.803-0.107-1.219 c0.029-0.117,0.152-0.13,0.256-0.151c0.021,0.003,0.033,0.014,0.053,0.018c0.017-0.104-0.098-0.168-0.211-0.23v-0.655 c0.646,0.533,1.257,0.965,1.773,1.486c0.393,0.394,0.893,0.622,1.291,0.992c0.354,0.327,0.133,0.398-0.174,0.451 c0.004,0.125,0.01,0.25,0.016,0.374c-0.051,0.139-0.104,0.275-0.147,0.415c-0.099,0.314-0.244,0.438-0.522,0.16 c-0.119-0.117-0.285-0.277-0.431-0.13c-0.156,0.158,0.041,0.307,0.146,0.422c0.248,0.275,0.717,0.46,0.34,0.958 c-0.014,0.018,0.014,0.099,0.039,0.109c0.688,0.257,0.766,1.233,1.588,1.343c0.285,0.038,0.381,0.229,0.248,0.512 c-0.107,0.229-0.096,0.475,0.104,0.637c0.23,0.187,0.242-0.128,0.361-0.203c0.086-0.053,0.176-0.041,0.219,0.041 c0.119,0.222,0.285,0.485,0.098,0.703c-0.268,0.314-0.346,0.587-0.111,0.953c0.111,0.174,0.058,0.314-0.215,0.288 c-0.424-0.042-0.438,0.307-0.504,0.587c-0.09,0.378,0.187,0.349,0.431,0.444c0.309,0.121,0.416,0.479,0.602,0.75 c0.302,0.44,0.302,0.955,0.486,1.417c0.08,0.198,0.058,0.418-0.152,0.564c-0.442,0.31-0.549,0.778-0.561,1.273 c-0.019,0.712-0.183,1.383,0.139,2.14c0.271,0.642,0.779,0.712,1.205,0.947c0.799,0.441,1.08,0.835,0.858,1.712 c-0.086,0.341-0.09,0.64,0.011,0.974c0.146,0.485,0.409,0.963,0.127,1.5c-0.078,0.152,0.063,0.318,0.194,0.433 c0.623,0.536,0.625,1.19,0.363,1.896C94.143,44.047,94.102,44.088,94.044,44.114z M46.564,91.338c0,0,0.001,0.004,0,0.004 c-0.783,0.479-1.594,0.807-2.52,0.416c-0.193-0.082-0.398-0.252-0.592-0.148c-0.593,0.311-0.811-0.066-0.967-0.508 c-0.15-0.422-0.535-0.689-0.722-1.117c0.456-0.143,0.824,0.271,1.079,0.234c0.575-0.084,1.251,0.018,1.73-0.438 c0.333-0.317,0.477-0.399,0.593,0.168c0.133,0.653,0.794,0.912,1.403,0.631c0.041,0.002,0.083,0.002,0.124,0.002 c0.226,0.17,0.186,0.356-0.016,0.483C46.549,91.148,46.482,91.195,46.564,91.338z M45.541,97.131 c0.047,0.579-0.239,0.842-0.991,0.899c-0.127-0.084-0.254-0.168-0.381-0.255c-0.114-0.161-0.286-0.237-0.457-0.319 c-0.296-0.146-0.354-0.401-0.281-0.688c0.076-0.293,0.35-0.256,0.567-0.283c0.142-0.02,0.292,0.031,0.436,0.016 C45.291,96.41,45.493,96.521,45.541,97.131z M37.369,94.389c-0.008,0.27-0.244,0.293-0.463,0.321 c-0.225-0.022-0.52-0.063-0.49-0.34c0.027-0.265,0.357-0.229,0.566-0.274C37.191,94.053,37.374,94.16,37.369,94.389z">
                        </path>
                      </g>
                      </g>
                    </g>
                  </svg>
                  )}
            </button>
            <button
              className="bi bi-alarm"
              title="notification"
            >
              {/* {notificationCount > 0 &&
                <div className="notification_count" >
                  {notificationCount}
                </div>
              } */}
              <svg
                height="200px"
                width="200px"
                version="1.1"
                id="_x32_"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
                fill="white"
              >
                <g id="SVGRepo_bgCarrier" strokeWidth="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <style type="text/css">
                    {`.st0 { fill: white;}`}
                  </style>
                  <g>
                    <path
                      className="st0"
                      d="M184.329,21.984C168.143,2.924,142.137-4.62,118.261,2.835C96.374,10.718,79.518,22.776,66.337,33.59 l-6.486-7.657c4.442-3.771,4.992-10.45,1.212-14.917c-3.78-4.458-10.467-4.992-14.909-1.212L30,23.503 c-4.442,3.78-4.992,10.459-1.212,14.917c3.78,4.45,10.467,5,14.91,1.22l6.663,7.842C39.183,57.926,27.27,71.05,17.707,88.189 c-11.242,22.339-8.028,49.227,8.158,68.304l14.408,16.96L198.722,38.962L184.329,21.984z"
                    ></path>
                    <path
                      className="st0"
                      d="M494.311,88.189c-9.579-17.147-21.492-30.272-32.678-40.723l6.647-7.826c4.458,3.78,11.13,3.23,14.926-1.22 c3.78-4.458,3.23-11.138-1.212-14.917L465.841,9.804c-4.458-3.78-11.146-3.246-14.926,1.212c-3.78,4.467-3.215,11.146,1.228,14.917 l-6.486,7.641c-13.19-10.807-30.045-22.857-51.917-30.74c-23.875-7.455-49.881,0.088-66.051,19.149l-14.425,16.977l158.464,134.492 l14.393-16.96C502.307,137.416,505.538,110.528,494.311,88.189z"
                    ></path>
                    <path
                      className="st0"
                      d="M85.632,493.556c-1.583,2.278-1.114,5.387,1.083,7.084l13.278,10.274c2.18,1.704,5.33,1.365,7.107-0.744 l37.072-41.586l-26.475-20.474L85.632,493.556z"
                    ></path>
                    <path
                      className="st0"
                      d="M394.29,448.109l-26.459,20.474l37.056,41.586c1.793,2.108,4.942,2.447,7.123,0.744l13.278-10.274 c2.181-1.696,2.649-4.806,1.066-7.084L394.29,448.109z"
                    ></path>
                    <path
                      className="st0"
                      d="M256.001,81.21c-54.694-0.016-104.383,22.219-140.211,58.063c-35.86,35.828-58.087,85.524-58.071,140.212 c-0.016,54.703,22.211,104.39,58.071,140.21c35.828,35.86,85.516,58.096,140.211,58.079 c54.712,0.017,104.383-22.219,140.212-58.079c35.844-35.82,58.087-85.508,58.07-140.21c0.016-54.687-22.227-104.383-58.07-140.212 C360.384,103.429,310.713,81.195,256.001,81.21z M413.447,295.784c-9.013,0-16.331-7.285-16.331-16.283 c0-8.998,7.318-16.275,16.331-16.275c8.974,0,16.251,7.277,16.251,16.275C429.698,288.498,422.421,295.784,413.447,295.784z M243.87,278.556l2.747-94.013c0-5.194,4.2-9.402,9.384-9.402c5.201,0,9.418,4.208,9.418,9.402l2.383,82.124l60.276,1.276 c5.864,0,10.628,4.749,10.628,10.613c0,5.871-4.765,10.636-10.628,10.636l-72.077,1.51 C249.313,290.703,243.87,285.26,243.87,278.556z M256.001,138.37c-9.005,0-16.266-7.294-16.266-16.299 c0-9.014,7.262-16.283,16.266-16.283c9.014,0,16.291,7.269,16.291,16.283C272.292,131.076,265.015,138.37,256.001,138.37z M256.001,420.616c9.014,0,16.291,7.293,16.291,16.298c0,9.014-7.277,16.283-16.291,16.283c-9.005,0-16.266-7.269-16.266-16.283 C239.734,427.909,246.996,420.616,256.001,420.616z M156.197,179.714c-6.372,6.348-16.67,6.364-23.034,0 c-6.348-6.389-6.348-16.678,0-23.051c6.364-6.348,16.662-6.365,23.034,0C162.578,163.051,162.578,173.357,156.197,179.714z M133.179,379.288c6.373-6.34,16.703-6.34,23.043,0c6.348,6.365,6.372,16.687,0,23.035c-6.397,6.389-16.695,6.372-23.067,0.024 C126.839,395.991,126.806,385.668,133.179,379.288z M355.78,379.28c6.364-6.325,16.662-6.348,23.034,0 c6.372,6.388,6.372,16.702,0,23.05c-6.372,6.349-16.67,6.372-23.034,0C349.44,395.942,349.44,385.653,355.78,379.28z M378.847,179.714c-6.372,6.372-16.702,6.356-23.051,0c-6.34-6.349-6.364-16.67,0-23.044c6.372-6.364,16.703-6.348,23.051,0 C385.187,163.044,385.212,173.35,378.847,179.714z M98.579,295.784c-9.014,0-16.291-7.285-16.291-16.283 c0-8.998,7.277-16.275,16.291-16.275c9.005,0,16.306,7.277,16.306,16.275C114.87,288.498,107.584,295.784,98.579,295.784z"
                    ></path>
                  </g>
                </g>
              </svg>

              {/* {showNotification &&
                <div className={`notification-container ${showNotification ? "fadeOutAnimation" : "fadeInAnimation"}`}>
                  {userId !== null &&
                    <Notifier userId={userId} />
                  }
                </div>

              } */}
            </button>
            <button
              onClick={() => userLogOut()}
              className="bi bi-gear-fill"
              aria-label="log out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                fill="currentColor"
                className="bi bi-gear-fill"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.405 1.05c-.413-1.4-2.397-1.4-2.81 0l-.1.34a1.464 1.464 0 0 1-2.105.872l-.31-.17c-1.283-.698-2.686.705-1.987 1.987l.169.311c.446.82.023 1.841-.872 2.105l-.34.1c-1.4.413-1.4 2.397 0 2.81l.34.1a1.464 1.464 0 0 1 .872 2.105l-.17.31c-.698 1.283.705 2.686 1.987 1.987l.311-.169a1.464 1.464 0 0 1 2.105.872l.1.34c.413 1.4 2.397 1.4 2.81 0l.1-.34a1.464 1.464 0 0 1 2.105-.872l.31.17c1.283.698 2.686-.705 1.987-1.987l-.169-.311a1.464 1.464 0 0 1 .872-2.105l.34-.1c1.4-.413 1.4-2.397 0-2.81l-.34-.1a1.464 1.464 0 0 1-.872-2.105l.17-.31c.698-1.283-.705-2.686-1.987-1.987l-.311.169a1.464 1.464 0 0 1-2.105-.872zM8 10.93a2.929 2.929 0 1 1 0-5.86 2.929 2.929 0 0 1 0 5.858z"
                />
              </svg>
            </button>
          </nav>
        </header>

        <section className="sub-header-container">
          <div className="sub-header">
            <div className="route-headlings">
              <div className="route-headlings-item">
                <p>{dashboardBtnType} ⫸ {dashboardBtnRoute}</p>
                <button>Daily</button>
              </div>
            </div>
            <div className="sub-routes">
              <div className="sub-routes-nav">
                {dashboardRouteOptionsQuery.routeOptions.map((name, index) => (
                  <button
                    key={index}
                    onClick={() => {

                      const activeRouteText = dashboardRouteOptionsQuery.routeOptions[index]; // Get corresponding activeRouteOption
                      const activeRoute = dashboardRouteOptionsQuery.activeRouteOptions[index]; // Get corresponding activeRouteOption
                      setDashboardBtnRoute(activeRouteText)
                      setActiveDashboardBtnRoute(activeRoute); // Updates the active route
                      handleClick(activeDashboardBtn, activeRoute); // Passes the correct active button and active route
                    }}
                    className={activeDashboardBtnRoute === dashboardRouteOptionsQuery.activeRouteOptions[index] ? "activeBtn" : ""}
                  >
                    {name}
                  </button>
                ))}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push("/Add_New_Task")
                  }}
                >
                  New Task
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="all-task">
          <div className="task">
            <div className="task-list">
              {userTask}
            </div>
          </div>
        </section>

        <section className="footer">
          <div className="weekly-review">
            {weeklyData}
          </div>

          <div className="ignored">
            {userDeletedFiles}
          </div>
        </section>
      </section>
    </div>
  )
}