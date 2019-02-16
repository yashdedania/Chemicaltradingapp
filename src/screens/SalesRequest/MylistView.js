import React,{Component} from 'react';
import { connect } from 'react-redux';
import {TouchableOpacity} from 'react-native';
import { Card, CardItem,
    Body, Text, Left, Right
  } from 'native-base';
import styles from '../../theme/styles/requestlist';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import format from '../../components/dateformat';
class MylistView extends Component {
    constructor(props){
        super(props);
        this.state = {
            accept: ((props.user.details.role == 'admin' || props.user.details.accessto.indexOf("Accept/Reject") != -1 ) && (props.screenname == 'pending' || props.screenname == 'rejected')) ? true: false,
            inventory:(props.user.details.id == props.data.user.id && props.screenname == 'accepted') ? false : false,
            extraButtext: props.extrabut == null ? '' : props.extrabut
        };
    }

    _onPress = () =>{
      console.log("pressed");
      console.log("Role: "+this.props.user.details.role);
      console.log("Screenname: "+this.props.screenname);
        if( (this.props.user.details.role == 'admin' || this.props.user.details.accessto.indexOf("Accept/Reject") != -1) && (this.props.screenname == 'pending' || this.props.screenname == 'rejected')){
            this.props.onSingleUpdate(this.props.data)   
        }
        else if(this.props.user.details.id == this.props.data.user.id && this.props.screenname == 'accepted'){
            console.log("In OnPress");
            //this.props.onSingleUpdate(this.props.data)
        }
        else{
            return false;
        }
    }
    render(){
        return(
            <Card style={styles.Card}>
            <CardItem>
              <Left>
                <FontAwesome name="shopping-cart" style={styles.cardIcon} />
                <Body>
                  <Text>Sales Request</Text>
                  <Text note style={styles.boldText}>{(this.props.user.details.role == 'admin' || this.props.user.details.accessto.indexOf("Accept/Reject") != -1) ? this.props.data.user.username : this.props.data.broker.name }</Text>
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
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>Amount :</Text> Rs. {this.props.data.total_amount} </Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>Sales Type :</Text> {this.props.data.sales_id == null ? 'Not Linked(Purchase Pending)' : 'Linked to CC no.'+this.props.data.sales_id}</Text>
                <Text style={styles.bodyText}>
                  <Text style={styles.boldText}>Delivery Port: </Text>{this.props.data.delivery_place}</Text>
              </Body>
            </CardItem>
            <CardItem style={styles.CardItem}>
              <Body style={styles.ViewDetailsBodyStyle} >
                <TouchableOpacity style={[styles.textBack,{display:this.state.accept ? 'flex' : 'none'}]} onPress = {() => this._onPress()} disabled={this.state.accept ? false:true}>
                   <Text style={this.props.screenname == 'pending' ? styles.acceptText:styles.acceptText}>{this.state.extraButtext}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.textBack,{display:this.state.inventory ? 'flex' : 'none'}]} onPress = {() => this._onPress()} disabled={this.state.inventory ? false:true}>
                   <Text style={styles.acceptText}>{this.state.extraButtext}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.subBack} onPress = {() => this.props.onPressItem(this.props.data)}>
                  <Text style={styles.viewDetailsText}>View Request Details</Text>
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