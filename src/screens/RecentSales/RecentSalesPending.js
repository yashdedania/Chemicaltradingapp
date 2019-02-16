import React, { Component } from 'react';
import { Container, Content,  ListItem, 
  Text, Left, Body, View,Right,Title,Input,ActionSheet} from 'native-base';
import {FlatList,RefreshControl,TouchableOpacity,Keyboard,NativeModules, processColor} from 'react-native';
import { connect } from 'react-redux';
import SocketIOClient from 'socket.io-client';
import urls from '../../api/apivariable';
import sales from '../../api/sales';
import styles from '../../theme/styles/inventorylist';
import gstyles from '../../theme/styles/general';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import hstyles from '../../theme/styles/header';
import colors from '../../theme/color';
import Loader from '../../components/Loader';
import searchData from '../../api/searchfilter';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import AlertAsync from "react-native-alert-async";
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
const { StatusBarManager } = NativeModules;
const BUTTONS = [
    {text:"Newest First",index:0},
    {text:"Oldest First",index:1},
    {text:"Sort By CC No. (ASC)",index:2},
    {text:"Sort By CC No. (DSC)",index:3},
    {text:"Cancel",index:4}
]

class Incoming extends Component {
	static navigationOptions = {
        tabBarLabel:'Pending',
        tabBarIcon:({tintColor}) =>(
            <MaterialIcons name='import-export' color={tintColor} size={20} />
        )
    };
    
    constructor(props) {
      super(props);

      this.state = {
        loading: false,
        refreshing:false,
        blur:false,
        listArray:[],
        fullData:[],
        nodatatext:'',
        query:'',
        searchbarVisible:false,
        searchBarFocused:false,
      };
      this.socket = SocketIOClient(`${urls.SERVER_API}`+'/socket_salesrequests');
      this._isMounted = false;
      this.count = 0;
      this.previousChemical = "";
    }

    _socketConnect = () =>{
        this.socket.on('sales_request',(data) => {
            if(this._isMounted){
                this.setState({loading:true});
                this._refetch();
            }   
        });
    }
    _socketDisconnect = () =>{
        this.socket.close();
        this.socket.disconnect();
    }

    componentDidMount = () =>{
        this._isMounted = true;
        if(this._isMounted){
            this._socketConnect();
            this.setState({loading:true});
            this._refetch();
        }
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }
    componentWillUnmount = () =>{
        this._isMounted = false;
        this._socketDisconnect();
        this.keyboardDidShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _refetch = async() =>{
        if(this._isMounted){
            var body = {};
            body.page = "recent_sales";
            body.request_status = "subtracted from inventory";
            var resp = await sales.findall(body);
            let extra = {...this.state};
            extra.refreshing = false;
            extra.loading = false;
            if(resp !== false){
                if(resp.status !== 'error'){
                    //console.log("Data Received: "+resp.result.length);
                    extra.listArray = resp.result;
                    extra.fullData = resp.result;
                    if(resp.result === null || resp.result === undefined || resp.result.length <= 0 ){
                        extra.nodatatext = "No Data Avaible";
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
            this.setState({...this.state,...extra});
        }
    }
    _onPressItem = (params) =>{
        this.props.navigation.navigate('RecentSalesDetails',{...params});
    }
    _renderVerify = (name) =>{
        var role = this.props.user.details.role;
        var accessto = this.props.user.details.accessto;
        if(role == "admin"){
            return 'flex';
        }
        else if(accessto.indexOf('Verify') !== -1){
            return 'flex';
        }
        else{
            return 'none';
        }
    }
    _renderEdit = (name,params) =>{
        var role = this.props.user.details.role;
        var user_request = params.user.id;
        var id  = this.props.user.details.id;
        if(id == user_request || role == "admin"){
            return "flex";
        }
        else{
            return "none";
        }
    }
    _onPressList = (params) =>{
        params.page = "inventory";
        params.extraedit = "inventory";
        this.props.navigation.navigate('SalesRequestDetails',{...params});
    }
    _onPressDelete = async(params) =>{
        let body = {};
        var choice = false;
        let resp  = false;
        var message = "Are your sure you want to Delete this order with CC NO.: "+params.id;
        choice = await AlertAsync(
            'Delete Order',
             message,
            [
              {text:'Yes',onPress:() => true},
              {text:'No',onPress:() => false}
            ],
            {cancelable:false}
        );
        if(choice){
            
            if(this._isMounted){
                this.setState({loading:true});
                if(params.sales_id == null){
                    body.request_status = "deleted";
                    body.id = params.id; 
                    resp = await sales.singleupdate(body);
                }
                else{
                    body.sales_id = params.id;
                    body.purchase_id = params.sales_id == null ? null : params.request.id;
                    body.selling_quantity = params.selling_quantity;
                    body.purchase_quantity = params.sales_id == null ? null : params.request.extra_purchase_quantity;
                    body.page = "delete";
                    resp = await sales.unlink(body);
                }
                if(resp !== false){
                    if(resp.status !== 'error'){
                        this._refetch();
                    }
                    else{
                        console.log("Error recieved from server");
                        this._refetch();
                        console.log(resp.result);
                    }
                }
                else{
                    this._refetch();
                    console.log("False error in purchase Request");
                }
            }
                
        }
    }
    _renderDelete = (name,params) =>{
        var role = this.props.user.details.role;
        var user_request = params.user.id;
        var id  = this.props.user.details.id;
        if(id == user_request || role == "admin"){
            return "flex";
        }
        else{
            return "none";
        }
    }
    _onPressVerify = async(params) =>{
        var body = {};
        let choice = false;
        if(params !== undefined && params !== null){
            if(params.sales_id !== null && params.sales_id !== undefined && params.sales_id !== false){
                var message = "Are you sure you want to verify this order with CC No. "+params.id;
                choice = await AlertAsync(
                    'Verify Sales Order',
                    message,
                    [
                      {text:'Yes',onPress:() => true},
                      {text:'No',onPress:() => false}
                    ],
                    {cancelable:false}
                );
                if(choice){
                    body.request_status = 'verified';
                    body.id = params.id;
                    this.setState({loading:true});
                    let resp = await sales.singleupdate(body);
                    if(resp !== false){
                        if(resp.status !== 'error'){
                            console.log("Chemical request status successfully updated");
                            this._refetch();
                            console.log("ROutes changed");
                        }
                        else{
                            console.log("In request detail error recieved");
                            this._refetch();
                        }
                    }
                    else{
                        console.log("False data recieved in Request Details");
                        this._refetch();
                    }
                }
            }
            else{
                choice = await AlertAsync(
                    'Warning',
                    "You can't verify orders that are not linked to any purchase order. Please link this order to any purchase order from purchase pending section.",
                    [
                      {text:'Okay',onPress:() => true},
                    ],
                    {cancelable:true}
                  );
            }
        }
    }
    _renderItem = ({item}) =>{
        var flag = false;
        if(this.previousChemical != item.chemical_name){
            flag = true;
        }
        else{
            flag = false;
        }
        this.previousChemical = item.chemical_name;
        return(
            <View style={{flex:1,flexDirection:"column",margin:0,padding:0}} >
            {flag ? (
                <ListItem itemDivider>
                    <Text>{item.chemical_name}</Text>
                </ListItem>
            ):(null)}
            <ListItem thumbnail style={{flex:1,flexDirection:"row",margin:10}} onPress={() => this._onPressItem(item)}>
                <Left>
                    <View style={styles.circle}>
                        <Text style={[gstyles.textMedium,gstyles.transformUpp]}>{(item.chemical_name).substring(0,3).toUpperCase()}</Text>  
                    </View>
                </Left>
                <Body>
                    <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Name :</Text>{item.chemical_name}</Text>
                    <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>CC Number :</Text> {item.id} </Text>
                    <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Quantity:</Text> {item.selling_quantity} MT </Text>
                    <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Status :</Text> {item.sales_id === null ? 'Not Linked' : "Linked to CC No. "+item.sales_id} </Text>
                </Body>
                <Right>
                    <TouchableOpacity style={{marginTop:5,marginBottom:5,display:this._renderEdit('edit',item)}} onPress={() => this._onPressList(item)}><Text style={gstyles.salesText}>Edit</Text></TouchableOpacity>
                    <TouchableOpacity style={{display:this._renderVerify('verify')}} onPress={() => this._onPressVerify(item)}><Text style={gstyles.salesText}>Verify</Text></TouchableOpacity>
                    <TouchableOpacity style={{marginTop:5,marginBottom:5,display:this._renderDelete('delete',item)}} onPress={() => this._onPressDelete(item)}><Text style={gstyles.salesText}>Delete</Text></TouchableOpacity>

                </Right>
            </ListItem>
            </View>
        );
    };
    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            this._refetch();
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
            extra.listArray = _.orderBy(extra.fullData,['chemical_name','updatedAt'],['asc','desc']);
        }
        else if(data.index == 1){
            extra.listArray = _.orderBy(extra.fullData,['chemical_name','updatedAt'],['asc','asc']);
        }
        else if(data.index == 2){
            extra.listArray = _.orderBy(extra.fullData,['chemical_name','id'],['asc','asc']);
        }
        else if(data.index == 3){
            extra.listArray = _.orderBy(extra.fullData,['chemical_name','id'],['asc','desc']);
        }
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }

    }
    render() {
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
                                <Title style={hstyles.headtitle}>Pending Sales Order</Title>
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
export default (connect(mapStateToProps)(Incoming));