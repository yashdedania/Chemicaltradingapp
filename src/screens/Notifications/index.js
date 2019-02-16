import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import PurchaseNotification from './PurchaseNotification';
import SalesNotification from './SalesNotification';
import color from '../../theme/color';
const Notifications = createMaterialBottomTabNavigator({
    PurchaseNotification:PurchaseNotification,
    SalesNotification:SalesNotification
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});

const routes = {
    NotificationView : Notifications,
}

const routeConfig = {
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
}

export default createStackNavigator(routes,routeConfig);