import { createAction, handleActions } from 'redux-actions';
import { CSSType } from '../utils/constant';

const CREATE_COLOR = 'resource/CREATE_COLOR';
const DELETE_COLOR = 'resource/DELETE_COLOR';
const UPDATE_COLOR = 'resource/UPDATE_COLOR';
const CREATE_ASSET = 'resource/CREATE_ASSET';
const DELETE_ASSET = 'resource/DELETE_ASSET';
const UPDATE_ASSET = 'resource/UPDATE_ASSET';
const CREATE_CSS = 'resource/CREATE_CSS';
const DELETE_CSS = 'resource/DELETE_CSS';
const UPDATE_CSS = 'resource/UPDATE_CSS';
const CREATE_STYLE = 'resource/CREATE_STYLE';
const DELETE_STYLE = 'resource/DELETE_STYLE';
const UPDATE_STYLE = 'resource/UPDATE_STYLE';
const LOAD_RESOURCE = 'resource/LOAD_RESOURCE';

export const createColor = createAction(CREATE_COLOR); // name, value
export const deleteColor = createAction(DELETE_COLOR); // name
export const updateColor = createAction(UPDATE_COLOR); // name, value
export const createAsset = createAction(CREATE_ASSET); // name, value
export const deleteAsset = createAction(DELETE_ASSET); // name
export const updateAsset = createAction(UPDATE_ASSET); // name, value
export const createCss = createAction(CREATE_CSS); // name, value, type
export const deleteCss = createAction(DELETE_CSS); // name,
export const updateCss = createAction(UPDATE_CSS); // name, value, active
export const createStyle = createAction(CREATE_STYLE); // name, value
export const updateStyle = createAction(UPDATE_STYLE); // name, value
export const deleteStyle = createAction(DELETE_STYLE); // name
export const loadResource = createAction(LOAD_RESOURCE); // color, asset, css

const initialState = {
    color:[
        // {
        //     name,
        //     value
        // }
    ],
    asset:[],
    css:[{
        name: 'bootstrap',
        value: 'https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css', 
        type: CSSType.Url, 
        active:true
    }],
    style: [
        // name, value
    ]
}

export default handleActions({
    [CREATE_COLOR]: (state, {payload}:any) => {
        if (state.color.filter(color=> color.name === payload.name).length === 0) {
            state.color.push({
                name: payload.name,
                value: payload.value
            })
        }
        return {...state}
    },
    [UPDATE_COLOR]: (state, {payload}:any)=> {
        state.color.filter(color=>color.name === payload.name).forEach(color=>color.value = payload.value);
        return {...state}
    },
    [DELETE_COLOR]: (state, {payload}:any)=> {
        let idx = undefined;
        state.color.forEach((color, i)=> {
            if (color.name === payload) {
                idx = i;
            }
        })
        if (idx !== undefined) {
            state.color.splice(idx, 1)
        }
        return {...state}
    },
    [CREATE_ASSET]: (state, {payload}:any) => {
        if (state.asset.filter(asset=> asset.name === payload.name).length === 0) {
            state.asset.push({
                name: payload.name,
                value: payload.value
            })
        }
        return {...state}
    },
    [UPDATE_ASSET]: (state, {payload}:any)=> {
        state.asset.filter(asset=>asset.name === payload.name).forEach(asset=>asset.value = payload.value);
        return {...state}
    },
    [DELETE_ASSET]: (state, {payload}:any)=> {
        let idx = undefined;
        state.asset.forEach((asset, i)=> {
            if (asset.name === payload) {
                idx = i;
            }
        })
        if (idx !== undefined) {
            state.asset.splice(idx, 1)
        }
        return {...state}
    },
    [CREATE_CSS]: (state, {payload}:any) => {
        if(state.css.filter(css=> css.name === payload.name).length === 0) {
            state.css.push({
                name: payload.name,
                value: payload.value,
                type: payload.type,
                active: true
            })
        }
        return {...state}
    },
    [DELETE_CSS]: (state, {payload}:any) => {
        let idx = undefined;
        state.css.forEach((css, i)=> {
            if (css.name === payload) {
                idx = i;
            }
        })
        if (idx !== undefined) {
            state.css.splice(idx, 1)
        }
        return {...state}
    },
    [UPDATE_CSS]: (state, {payload}:any) => {
        state.css.filter(css=>css.name === payload.name).forEach(css=> {
            if(payload.value !== undefined) {
                css.value = payload.value;
            }
            if (payload.active !== undefined) {
                css.active = payload.active;
            }
        });
        return {...state}
    },
    [LOAD_RESOURCE]: (state, {payload}:any) => {
        return {
            color:payload.color,
            asset:payload.asset,
            css:payload.css,
            style: payload.style
        }
    },
    [CREATE_STYLE]: (state, {payload}:any) => {
        if (state.style.filter(style=>style.name === payload.name).length === 0) {
            state.style.push({
                name: payload.name,
                value: payload.value
            })
        }
        return {...state}
    },
    [DELETE_STYLE]: (state, {payload}:any) => {
        let idx = undefined;
        state.style.forEach((style, i)=> {
            if (style.name === payload) {
                idx = i;
            }
        })
        if (idx !== undefined) {
            state.style.splice(idx, 1)
        }
        return {...state}
    },
    [UPDATE_STYLE]: (state, {payload}:any) => {
        state.style.filter(style=>style.name === payload.name).forEach(style=> {
            style.value = payload.value;
        });
        return {...state}
    },
}, initialState)