const redux=require('redux')
const thunkMiddleware=require('redux-thunk').default
const axios=require('axios')

const createStore=redux.createStore
const initialState={
    loading:false,
    users:[],
    error:""
}
const applyMiddleware=redux.applyMiddleware

const fetchUserRequest=()=>{
    return {
        type:"FETCH_REQUEST"
    }
}
const fetchUsersuccess=(users)=>{
    return {
        type:"FETCH_SUCCESS",
        payload:users
    }
}
const fetchUserfailed=(error)=>{
    return {
        type:"FETCH_FAILED",
        payload:error
    }
}

const reducer=(state=initialState,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':{
            return {
                ...state,
                loading:true
            }
        }
        case 'FETCH_SUCCESS':{
            return {
                ...state,
                users:action.payload
            }
        }
        case 'FETCH_FAILED':{
            return{
                ...state,
                error:action.payload
            }
        }
    }
}

const fetchUser=()=>{
  return  function(dispatch){
      dispatch(fetchUserRequest())
       axios.getAdapter('https://jsonplaceholder.typicode.com/users').then((res)=>{
        const users=res.data
        dispatch(fetchUsersuccess(users))
      }).catch((e)=>{
        dispatch(fetchUserfailed(error))

      })
      
  }
}
const store=createStore(reducer,applyMiddleware(thunkMiddleware))

store.subscribe(()=>{
    console.log(store.getState())
})
store.dispatch(fetchUser())