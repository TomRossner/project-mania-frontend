import ProjectManagement from "./components/ProjectManagement";
import { Route, Routes } from "react-router-dom";
import Projects from "./components/Projects";
import Notifications from "./components/Notifications"
import Profile from "./components/Profile"
import { useContext, useEffect } from "react";
import { ProjectContext } from "./contexts/ProjectContext";
import NotificationTab from "./components/NotificationTab";
import ProfileTab from "./components/ProfileTab";
import Login from "./components/Login";
import Register from "./components/Register";
import ProjectOverview from "./components/ProjectOverview";
import NavBar from "./components/NavBar";
import Task from "./components/Task";
import Create from "./components/Create";
import ErrorPopup from "./components/ErrorPopup";
import Logout from "./components/Logout";
import { useDispatch } from "react-redux";
import { setUser } from "./store/user/user.actions";
import { getUser } from "./httpRequests/auth";

// Styles
import "./styles/main-styles.scss";
import "./styles/nav-styles.scss";
import "./styles/create-styles.scss";
import "./styles/input-styles.scss";
import "./styles/form-styles.scss";
import "./styles/project-overview-styles.scss";
import "./styles/task-overview-styles.scss";
import "./styles/notification-tab-styles.scss";
import "./styles/projects-styles.scss";
import "./styles/profile-tab-styles.scss";
import "./styles/back-button-styles.scss";
import "./styles/progress-bar-styles.scss";
import "./styles/project-info-bar-styles.scss";
import "./styles/project-members-styles.scss";
import "./styles/error-popup-styles.scss";
import "./styles/task-styles.scss";
import "./styles/chat-styles.scss";
import "./styles/chat-message-styles.scss";
import "./styles/project-stages-styles.scss";
import "./styles/spinner-styles.scss";
import "./styles/label-styles.scss";
import "./styles/labels-container-styles.scss";

const App = () => {
  const {notificationTabOpen, profileTabOpen} = useContext(ProjectContext);
  const dispatch = useDispatch();

  useEffect(() => {
    const subscribe = () => {
      dispatch(setUser(getUser()));
    }
    subscribe();
  }, [])

  return (
    <div className='main'>
      <NavBar/>
      <Create/>
      <ErrorPopup/>
      <div className="main-content">
          {notificationTabOpen ? <NotificationTab/> : null}
          {profileTabOpen ? <ProfileTab/> : null}
        <Routes>
        <Route path="/" element={<ProjectManagement/>}/>
        <Route path="/projects" element={<Projects/>}>
          <Route path=":id" element={<ProjectOverview/>}/>
          <Route path=":id/notifications" element={<Notifications/>}/>
          <Route path=":id/:stage_id/:task_id" element={<Task/>}/>
        </Route>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/logout" element={<Logout/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route path="/register" element={<Register/>}/>
        </Routes>
        <div className="flex1"></div>
      </div>
    </div>
  )
}

export default App;