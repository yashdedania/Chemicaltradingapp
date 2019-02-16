import React,{Component} from 'react';
import { connect } from 'react-redux';
import {TouchableOpacity} from 'react-native';
import { Card, CardItem,
    Body, Text, Left, Right, View
  } from 'native-base';
import styles from '../../theme/styles/requestlist';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import format from '../../components/dateformat';
class MylistView extends Component {
    constructor(props){
        super(props);
        this.state = {
            extraButtext: props.extrabut == null ? '' : props.extrabut,
            screenname: props.screenname == null ? '' : props.screenname
        };
    }
    _onPress = () =>{
      /*console.log("pressed");
      console.log("Role: "+this.props.user.details.role);
      console.log("Screenname: "+this.props.screenname);
        if(this.props.user.details.role == 'admin' && (this.props.screenname == 'pending' || this.props.screenname == 'rejected')){
            this.props.onSingleUpdate(this.props.data)   
        }
        else if(this.props.user.details.role == 'purchaser' && this.props.screenname == 'accepted'){
            console.log("In OnPress");
            this.props.onSingleUpdate(this.props.data)
        }
        else{
            return false;
        }*/
        this.props.onSingleUpdate(this.props.data)
    }
    render(){
        return(
            <Card style={styles.Card}>
            <CardItem>
              <Left>
                <FontAwesome name="shopping-cart" style={styles.cardIcon} />
                <Body>
                  <Text>{this.state.screenname} Order</Text>
                  <Text note style={styles.boldText}>{this.props.user.details.username == this.props.data.user.username ? "Self" : this.props.data.user.username}</Text>
                </Body>
              </Left>
              <Right>
                <Body style={styles.DateTimeBody}>
                  <Text note style={styles.boldText}>Time : {format.Time(this.props.data.createdAt)} </Text>
                  <Text note style={styles.boldText}>Date : {format.Date(this.props.data.createdAt)}</Text>
                </Body>
              </Right>
            </CardItem>
            <CardItem cardBody>
              <Body style={styles.cardBody}>
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>Chemical Name :</Text>{this.props.data.chemical_name}</Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>CC No.: </Text>{this.props.data.id}</Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>Quantity :</Text> {this.props.data.selling_quantity} MT </Text>
                </Body>
            </CardItem>
            <CardItem style={styles.CardItem}>
              <Body style={styles.ViewDetailsBodyStyle} >
                

                <TouchableOpacity style={styles.textBack} onPress = {() => this.props.onLink(this.props.data)}>
                   <Text style={styles.acceptText}>{this.state.extraButtext}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.subBack} onPress = {() => this.props.onPressItem(this.props.data)}>
                  <Text style={styles.viewDetailsText}>View More Details</Text>
                </TouchableOpacity>
              </Body>
            </CardItem>
          </Card>
        );
    }
}

const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
  };
  
  
export default (connect(mapStateToProps)(MylistView));