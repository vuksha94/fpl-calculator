import { ManagerAction, NumOfManagers } from "./types";

const initialNumOfManagers: NumOfManagers = {
    number: 100
}

const numOfManagersReducer = (action: ManagerAction): NumOfManagers => {
    return {
        number: action.number
    }
}

export const managerReducer = (prevState: NumOfManagers = initialNumOfManagers, action: ManagerAction) => {
    switch (action.type) {
        case "SET_NUMBER_OF_MANAGERS":
            return {
                ...prevState, ...numOfManagersReducer(action)
            }
        default: return prevState
    }
}