// const SET_NUMBER_OF_MANAGERS = 'SET_NUMBER_OF_MANAGERS'

import { ManagerAction } from "./types"

export const setNumberOfManagers = (number: number): ManagerAction => {
    return {
        type: 'SET_NUMBER_OF_MANAGERS',
        number: number
    }
}


