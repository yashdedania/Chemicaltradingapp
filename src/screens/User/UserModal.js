import React, { Component } from "react";
import gstyles from '../../theme/styles/general';
import fstyles from '../../theme/styles/formstyles';
import mstyles from '../../theme/styles/requestsent';
import {View,Body,Text,Button,Input,Item,Picker,CheckBox,Icon} from 'native-base';
import {ImageBackground,Modal,TouchableOpacity,StyleSheet,ScrollView} from 'react-native';
import color from "../../theme/color";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import urls from "../../api/apivariable";
import AlertAsync from "react-native-alert-async";
class UserModal extends Component{
    constructor(props){
        super(props);
        this.state = {
            username:{value:'',err:false,helperText:''},
            email:{value:'',err:false,helperText:''},
            mobileno:{value:'',err:false,helperText:''},
            pass:{value:'',err:false,helperText:''},
            confirmpass:{value:'',err:false,helperText:''},
            role:{value:'staff',err:false,helperText:''},
            accessto:[],
            sales:false,
            stock_available:false,
            purchase_pending:false,
            request_status:false,
            gen_request:false,
            userauth:false,
            ar:false,
            delete:false,
            user:props.data == null ? null : props.data
        }
        this._ismounted = false;
    }
    componentDidMount = () =>{
        this._ismounted = true;
    }
    componentWillUnmount = () =>{
        this._ismounted = false;
    }
    _handlechange= (name,text) =>{
        let errors = {...this.state};
      //console.log("name: "+name+" Value: "+text);
        if(name == 'username'){
            errors.username.value = text; errors = this.validate_UserName(errors);errors.username.state = true;
        }
        if(name == 'email'){
            errors.email.value = text; errors = this.validate_Email(errors);errors.email.state = true;
        }
        if(name == 'password'){
            errors.pass.value = text; errors = this.validate_Password(errors);errors.pass.state = true;
        }
        if(name == 'confirmpass'){
            errors.confirmpass.value = text; errors = this.validate_ConfirmPass(errors);errors.confirmpass.state = true;
        }
        if(name == 'mobileno'){
            errors.mobileno.value = text; errors = this.validate_Mobile(errors);errors.mobileno.state = true;
        }
        /*if(name == 'role'){
            errors.role.value = text; errors=this.validate_role(errors);
        }*/
        this.setState({ ...this.state, ...errors });
    }
    /*validate_role = (errors) =>{
        if(errors.role.value.length === 0  || errors.role.value == ""){
            errors.role.err = true;
            errors.role.helperText = "Please Select the role properly";
        }
        else{
            errors.role.err = false;
            errors.role.helperText = "";
        }
        return errors;
    }*/
    validate_UserName(errors){
        if(errors.username.value.length === 0  || errors.username.value.toString().match(/\d+/g) != null){
            errors.username.helperText = 'Please enter a correct name'; errors.username.err = true;
        }
        else{
            errors.username.helperText = ''; errors.username.err = false; 
        }
        return errors;
    }
    validate_Email(errors){
        if (errors.email.value.length === 0 || !(/^\S+@\w+([-]?\w+)*(\.\w{2,3})+$/.test(errors.email.value)) ){
        errors.email.helperText = 'Please enter a correct Email Id'; errors.email.err = true;
      }
      else{
        errors.email.helperText = ''; errors.email.err = false;
      }
      return errors;
    }
    validate_Password(errors){
        if (errors.pass.value != "" && errors.pass.value.length <= 8){
        errors.pass.helperText = 'Should be equal to or more than 8 characters'; errors.pass.err = true;
      }
      else if(errors.confirmpass.value.length != 0 && errors.confirmpass.value != errors.pass.value){
          errors.pass.helperText = 'The Password you entered do not match'; errors.pass.err = true;
      }
      else{
        errors.pass.helperText = ''; errors.pass.err = false;
      }
      return errors;
    }
    validate_ConfirmPass(errors){
        if (errors.confirmpass.value != "" && errors.confirmpass.value.length <= 8){
        errors.confirmpass.helperText = 'Should be equal to or more than 8 characters'; errors.confirmpass.err = true;
      }
      else if(errors.confirmpass.value != errors.pass.value){
          errors.confirmpass.helperText = 'The Password you entered do not match'; errors.confirmpass.err = true;
      }
      else{
        errors.confirmpass.helperText = ''; errors.confirmpass.err = false;
      }
      return errors;
    }
    validate_Mobile(errors){
        if (errors.mobileno.value.length === 0){
        errors.mobileno.helperText = 'Please enter a correct Mobile No'; errors.mobileno.err = true;
      }
      else{
        errors.mobileno.helperText = ''; errors.mobileno.err = false;
      }   
      return errors;
    }
    validateInput(name){
      //console.log(this.state);
      let errors = {...this.state};
      errors = this.validate_UserName(errors); errors = this.validate_Email(errors);errors = this.validate_Password(errors);
      errors = this.validate_ConfirmPass(errors);errors = this.validate_Mobile(errors); //errors = this.validate_role(errors);
      
      let err_chk = false;
      for (let x in errors){
        console.log(x);
        if(errors[x] !== null && errors[x] !== undefined && errors[x].err !== null && errors[x].err !== undefined){
            
            if (errors[x].err === true){
                err_chk = true;
            }  
        }   
        
      }
      //console.log("Printing states");
      //console.log(...this.state);
      if (err_chk === false)
        this.props.submitForm(name,this.state);
      else
        this.setState({ ...this.state, ...errors, });
    }
    IconRender(field){
        if(!field.state){
            return null;
        }
        if(field.err){
            return (
                <Icon name='close-circle' />
            );
        }
        else{
            return (<Icon name='checkmark-circle' />
            );
        }
    }
    _handlecheckchange = (name) =>{
        let extra = {...this.state};
        let flag;
        console.log("-----------------Handle check -------------");
        if(name == "Generate Request"){
            flag = extra.gen_request;
            extra.gen_request = !extra.gen_request;
        }
        else if(name == "Request Status"){
            flag = extra.request_status;
            extra.request_status = !extra.request_status;
        }
        else if(name == "Purchase Pending"){
            flag = extra.purchase_pending;
            extra.purchase_pending = !extra.purchase_pending;
        }
        else if(name == "Stock Available"){
            flag = extra.stock_available;
            extra.stock_available = !extra.stock_available;
        }
        else if(name == "Sales"){
            flag = extra.sales;
            extra.sales  = !extra.sales;
        }
        else if(name == "Accept/Reject"){
            flag = extra.ar;
            extra.ar = !extra.ar;
        }
        else if(name == "User Authorization"){
            flag = extra.userauth;
            extra.userauth = !extra.userauth;
        }
        else if(name == "Deleted Request"){
            flag = extra.delete;
            extra.delete = !extra.delete;
        }
        
        console.log("-----printing flag---- "+flag);
        if(flag){
            // remove element from array
            console.log("------Removing Element----");
            extra.accessto.splice(extra.accessto.indexOf(name),1);
        }
        else{
            // add element if not present
            console.log("------adding element");
            if(extra.accessto.indexOf(name) == -1){
                console.log("In if");
                extra.accessto.push(name);
            }
        }
        //console.log(extra);
        this.setState({...this.state,...extra});
    }
    setValues =()=>{
        //console.log("Set vlues called------------");

        //console.log(this.props.data);
        if(this.props.data !== undefined && this.props.data !== null && JSON.stringify(this.props.data).length != 2){
            //console.log("printing props--------");
            let params = this.props.data;
            //console.log(params.username);
            let extra = {
                username:{value:params.username == null ? '' : params.username,err:false,helperText:''},
                email:{value:params.email == null ? '' : params.email,err:false,helperText:''},
                mobileno:{value:params.mobileno == null ? '' : params.mobileno,err:false,helperText:''},
                pass:{value:'',err:false,helperText:''},
                confirmpass:{value:'',err:false,helperText:''},
                role:{value:params.role == null ? '' : params.role,err:false,helperText:''},
                accessto:params.accessto == null ? [] : params.accessto,
                sales:params.accessto.indexOf("Sales") == -1 ? false :true,
                stock_available:params.accessto.indexOf("Stock Available") == -1 ? false :true,
                purchase_pending:params.accessto.indexOf("Purchase Pending") == -1 ? false :true,
                request_status:params.accessto.indexOf("Request Status") == -1 ? false :true,
                gen_request:params.accessto.indexOf("Generate Request") == -1 ? false :true,
                userauth:params.accessto.indexOf("User Authorization") == -1 ? false:true,
                ar:params.accessto.indexOf("Accept/Reject") == -1 ? false:true,
                delete:params.accessto.indexOf("Deleted Request") == -1 ? false :true,
                user:params == null ? null : params
            }
            if(this._ismounted){
                this.setState({...this.state,...extra});
            }
        }
        else{
            if(this._ismounted){
                this.setState({user:null});
            }
        }
    }

    _renderBlock = (name) =>{
        if(this.state.user !== null && this.state.user !== undefined){
            if(name === "Block" && this.state.user.verified === true){
                return true;
            }
            else if(name === "Unblock" && this.state.user.verified === false){
                return true;
            }
            else{
                return false;
            }
        }   
        else{
            return false;
        }
    }
    _pressBlock = async(name) =>{
        let choice  =false;
        let heading = name+ " User";
        let message = "Are you sure you want to "+name+" this user?";
        choice = await AlertAsync(
            heading,
            message,
            [
            {text:'Yes',onPress:() => true},
            {text:'No',onPress:() => false}
            ],
            {cancelable:false}
        );
        if(choice){
            this.props.block(name,this.state);
        }
    }
    render(){
        return(
            <Modal visible={this.props.visibile}  animationType={'slide'} onShow={() => this.setValues()} onRequestClose={() => {console.log("Modal close")}}>
                <View style={mstyles.ModalContainer}><Text style={mstyles.Modaltitle}>User Details</Text><TouchableOpacity onPress={() => this.props.dismiss()}><MaterialCommunityIcons name='close-outline' style={mstyles.Modalclose}/></TouchableOpacity></View>
                <View style={gstyles.profileContainer}>
                    <View style={gstyles.profilecircle}>
                        <TouchableOpacity>
                            <ImageBackground  style={gstyles.profileBack} imageStyle={{borderRadius:50}} source={{uri:this.state.user ===  null ? urls.DEFAULT : this.state.user.imageuri}}>
                            </ImageBackground>
                        </TouchableOpacity>    
                    </View>
                </View>
                <ScrollView keyboardDismissMode="none" keyboardShouldPersistTaps="always">
                    <View style={styles.loginForm}>
						<View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.username.state ? (this.state.username.err ? true : false) : false} success={this.state.username.state ? (this.state.username.err ? false : true) : false}>
				            <Input placeholder='Username' textContentType="username" onChangeText={(text) => this._handlechange('username',text)} value={this.state.username.value} />
				            {this.IconRender(this.state.username)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.username.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.pass.state ? (this.state.pass.err ? true : false) : false} success={this.state.pass.state ? (this.state.pass.err ? false : true) : false}>
				            <Input placeholder='Password' textContentType="password" secureTextEntry={true} onChangeText={(text) => this._handlechange('password',text)} value={this.state.pass.value}/>
				            {this.IconRender(this.state.pass)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.pass.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.confirmpass.state ? (this.state.confirmpass.err ? true : false) : false} success={this.state.confirmpass.state ? (this.state.confirmpass.err ? false : true) : false}>
				            <Input placeholder='Confirm Password' textContentType="password" secureTextEntry={true} onChangeText={(text) => this._handlechange('confirmpass',text)} value={this.state.confirmpass.value}/>
				            {this.IconRender(this.state.confirmpass)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.confirmpass.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.email.state ? (this.state.email.err ? true : false) : false} success={this.state.email.state ? (this.state.email.err ? false : true) : false}>
				            <Input placeholder='Email' textContentType="emailAddress" keyboardType="email-address" onChangeText={(text) => this._handlechange('email',text)} value={this.state.email.value}/>
				            {this.IconRender(this.state.email)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.email.helperText}</Text>
				        </View>


				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.mobileno.state ? (this.state.mobileno.err ? true : false) : false} success={this.state.mobileno.state ? (this.state.mobileno.err ? false : true) : false}>
				            <Input placeholder='Mobile Number'  textContentType="telephoneNumber" keyboardType="numeric" maxLength={10} onChangeText={(text) => this._handlechange('mobileno',text)} value={this.state.mobileno.value}/>
				            {this.IconRender(this.state.mobileno)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.mobileno.helperText}</Text>
				        </View>

                        {/*<View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.mobileno.state ? (this.state.mobileno.err ? true : false) : false} success={this.state.mobileno.state ? (this.state.mobileno.err ? false : true) : false}>
                          <Picker
                                mode="dropdown"
                                selectedValue={this.state.role.value}
                                onValueChange={(text) => this._handlechange("role",text)}
                                style={styles.selectFields}
                            >
                                <Picker.Item label="Select Role" value="" />
                                <Picker.Item label="Staff" value="staff" />
                                <Picker.Item label="Admin" value="admin" />
                            </Picker>

				          </Item>
				          <Text style={styles.helpertext}>{this.state.role.helperText}</Text>
        </View>*/}

                        <View style={styles.checkContainer}>
                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Generate Request')}>
                                <CheckBox checked={this.state.gen_request} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Generate Request</Text>
                                </Body>
                            </TouchableOpacity>

                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Request Status')}>
                                <CheckBox checked={this.state.request_status} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Request Status</Text>
                                </Body>
                            </TouchableOpacity>

                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Purchase Pending')}>
                                <CheckBox checked={this.state.purchase_pending} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Purchase Pending</Text>
                                </Body>
                            </TouchableOpacity>

                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Stock Available')}>
                                <CheckBox checked={this.state.stock_available} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Stock Available</Text>
                                </Body>
                            </TouchableOpacity>

                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Sales')}>
                                <CheckBox checked={this.state.sales} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Sales</Text>
                                </Body>
                            </TouchableOpacity>
                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('User Authorization')}>
                                <CheckBox checked={this.state.userauth} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>User Authorization</Text>
                                </Body>
                            </TouchableOpacity>
                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Accept/Reject')}>
                                <CheckBox checked={this.state.ar} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Accept/Reject</Text>
                                </Body>
                            </TouchableOpacity>

                            <TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Deleted Request')}>
                                <CheckBox checked={this.state.delete} color={color.primary} />
                                <Body style={fstyles.formBody}>
                                    <Text>Deleted Request</Text>
                                </Body>
                            </TouchableOpacity>
                            
                        </View>
                
                        <View style={styles.formContainer}>
                            <Button full primary rounded style={this.state.user == null ? styles.hidebut:styles.logBut} onPress={() => this.validateInput('Update')}>
                                <Text style={styles.logtext}>Update User</Text>
                            </Button>

                            <Button full danger rounded style={this._renderBlock("Block") ? styles.logBut:styles.hidebut} onPress={() => this._pressBlock('Block')}>
                                <Text style={styles.logtext}>Block User</Text>
                            </Button>

                            <Button full success rounded style={this._renderBlock("Unblock") ? styles.logBut:styles.hidebut} onPress={() => this._pressBlock('Unblock')}>
                                <Text style={styles.logtext}>Unblock User</Text>
                            </Button>

                            <Button full primary rounded style={this.state.user == null ? styles.logBut:styles.hidebut} onPress={() => this.validateInput('New User')}>
                                <Text style={styles.logtext}>Register New User</Text>
                            </Button>
                        </View>
				    </View>
                </ScrollView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex:1,
      height:800,
      backgroundColor: 'rgba(255, 255, 255, 1)',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection:'column'
    },
    logoContainer:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        paddingTop:10
    },
    formContainer:{
      display:'flex',
      justifyContent:'center',
      width:'100%',
      alignItems:'flex-start',
      paddingLeft:25,
      paddingRight:25,
      marginTop:8,
      marginBottom:8
    },
    checkContainer:{
        display:'flex',
        flexWrap:'wrap',
        alignItems:'center',
        flexDirection:'row',
        padding:10,
        marginTop:5,
        marginBottom:5
    },
    inputFields:{
        backgroundColor:'rgba(255, 255, 255, 1)',
      borderWidth:5,
      width:'100%'
    },
    selectFields:{
      borderWidth:10,
      width:'100%'
    },
    loginForm:{
        flex:3,
      marginTop:10,
        justifyContent:'space-around',
        alignItems:'center',
        flexDirection:'column',
    },
    helpertext:{
        fontSize:12,
        paddingRight:10,
        color:'rgb(225, 23, 23)'
    },
    logBut:{
      width:'100%',
      marginTop:8,
      marginBottom:8
    },
    hidebut:{
        display:'none'
    },
    logtext:{
        fontSize:20,
        textAlign:'justify'
    },
    bottom:{
      flex:1,
        width:'100%',
        height:'100%'
    },
    bottomRow1:{
        flex:1,
        justifyContent:'center',
        alignItems:'flex-end',
        paddingBottom:10,
        flexDirection:'row'
    },
    already:{
        fontSize:18,
        color:'rgb(255,255,255)',
        marginRight:5
    },
    signin:{
        fontSize:20,
        fontWeight:'bold',
        color:'rgb(53, 53, 53)'
    }
  });

  export default UserModal;