import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import color from '../../theme/color';
import DPurchaseRequest from './DPurchaseRequest';
import DSalesRequest from './DSalesRequest';
const Delete = createMaterialBottomTabNavigator({
    DPurchaseRequest:DPurchaseRequest,
    DSalesRequest:DSalesRequest
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});

const routes = {
    DeletedRequest:Delete
}
const routeConfig = {
    initialRouteName:"DeletedRequest",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
}

export default createStackNavigator(routes,routeConfig);