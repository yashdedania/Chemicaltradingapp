import React, { Component } from 'react';


import {TouchableOpacity} from 'react-native';
import {View,Text,Container,Content,Left,Body,Title, Right} from 'native-base';
import SocketIOClient from 'socket.io-client';
import {setUserDetails} from '../../actions/userActions';
import { connect } from 'react-redux';
import request from '../../api/request';
import user from '../../api/user';
import sales from '../../api/sales';
import urls from '../../api/apivariable';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import RequestgModal from './RequestgModal';
import StatusModal from './StatusModal';
import styles from '../../theme/styles/dashboard';
import gstyles from '../../theme/styles/general';
import hstyles from '../../theme/styles/header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';
import UserAuthorization from '../User/UserAuthorization';
class Home extends Component {
    constructor(props) {
      super(props);
      this.props.navigation.setParams({ title: 'Dashboard' });
      this.state = {
        purchase_request: 0,
        request_status:0,
        recent_purchase:0,
        sales_request:0,
        recent_sales:0,
        sales_request_status:0,
        blur:false,
        requestmodal:false,
        statusmodal:false
      };
      this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_requests');
      this.sales_socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_salesrequests');
      this._fetchcount();
      this._fetchsalescount();
      this._isMounted = false;
      //console.log(this.socket); 
    }
    _socketConnect = () =>{
      this.socket.on('request',(data) => {
        console.log("data recieved: "+data);
        this._fetchcount();
      });
      this.sales_socket.on('sales_request',(data) =>{
        console.log("Sales Data received");
        this._fetchsalescount();
      })
    }
    _socketDisconnect = () =>{
      this.socket.close();
      this.socket.disconnect();
      this.sales_socket.close();
      this.sales_socket.disconnect();
    }
    componentDidMount = async() =>{
      this._isMounted = true;
      this._socketConnect();

      this.didBlurSubscription = this.props.navigation.addListener(
        'didBlur',
        payload => {
          this.setState({blur:true});
          
        }
      );
      this.willFocusSubscription = this.props.navigation.addListener(
          'willFocus',
          payload => {
            if(this.state.blur){
              if(this._isMounted){
                this.setState({blur:false});
                this._fetchcount();
                this._fetchsalescount();
              }
                
            }
          }
      );
    }
    componentWillUnmount(){
      this._isMounted = false;
      this.didBlurSubscription.remove();
      this.willFocusSubscription.remove();
      this._socketDisconnect();
    }
    
    _fetchcount = async() =>{
      if(this._isMounted){
        var resp = await request.countall(this.state);
        if(resp !== false){
          if(resp.status !== 'error'){
            //console.log(resp.result);
            const result = resp.result;
            var purchase_request= 0,request_count = 0 ,recent_purchase = 0;
            for (x in result){
              if(result[x].request_status == 'pending'){
                purchase_request += parseInt(result[x].count);
                request_count += parseInt(result[x].count);
              }
              else if(result[x].request_status == 'rejected'){
                request_count += parseInt(result[x].count);
              }
              else if(result[x].request_status == 'added to inventory'){
                recent_purchase += parseInt(result[x].count);
              }
            }
            if(this._isMounted){
              this.setState({purchase_request:purchase_request,
                request_status:request_count,
                recent_purchase:recent_purchase});
            }
                      
          }
          else{
            console.log("Error recieved from server in Home");
          }
        }
        else{
          console.log("False response in Home");
        }
      }
      
    }
    _fetchsalescount = async() =>{
      if(this._isMounted){
        var resp = await sales.countall(this.state);
        if(resp !== false){
          if(resp.status !== 'error'){
            //console.log(resp.result);
            const result = resp.result;
            var sales_request= 0,salesrequest_count = 0 ,recent_sales = 0;
            for (x in result){
              if(result[x].request_status == 'pending'){
                sales_request += parseInt(result[x].count);
                salesrequest_count += parseInt(result[x].count);
              }
              else if(result[x].request_status == 'rejected'){
                salesrequest_count += parseInt(result[x].count);
              }
              else if(result[x].request_status == 'subtracted from inventory'){
                recent_sales += parseInt(result[x].count);
              }
            }
            if(this._isMounted){
              this.setState({sales_request:sales_request,
                sales_request_status:salesrequest_count,
                recent_sales:recent_sales});
            }
                      
          }
          else{
            console.log("Error recieved from server in Home");
          }
        }
        else{
          console.log("False response in Home");
        }
      }
      
    }
    _renderCard = (name) =>{
      const role = this.props.user.details.role;
      const accessto = this.props.user.details.accessto;
      //console.log(role);
      if (role == "admin"){
        return true;
      }
      else if(name == "Profile" || name == "Logout" || name == "Notifications"){
        return true;
      }
      else if(accessto.indexOf(name) !== -1){
        return true;
      }
      else{
        return false;
      }
    }
    openRequestModal = () =>{
      if(this._isMounted){
        this.setState({requestmodal:true});
      }
    }
    openStatusModal = () =>{
      if(this._isMounted){
        this.setState({statusmodal:true});
      }
    }
    
    _onDismiss = () =>{
      let extra = {...this.state};
      extra.requestmodal = false;
      extra.statusmodal = false;
      if(this._isMounted){
        this.setState({...this.state,...extra});
      }
    }
    _RequestModalClicks = (route)=>{
      this._onDismiss();
      if(route == 'Sales'){
        this.props.navigation.navigate('Sales');
      }
      else if(route == 'Purchase'){
        this.props.navigation.navigate('Purchase');
      }
    }
    _StatusModalClicks = (route) =>{
      this.props.navigation.navigate(route);
    }
  	render(){
  		return(
  			<Container style={gstyles.container_background}>
          <View style={hstyles.header}>
            <View style={hstyles.headerContainer}>
              <Left style={hstyles.left}>
                <TouchableOpacity onPress={() => this.props.navigation.openDrawer()}>
                  <MaterialCommunityIcons name="menu" style={hstyles.icon} />
                </TouchableOpacity>
              </Left>
              <Body style={hstyles.body}>
                <Title style={hstyles.headtitle}>Dashboard</Title>
              </Body>
              <Right style={hstyles.right}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Logout')}>
                  <FontAwesome name="power-off" style={hstyles.icon} />
                </TouchableOpacity>
              </Right>
            </View>
          </View>
        <RequestgModal visible={this.state.requestmodal} dismiss={this._onDismiss} RequestModalClicks={this._RequestModalClicks} />
        <StatusModal visible={this.state.statusmodal} dismiss={this._onDismiss} data={{...this.state}} StatusModalClicks={this._StatusModalClicks} />
        <Content>
        {/* Cards Stack View - All cards inside this */}
        <View style={styles.cardStack}>


          {/* CARD 2 */}
          <TouchableOpacity style={this._renderCard('Generate Request') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.openRequestModal()}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="wpforms" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Generate Requests</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('Request Status') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.openStatusModal()}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="exclamation-circle" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Request Status</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('Purchase Pending') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('PurchasePending')}>
          
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="exclamation-circle" style={styles.cardIcon} />
                </View>
                {/* Circle + Text */}
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Purchase Pending</Text>
              </View>
          </TouchableOpacity>


          {/* CARD 3 */}
          <TouchableOpacity style={this._renderCard('Stock Available') === true ? styles.cardStyles : styles.hideCard} onPress ={() => this.props.navigation.navigate('Inventory')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="cart-plus" style={styles.cardIcon} />
                </View>
                {/* Circle + Text */}
                <View style={this.state.recent_purchase == 0 ? styles.circle : styles.circledark}>
                  <Text style={this.state.recent_purchase == 0 ? styles.blackfont : styles.whitefont}>{this.state.recent_purchase}</Text>
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Stock Available</Text>
              </View>
            
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('Sales') === true ? styles.cardStyles : styles.hideCard} onPress ={() => this.props.navigation.navigate('RecentSales')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="cart-plus" style={styles.cardIcon} />
                </View>
                {/* Circle + Text */}
                <View style={this.state.recent_sales == 0 ? styles.circle : styles.circledark}>
                  <Text style={this.state.recent_sales == 0 ? styles.blackfont : styles.whitefont}>{this.state.recent_sales}</Text>
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Sales</Text>
              </View> 
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('Deleted Request') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('DRequest')}>
          
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <MaterialCommunityIcons name="delete" style={styles.cardIcon} />
                </View>
                {/* Circle + Text */}
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Deleted Request</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('User Authorization') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('UserAuthorization')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <Feather name="user-check" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Authorization</Text>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={this._renderCard('LoginActivity') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('People')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <FontAwesome name="users" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Login Activity</Text>
              </View>
          </TouchableOpacity>


          <TouchableOpacity style={this._renderCard('Profile') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('Profile')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <MaterialCommunityIcons name="face-profile" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Profile</Text>
              </View>
          </TouchableOpacity>


          <TouchableOpacity style={this._renderCard('Notifications') === true ? styles.cardStyles : styles.hideCard} onPress={() => this.props.navigation.navigate('Notifications')}>
              {/* CARD Upper-Half Icon + Circle + Text */}
              <View style={styles.cardUpper}>
                {/* Icon */}
                <View style={styles.cardIconView}>
                  <MaterialCommunityIcons name="bell" style={styles.cardIcon} />
                </View>
              </View>
              {/* CARD Lower-Half Text */}
              <View>
                <Text style={styles.cardNameText}>Notifications</Text>
              </View>
          </TouchableOpacity>

          

        </View>
        </Content>
      </Container>
  		)
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

export default (connect(mapStateToProps,mapDispatchToProps)(Home));