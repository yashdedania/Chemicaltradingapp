import React from 'react';
import {createStackNavigator} from 'react-navigation';
import SalesForm from './SalesForm';
import SalesDetail from './SalesDetail';


const routes = {
	SalesForm:SalesForm,
	SalesDetail:SalesDetail
};
const routeconfig = {
	initialRouteName:"SalesForm",
}

export default createStackNavigator(routes,routeconfig);