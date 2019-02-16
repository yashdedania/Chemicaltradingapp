import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation';
import PendingRequest from './PendingRequest';
import AcceptedRequest from './AcceptedRequest';
import RejectedRequest from './RejectedRequest';
import SalesDetails from './SalesRequestDetails';
import color from '../../theme/color';
const routes = {
	SalesPendingRequest:PendingRequest,
    SalesAcceptedRequest:AcceptedRequest,
    SalesRejectedRequest:RejectedRequest,
};
const routeconfig = {
    shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',
}

const SalesTab = createMaterialBottomTabNavigator(routes,routeconfig);

export default createStackNavigator({
    SalesRequests:SalesTab,
    SalesRequestDetails:SalesDetails
},{
    initialRouteName:"SalesRequests",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
});