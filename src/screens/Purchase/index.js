import React from 'react';
import {createStackNavigator} from 'react-navigation';
import PurchaseForm from './PurchaseForm';
import PurchaseDetails from './PurchaseDetails';


const routes = {
	PurchaseForm:PurchaseForm,
	PurchaseDetails:PurchaseDetails
};
const routeconfig = {
	initialRouteName:"PurchaseForm",
	
}

export default createStackNavigator(routes,routeconfig);