import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Incoming from './Incoming';
import Ready from './Ready';
import InventoryDetails from './InventoryDetails';
import PurchaseVerify from './PurchaseVerify';
import color from '../../theme/color';
const Inventory = createMaterialBottomTabNavigator({
    Incoming:Incoming,
    Ready:Ready
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});
const routes = {
    Inventory : Inventory,
    InventoryDetails:InventoryDetails,
    InventoryVerify:PurchaseVerify
}

const routeConfig = {
    initialRouteName:"Inventory",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
}

export default createStackNavigator(routes,routeConfig);