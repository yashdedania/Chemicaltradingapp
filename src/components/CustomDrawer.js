import { Permissions, Notifications } from 'expo';
import React , { Component }from 'react';
import { connect } from 'react-redux';
import {SafeAreaView,ScrollView,Image} from 'react-native';
import {List,ListItem,View,Text,Left,Body,Right} from 'native-base';
import dstyles from '../theme/styles/dashboard';
import SocketIOClient from 'socket.io-client';
import urls from '../api/apivariable';
import user from '../api/user';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {setUserDetails} from '../actions/userActions';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
class SideMenu extends Component {
	
	constructor(props) {
	  super(props);
		this.state = {
			currentroute:'Dashboard',
			purchaseVisible:false,
			purchaseroutes:false,
			salesroutes:false,
			salesVisible:false,
		};
		this._isMounted = false;
		this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_activity');
	}
	componentDidMount = () =>{
		this._isMounted = true;
		Notifications.createChannelAndroidAsync('request', {
			name:'Request',
			sound:true,
			priority:'high'
		})
		console.log("----------------Drawer Mounted------------");
		this._socketConnect();
		this.registerForPushNotificationsAsync();
		this.detectNotifications = Notifications.addListener(this._handleNotifications);
		
        
	}
	
	componentWillUnmount = () =>{
		this._isMounted = false;
		console.log("----------------Drawer UnMounted------------");
		this._socketDisconnect();
		this.detectNotifications.remove();

	}
	_socketConnect = () =>{
        this.socket.on('userUpdate',(data) => {
            console.log("Users Update received: "+data);
            if(this._isMounted){
                this.refetch();
            }   
		});
		this.socket.on('purhcase_activity',(data) =>{
			console.log("Purchase_ Activity recciev");
			this._handlePurchase(data);
		});
		this.socket.on('sales_activity',(data) =>{
			this._handleSales(data);
		});
	}
	_handleNotifications = (params) =>{
		console.log("--------Notification handling routing-------");

		if(params !== undefined && params !== null){
			if(params.origin == "selected"){
				if(params.data == "Purchase"){
					this.props.navigation.navigate('PurchaseRequests');
				}
				else{
					this.props.navigation.navigate('SalesRequests');
				}
			}
			
		}
	}
	_handlePurchase = (data) =>{
		var message = {
			sound:true,
			ios:{
				sound:true
			},
			android:{
				sound:true,
				channelId:'request'
			}	
		};
		console.log("-----handling purchase ----");
		var role = this.props.user.details.role;
		var id = this.props.user.details.id;
		if(data !== undefined && data !== null){
			message.title = data.activity_type;
			message.body = data.activity_detail;
			message.data = "Purchase";
			if(data.ract_request !== undefined && data.ract_request !== null){
				if((data.activity_type == "Accept" || data.activity_type == "Delete" || data.activity_type == "Reject")&& data.request.user.role != "admin" && data.request.user.id == id){
					this.sendNotifications(message);
				}
				else if((data.activity_type == "Update" || data.activity_type == "Purchase Request") && data.request.user.role != "admin" && role == "admin"){
					this.sendNotifications(message);
				}
			}
		}
		
	}

	_handleSales = (data) =>{
		var message = {
			sound:true,
			ios:{
				sound:true
			},
			android:{
				sound:true
			}	
		};
		var role = this.props.user.details.role;
		var id = this.props.user.details.id;
		if(data !== undefined && data !== null){
			message.title = data.activity_type;
			message.body = data.activity_detail;
			message.data = "Sales";
			//console.log("-----------in Sales--------");
			//console.log(data);
			if(data.sact_request !== undefined && data.sact_request !== null){
				if((data.activity_type == "Accept" || data.activity_type == "Delete" || data.activity_type == "Reject")&& data.sale.user.role != "admin" && data.sale.user.id == id){
					this.sendNotifications(message);
				}
				else if((data.activity_type == "Update" || data.activity_type == "Sales Request") && data.sale.user.role != "admin" && role == "admin"){
					this.sendNotifications(message);
				}
			}
		}
	}
	sendNotifications = (message) =>{
		console.log("Send notification function");
		Notifications.presentLocalNotificationAsync(message);
	}
    _socketDisconnect = () =>{
        this.socket.close();
        this.socket.disconnect();
	}
	registerForPushNotificationsAsync = async() => {
		if(this._isMounted){
		  const { status: existingStatus } = await Permissions.getAsync(
			Permissions.NOTIFICATIONS
		  );
		  let finalStatus = existingStatus;
		
		  // only ask if permissions have not already been determined, because
		  // iOS won't necessarily prompt the user a second time.
		  if (existingStatus !== 'granted') {
			// Android remote notification permissions are granted during the app
			// install, so this will only ask on iOS
			const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
			finalStatus = status;
			if(finalStatus == 'granted'){
			  let token = await Notifications.getExpoPushTokenAsync();
			  /*var resp = await user.storeNotToken({token:token});
			  if(resp !== false){
				if(resp.status == 'ok'){
				  console.log("Users token stored successfully");
				  if(this._isMounted){
					this.props.setUserDetails(resp.result);
				  }
				}
				else{
				  console.log("Error received");
				  console.log(resp);
				}
			  }
			  else{
				console.log("False data recieved");
			  }*/
			}
		  }
		
		  // Stop here if the user did not grant permissions
		  if (finalStatus !== 'granted') {
			return;
		  }
		
		  // Get the token that uniquely identifies this device
		  
		}
		
	  }
	refetch = async() =>{
		if(this._isMounted){
			var resp = await user.findAndUpdate({id:this.props.user.details.id});
			if(resp !== false){
				if(resp.status == 'ok'){
					console.log("In activity data received");
					this.props.setUserDetails(resp.result);
				}
				else{
					console.log("Error received");
					console.log(resp);
				}
			}
			else{
				console.log("False data recieved");
			}

		}
	}
	_navigate = (name,id) =>{
		let extra = {...this.state}
		if((name == "Purchase" || name == "PurchaseRequests" || name == "Inventory") && id == "Purchase"){
			extra.purchaseroutes = true;
			extra.salesroutes = false;
		}
		else if((name == "Sales" || name == "SalesRequests" || name == "Inventory" || name == "RecentSales") && id == "Sales"){
			extra.salesroutes = true;
			extra.purchaseroutes = false;
		}
		else{
			extra.salesroutes = false;
			extra.purchaseroutes = false;
		}
		extra.currentroute = name;
		this.setState({...this.state,...extra});
		this.props.navigation.navigate(name);
		
	}
	_changeNavState = (params) => {
		const {currentroute} = this.state;
		const { state } = this.props.navigation;
		let currentstate = state.routes[state.index].routeName;
		console.log(state.routes[state.index]);
		//console.log("Current Route: "+currentroute);
		//console.log("Current State: "+currentstate);
		if(currentroute !== currentstate && this._isMounted){
			if(currentstate == "Inventory"){
				this.setState({currentroute:'Inventory'});
			}
			if(currentstate == "People"){
				this.setState({currentroute:"People"});
			}
			if(currentstate == "RecentSales"){
				this.setState({currentroute:"RecentSales"});
			}
			if(currentstate == "PurchaseRequests"){
				this.setState({currentroute:"PurchaseRequests"});
			}
			if(currentstate == "SalesRequests"){
				this.setState({currentroute:"SalesRequests"});
			}
		}
	}


	_checkRender = (name)=>{
		let role = this.props.user.details.role;
		let accessto = this.props.user.details.accessto;
		//this._changeNavState("data");
		if(name == "Dashboard" || name == "Logout" || name == "Inventory" || name == "Profile" || name == "LogError" || name == "DRequest"){
			return 'flex';
		}
		if(name == "Purchase" && (role =='admin' || role == "purchaser" || role == "both")){
			return 'flex';
		}
		if(name == "Sales" && (role == 'admin' || role == "seller" || role == "both")){
			return 'flex';
		}
		if(name == "Purchase Pending" && (role == 'admin' || accessto.indexOf("Purchase Pending") > -1 )){
			return 'flex';
		}
		if((name == "People" || name == "Notifications") && role == "admin"){
			return 'flex';
		}
		else{
			return 'none';
		}
		

	}
	_toggleBar = (name) =>{
		let extra = {...this.state}
		extra[name] = !extra[name];
		if(this._isMounted){
			this.setState({...this.state,...extra});
		}
	}
	
render () {
		var cr = this.state.currentroute;
		var pr  = this.state.purchaseroutes;
		var sr = this.state.salesroutes;
		
    return (
      <SafeAreaView style={dstyles.safeView}>
				<View style={dstyles.logoview}>
						<Image key={new Date()} source={{uri:this.props.user.details.imageuri}} style={dstyles.logoImg}/>
						<Text style={dstyles.username}>{this.props.user.details.username}</Text>
						{/*<Text style={dstyles.role}>{this.props.user.details.role == "both" ? "Purchaser + Seller" : this.props.user.details.role}</Text>*/}
						<Text style={dstyles.role}>{this.props.user.details.accessto.join(",")}</Text>
				</View>
			<ScrollView>
				<List>
					<ListItem style={[{display:this._checkRender('Dashboard')},dstyles.dListItem,cr == 'Dashboard' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Dashboard','')}>
						<Left style={dstyles.dLeft}>
								<FontAwesome name="home" style={[dstyles.dIcon,cr == "Dashboard" ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,cr == "Dashboard" ? dstyles.actCol : dstyles.inactCol]}>Dashboard</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					{/*<ListItem style={[{display:this._checkRender('Purchase')},dstyles.dcolList,dstyles.dListItem, pr ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._toggleBar('purchaseVisible')}>
						<View style={dstyles.viewList}>
							<Left style={dstyles.dLeft} >
									<FontAwesome name="money" style={[dstyles.dIcon,pr ? dstyles.actCol : dstyles.inactCol]}/>
							</Left>
							<Body style={dstyles.dBody}>
									<Text style={[dstyles.dLabel,pr ? dstyles.actCol : dstyles.inactCol]}>Purchase</Text>
							</Body>
							<Right style={dstyles.dRight}>
								{this.state.purchaseVisible ? (
									<MaterialCommunityIcons name="chevron-up"  style={[dstyles.dIcon,pr ? dstyles.actCol : dstyles.inactCol]} />
								):(
									<MaterialCommunityIcons name="chevron-down"  style={[dstyles.dIcon,pr ? dstyles.actCol : dstyles.inactCol]} />
								)}
							</Right>
						</View>
						{this.state.purchaseVisible ? (
							<List style={dstyles.dextraList}>
									<ListItem style={[dstyles.dListItem,cr == 'Purchase' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Purchase','Purchase')}>
										<Left style={dstyles.dLeft}>
												<FontAwesome name="wpforms" style={[dstyles.dIcon,cr == "Purchase" ? dstyles.actCol : dstyles.inactCol]}/>
										</Left>
										<Body style={dstyles.dBody}>
												<Text style={[dstyles.dLabel,cr == "Purchase" ? dstyles.actCol : dstyles.inactCol]}>Purchase Form</Text>
										</Body>
										<Right style={dstyles.dRight} />
									</ListItem>

									<ListItem style={[dstyles.dListItem,cr == "PurchaseRequests" ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('PurchaseRequests','Purchase')}>
										<Left style={dstyles.dLeft}>
												<MaterialIcons name="shopping-cart" style={[dstyles.dIcon,cr == "PurchaseRequests" ? dstyles.actCol : dstyles.inactCol]}/>
										</Left>
										<Body style={dstyles.dBody}>
												<Text style={[dstyles.dLabel,cr == "PurchaseRequests" ? dstyles.actCol : dstyles.inactCol]}>Purchase Requests</Text>
										</Body>
										<Right style={dstyles.dRight} />
									</ListItem>


									<ListItem style={[dstyles.dListItem,(cr == 'Inventory' && pr) ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Inventory','Purchase')}>
										<Left style={dstyles.dLeft}>
												<Ionicons name="ios-beaker" style={[dstyles.dIcon,(cr == 'Inventory' && pr) ? dstyles.actCol : dstyles.inactCol]}/>
										</Left>
										<Body style={dstyles.dBody}>
												<Text style={[dstyles.dLabel,(cr == 'Inventory' && pr) ? dstyles.actCol : dstyles.inactCol]}>Purchases</Text>
										</Body>
										<Right style={dstyles.dRight} />
									</ListItem>
							</List>
						):(null)}
					</ListItem>

					<ListItem style={[{display:this._checkRender('Sales')},dstyles.dcolList,dstyles.dListItem, sr ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._toggleBar('salesVisible')}>
						<View style={dstyles.viewList}>
							<Left style={dstyles.dLeft} >
									<MaterialCommunityIcons name="sale" style={[dstyles.dIcon,sr ? dstyles.actCol : dstyles.inactCol]}/>
							</Left>
							<Body style={dstyles.dBody}>
									<Text style={[dstyles.dLabel,sr ? dstyles.actCol : dstyles.inactCol]}>Sales</Text>
							</Body>
							<Right style={dstyles.dRight}>
								{this.state.salesVisible ? (
									<MaterialCommunityIcons name="chevron-up"  style={[dstyles.dIcon,sr ? dstyles.actCol : dstyles.inactCol]} />
								):(
									<MaterialCommunityIcons name="chevron-down"  style={[dstyles.dIcon,sr ? dstyles.actCol : dstyles.inactCol]} />
								)}
							</Right>
						</View>
						{this.state.salesVisible ? (
							<List style={dstyles.dextraList}>
								<ListItem style={[dstyles.dListItem,cr == 'Sales' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Sales','Sales')}>
									<Left style={dstyles.dLeft}>
											<FontAwesome name="wpforms" style={[dstyles.dIcon,cr == "Sales" ? dstyles.actCol : dstyles.inactCol]}/>
									</Left>
									<Body style={dstyles.dBody}>
											<Text style={[dstyles.dLabel,cr == "Sales" ? dstyles.actCol : dstyles.inactCol]}>Sales Form</Text>
									</Body>
									<Right style={dstyles.dRight} />
								</ListItem>

								<ListItem style={[dstyles.dListItem,(cr == 'Inventory' && sr) ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Inventory','Sales')}>
									<Left style={dstyles.dLeft}>
											<Ionicons name="ios-beaker" style={[dstyles.dIcon,(cr == 'Inventory' && sr) ? dstyles.actCol : dstyles.inactCol]}/>
									</Left>
									<Body style={dstyles.dBody}>
											<Text style={[dstyles.dLabel,(cr == 'Inventory' && sr) ? dstyles.actCol : dstyles.inactCol]}>Sell from Stock Available</Text>
									</Body>
									<Right style={dstyles.dRight} />
								</ListItem>

								<ListItem style={[dstyles.dListItem,cr == 'SalesRequests' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('SalesRequests','Sales')}>
									<Left style={dstyles.dLeft}>
											<MaterialCommunityIcons name="ticket-percent" style={[dstyles.dIcon,cr == "SalesRequests" ? dstyles.actCol : dstyles.inactCol]}/>
									</Left>
									<Body style={dstyles.dBody}>
											<Text style={[dstyles.dLabel,cr == "SalesRequests" ? dstyles.actCol : dstyles.inactCol]}>Sales Requests</Text>
									</Body>
									<Right style={dstyles.dRight} />
								</ListItem>

								<ListItem style={[dstyles.dListItem,cr == 'RecentSales' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('RecentSales','Sales')}>
									<Left style={dstyles.dLeft}>
											<MaterialCommunityIcons name="sale" style={[dstyles.dIcon,cr == "RecentSales" ? dstyles.actCol : dstyles.inactCol]}/>
									</Left>
									<Body style={dstyles.dBody}>
											<Text style={[dstyles.dLabel,cr == "RecentSales" ? dstyles.actCol : dstyles.inactCol]}>Sales</Text>
									</Body>
									<Right style={dstyles.dRight} />
								</ListItem>

							</List>
						):(null)}
					</ListItem>

					<ListItem style={[{display:this._checkRender('Purchase Pending')},dstyles.dListItem,(cr == 'PurchasePending') ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('PurchasePending','')}>
						<Left style={dstyles.dLeft} >
								<MaterialCommunityIcons name="timetable" style={[dstyles.dIcon,(cr == "PurchasePending") ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == "PurchasePending") ? dstyles.actCol : dstyles.inactCol]}>Purchase Pending</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					<ListItem style={[{display:this._checkRender('Inventory')},dstyles.dListItem,(cr == 'Inventory' && !pr && !sr) ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Inventory','')}>
						<Left style={dstyles.dLeft} >
								<Ionicons name="ios-beaker" style={[dstyles.dIcon,(cr == 'Inventory' && !pr && !sr) ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == 'Inventory' && !pr && !sr) ? dstyles.actCol : dstyles.inactCol]}>Stock Available</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					<ListItem style={[{display:this._checkRender('DRequest')},dstyles.dListItem,(cr == 'DRequest') ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('DRequest','')}>
						<Left style={dstyles.dLeft} >
								<MaterialCommunityIcons name="delete" style={[dstyles.dIcon,(cr == "DRequest") ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == "DRequest") ? dstyles.actCol : dstyles.inactCol]}>Deleted Requests</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					<ListItem style={[{display:this._checkRender('People')},dstyles.dListItem,(cr == 'People') ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('People','')}>
						<Left style={dstyles.dLeft} >
								<FontAwesome name="user" style={[dstyles.dIcon,(cr == "People") ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == "People") ? dstyles.actCol : dstyles.inactCol]}>People</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					<ListItem style={[{display:this._checkRender('Notifications')},dstyles.dListItem,(cr == 'Notifications') ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Notifications','')}>
						<Left style={dstyles.dLeft} >
								<MaterialCommunityIcons name="bell" style={[dstyles.dIcon,(cr == "Notifications") ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == "Notifications") ? dstyles.actCol : dstyles.inactCol]}>Notifications</Text>
						</Body>
						<Right style={dstyles.dRight} />
						</ListItem>*/}

					<ListItem style={[{display:this._checkRender('Profile')},dstyles.dListItem,(cr == 'Profile') ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Profile','')}>
						<Left style={dstyles.dLeft} >
								<MaterialCommunityIcons name="face-profile" style={[dstyles.dIcon,(cr == "Profile") ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,(cr == "Profile") ? dstyles.actCol : dstyles.inactCol]}>Profile</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					{/*<ListItem style={[{display:this._checkRender('LogError')},dstyles.dListItem,cr == 'LogError' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('LogError','')}>
						<Left style={dstyles.dLeft}>
								<MaterialIcons name="error" style={[dstyles.dIcon,cr == "LogError" ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,cr == "LogError" ? dstyles.actCol : dstyles.inactCol]}>Report Error</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>*/}

					<ListItem style={[{display:this._checkRender('Logout')},dstyles.dListItem,cr == 'Logout' ? dstyles.dactBck:dstyles.dinactBck]} onPress={() => this._navigate('Logout','')}>
						<Left style={dstyles.dLeft}>
								<FontAwesome name="power-off" style={[dstyles.dIcon,cr == "Logout" ? dstyles.actCol : dstyles.inactCol]}/>
						</Left>
						<Body style={dstyles.dBody}>
								<Text style={[dstyles.dLabel,cr == "Logout" ? dstyles.actCol : dstyles.inactCol]}>Logout</Text>
						</Body>
						<Right style={dstyles.dRight} />
					</ListItem>

					

					

				</List>
			</ScrollView>	
		</SafeAreaView>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};
const mapDispatchToProps = (dispatch) => {
    return {
      setUserDetails: (name) => {
        dispatch(setUserDetails(name));
      }
    };
  };

export default (connect(mapStateToProps,mapDispatchToProps)(SideMenu))



