import { createAction, handleActions } from 'redux-actions';
import { CSSType } from '../utils/constant';
import { pender } from 'redux-pender';

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

export type ResourceState = {
    color: Array<{name:string, value:string}>,
    asset: Array<{name:string, value:string}>,
    css: Array<{name:string, value: string, type: CSSType, active: boolean}>,
    style: Array<{name:string, value:string}>
}

const initState:ResourceState = {
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

export const ResourceAction = {
    createColor: (name:string, value:string) => Promise.resolve({name, value}),
    deleteColor: (name:string) => Promise.resolve(name),
    updateColor: (name:string, value:string) => Promise.resolve({name, value}),
    createAsset: (name:string, value:string) => Promise.resolve({name, value}),
    deleteAsset: (name:string) => Promise.resolve(name),
    updateAsset: (name:string, value:string) => Promise.resolve({name, value}),
    createCss: (name:string, value:string, type:CSSType) => Promise.resolve({name, value, type}),
    deleteCss: (name:string) => Promise.resolve(name),
    updateCss: (name:string, value:string, active:boolean) => Promise.resolve({name, value, active}),
    createStyle: (name:string, value:string) => Promise.resolve({name, value}),
    updateStyle: (name:string, value:string) => Promise.resolve({name, value}),
    deleteStyle: (name:string) => Promise.resolve(name),
    loadResource: (color:typeof initState.color, asset: typeof initState.asset, css: typeof initState.css, style: typeof initState.style) => 
        Promise.resolve({color, asset, css, style})
}

export const resourceActions = {
    createColor: createAction(CREATE_COLOR, ResourceAction.createColor),
    deleteColor: createAction(DELETE_COLOR, ResourceAction.deleteColor),
    updateColor: createAction(UPDATE_COLOR, ResourceAction.updateColor),
    createAsset: createAction(CREATE_ASSET, ResourceAction.createAsset),
    deleteAsset: createAction(DELETE_ASSET, ResourceAction.deleteAsset),
    updateAsset: createAction(UPDATE_ASSET, ResourceAction.updateAsset),
    createCss: createAction(CREATE_CSS, ResourceAction.createCss),
    deleteCss: createAction(DELETE_CSS, ResourceAction.deleteCss),
    updateCss: createAction(UPDATE_CSS, ResourceAction.updateCss),
    createStyle: createAction(CREATE_STYLE, ResourceAction.createStyle),
    updateStyle: createAction(UPDATE_STYLE, ResourceAction.updateStyle),
    deleteStyle: createAction(DELETE_STYLE, ResourceAction.deleteStyle),
    loadResource: createAction(LOAD_RESOURCE, ResourceAction.loadResource)
}

export default handleActions({
    ...pender({
        type:CREATE_COLOR,
        onSuccess:(state:ResourceState, {payload}) => {
            if (state.color.filter(color=> color.name === payload.name).length === 0) {
                state.color.push({
                    name: payload.name,
                    value: payload.value
                })
            }
            return {...state}
        }
    }),
    ...pender({
        type:UPDATE_COLOR,
        onSuccess:(state:ResourceState, {payload}) => {
            state.color.filter(color=>color.name === payload.name).forEach(color=>color.value = payload.value);
            return {...state}
        }
    }),
    ...pender({
        type:DELETE_COLOR,
        onSuccess:(state:ResourceState, {payload}) => {
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
        }
    }),
    ...pender({
        type:CREATE_ASSET,
        onSuccess:(state:ResourceState, {payload}) => {
            if (state.asset.filter(asset=> asset.name === payload.name).length === 0) {
                state.asset.push({
                    name: payload.name,
                    value: payload.value
                })
            }
            return {...state}
        },
    }),
    ...pender({
        type:UPDATE_ASSET,
        onSuccess:(state:ResourceState, {payload}) => {
            state.asset.filter(asset=>asset.name === payload.name).forEach(asset=>asset.value = payload.value);
            return {...state}
        },
    }),
    ...pender({
        type:DELETE_ASSET,
        onSuccess:(state:ResourceState, {payload}) =>  {
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
    }),
    ...pender({
        type:CREATE_CSS,
        onSuccess:(state:ResourceState, {payload}) => {
            if(state.css.filter(css=> css.name === payload.name).length === 0) {
                state.css.push({
                    name: payload.name,
                    value: payload.value,
                    type: payload.type,
                    active: true
                })
            }
            return {...state}
        }
    }),
    ...pender({
        type:DELETE_CSS,
        onSuccess:(state:ResourceState, {payload}) => {
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
    }),
    ...pender({
        type:UPDATE_CSS,
        onSuccess:(state:ResourceState, {payload}) => {
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
    }),
    ...pender({
        type:LOAD_RESOURCE,
        onSuccess:(state:ResourceState, {payload}) => {
            return {
                color:payload.color,
                asset:payload.asset,
                css:payload.css,
                style: payload.style
            }
        },
    }),
    ...pender({
        type:CREATE_STYLE,
        onSuccess:(state:ResourceState, {payload}) => {
            if (state.style.filter(style=>style.name === payload.name).length === 0) {
                state.style.push({
                    name: payload.name,
                    value: payload.value
                })
            }
            return {...state}
        },
    }),
    ...pender({
        type:DELETE_STYLE,
        onSuccess:(state:ResourceState, {payload}) => {
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
    }),
    ...pender({
        type:UPDATE_STYLE,
        onSuccess:(state:ResourceState, {payload}) => {
            state.style.filter(style=>style.name === payload.name).forEach(style=> {
                style.value = payload.value;
            });
            return {...state}
        },
    }),
}, initState)