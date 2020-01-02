import { handleActions, createAction } from "redux-actions"

const SET_AWS_CONFIG = 'support/SET_AWS_CONFIG';

export const setAwsConfig = createAction(SET_AWS_CONFIG); // aws obj

const initialState = {
    aws: {
        isConnected:false,
        accessKeyId:undefined,
        secretAccessKey:undefined,
        region:undefined,
        bucket:undefined
    }
}

export default handleActions({
    [SET_AWS_CONFIG]:(state, {payload}:any) => {
        return {...state, aws:payload}
    }
}, initialState)