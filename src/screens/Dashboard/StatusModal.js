import React from "react";
import {Modal,TouchableOpacity} from 'react-native';
import { Text,Content,View } from 'native-base';
import styles from '../../theme/styles/dashboard';
import mstyles from '../../theme/styles/requestsent';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const StatusModal = (props) =>{

    return(
        <Modal visible={props.visible} animationType={'slide'} onRequestClose={() => {console.log("Modal close")}}>
            <View style={mstyles.ModalContainer}><Text style={mstyles.Modaltitle}>Request Status</Text><TouchableOpacity onPress={() => props.dismiss()}><MaterialCommunityIcons name='close-outline' style={mstyles.Modalclose}/></TouchableOpacity></View>
            <Content>
                <View style={styles.cardStack}>

                    <TouchableOpacity style={styles.cardStyles} onPress={() => props.StatusModalClicks('PurchaseRequests')}> 
                        {/* CARD Upper-Half Icon + Circle + Text */}
                        <View style={styles.cardUpper}>
                        {/* Icon */}
                        <View style={styles.cardIconView}>
                            <FontAwesome name="plus-square" style={styles.cardIcon} />
                        </View>
                        {/* Circle + Text */}
                        <View style={props.data.purchase_request == 0 ? styles.circle : styles.circledark}>
                            <Text style={props.data.purchase_request == 0 ? styles.blackfont : styles.whitefont}>{props.data.purchase_request}</Text>
                        </View>
                        </View>
                        {/* CARD Lower-Half Text */}
                        <View>
                            <Text style={styles.cardNameText}>Purchase Request</Text>
                        </View>
                    
                    </TouchableOpacity>
                    
                    <TouchableOpacity style={styles.cardStyles} onPress={() => props.StatusModalClicks('SalesRequests')}> 
                        
                        {/* CARD Upper-Half Icon + Circle + Text */}
                        <View style={styles.cardUpper}>
                        {/* Icon */}
                        <View style={styles.cardIconView}>
                            <FontAwesome name="minus-square" style={styles.cardIcon} />
                        </View>
                        {/* Circle + Text */}
                        <View style={props.data.sales_request == 0 ? styles.circle : styles.circledark}>
                            <Text style={props.data.sales_request == 0 ? styles.blackfont : styles.whitefont}>{props.data.sales_request}</Text>
                        </View>
                        </View>
                        {/* CARD Lower-Half Text */}
                        <View>
                            <Text style={styles.cardNameText}>Sales Request</Text>
                        </View>
                    
                    </TouchableOpacity>

                    
                    
                    

                </View>
            </Content>
        </Modal>
    );
}

export default StatusModal;