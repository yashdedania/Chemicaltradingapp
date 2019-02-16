import React, { Component } from 'react';
import { StyleProvider,Text,Content,Item,Button,Input,Icon,Toast,Picker} from "native-base";
import {View,StyleSheet,Image,ImageBackground,ScrollView} from 'react-native';
import getTheme from '../../../native-base-theme/components';
import material from '../../../native-base-theme/variables/material';
import auth from '../../api/Authorization';
const Logo  = require('../../../assets/AccordLogo.png');
const PinkBack = require('../../../assets/static/pinkbackground.png');
import Loader from '../../components/Loader';
import color from '../../theme/color';
class Register extends Component {
	static navigationOptions = {
    // headerTitle instead of title
    title:"Register",
    headerStyle: {
      backgroundColor: color.dark,
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
  constructor(props) {
    super(props);
  
    this.state = {
    	reg_username: { value: '', err: false, helperText: '',state:false}, 
      	reg_email: { value: '', err: false, helperText: '',state:false},
      	reg_mobileno: { value: '', err: false, helperText: '',state:false}, 
      	reg_pass: { value: '', err: false, helperText: '',state:false},
      	reg_confirmpass:{ value: '', err: false, helperText: '',state:false},
      	loading:false,
        showToast: false
    };
  }

  _handlechange= (name,text) =>{
  	let errors = {...this.state};
    //console.log("name: "+name+" Value: "+text);
  	if(name == 'username'){
  		errors.reg_username.value = text; errors = this.validate_UserName(errors);errors.reg_username.state = true;
  	}
  	if(name == 'email'){
  		errors.reg_email.value = text; errors = this.validate_Email(errors);errors.reg_email.state = true;
  	}
  	if(name == 'password'){
  		errors.reg_pass.value = text; errors = this.validate_Password(errors);errors.reg_pass.state = true;
  	}
  	if(name == 'confirmpass'){
  		errors.reg_confirmpass.value = text; errors = this.validate_ConfirmPass(errors);errors.reg_confirmpass.state = true;
  	}
  	if(name == 'mobileno'){
  		errors.reg_mobileno.value = text; errors = this.validate_Mobile(errors);errors.reg_mobileno.state = true;
    }
  	this.setState({ ...this.state, ...errors });
  }

  validate_UserName(errors){
  	if(errors.reg_username.value.length === 0  || errors.reg_username.value.toString().match(/\d+/g) != null){
  		errors.reg_username.helperText = 'Please enter a correct name'; errors.reg_username.err = true;
  	}
  	else{
  		errors.reg_username.helperText = ''; errors.reg_username.err = false; 
  	}
  	return errors;
  }
  validate_Email(errors){
  	if (errors.reg_email.value.length === 0 || !(/^\S+@\w+([-]?\w+)*(\.\w{2,3})+$/.test(errors.reg_email.value)) ){
      errors.reg_email.helperText = 'Please enter a correct Email Id'; errors.reg_email.err = true;
    }
    else{
      errors.reg_email.helperText = ''; errors.reg_email.err = false;
    }
    return errors;
  }
  validate_Password(errors){
  	if (errors.reg_pass.value.length <= 8){
      errors.reg_pass.helperText = 'Should be equal to or more than 8 characters'; errors.reg_pass.err = true;
    }
    else if(errors.reg_confirmpass.value.length != 0 && errors.reg_confirmpass.value != errors.reg_pass.value){
    	errors.reg_pass.helperText = 'The Password you entered do not match'; errors.reg_pass.err = true;
    }
    else{
      errors.reg_pass.helperText = ''; errors.reg_pass.err = false;
    }
    return errors;
  }
  validate_ConfirmPass(errors){
  	if (errors.reg_confirmpass.value.length <= 8){
      errors.reg_confirmpass.helperText = 'Should be equal to or more than 8 characters'; errors.reg_confirmpass.err = true;
    }
    else if(errors.reg_confirmpass.value != errors.reg_pass.value){
    	errors.reg_confirmpass.helperText = 'The Password you entered do not match'; errors.reg_confirmpass.err = true;
    }
    else{
      errors.reg_confirmpass.helperText = ''; errors.reg_confirmpass.err = false;
    }
    return errors;
  }
  validate_Mobile(errors){
  	if (errors.reg_mobileno.value.length === 0){
      errors.reg_mobileno.helperText = 'Please enter a correct Mobile No'; errors.reg_mobileno.err = true;
    }
    else{
      errors.reg_mobileno.helperText = ''; errors.reg_mobileno.err = false;
    }   
    return errors;
  }
  validateInput(){
    //console.log(this.state);
    let errors = {...this.state};
    errors = this.validate_UserName(errors); errors = this.validate_Email(errors);errors = this.validate_Password(errors);
    errors = this.validate_ConfirmPass(errors);errors = this.validate_Mobile(errors); 
    
    let err_chk = false;
    for (var x in errors){
      if (errors[x].err === true)
        err_chk = true;
    }
    //console.log("Printing states");
    //console.log(...this.state);
    if (err_chk === false)
      this.register();
    else
      this.setState({ ...this.state, ...errors, });
  }
  async register(){
    console.log('registering user...');
    this.setState({ ...this.state, loading: true, });
    console.log("In register");
    //console.log(this.state);    
    let resp = await auth.register(this.state); //console.log('Register resp: ',resp);
    if (resp !== false){
      if (resp.status === 'error'){
        this.setState({ ...this.state, loading: false, });    
        //console.log('In first IF');
        Toast.show({text: resp.result,buttonText: "Okay",type: "warning"});
      }
      else{
        //console.log('In first else');
        this.setState({ ...this.state, loading: false, });
        Toast.show({text: "User successfully registered!",buttonText: "Okay",type: "success"});
        this.props.navigation.navigate('LoginScreen');
      }  
    }
    else{
      //console.log('In last else');
      this.setState({ ...this.state, loading: false, }); 
      Toast.show({text: "Couldn't communicate with server. Please try again",buttonText: "Okay",type: "danger"});   
      
    }
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
	render(){
		return(
			<StyleProvider style={getTheme(material)}>
        <ScrollView keyboardDismissMode="none" keyboardShouldPersistTaps="always">
        <Loader loading = {this.state.loading} />
				<View style={styles.container}>
					<View style={styles.logoContainer}>
						<Image source={Logo} style={styles.logo} />
					</View>
					<View style={styles.loginForm}>
						    <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.reg_username.state ? (this.state.reg_username.err ? true : false) : false} success={this.state.reg_username.state ? (this.state.reg_username.err ? false : true) : false}>
				            <Input placeholder='Username' textContentType="username" onChangeText={(text) => this._handlechange('username',text)}/>
				            {this.IconRender(this.state.reg_username)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.reg_username.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.reg_pass.state ? (this.state.reg_pass.err ? true : false) : false} success={this.state.reg_pass.state ? (this.state.reg_pass.err ? false : true) : false}>
				            <Input placeholder='Password' textContentType="password" secureTextEntry={true} onChangeText={(text) => this._handlechange('password',text)}/>
				            {this.IconRender(this.state.reg_pass)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.reg_pass.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.reg_confirmpass.state ? (this.state.reg_confirmpass.err ? true : false) : false} success={this.state.reg_confirmpass.state ? (this.state.reg_confirmpass.err ? false : true) : false}>
				            <Input placeholder='Confirm Password' textContentType="password" secureTextEntry={true} onChangeText={(text) => this._handlechange('confirmpass',text)}/>
				            {this.IconRender(this.state.reg_confirmpass)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.reg_confirmpass.helperText}</Text>
				        </View>

				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.reg_email.state ? (this.state.reg_email.err ? true : false) : false} success={this.state.reg_email.state ? (this.state.reg_email.err ? false : true) : false}>
				            <Input placeholder='Email' textContentType="emailAddress" keyboardType="email-address" onChangeText={(text) => this._handlechange('email',text)}/>
				            {this.IconRender(this.state.reg_email)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.reg_email.helperText}</Text>
				        </View>


				        <View style={styles.formContainer}>
				          <Item rounded style={styles.inputFields} error={this.state.reg_mobileno.state ? (this.state.reg_mobileno.err ? true : false) : false} success={this.state.reg_mobileno.state ? (this.state.reg_mobileno.err ? false : true) : false}>
				            <Input placeholder='Mobile Number'  textContentType="telephoneNumber" keyboardType="numeric" maxLength={10} onChangeText={(text) => this._handlechange('mobileno',text)}/>
				            {this.IconRender(this.state.reg_mobileno)}
				          </Item>
				          <Text style={styles.helpertext}>{this.state.reg_mobileno.helperText}</Text>
				        </View>

                
                <View style={styles.formContainer}>
                  <Button full rounded style={styles.logBut} onPress={() => this.validateInput()}>
                    <Text style={styles.logtext}>SEND ACCESS REQUEST</Text>
                  </Button>
                </View>
					</View>
					<ImageBackground style={styles.bottom} source={PinkBack}>
						<View style={[styles.bottomRow1,styles.bottomRow2]} ><Text style={styles.already} onPress={() => this.props.navigation.navigate('LoginScreen')}>Already Have Account?</Text><Text style={styles.signin} onPress={() => this.props.navigation.navigate('LoginScreen')}>Sign In</Text></View>
					</ImageBackground>
				</View>
        </ScrollView>
			</StyleProvider>
      
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
    paddingRight:25
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
  	backgroundColor:'rgba(0, 0, 0, 1)',
    width:'100%'
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


export default Register;