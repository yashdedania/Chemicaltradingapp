import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import RecentSalesPending from './RecentSalesPending';
import RecentSalesVerified from './RecentSalesVerified';
import RecentSalesDetails from './RecentSalesDetails';
import colors from '../../theme/color';
const RecentSales = createMaterialBottomTabNavigator({
    RecentSalesPending:RecentSalesPending,
    RecentSalesVerified:RecentSalesVerified
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:colors.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});
const routes = {
    RecentSales : {
        screen:RecentSales,
        navigationOptions:{
            headerMode : 'none',
		header:null
        }
    },
    RecentSalesDetails:{
        screen:RecentSalesDetails,
        navigationOptions:{
            title:"Sales Summary",
            headerStyle: {
            backgroundColor: colors.primary,
            height:50,
            paddingBottom:10
            },
            headerTintColor: 'rgb(255,255,255)',
            headerBackTitleStyle:{
            color:'rgb(255,255,255)'
            },
            headerTitleStyle:{
            color:'rgb(255,255,255)'
            }
        }
    }
}

const routeConfig = {
    initialRouteName:"RecentSales",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
			
	})
}

export default createStackNavigator(routes,routeConfig);