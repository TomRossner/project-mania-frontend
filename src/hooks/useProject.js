import {useEffect} from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectBoards } from "../store/boards/boards.selector";
import { selectCurrentProject, selectProject, selectProjectMembers } from "../store/project/project.selector";
import { updateProject, deleteProject } from "../httpRequests/projectsRequests";
import { useNavigate } from "react-router-dom";
import { setBoards } from "../store/boards/boards.actions";
import {deleteTask, addProject} from "../httpRequests/projectsRequests";
import {getUserInfo} from "../httpRequests/auth";
import { selectMembers } from "../store/members/members.selector";
import useAuth from "./useAuth";
import { generateId } from "../utils/IdGenerator";
import {
    setTasks,
    setNotificationTabOpen,
    setProfileTabOpen,
    setCreatePopupOpen,
    setElement,
    setProjectMenuOpen,
    setCurrentProject,
    setProjectMembers,
    setStage,
    setError,
    setErrorPopupOpen,
    setTaskPriority,
    setAdminPassFormOpen
} from "../store/project/project.actions";

const useProject = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const currentProject = useSelector(selectCurrentProject);
    const boards = useSelector(selectBoards);
    const projectMembers = useSelector(selectProjectMembers);
    const members = useSelector(selectMembers);
    const {user} = useAuth();
    const {
        element,
        projectMenuOpen,
        profileTabOpen,
        notificationTabOpen,
        createPopupOpen,
        stage,
        projectMenuTabOpen,
        error,
        errorPopupOpen,
        taskPriority,
        tasks,
        adminFormOpen
    } = useSelector(selectProject);

    const closeCreatePopup = () => dispatch(setCreatePopupOpen(false));

    const handleCreateBoard = () => {
        dispatch(setCreatePopupOpen(true));
        dispatch(setElement("board"));
    }

    const handleCreate = (type) => {
        closeStageOptionMenus();
        dispatch(setElement(type));
        dispatch(setCreatePopupOpen(true));
    }

    const handleRemoveMemberFromProject = (id) => {
        if (!id) return;
        const memberToRemove = projectMembers.find(member => member._id === id);
        if (!memberToRemove) throw new Error("Member not found");
        else dispatch(setProjectMembers(projectMembers.filter(member => member._id !== memberToRemove._id)));
    }

    const handleCreateClick = () => {
        dispatch(setCreatePopupOpen(!createPopupOpen));
        if (projectMenuOpen) dispatch(setProjectMenuOpen(false));
        if (notificationTabOpen) dispatch(setNotificationTabOpen(false));
        if (profileTabOpen) dispatch(setProfileTabOpen(false));
    }

    const validate = (inputValue, stageToUpdate) => {
        if (!inputValue || !stageToUpdate) return;

        return dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
            if (stage._id === stageToUpdate._id) {
                return {...stage, stage_name: inputValue, edit_active: false, stage_tasks: [...stage.stage_tasks.map(task => {
                    return {...task, current_stage: {...task.current_stage, name: inputValue}};
                })]};
            } else return stage;
        })]}));
    }

    const handleToggleProfileTab = () => {
        dispatch(setProfileTabOpen(!profileTabOpen));
        if (notificationTabOpen) dispatch(setNotificationTabOpen(false));
    }

    const handleProjectsClick = () => {
        closeCreatePopup();
        if (notificationTabOpen) dispatch(setNotificationTabOpen(false));
        if (profileTabOpen) dispatch(setProfileTabOpen(false));
    }

    const handleToggleNotificationTab = () => {
        dispatch(setNotificationTabOpen(!notificationTabOpen));
        if (profileTabOpen) dispatch(setProfileTabOpen(false));
    }

    const update = async (project) => {
        if (!project) return;
    
        try {
            await updateProject(project);
        } catch (error) {
            console.log(error);
        }
    }

    const handleAddStage = () => {
        dispatch(setCreatePopupOpen(true));
        dispatch(setProjectMenuOpen(false));
        dispatch(setElement("stage"));
    }

    const handleDeleteProject = async (id) => {
        await deleteProject(id);
        dispatch(setCurrentProject(null));
        dispatch(setBoards([...boards.filter(board => board._id !== currentProject._id)]));
        navigate("/");
    }

    const handleMenuClick = () => {
        dispatch(setProjectMenuOpen(!projectMenuTabOpen));
    }

    const handleAddMember = (member) => {
        if (!member) return;

        const MemberAlreadyAdded = projectMembers.find(m => m._id === member._id);
        if (MemberAlreadyAdded) return;

        else dispatch(setCurrentProject({...currentProject, members: [...currentProject.members, member]}));
    }

    const handleElementClick = (element) => {
        dispatch(setElement(element));
    }

    const closeStageOptionMenus = () => {
        return dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
            if (stage.options_menu_open) {
                return {...stage, options_menu_open: false};
            } else return stage;
        })]}));
    }

    const handleAddTask = (stageToAddTaskTo) => {
        closeStageOptionMenus();
        dispatch(setStage(stageToAddTaskTo));
        dispatch(setCreatePopupOpen(true));
        dispatch(setElement("task"));
    }

    const toggleStageOptions = (stageToUpdate) => {
        if (!stageToUpdate) return;

        const updatedStage = {...stageToUpdate, options_menu_open: !stageToUpdate.options_menu_open}
        return dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
            if (stage.options_menu_open && stage._id !== stageToUpdate._id) {
                return {...stage, options_menu_open: false};
            }
            else if (!stage.options_menu_open && stage._id !== stageToUpdate._id) {
                return stage;
            }
            else return updatedStage;
        })]}));
    }

    const handleDeleteStage = (stageToDelete) => {
        if (!stageToDelete) return;

        closeStageOptionMenus();
        return dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.filter(stage => stage._id !== stageToDelete._id)]}));
    }

    const updateBoards = () => dispatch(setBoards([...boards.map(board => {
        if (board._id === currentProject._id) {
            return {...currentProject};
        } else return board;
    })]))

    const handleMarkAsDone = (task) => {
        dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
          if (stage._id === task.current_stage.id) {
            return {...stage, tasks_done: stage.stage_tasks.filter(t => t.isDone === true).length + 1 , stage_tasks: [...stage.stage_tasks.map(t => {
              if (t._id === task._id) {
                return {...t, isDone: true};
              } else return t;
            })]};
          } else return stage;
        })]}))
    }

    const handleMarkAsNotDone = (task) => {
        dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
          if (stage._id === task.current_stage.id) {
            return {...stage, tasks_done: stage.stage_tasks.filter(t => t.isDone === true).length - 1 , stage_tasks: [...stage.stage_tasks.map(t => {
              if (t._id === task._id) {
                return {...t, isDone: false};
              } else return t;
            })]};
          } else return stage;
        })]}))
    }

    const handleDeleteTask = async (task) => {
        dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(stage => {
          if (stage._id === task.current_stage.id) {
            return {...stage, tasks_done: stage.tasks_done === 0 ? 0 : stage.tasks_done - 1, stage_tasks: [...stage.stage_tasks.filter(t => t._id !== task._id)]}
          } else return stage;
        })]}))
        await deleteTask({id: currentProject._id, stage_id: task.current_stage.id, task_id: task._id});
        dispatch(setTasks([...tasks.filter(t => t._id !== task._id)]));
    }

    const handleAddMembers = (e) => {
        if (!e.target.value) return;
        const newMember = members?.find(member => e.target.value.trim() === member._id);
        if (projectMembers.find(member => newMember._id === member._id)) return;
        if (newMember._id === user._id) return;
        else dispatch(setProjectMembers([...projectMembers, members?.find(member => e.target.value.trim() === member._id)]));
    }

    const addBoard = async (values) => {
        if (values.type !== 'board') return setError("Invalid values. Could not create board");
        if (createPopupOpen) closeCreatePopup();
        try {
            const {data: userInfo} = await getUserInfo(user._id);
            const {data: newProject} = await addProject({...values, members: [...values.members, userInfo], admins: [userInfo]});
            dispatch(setBoards([...boards, {...newProject, due_date: new Date(newProject.due_date).toDateString()}]));
            dispatch(setAdminPassFormOpen(true));
        } catch ({response}) {
            if (response.data.error && response.status === 400) {
                dispatch(setError(response.data.error));
                dispatch(setErrorPopupOpen(true));
            }
        }
    }

    const closeAdminForm = () => dispatch(setAdminPassFormOpen(false));

    const addStage = (values, project) => {
        if (!values || values.type !== 'stage') return dispatch(setError("Invalid values. Could not create stage"));
        if (createPopupOpen) closeCreatePopup();
        const newStage = {...values, project: project.title};
        const projectToAddStage = boards.find(board => board._id === project._id);
        dispatch(setBoards([...boards.filter(board => board._id !== projectToAddStage._id),
            {...projectToAddStage, stages: [...projectToAddStage.stages, newStage]}]));
        if (projectToAddStage._id === currentProject._id) {
            dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages, newStage]}));
        }
    }

    const addTask = (values, stageToUpdate) => {
        if (!values || values.type !== 'task') return setError("Invalid values. Could not create task");
        if (createPopupOpen) closeCreatePopup();
        const newTask = {
            ...values,
            current_stage: {
                name: stageToUpdate.stage_name,
                id: stageToUpdate._id
            },
            project: {
                title: currentProject.title,
                id: currentProject._id
            },
            _id: generateId(),
            messages: [],
            priority: taskPriority
        };
        dispatch(setCurrentProject({...currentProject, stages: [...currentProject.stages.map(current_project_stage => {
                if (current_project_stage._id === stageToUpdate._id) {
                    return {...current_project_stage, stage_tasks: [...current_project_stage.stage_tasks, newTask]}
                } else return current_project_stage;
        })]}))
        dispatch(setTasks([...tasks, newTask]));
    }

    const handleSelectStage = (stage) => {
        return dispatch(setStage(stage));
    }

    const handleSetPriority = (priority=null) => {
        return dispatch(setTaskPriority(priority));
    }

    useEffect(() => {
        if (!currentProject) return;
        update(currentProject);
    
        // Each time currentProject changes update tasks
        const projectTasks = currentProject?.stages.map(stage => {
        return stage.stage_tasks.map(task => task);
        // Each stage is returned as an array, so projectTasks is an array of arrays
        })
        dispatch(setTasks(projectTasks.flatMap(arr => arr)));

        // Update boards every time currentProject changes
        updateBoards();

    }, [currentProject])

    // Reset element every time popup is closed 
    useEffect(() => {
        if (!createPopupOpen) dispatch(setElement(""));
    }, [createPopupOpen])

    // useEffect(() => {
    //     if (currentProject) dispatch(setProjectMembers(currentProject.members));
    // }, [])
    
    return {
        currentProject,
        boards,
        element,
        profileTabOpen,
        projectMembers,
        notificationTabOpen,
        createPopupOpen,
        stage,
        projectMenuTabOpen,
        error,
        errorPopupOpen,
        taskPriority,
        tasks,
        adminFormOpen,
        handleCreateBoard,
        handleCreate, // handleCreate and handleCreateBoard are similar
        handleToggleNotificationTab,
        closeCreatePopup,
        handleCreateClick,
        handleToggleProfileTab,
        handleProjectsClick,
        handleAddStage,
        handleMenuClick,
        handleDeleteProject,
        handleAddMember,
        closeStageOptionMenus,
        handleAddTask,
        validate,
        toggleStageOptions,
        handleDeleteStage,
        handleMarkAsDone,
        handleMarkAsNotDone,
        handleDeleteTask,
        handleRemoveMemberFromProject,
        handleAddMembers,
        addBoard,
        addStage,
        addTask,
        handleSelectStage,
        handleSetPriority,
        handleElementClick,
        closeAdminForm
    }
}

export default useProject;