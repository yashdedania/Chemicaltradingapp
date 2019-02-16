import React from 'react';
import {createStackNavigator} from 'react-navigation';
import Home from './Home';

const routes = {
	Home:Home
};
const routeconfig = {
	initialRouteName:"Home",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
}

export default createStackNavigator(routes,routeconfig);