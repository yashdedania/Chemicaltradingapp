import {createStore, combineReducers, applyMiddleware} from "redux";
import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from 'redux-promise-middleware';
import userReducer from "./src/reducers/userReducer";


const myLogger = (store) => (next) => (action) => {
	//console.log("Logged Action: ", action);
	next(action);
}

const store = createStore(
	combineReducers({
		user:userReducer
	}), 
	{}, 
	applyMiddleware(myLogger, logger, thunk, promise())
);

export default store;
