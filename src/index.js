
import React , { Component }from 'react';
import {View,StatusBar} from 'react-native';
import { createStackNavigator,createSwitchNavigator,createDrawerNavigator} from 'react-navigation';
import Login from './screens/Authorization/Login';
import Register from './screens/Authorization/Register';
import AuthLoadingScreen from './components/AuthLoadingScreen';
import Logout from './components/Logout';
import {Root} from 'native-base';
import SideMenu from './components/CustomDrawer';
import { connect } from 'react-redux';
import Purchase from './screens/Purchase';
import Sales from './screens/Sales';
import Dashboard from './screens/Dashboard';
import PurchaseRequests from './screens/Request';
import SalesRequests from './screens/SalesRequest';
import Inventory from './screens/Inventory';
import VerifyOrders from './screens/VerifyOrders';
import RecentSales from './screens/RecentSales';
import PurchasePending from './screens/PurchasePending';
import Notifications from './screens/Notifications';
import DRequest from './screens/Delete';
import People from './screens/People';
import color from './theme/color';
import LogError from './screens/LogError';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import OfflineNotice from './components/OfflineNotice';
import UserAuthorization from './screens/User';
import Profile from './screens/Profile';
class Index extends Component {
	constructor(props) {
		super(props);
		this.state = {
		    isReady: false
		};
	}
	render() {
		return(
    		<Root>
				<StatusBar barStyle="light-content" backgroundColor="#FF5964" />
				<OfflineNotice />
    			<RootStack />
    		</Root>
    	);
   
  }
}

const AuthStack = createStackNavigator(
	  {
	    LoginScreen:{screen:Login}
	    //RegisterScreen:{screen:Register}
	  },{
	  	initialRouteName: "LoginScreen"
	  }
);


const AppStack = createDrawerNavigator(
			{  
				Dashboard:{
					screen: Dashboard,
					navigationOptions:{
						drawerLabel:"Dashboard",
						drawerIcon:({tintColor}) => (
						  <MaterialCommunityIcons name="home" style={{fontSize:26,color:tintColor}} />
						)
					}
				},
				UserAuthorization:UserAuthorization,
				Purchase:{
					screen:Purchase,
					navigationOptions:{
						drawerLabel:"Purchase Form",
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="cash" style={{fontSize:26,color:tintColor}} />
						)
					}
				},
				Sales:{
					screen:Sales,
					navigationOptions:{
						drawerLabel:'Sales Form',
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="sale" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				PurchasePending:{
					screen:PurchasePending,
					navigationOptions:{
						drawerLabel:'Purchase Pending',
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="timetable" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				Inventory:{
					screen:Inventory,
					navigationOptions:{
						drawerLabel:'Inventory',
						drawerIcon:({tintColor}) => (
							<Ionicons name="ios-beaker" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				RecentSales:{
					screen:RecentSales,
					navigationOptions:{
						drawerLabel:'Recent Sales',
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="sale" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},

				PurchaseRequests:{
					screen: PurchaseRequests,
					navigationOptions:{
						drawerLabel:"Purchase Request Status",
						drawerIcon:({tintColor}) => (
						  <MaterialIcons name="shopping-cart" style={{fontSize:26,color:tintColor}} />
						)
					}
				},
				SalesRequests:{
					screen: SalesRequests,
					navigationOptions:{
						drawerLabel:"Sales Request Status",
						drawerIcon:({tintColor}) => (
						  <MaterialCommunityIcons name="ticket-percent" style={{fontSize:26,color:tintColor}} />
						)
					}
				},
				VerifyOrders:{
					screen:VerifyOrders,
					navigationOptions:{
						drawerLabel:'Verify Orders',
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="clipboard-check" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				Profile:{
					screen: Profile,
					navigationOptions:{
						drawerLabel:"Profile",
						drawerIcon:({tintColor}) => (
						  <MaterialCommunityIcons name="face-profile" style={{fontSize:26,color:tintColor}} />
						)
					}
				},
				People:{
					screen:People,
					navigationOptions:{
						drawerLabel:'People',
						drawerIcon:({tintColor}) => (
							<FontAwesome name="user" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				Notifications:{
					screen:Notifications,
					navigationOptions:{
						drawerLabel:'Notifications',
						drawerIcon:({tintColor}) => (
							<MaterialCommunityIcons name="bell" style={{ fontSize: 26, color: tintColor }} />
						)
					}
				},
				DRequest:DRequest,
				LogError:LogError,
				Logout:Logout
			},
			{	
				initialRouteName: 'Dashboard',
				drawerLockMode:'locked-closed',
				contentComponent:SideMenu,
				contentOptions:{
					activeTintColor:color.primary
				}
			}
		);

const RootStack = createSwitchNavigator(
			{
				AuthLoading: AuthLoadingScreen,
		    	App: AppStack,
		    	Auth: AuthStack,
			},
			{
				initialRouteName: 'AuthLoading',
			}
);


const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
export default (connect(mapStateToProps)(Index))