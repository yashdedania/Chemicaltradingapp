import React, { Component } from 'react';
import { View, Container, Text, ListItem, 
    Left, Body, List, Content } from 'native-base';
import styles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import format from '../../components/dateformat';
import colors from '../../theme/color';
import {TouchableOpacity} from 'react-native';
import PurchaseModal from './PurchaseModal';
import font from '../../theme/font';
class RecentSalesDetails extends Component{
    static navigationOptions = {
        // headerTitle instead of title
        title:"Request Summary",
        headerStyle: {
          backgroundColor: colors.primary,
          height:50,
          paddingBottom:10
        },
        headerTintColor: 'rgb(255,255,255)',
        headerBackTitleStyle:{
          color:'rgb(255,255,255)'
        },
        headerTitleStyle:{
          color:'rgb(255,255,255)'
        }
      };
    constructor(props){
        super(props);
        const { params = {} } = this.props.navigation.state;
        //console.log("Prinitng params");
        //console.log(params);
        this.state = {
          chemical_name:  params == null? '': params.chemical_name, 
          cc_number: params.id == null ? '' : params.id,
          linkid:params.sales_id == null ? null : params.sales_id,
          selling_type: params.selling_type == null ? '' : params.selling_type,
          selling_quantity:params.selling_quantity == null ? '' : params.selling_quantity,
          supplier:params.supplier == null ? '' : params.supplier,
          packing:params.packing == null ? '' : params.packing,
          eta:params.eta == null ? '' : params.eta,
          delivery_place : params.delivery_place == null ? '' : params.delivery_place,
          delivery_date : params.delivery_date == null ? '' : params.delivery_date,
          vessel_name:params.vessel_name == null ? '' : params.vessel_name,
          broker: params.broker == null ? '' : params.broker,
          extra_storage : params.extra_storage == null ? '' : params.extra_storage,
          transportation: params.transportation == null  ? '' : params.transportation,
          loan_basis: params.loan_basis == null ? '' : params.loan_basis,
          payment:params.payment == null ? '' : params.payment,
          bl_date:params.bl_date == null ? '' : params.bl_date,
          storage: params.storage == null ? '' : params.storage,
          currency: params.currency == null ? '' : params.currency,
          selling_rate: params.selling_rate == null ? '' : params.selling_rate,
          custom: params.custom == null ? '' : params.custom,
          clearance_cost: params.clearance_cost == null ? '' : params.clearance_cost,
          finance_cost: params.finance_cost == null ? '' : params.finance_cost,
          cess: params.cess == null ? '' : params.cess,
          total_amount: params.total_amount == null ? '' : params.total_amount,
          remarks: params.remarks == null ? '' : params.remarks,
          changesummary: params.changesummary == null ? '' : params.changesummary,
          createdAt:params.createdAt == null ? '' : params.createdAt,
          request_data:params.request == null ? null : params.request,
          loading:false,
          purchase_modal:false
        };
        this._isMounted = false;
    }
    componentDidMount(){
        this._isMounted = true
    }
    componentWillUnmount(){
        this._isMounted = false;
    }
    openPurchase =() =>{
        if(this._isMounted){
            this.setState({purchase_modal:true});
        }
    }
    _onDismiss = () =>{
        if(this._isMounted){
            this.setState({purchase_modal:false});
        }
    }
    render(){
        
        return(
            <Container style={gstyles.container_background}>
            {(this.state.request_data !== null && this.state.request_data !== undefined) ? (
                <PurchaseModal visibile={this.state.purchase_modal} data={{...this.state.request_data}} dismiss={this._onDismiss} />    
            ):null}
            <Content>
                <List>
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Order Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>CC No : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.cc_number}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Sales Type: </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.linkid == null ? 'Not Linked(Purchase Pending)' : 'Linked to CC No.'+this.state.linkid}</Text>
                        <TouchableOpacity onPress={() => this.openPurchase()} style={{display:this.state.linkid == null ? 'none':'flex'}} disabled={this.state.linkid == null ? true:false}>
                            <Text style={{color:colors.primary,fontFamily:font.bold}}>Click here to view Details</Text>
                        </TouchableOpacity>
                    </Body>
                </ListItem>
                
                
                <ListItem>
                    <Left><Text>Order Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.createdAt)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Order Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Time(this.state.createdAt)}</Text></Body>
                </ListItem>
            
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Chemical Details</Text>
                </ListItem>                    
                    
                <ListItem>
                    <Left><Text>Chemical Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.chemical_name}</Text></Body>
                </ListItem>                    
                       
                <ListItem>
                    <Left><Text>Selling Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.selling_quantity} MT</Text></Body>
                </ListItem>
                
                <ListItem>
                    <Left><Text>Package Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.packing.type}</Text></Body>
                </ListItem>
                {this.state.packing.type == "drums" &&
                <ListItem>
                    <Left><Text>Package SubType :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.packing.subtype}</Text></Body>
                </ListItem>
                }
                {(this.state.packing.type == "drums" || this.state.packing.type == "bags") &&
                <ListItem>
                    <Left><Text>Package Weight :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.packing.weight}</Text></Body>
                </ListItem>
                }

                <ListItem>
                    <Left><Text>Vessel Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.vessel_name}</Text></Body>
                </ListItem>
                

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Delivery & Storage & Transportation</Text>
                </ListItem>  
                    
                <ListItem>
                    <Left><Text>Estimated Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.eta.time}</Text></Body>
                </ListItem>

                {(this.state.eta.time != "ready" && this.state.eta.time != "") ? (
                    <ListItem>
                        <Left><Text>Estimated Month :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.eta.month}</Text></Body>
                    </ListItem>
                ):(null)}
                
                    
                <ListItem>
                    <Left><Text>Delivery Place:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.delivery_place}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Delivery Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.delivery_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.storage.days} from {format.Date(this.state.storage.date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Extra Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.extra_storage} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Transportation :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.transportation.flag}</Text></Body>
                </ListItem>
                {this.state.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.transportation.rate} PMT</Text></Body>
                </ListItem>
                }
                {this.state.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Cost:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {this.state.transportation.amount}</Text></Body>
                </ListItem>
                }

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Payment Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.payment.type}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Payment Terms :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.payment.terms}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.payment.date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>BL Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.bl_date)}</Text></Body>
                </ListItem>
                    
                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Billing Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Selling Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.selling_type.type} ({this.state.selling_type.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Selling Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.selling_quantity} MT</Text></Body>
                </ListItem>
                { this.state.currency.type != "inr" && 
                <ListItem>
                    <Left><Text>Provisional Exchange Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}> Rs. {this.state.currency.rate}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Selling Rate :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.selling_rate.usd} PMT</Text></Body>
                </ListItem>
                {this.state.currency.type != "inr" &&
                    <ListItem>
                        <Left><Text>Selling Rate (INR)  :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.selling_rate.inr} PMT</Text></Body>
                    </ListItem>
                }
                
                {this.state.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Custom Duty Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>Rs. {this.state.custom}</Text></Body>
                    </ListItem>
                }

                {this.state.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Finance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>Rs. {this.state.finance_cost}</Text></Body>
                    </ListItem>
                }

                {this.state.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>CESS :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>Rs. {this.state.cess}</Text></Body>
                    </ListItem>
                }
                {this.state.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Clearance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>Rs. {this.state.clearance_cost}</Text></Body>
                    </ListItem>
                }

                <ListItem>
                    <Left><Text>Total Bill Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {this.state.total_amount}</Text></Body>
                </ListItem>
                

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Broker / Commsion Details</Text>
                </ListItem>                    
                
                <ListItem>
                    <Left><Text>Broker : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.broker.flag}</Text></Body>
                </ListItem>
                {this.state.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Broker Name : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.broker.name}</Text></Body>
                </ListItem>
                }
                {this.state.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Commission : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {this.state.broker.commission}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>selling Through :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.supplier}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Remarks :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.remarks}</Text></Body>
                </ListItem>
            </List>
            </Content>
        </Container>
        );
    }

};
export default RecentSalesDetails;