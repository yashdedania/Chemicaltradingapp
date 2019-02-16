import React, { Component } from "react";
import {Container,Content,View,Text,Input,Body,Left,Right,Title} from 'native-base';
import {RefreshControl,FlatList,TouchableOpacity,Keyboard,NativeModules, processColor} from 'react-native';
import gstyles from '../../theme/styles/general';
import activity from '../../api/activity';
import urls from '../../api/apivariable';
import NotificationList from './NotificationList';
import SalesNotModal from './SalesNotModal';
import SocketIOClient from 'socket.io-client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import hstyles from '../../theme/styles/header';
import colors from '../../theme/color';
import Loader from '../../components/Loader';
import searchData from '../../api/searchfilter';
import Ionicons from '@expo/vector-icons/Ionicons';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
const { StatusBarManager } = NativeModules;
import { connect } from 'react-redux';

class SalesNotification extends Component {
    static navigationOptions = {
        tabBarLabel:'Sales',
        tabBarIcon:({tintColor}) =>(
            <MaterialCommunityIcons name='sale' color={tintColor} size={20} />
        )
    };
    constructor(props){
        super(props);
        this.state = {
            listArray:[],
            fullData:[],
            loading:false,
            refreshing:false,
            blur: false,
            currentparams:{},
            modalVisible:false,
            nodatatext:'',
            query:'',
            searchbarVisible:false,
            searchBarFocused:false,
        };
        this._isMounted = false;
        this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_activity');
    }
    componentDidMount = () =>{
        this._isMounted = true;
        this.didBlurSubscription = this.props.navigation.addListener(
            'didBlur',
            payload => {
                if(this._isMounted){
                    this.setState({blur:true});
                } 
            }
        );
        this.willFocusSubscription = this.props.navigation.addListener(
            'willFocus',
            payload => {
              if(this.state.blur){
                  if(this._isMounted){
                    this.setState({blur:false});
                    
                  }   
              }
            }
        );
        if(this._isMounted){
            this._socketConnect();
            this.setState({loading:true});
            this._fetchData();
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);   
    
    }
    _socketConnect = () =>{
        this.socket.on('purhcase_activity',(data) => {
          //console.log("Activity recieved: "+data);
          extra.listArray.unshift(data);
          extra.fullData.unshift(data);
          if(this._isMounted){
              this.setState({...this.state,...extra});
          }
        });
    }
    _socketDisconnect = () =>{
        this.socket.close();
        this.socket.disconnect();
        console.log("Socket Disconnected");
    }
    _fetchData = async() =>{
        var resp = await activity.getactivity({page:'Sales'});
            let extra = {...this.state};
            extra.refreshing = false;
            extra.loading = false;
            if(resp !== false){
                if(resp.status !== 'error'){
                    //console.log("Data Received: "+resp.result.length);
                    extra.listArray = resp.result;
                    extra.fullData = resp.result;
                    if(resp.result === null || resp.result === undefined || resp.result.length <= 0 ){
                        extra.nodatatext = "No Data Available";
                    }

                }
                else{
                    console.log("Error recieved from server");
                    console.log(resp.result);
                }
            }
            else{
                console.log("False error in purchase Request");
            }
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }   
    componentWillUnmount = () =>{
        this._isMounted = false;
        this.didBlurSubscription.remove();
        this.willFocusSubscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._socketDisconnect();
    }
    
    _OpenModal = (params) =>{
        let extra = {...this.state};
        console.log("In openModal");
        extra.modalVisible = true;
        extra.currentparams = params;
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }
    _onDismiss = () =>{
        if(this._isMounted){
            let extra  = {...this.state}
            extra.modalVisible = false;
            extra.currentparams = {};
            this.setState({...this.state,...extra});
            console.log("On dismiss modal closed");
        }
    }
    _renderItem = ({item}) =>{
        let id = this.props.user.details.id;
        let role  = this.props.user.details.role;
        let requestid;
        if(item.sale !== null && item.sale !== undefined){
            requestid = item.sale.user.id;
        }
        if(role == "admin"){
            return(
                <NotificationList 
                    data = {{...item}}
                    openModal = {this._OpenModal}
                />
            );
        }
        else if(requestid == id){
            return(
                <NotificationList 
                    data = {{...item}}
                    openModal = {this._OpenModal}
                />
            );
        }
        else{
            return null;
        }
        
    }
    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            this._fetchData();
        }
    }
    _keyboardDidShow = () =>{
        if(this._isMounted && this.state.searchbarVisible){
            this.setState({searchBarFocused:true});
        }
    }
    _keyboardWillShow = () =>{
        if(this._isMounted && this.state.searchbarVisible){
            this.setState({searchBarFocused:true});
        }
    }
    _keyboardDidHide = () =>{
        if(this._isMounted){
            this.setState({searchBarFocused:false});
        }    
    }


    _handleSearch = async(text) =>{
        let extra = {...this.state};
        extra.query = text;
        await this.setState({...this.state,...extra});
        this._searchQuery();
    }
    _searchQuery = ()=>{
        let extra = {...this.state};
        const formatText = extra.query.toLowerCase();
        const data = _.filter(this.state.fullData,chemical => {
            return searchData.activityContains(chemical,formatText);
        });
        if(data === null || data.length <= 0){
            extra.nodatatext = "No Data Available"
        }
        if(this._isMounted){
            extra.listArray = data;
            this.setState({...this.state,...extra});
        }
    }
    _showSearch = () =>{
        if(this._isMounted){
            this.setState({searchbarVisible : true});
        }
        this.view.transitionTo({backgroundColor:colors.background});
        StatusBarManager.setStyle('dark-content');
        StatusBarManager.setColor(processColor('#E0E0E0'),true);
    }
    _clearSearch = async() =>{
        console.log("Clear search excuted");
        if(this._isMounted){
            await this.setState({query:''});
        }
        this._searchQuery();
    }
    _hideSearch = async() =>{
        let extra = {...this.state};
        extra.query = '';
        extra.searchbarVisible = false;
        if(this._isMounted){
            await this.setState({...this.state,...extra});
        }
        this.view.transitionTo({backgroundColor:colors.primary});
        StatusBarManager.setStyle('light-content');
        StatusBarManager.setColor(processColor('#FF5964'),true);
        this._searchQuery();
    }
    handleViewRef = ref => this.view = ref;

    render() {
        return(
            <Container>
                <SalesNotModal visibile={this.state.modalVisible} data={{...this.state.currentparams}} dismiss={this._onDismiss} />
                <Animatable.View ref={this.handleViewRef}  style={hstyles.header}>
                        <View style={[hstyles.headerContainer,this.state.searchbarVisible ? hstyles.lightbackground : hstyles.darkbackground]}>
                        <Left style={hstyles.left}>
                            {!!this.state.searchbarVisible ? (
                                <TouchableOpacity onPress={() => this._hideSearch()}>
                                   <Animatable.View animation="rotate" duration={500}><MaterialCommunityIcons  name="arrow-left" style={hstyles.darkicon}/></Animatable.View>
                                </TouchableOpacity>
                            ):(
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                                    <MaterialCommunityIcons name="home" style={hstyles.icon} />
                                </TouchableOpacity>
                            )}  
                        </Left>
                        <Body style={hstyles.body}>
                            {!!this.state.searchbarVisible ? (
                               <Input style={hstyles.inputField} placeholder="Search"  onChangeText={(text) => this._handleSearch(text)} value={this.state.query} /> 
                            ):(
                                <Title style={hstyles.headtitle}>Sales Activity</Title>
                            )}
                            
                        </Body>
                        <Right style={hstyles.right}>
                            {(!!this.state.searchbarVisible) ? (null):(
                                <TouchableOpacity onPress={() => this._showSearch()}>
                                    <Ionicons name="ios-search" style={hstyles.icon} />
                                </TouchableOpacity>
                            )}
                            {(!!this.state.searchbarVisible && this.state.query.length > 1) ? (
                                <TouchableOpacity onPress={() => this._clearSearch()}>
                                    <MaterialCommunityIcons name ="close" style={hstyles.darkicon} />
                                </TouchableOpacity>
                            ):(null)}   
                        </Right>
                        </View>
                    </Animatable.View>
                
                <Loader loading={this.state.loading} />
                {(this.state.listArray !== null && this.state.listArray !== undefined && this.state.listArray.length > 0) ? 
                (
                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        data={this.state.listArray}
                        renderItem={this._renderItem}
                        keyExtractor={item => (item.id).toString()}
                    />
                    </Content>
                ):(
                    <View style= {gstyles.emptyContainer}>
                        <Text style={{color:'rgb(0,0,0)',fontSize:24}}>{this.state.nodatatext}</Text>
                    </View>
                )}
                
            </Container>
        );
    }
}
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
};
export default (connect(mapStateToProps)(SalesNotification))

