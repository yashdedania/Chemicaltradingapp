// Import Component From Ract
import React, { Component } from 'react';
// Import View, Text, StyleSheet, AsyncStorage from react-native
import {
  View, Container, Text, ListItem,
  Left, Body,Title,  Content, Thumbnail,Right
} from 'native-base';
import {TouchableOpacity,Linking,FlatList,RefreshControl} from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import styles from '../../theme/styles/staffdetails';
import sltyles from '../../theme/styles/staff_list';
import gstyles from '../../theme/styles/general';
import format from '../../components/dateformat';
import Loader from '../../components/Loader';
import activity from '../../api/activity';
import user from '../../api/user';
import UserModal from '../User/UserModal';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import hstyles from '../../theme/styles/header';
// Creating a Component

class StaffDetails extends Component {
    constructor(props) {
        super(props);
        this._isMounted = false;
        console.log("In staff Details constructor");
        this.params = props.navigation.state.params; 
        this.state = {
            userData:props.navigation.state.params == null ? null : props.navigation.state.params,
            listArray:[],
            loading:false,
            refreshing:false,
            blur: false,
            staffModal:false
        }        
    }
    componentDidMount = () =>{
        this._isMounted = true;
        if(this._isMounted){
            this.setState({loading:true});
            this._fetchData();
        }
    }
    componentWillUnmount = () =>{
        this._isMounted = false;
    }
    _fetchData = async() =>{
        let extra = {...this.state};
        var resp = await activity.getactivity({id:this.state.userData.id});
        if(resp !== false){
            if(resp.status == 'ok'){
                console.log("In activity data received");
                //console.log(resp);
                extra.listArray = resp.result;
                extra.loading = false;
                extra.refreshing = false;
                //extra.refreshing = false;
                if(this._isMounted){
                    this.setState({...this.state,...extra});
                }
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
    _fetchuser = async() =>{
        let extra = {...this.state};
        var resp = await user.findAllUser({id:this.state.userData.id,page:"details"});
        if(resp !== false){
            if(resp.status == 'ok'){
                console.log("In activity data received");
                
                console.log(resp.result);
                extra.userData = resp.result[0];
                //extra.listArray = resp.result[0].activities;
                extra.loading = false;
                extra.refreshing = false;
                //extra.refreshing = false;
                if(this._isMounted){
                    this.setState({...this.state,...extra});
                }
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
    _openModal = (params) =>{
        let extra = {...this.state};
        extra.staffModal = true;
        if(this._isMounted){    
            this.setState({staffModal:true});
        }
    }
    _onDismiss =()=>{
        let extra = {...this.state};
        extra.staffModal = false;
        if(this._isMounted){    
            this.setState({...this.state,...extra});
        }
    }
    _onUpdate = async(params) =>{
        if(this._isMounted){
            this.setState({loading:true});
            let errors = {...this.state};
            var resp = await user.singleUpdate(params);
            errors.staffModal = false;
            errors.loading = true;
            if(resp !== false){
                if(resp.status == 'ok'){
                    console.log("In activity data received");
                    
                }
                else{
                    console.log("error recieved");
                }
            }
            else{
                console.log("False data recieved");
            }
            if(this._isMounted){
                this.setState({...this.state,...errors});
                this._fetchuser();
            }
        }

    }
    _onPress = (name) =>{
        var href = '';
        if(name == 'phone'){
            href = 'tel:+91'+this.state.userData.mobileno;
        }
        if(name == 'sms'){
            href = 'sms:+91'+this.state.userData.mobileno;
        }
        Linking.openURL(href);
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
    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            this._fetchData();
        }
        console.log("after refresh");
    }
    _onSubmit = (name,data) =>{
        data.page = "normal";
        this.setState({loading:true});
        if(name == "Update"){
            this._onUpdate(data);
        }
        this._onDismiss();
    }
    _block = async(name,data) =>{
        data.page = "block";
        data.name = name;
        if(this._isMounted){
            this.setState({loading:true});
            let errors = {...this.state};
            var resp = await user.singleUpdate(data);
            errors.staffModal = false;
            errors.currentData = null;
            errors.loading = false;
            if(resp !== false){
                if(resp.status == 'ok'){
                    console.log("In activity data received");
                    //errors.refreshing = true;
                }
                else{
                    console.log("error recieved");
                }
            }
            else{
                console.log("False data recieved");
            }
            if(this._isMounted){
                this.setState({...this.state,...errors});
                this._fetchData();
            }
        }

    }
  render() {
      return(
          <Container style={gstyles.container_background}>
            <UserModal visibile={this.state.staffModal} data={{...this.state.userData}} dismiss={this._onDismiss} submitForm={this._onSubmit} block={this._block}/>

            <Loader loading = {this.state.loading} />
              <View style={hstyles.header}>
                <View style={hstyles.headerContainer}>
                  <Left style={hstyles.left}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                      <MaterialCommunityIcons name="home" style={hstyles.icon} />
                    </TouchableOpacity>
                  </Left>
                  <Body style={hstyles.body}>
                    <Title style={hstyles.headtitle}>Staff Details</Title>
                  </Body>
                  <Right style={hstyles.right} />
                </View>
              </View>

              <View style={styles.cardBody}>
                    <View style={styles.circle}>
                        <Thumbnail style={styles.thumbnailStyles}  source={{uri:this.state.userData.imageuri,cache:'reload'}} />
                    </View>

                    <View style={styles.textView}>
                        <View style={styles.nameEmployee}><Text style={styles.employeenameStyle}>Name: {this.state.userData.username.charAt(0).toUpperCase() + this.state.userData.username.slice(1)}</Text></View>
                        <View style={styles.AccessContrl}><Text style={[gstyles.textThemeColor, gstyles.textMedium]}>Access To:</Text></View>
                        <View><Text style={gstyles.textMedium}>{this.state.userData.accessto.join(",")}</Text></View>
                    </View>

                    <TouchableOpacity style={{ alignItems: 'center' }} onPress={() => this._openModal()}>
                        <FontAwesome name="edit" style={styles.editIcon} />
                    </TouchableOpacity>
                </View>



                <View style={styles.actionCard}>
                   
                    <TouchableOpacity style={styles.callIconView} onPress={() => this._onPress('phone')}>
                        <View><Text> <FontAwesome name="phone" style={styles.callIcon} /> </Text></View>
                        <View style={styles.messagetextView}>
                            <Text style={styles.calltextstyle}>Call</Text>
                        </View>
                    </TouchableOpacity>

                    <SimpleLineIcons name="options-vertical" style={styles.verticalLine} />

                    <TouchableOpacity style={styles.MessageIconView} onPress={() => this._onPress('sms')}>
                        <View><Text><FontAwesome name="envelope" style={styles.messageIcon} /> </Text></View>
                        <View style={styles.messagetextView}>
                            <Text style={styles.messagetextstyle}>Send Message</Text>
                        </View>
                    </TouchableOpacity>                    

                </View>

                <View style={styles.requestdetailheaderview}>
                    <Text style={styles.requestdetailheadertext}> Latest Activity </Text>
                </View>
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
          </Container>
      );
  }
}

export default StaffDetails;