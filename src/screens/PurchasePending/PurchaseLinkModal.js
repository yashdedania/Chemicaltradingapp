import React from "react";
import {Modal,TouchableOpacity,SafeAreaView} from 'react-native';
import { Text, ListItem, 
    Left, Body, List, Content,View } from 'native-base';
import styles from '../../theme/styles/requestsent';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import format from '../../components/dateformat';
const PurchaseLinkModal = (props) =>{
    
    

    return(
        <Modal visible ={props.visibile}  animationType={'slide'} onRequestClose={() => {console.log("Modal close")}}>
        <View style={styles.ModalContainer}><Text style={styles.Modaltitle}>Order Summary</Text><TouchableOpacity onPress={() => props.dismiss()}><MaterialCommunityIcons name='close-outline' style={styles.Modalclose}/></TouchableOpacity></View>
            
            {(props.data !== null && JSON.stringify(props.data).length != 2)?
            (
                <Content>
                <List>
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Order Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>CC No : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.id}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Status : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request_status}</Text></Body>
                </ListItem>
                
                <ListItem>
                    <Left><Text>Order Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.createdAt)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Order Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Time(props.data.createdAt)}</Text></Body>
                </ListItem>
            
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Chemical Details</Text>
                </ListItem>                    
                    
                <ListItem>
                    <Left><Text>Chemical Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.chemical_name}</Text></Body>
                </ListItem>                    
                       
                
                
                <ListItem>
                    <Left><Text>Package Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.packing.type}</Text></Body>
                </ListItem>
                {props.data.packing.type == "drums" &&
                <ListItem>
                    <Left><Text>Package SubType :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.packing.subtype}</Text></Body>
                </ListItem>
                }
                {(props.data.packing.type == "drums" || props.data.packing.type == "bags") &&
                <ListItem>
                    <Left><Text>Package Weight :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.packing.weight}</Text></Body>
                </ListItem>
                }

                <ListItem>
                    <Left><Text>Vessel Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.vessel_name}</Text></Body>
                </ListItem>
                

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Delivery & Storage & Transportation</Text>
                </ListItem>  
                    
                <ListItem>
                    <Left><Text>Estimated Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.eta.time}</Text></Body>
                </ListItem>

                {(props.data.eta.time != "ready" && props.data.eta.time != "") ? (
                    <ListItem>
                        <Left><Text>Estimated Month :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.eta.month}</Text></Body>
                    </ListItem>
                ):(null)}
                
                <ListItem>
                    <Left><Text>Confirmation Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.confirmation_date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Delivery Place:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.delivery_place}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Arrival Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.delivery_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.storage.days} days from {format.Date(props.data.storage.date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Extra Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.extra_storage} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Transportation :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.transportation.flag}</Text></Body>
                </ListItem>
                {props.data.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.transportation.rate} PMT</Text></Body>
                </ListItem>
                }
                {props.data.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Cost:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.transportation.amount}</Text></Body>
                </ListItem>
                }

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Payment Details</Text>
                </ListItem>
                <ListItem>
                    <Left><Text>BL Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.bl_date)}</Text></Body>
                </ListItem>
                <ListItem>
                    <Left><Text>Payment Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.payment.type}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Payment Terms :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.payment.terms} days from {props.data.payment.from}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.payment.date)}</Text></Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Broker / Commsion Details</Text>
                </ListItem>                    
                
                <ListItem>
                    <Left><Text>Broker : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.broker.flag}</Text></Body>
                </ListItem>
                {props.data.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Broker Name : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.broker.name}</Text></Body>
                </ListItem>
                }
                {props.data.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Commission : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.broker.commission} PMT</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Purchase Through :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.supplier}</Text></Body>
                </ListItem>

                    
                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Billing Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Purchase Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.purchase_type.type} ({props.data.purchase_type.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Purchase Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.purchase_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Quantity in Stock:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.extra_purchase_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Pending Orders:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.total_pending == null ? 0 : props.data.total_pending}/MT</Text></Body>
                </ListItem>
                <ListItem>
                    <Left><Text>Currency Type:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.currency.type} {props.data.currency.subtype !== "NA" ? " ("+props.data.currency.subtype+")" : ""}</Text></Body>
                </ListItem>
                {(props.data.currency.subtype == "CFR" || props.data.currency.subtype == "FOB") ? (
                    <ListItem>
                        <Left><Text>Insurance Cost:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.insurance_cost} PMT</Text></Body>
                    </ListItem>
                ):null}

                { props.data.currency.type != "inr" && 
                <ListItem>
                    <Left><Text>Provisional Exchange Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}> Rs. {props.data.currency.rate}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Purchase Rate :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.purchase_rate.usd} PMT</Text></Body>
                </ListItem>
                {props.data.currency.type != "inr" &&
                    <ListItem>
                        <Left><Text>Purchase Rate (INR)  :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.purchase_rate.inr} PMT</Text></Body>
                    </ListItem>
                }

                {props.data.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Custom Duty Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.custom} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS Percentage:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.cess_per} %</Text></Body>
                    </ListItem>
                }

                {props.data.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.cess} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Clearance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.clearance_cost} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Finance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.finance_cost} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.extra_expense.length > 0 ? (
                    <ListItem itemDivider>
                        <Text style={styles.listItemheader}>Extra Expense</Text>
                    </ListItem> 
                ):null}
                {props.data.extra_expense.map((result,i)=>{
                    return(
                        <ListItem key={i}>
                            <Left><Text>{result.name}:</Text></Left>
                            <Body><Text style={styles.listitemstyle}>{result.value} PMT</Text></Body>
                        </ListItem>
                    )
                })}
                <ListItem>
                    <Left><Text>Net Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.net_amount} PMT</Text></Body>
                </ListItem>
                <ListItem>
                    <Left><Text>Total Bill Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.total_amount}</Text></Body>
                </ListItem>
                

                
                <ListItem>
                    <Left><Text>Remarks :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.remarks}</Text></Body>
                </ListItem>
            </List>
            </Content>
            ):
            (null)}
            

        </Modal>
    );
}

export default (PurchaseLinkModal);