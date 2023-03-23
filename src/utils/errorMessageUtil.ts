import { Dispatch } from "redux"
import { ResponseType } from "../api/todolists-api"
import { AppActionsType, setErrorAC } from "../app/app-reducer"

export const errorMessageUtil = (dispatch: ErrorUtilsDispatchType, message: string) => {
   return  dispatch(setErrorAC(message))
}

export const handleServerError = <T>(dispatch: ErrorUtilsDispatchType, data: ResponseType<T>) => {
    if(data.messages.length) {
        dispatch(setErrorAC(data.messages[0]))
    } else {
        dispatch(setErrorAC('Some error'))
    }
}

type ErrorUtilsDispatchType = Dispatch<AppActionsType>