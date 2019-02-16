/* Importing Library to make a Component */

import React, { Component } from 'react';
import {
  Container, ListItem,
  Text, Left, Body,Right,Title, View, List, Content, Button
} from 'native-base';
import {TouchableOpacity,RefreshControl,FlatList} from 'react-native';
import gstyles from '../../theme/styles/general';
import styles from '../../theme/styles/requestsent';
import format from '../../components/dateformat';
import request from '../../api/request';
import sales from '../../api/sales';
import hstyles from '../../theme/styles/header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import PurchaseModal from './PurchaseModal';
import SalesModal from './SalesModal';
import MylistView from './MylistView';
import _ from 'lodash';
import AlertAsync from "react-native-alert-async";
import Loader from '../../components/Loader';
/* Creating the Component */
class InventoryDetails extends Component {
  constructor(props) {
    super(props);
    const {params} = props.navigation.state;
    this.state = {
      purchase_data:params,
      sales_data:(params.sales !== null && params.sales.length > 0) ? params.sales : null,
      purchase_id:params.id,
      loading:false,
      purchaseModal:false,
      refreshing:false,
      currentparams:{},
      salesModal:false,
      nodatatext:(params.sales !== null && params.sales.length > 0) ? '' : 'No Data Available'
    };
    this._isMounted = false; 
    console.log(this.state);
  }
  componentDidMount = () =>{
      this._isMounted = true;  
  }

  componentWillUnmount = () =>{
      this._isMounted = false;
  }
    refetch = async() =>{
      let extra = {...this.state}
      var body = {};
      body.id = extra.purchase_id;
      body.page = "inventory";
      body.request_status = "";
      if(this._isMounted){
          var resp = await request.findall(body);
            extra.loading = false;
            if(resp !== false){
                
                if(resp.status !== 'error'){
                    //console.log("Data Received: "+resp.result.length);
                    var x = resp.result[0];
                    extra.purchase_data = x;
                    extra.purchase_data.sales = null;
                    
                    if(x.sales !== null && x.sales !== undefined && x.sales.length > 0){
                        extra.sales_data = await _.orderBy(x.sales,'updatedAt','desc');
                    }
                    else{
                        extra.sales_data = null;
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
            console.log("Printing purchase Data");
            console.log(extra.purchase_data);
            await this.setState({...this.state,...extra});
        }  
    }
    _onDismiss = () =>{
        if(this._isMounted){
            this.setState({purchaseModal:false});
            console.log("On dismiss modal closed");
        }
    }
    _onSalesDismiss = () =>{
        let extra = {...this.state}
        extra.salesModal = false;
        extra.currentparams = {};
        if(this._isMounted){
            this.setState({...this.state,...extra});
            console.log("On dismiss modal closed");
        }
    }
    _openPurchase = () =>{
        if(this._isMounted){
            this.setState({purchaseModal:true});
        }
    }
    _onPressItem = (params) =>{
        let extra = {...this.state};
        extra.salesModal = true;
        extra.currentparams = params;
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }
    _onLink = async(params) =>{
        let extra = {...this.state};
        var choice = false;
        var message = "Are your sure you want to Unlink this order with CC NO.: "+params.id;
        choice = await AlertAsync(
            'UnLink Order',
             message,
            [
              {text:'Yes',onPress:() => true},
              {text:'No',onPress:() => false}
            ],
            {cancelable:false}
        );
        var body = {};
        if(choice){
            body.sales_id = params.id;
            body.purchase_id = this.state.purchase_data.id;
            body.selling_quantity = params.selling_quantity;
            body.purchase_quantity = this.state.purchase_data.extra_purchase_quantity;
            body.page = null;
            if(this._isMounted){
                this.setState({loading:true});
                var resp = await sales.unlink(body);
                
                if(resp !== false){
                    if(resp.status !== 'error'){
                        this.refetch();
                    }
                    else{
                        console.log("Error recieved from server");
                        this.setState({loading:false});
                        console.log(resp.result);
                    }
                }
                else{
                    this.setState({loading:false});
                    console.log("False error in purchase Request");
                }
                await this.setState({...this.state,...extra});
            }
        }
    }
    _renderItem = ({item}) =>(
        <MylistView
            data = {{...item}}
            onPressItem = {this._onPressItem}
            screenname = "Sales"
            onLink = {this._onLink}
            extrabut = "UnLink"
        />
    );

    _onRefresh = () =>{
        if(this._isMounted){
            this.setState({refreshing:true});
            this.refetch();
        }
        
    }

  render() {
    if(this.state.loading){

        return <Loader loading={this.state.loading} />
    }
    else{
    return (

      <Container style={styles.container}>
        {/* Header */}
        {/* Card */}
        
        <View style={hstyles.header}>
            <View style={hstyles.headerContainer}>
              <Left style={hstyles.left}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                  <MaterialCommunityIcons name="home" style={hstyles.icon} />
                </TouchableOpacity>
              </Left>
              <Body style={hstyles.body}>
                <Title style={hstyles.headtitle}>Order Details</Title>
              </Body>
              <Right style={hstyles.right} />
            </View>
        </View>
        <PurchaseModal visibile={this.state.purchaseModal} data={{...this.state.purchase_data}} dismiss={this._onDismiss} />
        <SalesModal visibile={this.state.salesModal} data={{...this.state.currentparams}} dismiss={this._onSalesDismiss} />
        <ListItem thumbnail>
          <Left>
            <View style={gstyles.circle}>
              <Text style={gstyles.textSemibold}>{this.state.purchase_data === null ? '' : (this.state.purchase_data.chemical_name).substring(0,3).toUpperCase()}</Text>
            </View>
          </Left>
          <Body>

            <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Chemical Name :</Text>{this.state.purchase_data === null ? '' : this.state.purchase_data.chemical_name}</Text>
            <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>CC Number :</Text>{this.state.purchase_data === null ? '' : this.state.purchase_data.id}</Text>
            <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Quantity in Bulk :</Text> {this.state.purchase_data === null ? '' : this.state.purchase_data.extra_purchase_quantity} MT </Text>
            <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Pending Orders :</Text> {this.state.purchase_data.total_pending === null ? 0 : this.state.purchase_data.total_pending} MT </Text>
            <Text stllyle={gstyles.textRegular}><Text style={gstyles.textBold}>Status :</Text> {this.state.purchase_data === null ? '' : this.state.purchase_data.request_status}</Text>
            <Button small style={{margin:5}} onPress={() => this._openPurchase()}><Text>View More Details</Text></Button>
          </Body>
        </ListItem>
        {/* List Body */}

        <ListItem itemDivider>
            <Text style={styles.listItemheader}>Linked Sales Order</Text>
        </ListItem>
        
        {(this.state.sales_data !== null && this.state.sales_data !== undefined && this.state.sales_data.length > 0) ? 
                (
                    <Content refreshControl={
                        <RefreshControl
                            refreshing={this.state.refreshing}
                            onRefresh={this._onRefresh}
                        />
                    }>
                    <FlatList
                        data={this.state.sales_data}
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
}

export default InventoryDetails
