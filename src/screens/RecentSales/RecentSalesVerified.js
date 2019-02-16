/* eslint-disable max-len */
/* Importing Library to make a Component */

import React, { Component } from 'react';
import { Container, Content,  ListItem, 
  Text, Left, Body, View,Right,Input,Title,ActionSheet} from 'native-base';
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
/* Creating the Component */
class Ready extends Component {
	static navigationOptions = {
        tabBarLabel:'Verified',
        tabBarIcon:({tintColor}) =>(
            <MaterialIcons name='done-all' color={tintColor} size={20} />
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
            this.setState({loading:true});
            var body = {};
            body.page = "recent_sales";
            body.request_status = "verified";
            var resp = await sales.findall(body);
            let extra = {...this.state};
            extra.refreshing = false;
            extra.loading = false;
            if(resp !== false){
                if(resp.status !== 'error'){
                    extra.listArray = resp.result;
                    extra.fullData = resp.result;
                    if(resp.result === null || resp.result === undefined || resp.result.length <= 0 ){
                        extra.nodatatext = "No Data Avaible";
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
            this.setState({...this.state,...extra});
        }
    }
    _onPressItem = (params) =>{
        this.props.navigation.navigate('RecentSalesDetails',{...params});
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
            <View style={{flex:1,flexDirection:"column",margin:0,padding:0}}>
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
            </ListItem>
            </View>
        );
        
            
    }
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
        console.log("Rendering");
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
                                <Title style={hstyles.headtitle}>Verified Sales Orders</Title>
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
                        keyExtractor={(item) => item.id.toString()}
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
export default (connect(mapStateToProps)(Ready));