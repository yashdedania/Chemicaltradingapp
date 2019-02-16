import React,{Component} from 'react';
import {View,Text,FlatList,RefreshControl,TouchableOpacity,Keyboard,NativeModules, processColor} from 'react-native';
import { connect } from 'react-redux';
import {Toast, Container,Content,Title,Left,Body,Right,Input,ActionSheet} from 'native-base';
import MylistView from './MylistView';
import sales from '../../api/sales';
import gstyles from '../../theme/styles/general';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AlertAsync from "react-native-alert-async";
import SocketIOClient from 'socket.io-client';
import urls from '../../api/apivariable';
import hstyles from '../../theme/styles/header';
import colors from '../../theme/color';
import Loader from '../../components/Loader';
import Ionicons from '@expo/vector-icons/Ionicons';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
import searchData from '../../api/searchfilter';
const { StatusBarManager } = NativeModules;
const BUTTONS = [
    {text:"Newest First",index:0},
    {text:"Oldest First",index:1},
    {text:"Sort By CC No. (ASC)",index:2},
    {text:"Sort By CC No. (DSC)",index:3},
    {text:"Cancel",index:4}
];
class RejectedRequest extends Component {
    static navigationOptions = {
        tabBarLabel:'Rejected',
        tabBarIcon:({tintColor}) => (
            <MaterialCommunityIcons name='cancel' color={tintColor} size={20} />
        )
    };
    constructor(props){
        super(props);
        this.state = {
            listArray:[],
            fullData:[],
            loading:false,
            refreshing:false,
            nodatatext:'',
            blur:false,
            showToast: false,
            query:'',
            searchbarVisible:false,
            searchBarFocused:false,
        };
        this._isMounted = false;
        this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_salesrequests');
    }

    _socketConnect = () =>{
        this.socket.on('sales_request',(data) => {
            console.log("in pending SAME data recieved: "+data);
            this.setState({loading:true});
            this.refetch();
        });
    }
    _socketDisconnect = () =>{
        this.socket.close();
        this.socket.disconnect();
    }
    componentDidMount(){
        this._isMounted = true;
        if(this._isMounted){
            this._socketConnect();
            this.setState({loading:true});
            this.refetch();
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

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
                    this.setState({blur:false,loading:true});
                    this.refetch();
                  }   
              }
            }
        );
    }
    componentWillUnmount(){
        this.didBlurSubscription.remove();
        this.willFocusSubscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._socketDisconnect();
    }
    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            this.refetch();
        }
    }
    refetch = async() => {
        let extra = {...this.state};
        extra.refreshing = false;
        extra.loading = false;
        var resp = await sales.findall({request_status:'rejected'});
            if(resp !== false){
                if(resp.status !== 'error'){
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
    _onPressItem = (params) =>{
        params.screenname = 'rejected';
        params.page = null;
        params.extraedit = null;
        this.props.navigation.navigate('SalesRequestDetails',{...params});
        console.log("Request sent");
    }
    _onSingleUpdate = async (params) => {
        var choice = false;
        choice = await AlertAsync(
            'Delete Request',
            'Are you sure you want to delete this request?',
            [
              {text:'Yes',onPress:() => true},
              {text:'No',onPress:() => false}
            ],
            {cancelable:false}
        );
        var body = {};
        if(choice){
            body.request_status = 'deleted';
            body.id = params.id;
            
            if(this._isMounted){
                this.setState({loading:true});
            }
            
            
            let resp = await sales.singleupdate(body);
            if(resp !== false){
                if(resp.status !== 'error'){
                    console.log("Chemical request status successfully updated");
                    console.log("ROutes changed");
                    //this.setState({loading:false});
                    if(this._isMounted){
                        this.refetch();
                    }
                    
                    Toast.show({text: "Request Successfully Deleted!",buttonText: "Okay",type: "success"});
                }
                else{
                    if(this._isMounted){
                        this.refetch();
                    }
                    Toast.show({text: resp.result,buttonText: "Okay",type: "warning"});
                    console.log("In request detail error recieved");
                    
                }
            }
            else{
                if(this._isMounted){
                    this.refetch();
                }
                
                Toast.show({text: "Couldn't communicate with server. Please try again",buttonText: "Okay",type: "danger"});
                console.log("False data recieved in Request Details");
            }
        }
    }
    _renderItem = ({item}) =>(
        <MylistView
            data = {{...item}}
            onPressItem = {this._onPressItem}
            screenname = "rejected"
            onSingleUpdate = {this._onSingleUpdate}
            extrabut = "Delete"
        />
    );
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
            return searchData.contains(chemical,formatText);
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
    _handlefilter = (name) =>{
        if(name == 'sort'){
            ActionSheet.show(
                {
                  options: BUTTONS,
                  cancelButtonIndex:4,
                  title: "SORT BY",
                  tintColor:colors.primary
                },
                buttonIndex => {
                    this._handleSort(BUTTONS[buttonIndex]);
     
                }
            );
        }
        if(name == 'filter'){

        }
    }
    _handleSort = async(data) =>{
        let extra = {...this.state}
        if(data.index == 0){
            extra.listArray = _.orderBy(extra.fullData,'updatedAt','desc');
        }
        else if(data.index == 1){
            extra.listArray = _.orderBy(extra.fullData,'updatedAt','asc');
        }
        else if(data.index == 2){
            extra.listArray = _.orderBy(extra.fullData,'id','asc');
        }
        else if(data.index == 3){
            extra.listArray = _.orderBy(extra.fullData,'id','desc');
        }
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }

    }
    render(){
        return(
            <Container style={this.state.searchBarFocused ? hstyles.blurBackground : null}>
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
                                <Title style={hstyles.headtitle}>Rejected Sales Request</Title>
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
                    <View style={hstyles.filterContainer}>
                            <TouchableOpacity onPress={() => this._handlefilter('sort')} style={hstyles.filterTypes}><MaterialCommunityIcons name="sort" style={hstyles.filterIcon}/><Text style={hstyles.filterText}>Sort</Text></TouchableOpacity>
                    </View>
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
  
  
export default (connect(mapStateToProps)(RejectedRequest));