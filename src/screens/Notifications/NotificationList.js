import React from "react";
import styles from '../../theme/styles/staff_list';
import {View,ListItem, Text, Thumbnail,Left,Right,Body} from 'native-base';
import {TouchableOpacity} from 'react-native';
import format from '../../components/dateformat';
import { connect } from 'react-redux';
const NotificationList = (props) =>{
    return(
        <TouchableOpacity >
            <ListItem  style={styles.ItemContainer} onPress={() => props.openModal(props.data)}>
                <Left style={styles.ItemLeft}>
                    <View style={styles.thumbnailContainer}>
                        <Thumbnail source = {{uri:props.data.user.imageuri}} />
                    </View>   
                </Left>
                <Body style={styles.ItemBody}>
                    <Text>{props.data.user.id == props.user.details.id ? "Self": props.user.details.role == "admin" ? props.data.user.username :"Admin"}</Text>
                <Text note>{props.data.activity_detail}</Text>
                </Body>
                <Right style={styles.ItemRight}>
                    <Text note>{format.Time(props.data.createdAt)}</Text>
                </Right>
            </ListItem>
        </TouchableOpacity>
    );
}
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
};
export default (connect(mapStateToProps)(NotificationList));