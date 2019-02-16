import React, { Component } from "react";
import {View,Text,FlatList,RefreshControl,TouchableOpacity,Keyboard,NativeModules, processColor} from 'react-native';
import { connect } from 'react-redux';
import {Toast, Container,Content,Body,Left,Right,Title,Input} from 'native-base';
import SocketIOClient from 'socket.io-client';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import AlertAsync from "react-native-alert-async";
import urls from '../../api/apivariable';
import gstyles from '../../theme/styles/general';
import sales from '../../api/sales';
import request from '../../api/request';
import Loader from '../../components/Loader';
import MylistView from './MylistView';
import PurchaseLinkModal from './PurchaseLinkModal';
import hstyles from '../../theme/styles/header';
import colors from '../../theme/color';
import searchData from '../../api/searchfilter';
import Ionicons from '@expo/vector-icons/Ionicons';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
const { StatusBarManager } = NativeModules;
class PurchaseLinkList extends Component {
    constructor(props){
        super(props);
        const {params} = props.navigation.state;
        this.state = {
            listArray:[],
            fullData:[],
            loading:false,
            refreshing:false,
            nodatatext:'',
            blur:false,
            showToast: false,
            modalVisible:false,
            currentparams:{},
            saleparams:params === null ? null : params,
            query:'',
            searchbarVisible:false,
            searchBarFocused:false,
        };
        this_isMounted = false;
        this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_requests');
    }
    componentDidMount = () =>{
        this._isMounted = true;
        if(this._isMounted){
            console.log("In mounted of fetch");
            this.setState({loading:true});
        }
        this.refetch();
        this._socketConnect();
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
                    this.refetch();
                  }   
              }
            }
        );
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    
    }
    componentWillUnmount = () => {
        this._isMounted = false;
        this.didBlurSubscription.remove();
        this.willFocusSubscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
        this._socketDisconnect();
    }
    _socketConnect = () =>{
        this.socket.on('request',(data) => {
            console.log("in pending SAME data recieved: "+data);
            if(this._isMounted){
                //this.refetch();
            }   
        });
    }
    _socketDisconnect = () =>{
        this.socket.close();
        this.socket.disconnect();
    }
    refetch = async() => {
        var body = {};
        var selling_type = '';
        let extra = {...this.state};
        if(this.state.saleparams !== undefined && this.state.saleparams !== null){
            body.chemical_name = this.state.saleparams.chemical_name;
            body.delivery_place = this.state.saleparams.delivery_place;
            body.request_status = ['added to inventory','verified'];
            body.delivery_date = this.state.saleparams.delivery_date;
            body.selling_quantity = this.state.saleparams.selling_quantity;
            selling_type = this.state.saleparams.selling_type.type;
            body.page = "Pending_Purchase";
            if(selling_type == 'Highseas' || selling_type == 'Contract'){
                body.selling_type = ['Self Import','Highseas','Contract'];
            }
            else if(selling_type == 'Bond Transfer'){
                body.selling_type = ['Bond Transfer','GST','Highseas'];
            }
            else if(selling_type == 'GST'){
                body.selling_type = ['GST','Highseas','Bond Transfer','Self Import','Contract'];
            }
            else if(selling_type == "Indent Sales"){
                body.selling_type = ['Indent Purchase'];
            }
            var resp = await request.findall(body);
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
                    
                    console.log("Printing Array length: "+this.state.listArray.length);
                    //console.log(this.state);
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
        
    }
    _onPressItem = (params) =>{
        let extra = {...this.state};
        extra.modalVisible = true;
        extra.currentparams = params;
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }
    _onDismiss = () =>{
        let extra  = {...this.state}
        extra.modalVisible = false;
        extra.currentparams = {};
        if(this._isMounted){
            this.setState({...this.state,...extra});
            console.log("On dismiss modal closed");
        }
    }
    _onLink = async(params) => {
        console.log("In On Link pressed");
        var choice = false;
        var total_pending = params.total_pending == null ? 0 : parseFloat(params.total_pending);
        if(total_pending < parseFloat(params.extra_purchase_quantity) && parseFloat(params.extra_purchase_quantity) > 0){
            var message = "Are your sure you want to link this order with CC NO.: "+params.id+" to Sales order with CC No."+this.state.saleparams.id;
            choice = await AlertAsync(
                'Link Order',
                message,
                [
                {text:'Yes',onPress:() => true},
                {text:'No',onPress:() => false}
                ],
                {cancelable:false}
            );
            var body = {};
            if(choice){
                body.sales_id = this.state.saleparams.id;
                body.purchase_id = params.id;
                body.selling_quantity = this.state.saleparams.selling_quantity;
                body.purchase_quantity = params.extra_purchase_quantity
                if(this._isMounted){
                    this.setState({loading:true});
                }
                let resp = await sales.pendingpurchase(body);
                if(resp !== false){
                    if(resp.status !== 'error'){
                        console.log("Chemical request status successfully updated");
                        console.log("ROutes changed");
                        Toast.show({text: "Order Successfully Linked!",buttonText: "Okay",type: "success"});
                        this.props.navigation.goBack();
                    }
                    else{
                        if(this._isMounted){
                            this.setState({loading:false});
                            this.refetch();
                        }
                        Toast.show({text: resp.result,buttonText: "Okay",type: "warning"});
                        console.log("In request detail error recieved");
                        
                    }
                }
                else{
                    if(this._isMounted){
                        this.setState({loading:false,refreshing:false});
                    }
                    Toast.show({text: "Couldn't communicate with server. Please try again",buttonText: "Okay",type: "danger"});
                    console.log("False data recieved in Request Details");
                }
            }

            else{
                if(this._isMounted){
                    this.setState({loading:false,refreshing:false});
                }
            }
        }   
        else{
            choice = await AlertAsync(
                'Warning',
                'Pending Orders is greater than or equal to the quantity in stock. Please Contact admin to first clear the pending request for this bulk',
                [
                  {text:'Okay',onPress:() => true}
                ],
                {cancelable:true}
            );
            if(this._isMounted){
                this.setState({loading:false,refreshing:false});
            }
        } 
    }
    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            console.log("Starting refresh");
            this.refetch();
            console.log("after refresh");
        }   
    }
    _renderItem = ({item}) =>(
        <MylistView
            data = {{...item}}
            onPressItem = {this._onPressItem}
            screenname = "Purchase"
            onLink = {this._onLink}
            extrabut = "Link this Purchase"
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


    render() {
        return(
            <Container style={this.state.searchBarFocused ? hstyles.blurBackground : null}>
                <PurchaseLinkModal visibile={this.state.modalVisible} data={{...this.state.currentparams}} dismiss={this._onDismiss} />
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
                                <Title style={hstyles.headtitle}>Similar Orders</Title>
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

export default (connect(mapStateToProps)(PurchaseLinkList));
