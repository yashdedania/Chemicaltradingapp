import React from 'react';
import {createStackNavigator} from 'react-navigation';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import PurchaseVerify from './PurchaseVerify';
import SalesVerify from './SalesVerify';
import PurchaseVerifyDetail from './PurchaseVerifyDetail';
import SalesVerifyDetail from './SalesVerifyDetail';
import colors from '../../theme/color';
const OrderStack = createMaterialBottomTabNavigator({
    PurchaseVerify:PurchaseVerify,
    SalesVerify:SalesVerify
},{shifting:true,
    labeled:true,
    lazy:true,
    barStyle:{backgroundColor:colors.primary},
    activeColor: 'rgb(240, 237, 246)',
    inactiveColor: 'rgb(62, 36, 101)',});


const routes = {
	Orders:{
        screen:OrderStack,
        navigationOptions:{
            headerMode : 'none',
		    header:null	
        }
    },
    PurchaseVerifyDetail:{
        screen:PurchaseVerifyDetail,
        navigationOptions:{
            title:"Order Summary",
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
    },
    SalesVerifyDetail:{
        screen:SalesVerifyDetail,
        navigationOptions:{
            title:"Order Summary",
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
};
const routeconfig = {
	initialRouteName:"Orders",
	navigationOptions: ({ navigation }) => ({
			
	})
}

export default createStackNavigator(routes,routeconfig);