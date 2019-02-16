import React from "react";
import {Modal,TouchableOpacity} from 'react-native';
import { Text,Content,View,Container } from 'native-base';
import styles from '../../theme/styles/dashboard';
import mstyles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

const RequestgModal = (props) =>{

    return(
        <Modal visible={props.visible} animationType={'slide'}  onRequestClose={() => {console.log("Modal close")}}>
            <Container style={gstyles.container_background}>
                <View style={mstyles.ModalContainer}><Text style={mstyles.Modaltitle}>Generate Request</Text><TouchableOpacity onPress={() => props.dismiss()}><MaterialCommunityIcons name='close-outline' style={mstyles.Modalclose}/></TouchableOpacity></View>
                <Content>
                    <View style={styles.cardStack}>

                        <TouchableOpacity style={styles.cardStyles} onPress={() => props.RequestModalClicks('Purchase')}>
                            {/* CARD Upper-Half Icon + Circle + Text */}
                            <View style={styles.cardUpper}>
                                {/* Icon */}
                                <View style={styles.cardIconView}>
                                <MaterialCommunityIcons name="cash" style={styles.cardIcon} />
                                </View>
                            </View>
                            {/* CARD Lower-Half Text */}
                            <View>
                                <Text style={styles.cardNameText}>Purchase</Text>
                            </View>
                        </TouchableOpacity>
                        
                        <TouchableOpacity style={styles.cardStyles} onPress={() => props.RequestModalClicks('Sales')}>
                            {/* CARD Upper-Half Icon + Circle + Text */}
                            <View style={styles.cardUpper}>
                                {/* Icon */}
                                <View style={styles.cardIconView}>
                                <MaterialCommunityIcons name="sale" style={styles.cardIcon} />
                                </View>
                            </View>
                            {/* CARD Lower-Half Text */}
                            <View>
                                <Text style={styles.cardNameText}>Sales</Text>
                            </View>
                        </TouchableOpacity>

                        
                    </View>
            </Content>
            </Container>
        </Modal>
    );
}

export default RequestgModal;