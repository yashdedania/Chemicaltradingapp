import React from 'react';
import {createStackNavigator} from 'react-navigation';
import PurchasePendingList from './PurchasePendingList';
import PurchaseLinkList from './PurchaseLinkList';

const routes = {
	PurchasePending:PurchasePendingList,
    PurchaseLink:PurchaseLinkList,
};
const routeconfig = {
	initialRouteName:"PurchasePending",
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null		
	})
};

export default createStackNavigator(routes,routeconfig);