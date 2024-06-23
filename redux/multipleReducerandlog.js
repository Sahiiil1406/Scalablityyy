const redux = require("redux");
const combineReducer=redux.combineReducers

const x = redux.createStore;

//actions
const orderCake = (q=1) => {
  return {
    type: "CAKE_ORDERED",
    payload: q,
  };
};
const cakeRestocked=(q=1)=>{
    return {
        type:"CAKE_RESTOCKED",
        payload:q
    }
}
const orderIcecream=(q=1)=>{
    return {
        type:"ORDERED_ICECREAM",
        payload:q
    }
}
const restockIcecream=(q=1)=>{
    return {
        type:"RESTOCK_ICECREAM",
        payload:q
    }
}
//initial State
const cakeState = {
    numOfCakes: 10,
};
const iceState={
    numOfIcecreams:10
}

const cakereducer = (state = cakeState, action) => {
  switch (action.type) {
    case "CAKE_ORDERED":
      return {
        ...state,
        numOfCakes: state.numOfCakes - action.payload,
      };
    case "CAKE_RESTOCKED":{
        return{
            ...state,
            numOfCakes:state.numOfCakes+action.payload
        }
    }
    default: {
      return state;
    }
  }
};

const iceReducer=(state=iceState,action)=>{
    switch(action.type){
        case "ORDERED_ICECREAM":{
            return {
                ...state,
                numOfIcecreams:state.numOfIcecreams-action.payload
            }
        }
        case "RESTOCK_ICECREAM":{
            return {
                ...state,
                numOfIcecreams:state.numOfIcecreams+action.payload
            }
        }
        default: {
          return state;
        }  
    }
}
const reducer=combineReducer({
    cake:cakereducer,
    ice:iceReducer
})
const store = x(reducer);
console.log("Initial State", store.getState());


//this is used to subscribe the event.After this,whenever a change is made ,users are informed
const unsubscribe = store.subscribe(() => {
  console.log("Current state", store.getState());
});

store.dispatch(orderCake(2));
store.dispatch(orderCake(2));

store.dispatch(orderIcecream(2))
store.dispatch(orderIcecream(2))

store.dispatch(cakeRestocked(4));
store.dispatch(restockIcecream(4))
