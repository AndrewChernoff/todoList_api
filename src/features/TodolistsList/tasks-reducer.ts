import { RequestStatusType } from './../../app/app-reducer';
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistsActionType} from './todolists-reducer'
import {TaskPriorities, TaskStatuses, TaskType, todolistsAPI, UpdateTaskModelType} from '../../api/todolists-api'
import {Dispatch} from 'redux'
import {AppRootStateType} from '../../app/store'
import { setErrorAC, SetErrorACType, setStatusAC, SetStatusACType } from '../../app/app-reducer'
import { errorMessageUtil, handleServerError } from '../../utils/errorMessageUtil'

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
    switch (action.type) {
        case 'REMOVE-TASK':
            return {...state, [action.todolistId]: state[action.todolistId].filter(t => t.id !== action.taskId)}
        case 'ADD-TASK':
            return {...state, [action.task.todoListId]: [action.task, ...state[action.task.todoListId]]}
        case 'UPDATE-TASK':
            return {
                ...state,
                [action.todolistId]: state[action.todolistId]
                    .map(t => t.id === action.taskId ? {...t, ...action.model} : t)
            }
        case 'ADD-TODOLIST':
            return {...state, [action.todolist.id]: []}
        case 'REMOVE-TODOLIST':
            const copyState = {...state}
            delete copyState[action.id]
            return copyState
        case 'SET-TODOLISTS': {
            const copyState = {...state}
            action.todolists.forEach(tl => {
                copyState[tl.id] = []
            })
            return copyState
        }
        case 'SET-TASKS':
            let tasks: any = action.tasks.map(t => ({...t, entityStatus: 'idle'}))            
            return {...state, [action.todolistId]: tasks}

        case 'SET-ENTITY-STATUS': {
            console.log(state[action.todolistId]/* state["81b5dd2d-0832-4f66-bb12-e1497bc1b3d3"] */);
                return {...state, 
                    [action.todolistId]: 
                    state[action.todolistId].map(task => task.id === action.taskId? {...task, entityStatus: action.status} : task)}
                }

        default:
            return state
    }
}

// actions
export const removeTaskAC = (taskId: string, todolistId: string) =>
    ({type: 'REMOVE-TASK', taskId, todolistId} as const)
export const addTaskAC = (task: TaskType) =>
    ({type: 'ADD-TASK', task} as const)
export const updateTaskAC = (taskId: string, model: UpdateDomainTaskModelType, todolistId: string) =>
    ({type: 'UPDATE-TASK', model, todolistId, taskId} as const)
export const setTasksAC = (tasks: Array<TaskType>, todolistId: string) =>
    ({type: 'SET-TASKS', tasks, todolistId} as const)
export const setEntityStatusAC =  (todolistId: string, taskId: string, status: RequestStatusType) =>
    ({type: 'SET-ENTITY-STATUS',  todolistId, taskId, status} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    todolistsAPI.getTasks(todolistId)
        .then((res) => {
            const tasks = res.data.items
            const action = setTasksAC(tasks, todolistId)
            dispatch(action)
            dispatch(setStatusAC('succeeded'))
        })
}
export const removeTaskTC = (taskId: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    dispatch(setEntityStatusAC(todolistId, taskId, 'loading'))///
    todolistsAPI.deleteTask(todolistId, taskId)
        .then(res => {
            if(res.data.resultCode === 0) {
                const action = removeTaskAC(taskId, todolistId)
                dispatch(action)
                dispatch(setStatusAC('idle'))            
            } else {
                handleServerError(dispatch, res.data)
            }
        }).catch((error) => {
            errorMessageUtil(dispatch, error.message)
        })
}
export const addTaskTC = (title: string, todolistId: string) => (dispatch: Dispatch<ActionsType>) => {
    dispatch(setStatusAC('loading'))
    //dispatch(setEntityStatusAC(todolistId, null,'loading'))///

    todolistsAPI.createTask(todolistId, title)
        .then(res => {
                if(res.data.resultCode === 0) {
                    const task = res.data.data.item
                    const action = addTaskAC(task)
                    dispatch(action)
                    dispatch(setStatusAC('idle'))  
                    //dispatch(setEntityStatusAC(todolistId, 'idle'))///          
                } else {
                    handleServerError(dispatch, res.data)
                }
            })
            .catch((error) => {
                errorMessageUtil(dispatch, error.message)
            })
}
export const updateTaskTC = (taskId: string, domainModel: UpdateDomainTaskModelType, todolistId: string) =>
    (dispatch: Dispatch<ActionsType>, getState: () => AppRootStateType) => {
        dispatch(setStatusAC('loading'))
        dispatch(setEntityStatusAC(todolistId, taskId, 'loading'))///

        const state = getState()
        const task = state.tasks[todolistId].find(t => t.id === taskId)
        if (!task) {
            //throw new Error("task not found in the state");
            console.warn('task not found in the state')
            return
        }

        const apiModel: UpdateTaskModelType = {
            deadline: task.deadline,
            description: task.description,
            priority: task.priority,
            startDate: task.startDate,
            title: task.title,
            status: task.status,
            ...domainModel
        }

        todolistsAPI.updateTask(todolistId, taskId, apiModel)
            .then(res =>  {
                if(res.data.resultCode === 0) {
                    const action = updateTaskAC(taskId, domainModel, todolistId)
                    dispatch(action)
                    dispatch(setStatusAC('idle'))
                    dispatch(setEntityStatusAC(todolistId, taskId, 'idle'))///                        
                } else {
                    if(res.data.messages.length) {
                        handleServerError(dispatch, res.data)
                    } else {
                        dispatch(setErrorAC('Some error'))
                    }
                }
            })
            .catch((error) => {
                errorMessageUtil(dispatch, error.message)
            })
    }

// types
export type UpdateDomainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatuses
    priority?: TaskPriorities
    startDate?: string
    deadline?: string
}
export type TasksStateType = {
    [key: string]: Array<TaskType>
}
type ActionsType =
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof addTaskAC>
    | ReturnType<typeof updateTaskAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistsActionType
    | ReturnType<typeof setTasksAC>
    | SetStatusACType
    | SetErrorACType
    | ReturnType<typeof setEntityStatusAC>
