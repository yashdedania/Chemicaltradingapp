import React from 'react';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import {createStackNavigator} from 'react-navigation';
import PendingRequest from './PendingRequest';
import AcceptedRequest from './AcceptedRequest';
import RejectedRequest from './RejectedRequest';
import RequestDetails from './RequestDetails';

import color from '../../theme/color';
const routes = {
	PendingRequest:PendingRequest,
    AcceptedRequest:AcceptedRequest,
    RejectedRequest:RejectedRequest,
};
const routeconfig = {
    shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',
}

const RequestTab = createMaterialBottomTabNavigator(routes,routeconfig);


export default createStackNavigator({
    PurchaseRequests:RequestTab,
    PurchaseRequestDetails:RequestDetails
},{
    initialRouteName:"PurchaseRequests",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
});