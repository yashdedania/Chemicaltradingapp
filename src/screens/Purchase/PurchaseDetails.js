import React, { Component } from 'react';
import { View, Container, Text, ListItem, 
    Left, Body, List, Content,Right,Title } from 'native-base';
import styles from '../../theme/styles/requestsent';
import { connect } from 'react-redux';
import gstyles from '../../theme/styles/general';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import format from '../../components/dateformat';
import colors from '../../theme/color';
import Loader from '../../components/Loader';
import hstyles from '../../theme/styles/header';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';


class PurchaseDetails extends Component{
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
          purchase_type: params.purchase_type == null ? '' : params.purchase_type,
          purchase_quantity:params.purchase_quantity == null ? '' : params.purchase_quantity,
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
          confirmation_date:params.confirmation_date == null ? '' : params.confirmation_date,
          storage: params.storage == null ? '' : params.storage,
          currency: params.currency == null ? '' : params.currency,
          purchase_rate: params.purchase_rate == null ? '' : params.purchase_rate,
          custom: params.custom == null ? '' : params.custom,
          clearance_cost: params.clearance_cost == null ? '' : params.clearance_cost,
          finance_cost:params.finance_cost == null ? '' : params.finance_cost,
          insurance_cost:params.insurance_cost == null ? '' : params.insurance_cost,
          extra_expense:params.extra_expense == null ? '' : params.extra_expense,
          cess_per: params.cess_per == null ? '' : params.cess_per,
          cess: params.cess == null ? '' : params.cess,
          net_amount: params.net_amount == null ? '' : params.net_amount,
          total_amount: params.total_amount == null ? '' : params.total_amount,
          remarks: params.remarks == null ? '' : params.remarks,
          changesummary: params.changesummary == null ? '' : params.changesummary,
          createdAt:params.createdAt == null ? '' : params.createdAt,
          loading:false,
        };
    }
    componentDidMount(){
    }
    render(){
        
        return(
            <Container style={gstyles.container_background}>
            
            <View style={styles.viewIconText}>
            
                <FontAwesome name="check-circle" style={styles.IconStyle} />
                <Text style={styles.requesttext}> 
                    {this.props.user.details.role == "admin" ? "Added To Inventory" : "Request Sent"} 
                </Text>
            </View>

            
            <View style={styles.requestdetailheaderview}>
                <Text style={styles.requestdetailheadertext}> Request Details </Text>
            </View>

            
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
                    <Left><Text>Purchase Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.purchase_quantity}</Text></Body>
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
                ):
                (null)}
                
                    
                <ListItem>
                    <Left><Text>Delivery Place:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.delivery_place}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Arrival Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.delivery_date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Confirmation  Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.confirmation_date)}</Text></Body>
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
                    <Left><Text>BL Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.bl_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Payment Terms :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.payment.terms} days from {this.state.payment.from}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(this.state.payment.date)}</Text></Body>
                </ListItem>

                
                    
                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Billing Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Purchase Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.purchase_type.type} ({this.state.purchase_type.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Currency Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.currency.type} ({this.state.currency.subtype == "NA" ? '': this.state.currency.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Quantity Purchased :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.purchase_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Currency Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.currency.type} {this.state.currency.subtype != "NA" ? " ("+this.state.currency.subtype+")" : ""}</Text></Body>
                </ListItem>

                {(this.state.currency.subtype === "CFR" || this.state.currency.subtype === "FOB") ?(
                    <ListItem>
                        <Left><Text>Insurance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.insurance_cost} PMT</Text></Body>
                    </ListItem>
                ):null}

                { this.state.currency.type != "inr" && 
                <ListItem>
                    <Left><Text>Provisional Exchange Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}> Rs. {this.state.currency.rate}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Purchase Rate (PMT):</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.purchase_rate.usd} PMT</Text></Body>
                </ListItem>
                {this.state.currency.type != "inr" &&
                    <ListItem>
                        <Left><Text>Purchase Rate (INR)  :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.purchase_rate.inr} PMT</Text></Body>
                    </ListItem>
                }
                
                {this.state.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Custom Duty Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.custom} PMT</Text></Body>
                    </ListItem>
                }
                {this.state.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS Percentage:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.cess_per} %</Text></Body>
                    </ListItem>
                }
                {this.state.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.cess} PMT</Text></Body>
                    </ListItem>
                }
                {this.state.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Clearance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.clearance_cost} PMT</Text></Body>
                    </ListItem>
                }

                {this.state.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Finance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{this.state.finance_cost} PMT</Text></Body>
                    </ListItem>
                }
                
                {this.state.extra_expense.map((result,i) =>{
                    return(
                        <ListItem key={i}>
                            <Left><Text>{result.name} :</Text></Left>
                            <Body><Text style={styles.listitemstyle}>{result.value} PMT</Text></Body>
                        </ListItem> 
                    )
                })}

                <ListItem>
                    <Left><Text>Net Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{this.state.net_amount} PMT</Text></Body>
                </ListItem>
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
                    <Left><Text>Purchase Through :</Text></Left>
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
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };

export default (connect(mapStateToProps)(PurchaseDetails));