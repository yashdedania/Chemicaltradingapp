import React from "react";
import {Modal,TouchableOpacity} from 'react-native';
import { Text, ListItem, 
    Left, Body, List, Content,View, Container,Thumbnail } from 'native-base';
import styles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import format from '../../components/dateformat';
const PurchaseNotModal = (props) =>{
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
                    <Body><Text style={styles.listitemstyle}>{props.data.request.id}</Text></Body>
                </ListItem>
                
                <ListItem>
                    <Left><Text>Status : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.request_status}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Order Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.request.createdAt)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Order Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Time(props.data.request.createdAt)}</Text></Body>
                </ListItem>
            
                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Chemical Details</Text>
                </ListItem>                    
                    
                <ListItem>
                    <Left><Text>Chemical Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.chemical_name}</Text></Body>
                </ListItem>                    


                
                
                <ListItem>
                    <Left><Text>Package Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.packing.type}</Text></Body>
                </ListItem>
                {props.data.request.packing.type == "drums" &&
                <ListItem>
                    <Left><Text>Package SubType :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.packing.subtype}</Text></Body>
                </ListItem>
                }
                {(props.data.request.packing.type == "drums" || props.data.request.packing.type == "bags") &&
                <ListItem>
                    <Left><Text>Package Weight :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.packing.weight}</Text></Body>
                </ListItem>
                }

                <ListItem>
                    <Left><Text>Vessel Name :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.vessel_name}</Text></Body>
                </ListItem>
                

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Delivery & Storage & Transportation</Text>
                </ListItem>  
                    
                <ListItem>
                    <Left><Text>Estimated Time :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.eta.time}</Text></Body>
                </ListItem>
                <ListItem>
                    <Left><Text>Estimated Month :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.eta.month}</Text></Body>
                </ListItem>

                 <ListItem>
                    <Left><Text>Confirmation Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.request.confirmation_date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Delivery Place:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.delivery_place}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Arrival Date:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.request.delivery_date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.storage.days} days from {format.Date(props.data.request.storage.date)}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Extra Storage :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.extra_storage} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Transportation :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.transportation.flag}</Text></Body>
                </ListItem>
                {props.data.request.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Rate:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.transportation.rate} PMT</Text></Body>
                </ListItem>
                }
                {props.data.request.transportation.flag == "accord" &&
                <ListItem>
                    <Left><Text>Transportation Cost:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.request.transportation.amount}</Text></Body>
                </ListItem>
                }

                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Payment Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>BL Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.request.bl_date)}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.payment.type}</Text></Body>
                </ListItem>
                    
                <ListItem>
                    <Left><Text>Payment Terms :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.payment.terms} days from {props.data.request.payment.from}</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Payment Date :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{format.Date(props.data.request.payment.date)}</Text></Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Broker / Commsion Details</Text>
                </ListItem>                    
                
                <ListItem>
                    <Left><Text>Broker : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.broker.flag}</Text></Body>
                </ListItem>
                {props.data.request.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Broker Name : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.broker.name}</Text></Body>
                </ListItem>
                }
                {props.data.request.broker.flag == "yes" &&
                <ListItem>
                    <Left><Text>Commission : </Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.broker.commission} PMT</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Purchase Through :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.supplier}</Text></Body>
                </ListItem>

                    
                <ListItem itemDivider >
                    <Text style={styles.listItemheader}>Billing Details</Text>
                </ListItem>

                <ListItem>
                    <Left><Text>Purchase Type :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.purchase_type.type} ({props.data.request.purchase_type.subtype})</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Purchase Quantity:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.purchase_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Quantity in Stock:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.extra_purchase_quantity} MT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Currency Type:</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.currency.type} {props.data.request.currency.subtype !== "NA" ? " ("+props.data.request.currency.subtype+")" : ""}</Text></Body>
                </ListItem>
                {(props.data.request.currency.subtype == "CFR" || props.data.request.currency.subtype == "FOB") ? (
                    <ListItem>
                        <Left><Text>Insurance Cost:</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.insurance_cost} PMT</Text></Body>
                    </ListItem>
                ):null}
                { props.data.request.currency.type != "inr" && 
                <ListItem>
                    <Left><Text>Provisional Exchange Rate :</Text></Left>
                    <Body><Text style={styles.listitemstyle}> Rs. {props.data.request.currency.rate}</Text></Body>
                </ListItem>
                }
                <ListItem>
                    <Left><Text>Purchase Rate :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.purchase_rate.usd} PMT</Text></Body>
                </ListItem>
                {props.data.request.currency.type != "inr" &&
                    <ListItem>
                        <Left><Text>Purchase Rate (INR)  :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.purchase_rate.inr} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.request.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Custom Duty Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.custom} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.request.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS Percentage :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.cess} %</Text></Body>
                    </ListItem>
                }
                {props.data.request.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>CESS :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.cess} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.request.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Clearance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.clearance_cost} PMT</Text></Body>
                    </ListItem>
                }
                {props.data.request.purchase_type.subtype == "import" &&
                    <ListItem>
                        <Left><Text>Finance Cost :</Text></Left>
                        <Body><Text style={styles.listitemstyle}>{props.data.request.finance_cost} PMT</Text></Body>
                    </ListItem>
                }

                {props.data.request.extra_expense.length > 0 ? (
                    <ListItem itemDivider>
                        <Text style={styles.listItemheader}>Extra Expense</Text>
                    </ListItem> 
                ):null}
                {props.data.request.extra_expense.map((result,i)=>{
                    return(
                        <ListItem key={i}>
                            <Left><Text>{result.name}:</Text></Left>
                            <Body><Text style={styles.listitemstyle}>{result.value} PMT</Text></Body>
                        </ListItem>
                    )
                })}

                <ListItem>
                    <Left><Text>Net Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.net_amount} PMT</Text></Body>
                </ListItem>

                <ListItem>
                    <Left><Text>Total Bill Amount :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>Rs. {props.data.request.total_amount}</Text></Body>
                </ListItem>
                

                
                <ListItem>
                    <Left><Text>Remarks :</Text></Left>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.remarks}</Text></Body>
                </ListItem>

                <ListItem itemDivider>
                    <Text style={styles.listItemheader}>Change Summary</Text>
                </ListItem>
                <ListItem>
                    <Body><Text style={styles.listitemstyle}>{props.data.request.changesummary}</Text></Body>
                </ListItem>
            </List>
            </Content>
            </Container>
            ):(null)}
        </Modal>
    )
}

export default PurchaseNotModal
    