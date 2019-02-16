import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import Staff from './Staff';
import StaffDetails from './StaffDetails';
import SelfActivity from './SelfActivity';
import color from '../../theme/color';

const LoginActivity = createMaterialBottomTabNavigator({
    SelfActivity:SelfActivity,
    StaffActivity:Staff
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:color.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});

const routes = {
	LoginActivity:LoginActivity,
    Staff:Staff,
    StaffDetails:StaffDetails
};
const routeconfig = {
	initialRouteName:"LoginActivity",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null		
	})
};

export default createStackNavigator(routes,routeconfig);