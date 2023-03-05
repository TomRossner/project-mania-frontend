export const defaultStageProperties = {
    stage_name: "New Stage",
    description: "",
    stage_tasks: [],
    created_at: new Date(),
    edit_active: false,
    options_menu_open: false,
    tasks_done: 0
}
  
export const defaultStages = [
    {...defaultStageProperties, stage_name: 'Stage #1'},
    {...defaultStageProperties, stage_name: 'Stage #2'},
    {...defaultStageProperties, stage_name: 'Stage #3'}
]
  
export const boardProperties = {
    stages: [...defaultStages],
    members: [],
    due_date: new Date().toDateString(),
    title: "New Board",
    subtitle: "",
}

export const defaultTaskProperties = {
    created_at: new Date(),
    current_stage: {
        name: "",
        id: ""
    },
    project: {
        title: "",
        id: ""
    },
    title: "New Task",
    due_date: new Date().toDateString(),
    isDone: false,
    edit_active: false,
    files: [],
    description: "",
    priority: "low",
    subtitle: ""
}