import { setAppStatusAC } from './../../../app/app-reducer';
import { Dispatch } from 'redux'
import { authAPI } from '../../../api/todolists-api'
import { handleServerAppError, handleServerNetworkError } from '../../../utils/error-utils'

type AuthState = {
    isLoggedIn: boolean
    isInitialized: boolean
    userId: number | null

}

type ActionsType = ReturnType<typeof getUserAC> 
 | ReturnType<typeof setIsLoggedInAC> 
 | ReturnType<typeof setIsInitializedAC> 

const initialState: AuthState = {
    isLoggedIn: false,
    isInitialized: false,
    userId: null
}

export const authReducer = (state = initialState, action: ActionsType): AuthState => {
    switch (action.type) {
        case 'SET-USER':
            return {...state, userId: action.userId}
        case 'SET-LOGIN':
            return {...state, isLoggedIn: action.status}
        case 'SET-INIT':
            return {...state, isInitialized: action.status}
        default:
            return state
    }
}

// actions
const getUserAC = (userId: number) =>({type: 'SET-USER', userId}) as const
const setIsLoggedInAC = (status: boolean) =>({type: 'SET-LOGIN', status}) as const
const setIsInitializedAC = (status: boolean) =>({type: 'SET-INIT', status}) as const

// thunks

export const getUserTC =  () => async (dispatch: Dispatch) => {
   dispatch(setAppStatusAC('loading'))
    try {
    const res = await authAPI.authMe()
    if(res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setIsInitializedAC(true))
        dispatch(getUserAC(res.data.data.id))
    } else {
        dispatch(setIsInitializedAC(true))
        handleServerAppError<any>(res.data, dispatch)
    }

   } catch (error: any){
    handleServerNetworkError(error, dispatch)
   }
}
export const authUser =  (obj: {email: string, password: string, rememberMe: boolean}) => async (dispatch: Dispatch) => {
   dispatch(setAppStatusAC('loading'))
    try {
    const res = await authAPI.login(obj)
    if(res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(true))
        dispatch(setAppStatusAC('succeeded'))
    } else {
        handleServerAppError<{userId: any}>(res.data, dispatch)
    }

   } catch (error: any){
    handleServerNetworkError(error, dispatch)
   }
}
export const logout =  () => async (dispatch: Dispatch) => {
   dispatch(setAppStatusAC('loading'))
    try {
    const res = await authAPI.logout()
    if(res.data.resultCode === 0) {
        dispatch(setIsLoggedInAC(false))
        dispatch(setAppStatusAC('succeeded'))
    } else {
        handleServerAppError<any>(res.data, dispatch)
    }

   } catch (error: any){
    handleServerNetworkError(error, dispatch)
   }
}
