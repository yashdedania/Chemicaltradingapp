import React, { Component } from "react";
import { 
    View,
    TouchableOpacity,RefreshControl,Linking,Keyboard,NativeModules, processColor,FlatList
} from "react-native";
import {Container, Content, ListItem, Text, Thumbnail,Left,Right,Body,Title,Input} from 'native-base';
import { connect } from 'react-redux';
import activity from '../../api/activity';
import sltyles from '../../theme/styles/staff_list';
import gstyles from '../../theme/styles/general';
import format from '../../components/dateformat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import hstyles from '../../theme/styles/header';
import colors from '../../theme/color';
import Loader from '../../components/Loader';
import searchData from '../../api/searchfilter';
import Ionicons from '@expo/vector-icons/Ionicons';
import urls from '../../api/apivariable';
import _ from 'lodash';
import * as Animatable from 'react-native-animatable';
const { StatusBarManager } = NativeModules;

class SelfActivity extends Component {
    static navigationOptions = {
        tabBarLabel:'Self',
        tabBarIcon:({tintColor}) =>(
            <FontAwesome name='user' color={tintColor} size={20} />
        )
    };
    constructor(props){
        super(props);
        this._isMounted = false;
        this.state = {
            listArray:[],
            fullData:[],
            loading:false,
            refreshing:false,
            blur: false,
            query:'',
            searchbarVisible:false,
            searchBarFocused:false,
        }
        
    }
    componentDidMount = () =>{
        this._isMounted = true;
        if(this._isMounted){
            this.setState({loading:true});
            this._fetchData();
        }
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
                    this._fetchData();
                  }   
              }
            }
        );
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardWillShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);   
    }
    componentWillUnmount = () =>{
        this._isMounted = false;
        this.didBlurSubscription.remove();
        this.willFocusSubscription.remove();
        this.keyboardDidShowListener.remove();
        this.keyboardWillShowListener.remove();
        this.keyboardDidHideListener.remove();
    }
    _fetchData = async() =>{
        let extra = {...this.state};
        var body = {'id':this.props.user.details.id};
        var resp = await await activity.getactivity(body);
        extra.loading = false;
        extra.refreshing = false;
        if(resp !== false){
            if(resp.status == 'ok'){
                console.log("In activity data received");
                if(resp.result.length > 0 ){
                    console.log(" Yeah data received have length: "+resp.result.length);
                    extra.listArray = resp.result;
                    extra.fullData = resp.result;
                };
                
                
            }
            else{
                console.log("Error received");
                console.log(resp);
            }
        }
        else{
            console.log("False data recieved");
        }
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }
    _renderText = (item) =>{
        var text = "";
        if(item.user.role == "seller" && item.sale !== null){
            text = item.sale.chemical_name.substring(0,3).toUpperCase();
        }
        else if(item.user.role == "purchaser" && item.request !== null){
            text = item.request.chemical_name.substring(0,3).toUpperCase();
        }
        else{
            text = "LOG"
        }
        return text;
    }
    _renderItem = ({item}) =>(
        <ListItem  style={sltyles.ItemContainer}>
                <Left style={sltyles.ItemLeft}>
                    <View style={sltyles.TextContainer}>
                        <Text>{this._renderText(item)}</Text>
                    </View>   
                </Left>
                <Body style={sltyles.ItemBody}>
                    <Text>{item.activity_type}</Text>
                    <Text note>{item.activity_detail}</Text>
                </Body>
                <Right style={sltyles.ItemRight}>
                    <Text note>{format.Time(item.createdAt)}</Text>
                </Right>
        </ListItem>
    )

    _onPress = (name,params) =>{
        if(name == 'message'){
            var sms = "sms:+91"+params.mobileno;
            Linking.openURL(sms);
        }
        if(name == 'phone'){
            var href = "tel:+91"+params.mobileno;
            Linking.openURL(href);
        }
        if(name == 'details'){
            console.log("In details press");
            this.props.navigation.navigate('StaffDetails',{...params});
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
            return searchData.userContains(chemical,formatText);
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
                                <Title style={hstyles.headtitle}>Activity</Title>
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
                {(this.state.listArray !== null && this.state.listArray !== undefined && this.state.listArray.length > 0) ?(
                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                        <FlatList
                            data={this.state.listArray}
                            renderItem ={this._renderItem}
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
  
  
export default (connect(mapStateToProps)(SelfActivity));

