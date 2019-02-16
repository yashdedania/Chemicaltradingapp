import React from "react";
import {Modal,TouchableOpacity} from 'react-native';
import { Text, ListItem, 
    Left, Body, List, Content,View, Container,Thumbnail } from 'native-base';
import styles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import format from '../../components/dateformat';
const SalesNotModal = (props) =>{

    return(
        <Modal visible ={props.visibile}  animationType={'slide'} onRequestClose={() => {console.log("Modal close")}}>
            <View style={styles.ModalContainer}><Text style={styles.Modaltitle}>Activity Summary</Text><TouchableOpacity onPress={() => props.dismiss()}><MaterialCommunityIcons name='close-outline' style={styles.Modalclose}/></TouchableOpacity></View>
            {(props.data !== null && JSON.stringify(props.data).length != 2)?
            (
            <Container>
                <ListItem thumbnail>
                    <Left>
                        <View style={gstyles.circle}>
                            <Thumbnail source = {{uri:props.data.user.imageuri}} />
                        </View>
                    </Left>
                    <Body>

                        <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Name :</Text>{props.data.user.username}</Text>
                        <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Activity Type :</Text>{props.data.activity_type}</Text>
                        <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Activity Detail :</Text> {props.data.activity_detail}</Text>
                        <Text style={gstyles.textRegular}><Text style={gstyles.textBold}>Activity Time :</Text> {format.Date(props.data.createdAt)} {format.Time(props.data.createdAt)} </Text>
                    </Body>
                </ListItem>
                <Content>
                <List>
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Order Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>CC No : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.id}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Status : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.request_status}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Sales Type : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.sales_id == null ? 'Not Linked(Purchase Pending)' : 'Linked to CC No.'+props.data.sale.sales_id}</Text></Body>
                </ListItem>
                
                <ListItem>
                    <Left><Text>Order Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.sale.createdAt)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Order Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Time(props.data.sale.createdAt)}</Text></Body>
                </ListItem>
            
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Chemical Details</Text>
                </ListItem>                    
                    
                <ListItem>
                    <Left><Text>Chemical Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.chemical_name}</Text></Body>
                </ListItem>                    
                       
                
                
                <ListItem>
                    <Left><Text>Package Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.packing.type}</Text></Body>
                </ListItem>
                {props.data.sale.packing.type == "drums" &&
                <ListItem>
                    <Left><Text>Package SubType :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.packing.subtype}</Text></Body>
                </ListItem>
                }
                {(props.data.sale.packing.type == "drums" || props.data.sale.packing.type == "bags") &&
                <ListItem>
                    <Left><Text>Package Weight :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.packing.weight}</Text></Body>
                </ListItem>
                }

                <ListItem>
                    <Left><Text>Vessel Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.vessel_name}</Text></Body>
                </ListItem>
                

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Delivery & Storage & Transportation</Text>
                </ListItem>  
                    
                <ListItem>
                    <Left><Text>Estimated Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.eta.time}</Text></Body>
                </ListItem>

                {(props.data.sale.eta.time != "ready") ?(
                    <ListItem>
                        <Left><Text>Estimated Month :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.eta.month}</Text></Body>
                    </ListItem>
                ):(null)}
                
                <ListItem>
                    <Left><Text>Confirmation Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.sale.confirmation_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Delivery Place:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.delivery_place}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Delivery Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.sale.delivery_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.storage.days} days from {format.Date(props.data.sale.storage.date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Extra Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.extra_storage} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Transportation :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.transportation.flag}</Text></Body>
                </ListItem>
                {props.data.sale.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.transportation.rate} PMT</Text></Body>
                </ListItem>
                }
                {props.data.sale.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Cost:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.sale.transportation.amount}</Text></Body>
                </ListItem>
                }

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Payment Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>BL Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.sale.bl_date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.payment.type}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Payment Terms :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.payment.terms} days from {props.data.sale.payment.from}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.sale.payment.date)}</Text></Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Broker / Commsion Details</Text>
                </ListItem>                    
                
                <ListItem>
                    <Left><Text>Broker : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.broker.flag}</Text></Body>
                </ListItem>
                {props.data.sale.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Broker Name : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.broker.name}</Text></Body>
                </ListItem>
                }
                {props.data.sale.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Commission : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.broker.commission} PMT</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Selling To (Customer) :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.supplier}</Text></Body>
                </ListItem>

                    
                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Billing Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Selling Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.selling_type.type} ({props.data.sale.selling_type.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Selling Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.extra_selling_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Currency Type:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.currency.type} {props.data.sale.currency.subtype !== "NA" ? " ("+props.data.sale.currency.subtype+")" : ""}</Text></Body>
                </ListItem>

                {(props.data.sale.currency.subtype == "CFR" || props.data.sale.currency.subtype == "FOB") ? (
                    <ListItem>
                        <Left><Text>Insurance Cost:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.insurance_cost} PMT</Text></Body>
                    </ListItem>
                ):null}

                { props.data.sale.currency.type != "inr" && 
                <ListItem>
                    <Left><Text>Provisional Exchange Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}> Rs. {props.data.sale.currency.rate}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Selling Rate :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.selling_rate.usd} PMT</Text></Body>
                </ListItem>
                {props.data.sale.currency.type != "inr" &&
                    <ListItem>
                        <Left><Text>Selling Rate (INR)  :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.selling_rate.inr} PMT</Text></Body>
                    </ListItem>
                }

                {props.data.sale.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Custom Duty Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.custom} PMT</Text></Body>
                    </ListItem>
                }

                {props.data.sale.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>CESS Percentage:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.cess_per} %</Text></Body>
                    </ListItem>
                }

                {props.data.sale.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>CESS :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.cess} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.sale.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Clearance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.clearance_cost} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.sale.selling_type.subtype == "export" &&
                    <ListItem>
                        <Left><Text>Finance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.sale.finance_cost} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.sale.extra_expense.length > 0 ? (
                    <ListItem itemDivider>
                        <Text style={styles.listItemheader}>Extra Expense</Text>
                    </ListItem> 
                ):null}
                {props.data.sale.extra_expense.map((result,i)=>{
                    return(
                        <ListItem key={i}>
                            <Left><Text>{result.name}:</Text></Left>
                            <Body><Text style={styles.listitemstyle}>{result.value} PMT</Text></Body>
                        </ListItem>
                    )
                })}
                <ListItem>
                    <Left><Text>Net Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.net_amount} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Total Bill Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.sale.total_amount}</Text></Body>
                </ListItem>
                

                
                <ListItem>
                    <Left><Text>Remarks :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.remarks}</Text></Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Change Summary</Text>
                </ListItem>
                <ListItem>
                    <Body><Text style={styles.listitemstyle}>{props.data.sale.changesummary}</Text></Body>
                </ListItem>
            </List>
            </Content>
            </Container>
            ):(null)}
        </Modal>
    )
}

export default SalesNotModal
    