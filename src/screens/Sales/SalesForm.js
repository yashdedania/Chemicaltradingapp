// export Component From Ract
import React, { Component } from 'react';
// export View, Text, StyleSheet, AsyncStorage from react-native
// eslint-disable-next-line max-len
import { Text, Button, Container, Label, Item, Input, Content, Picker, DatePicker, View,List,ListItem,Body,Left,Right,Title} from 'native-base';
import { ScrollView,TouchableOpacity } from 'react-native';
import styles from '../../theme/styles/general'; 
import sales from '../../api/sales';
import fstyles from '../../theme/styles/formstyles';
import Loader from '../../components/Loader';
import format from '../../components/dateformat';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import hstyles from '../../theme/styles/header';
import AlertAsync from "react-native-alert-async";
import messages from '../../components/messages';
// Creating a Component

class SalesForm extends Component {
    static navigationOptions = {
      // headerTitle instead of title
      headerMode:'none',
      header:null,
    };
    constructor(props) {
      super(props);
      var {params} = props.navigation.state;
      console.log("In constructor of salesform -------");
      console.log(params);
      if(params !== undefined){
          if(params.Inventoryflag === false){
            console.log("Inventory Flag null");
            params = null;
          }   
      }
      this.state = {
          old:params == null ? false : params,
          hasData:params == null ? false : true,
          chemical_name: { value:params == null ? '' : params.chemical_name, err: false, helperText: '',state:false}, 
          selling_quantity:{value:'',err:false,helperText:'',state:false,label:'Q'},
          supplier:{value:'',err:false,helperText:'',state:false},
          packing_type:{value:'',err:false,helperText:'',state:false},
          packing_subtype:{value:'',err:false,helperText:'',state:false},
          packing_weight:{value:'',err:false,helperText:'',state:false},
          estimated_time:{value:'',err:false,helperText:'',state:false},
          estimated_month:{value:'',err:false,helperText:'',state:false},
          delivery_place:{value:params == null ? '' : params.delivery_place,err:false,helperText:'',state:false},
          delivery_date:{value:'',err:false,helperText:'',state:false},
          vessel_name:{value:'',err:false,helperText:'',state:false},
          broker_select:{value:'',err:false,helperText:'',state:false},
          broker_name:{value:'',err:false,helperText:'',state:false},
          broker_comission:{value:'',err:false,helperText:'',state:false,label:'C'},
          transportation_select:{value:'',err:false,helperText:'',state:false},
          transportation_rate:{value:'',err:false,helperText:'',state:false,label:'TR'},
          transportation_amount:{value:'',err:false,helperText:'',state:false,label:'TA'},
          loan_basis:{value:'',err:false,helperText:'',state:false},
          payment_type:{value:'',err:false,helperText:'',state:false},
          payment_terms:{value:'',err:false,helperText:'',state:false},
          payment_terms_from:{value:'',err:false,helperText:'',state:false},
          payment_date:{value:'',err:false,helperText:'',state:false},
          bl_date:{value:'',err:false,helperText:'',state:false},
          confirmation_date:{value:'',err:false,helperText:'',state:false},
          storage_days:{value:'',err:false,helperText:'',state:false},
          storage_date:{value:'',err:false,helperText:'',state:false},
          selling_type:{value:'',err:false,helperText:'',state:false},
          selling_subtype:{value:'',err:false,helperText:'',state:false},
          currency_type:{value:'',err:false,helperText:'',state:false},
          currency_subtype:{value:'',err:false,helperText:'',state:false},
          insurance_cost:{value:'',err:false,helperText:'',state:false,label:'IC'},
          currency_rate:{value:'',err:false,helperText:'',sate:false,label:'CR'},
          clearance_cost:{value:'',err:false,helperText:'',state:false,label:'CC'},
          selling_rate:{value:'',err:false,helperText:'',state:false,label:'SR'},
          selling_rate_in_inr:{value:'',err:false,helperText:'',state:false,label:'SRI'},
          extra_storage:{value:'',err:false,helperText:'',state:false},
          custom_duty_cost:{value:'',err:false,helperText:'',state:false,label:'CDC'},
          cess_per:{value:'',err:false,helperText:'',state:false,label:'CPR'},
          cess:{value:'',err:false,helperText:'',state:false,label:'CS'},
          finance_cost:{value:'',err:false,helperText:'',state:false,label:'FC'},
          net_amount:{value:'',err:false,helperText:'',state:false,label:'NA'},
          total_amount:{value:'',err:false,helperText:'',state:false,label:'T'},
          remarks:{value:'',err:false,helperText:'',state:false},
          exp1:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp2:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp3:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp4:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp_flag:false,
          selling_type_flag:false,
          pickerlist:[{label:"Select Type" , value:''}],
          export_flag:false,
          selling_type_done_flag:false,
          loading:false,
          blur:false,
      };

      this._isMounted = false;
    }
    componentDidMount = async() =>{
      this._isMounted = true;
      let choice = false;
      if(this.state.old === false){
        choice = await AlertAsync(
          'Warning',
          'This Form is not Linked to any Purchase CC no. and will be submitted as Purchase pending request do you still want to continue?',
          [
            {text:'Yes',onPress:() => true},
            {text:'No',onPress:() => false}
          ],
          {cancelable:false}
        );
        if(!choice){
          this.props.navigation.goBack();
        }
      }
      this.props.navigation.setParams({ Inventoryflag: false });
      this.renderlist();
      this.didBlurSubscription = this.props.navigation.addListener(
        'didBlur',
        payload => {
          this.setState({blur:true});
        }
    );
    this.willFocusSubscription = this.props.navigation.addListener(
        'willFocus',
        payload => {
          if(this.state.blur){
              if(this._isMounted){
                this.reset();
                
              }
              
          }
        }
    );
    }
    reset = async() =>{
      let resetValues = {
        old:false,
        hasData:false,
        chemical_name: { value: '', err: false, helperText: '',state:false}, 
          selling_quantity:{value:'',err:false,helperText:'',state:false,label:'Q'},
          supplier:{value:'',err:false,helperText:'',state:false},
          packing_type:{value:'',err:false,helperText:'',state:false},
          packing_subtype:{value:'',err:false,helperText:'',state:false},
          packing_weight:{value:'',err:false,helperText:'',state:false},
          estimated_time:{value:'',err:false,helperText:'',state:false},
          estimated_month:{value:'',err:false,helperText:'',state:false},
          delivery_place:{value:'',err:false,helperText:'',state:false},
          delivery_date:{value:'',err:false,helperText:'',state:false},
          vessel_name:{value:'',err:false,helperText:'',state:false},
          broker_select:{value:'',err:false,helperText:'',state:false},
          broker_name:{value:'',err:false,helperText:'',state:false},
          broker_comission:{value:'',err:false,helperText:'',state:false,label:'C'},
          transportation_select:{value:'',err:false,helperText:'',state:false},
          transportation_rate:{value:'',err:false,helperText:'',state:false,label:'TR'},
          transportation_amount:{value:'',err:false,helperText:'',state:false,label:'TA'},
          loan_basis:{value:'',err:false,helperText:'',state:false},
          payment_type:{value:'',err:false,helperText:'',state:false},
          payment_terms:{value:'',err:false,helperText:'',state:false},
          payment_terms_from:{value:'',err:false,helperText:'',state:false},
          payment_date:{value:'',err:false,helperText:'',state:false},
          bl_date:{value:'',err:false,helperText:'',state:false},
          confirmation_date:{value:'',err:false,helperText:'',state:false},
          storage_days:{value:'',err:false,helperText:'',state:false},
          storage_date:{value:'',err:false,helperText:'',state:false},
          selling_type:{value:'',err:false,helperText:'',state:false},
          selling_subtype:{value:'',err:false,helperText:'',state:false},
          currency_type:{value:'',err:false,helperText:'',state:false},
          currency_subtype:{value:'',err:false,helperText:'',state:false},
          currency_rate:{value:'',err:false,helperText:'',sate:false,label:'CR'},
          clearance_cost:{value:'',err:false,helperText:'',state:false,label:'CC'},
          selling_rate:{value:'',err:false,helperText:'',state:false,label:'SR'},
          selling_rate_in_inr:{value:'',err:false,helperText:'',state:false,label:'SRI'},
          extra_storage:{value:'',err:false,helperText:'',state:false},
          custom_duty_cost:{value:'',err:false,helperText:'',state:false,label:'CDC'},
          cess_per:{value:'',err:false,helperText:'',state:false,label:'CPR'},
          cess:{value:'',err:false,helperText:'',state:false,label:'CS'},
          insurance_cost:{value:'',err:false,helperText:'',state:false,label:'IC'},
          finance_cost:{value:'',err:false,helperText:'',state:false,label:'FC'},
          net_amount:{value:'',err:false,helperText:'',state:false,label:'NA'},
          total_amount:{value:'',err:false,helperText:'',state:false,label:'T'},
          remarks:{value:'',err:false,helperText:'',state:false},
          exp1:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp2:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp3:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp4:{name:'',value:'',err:false,nhelperText:'',vhelperText:'',state:false},
          exp_flag:false,
          selling_type_flag:false,
          pickerlist:[{label:"Select Type" , value:''}],
          export_flag:false,
          selling_type_done_flag:false,
          loading:false,
          blur:false,
      };
      if(this._isMounted){
          console.log("In if mounted resetting");
        await this.setState({...this.state,...resetValues});
        this.renderlist();
      }
    }
    componentWillUnmount = () =>{
      this._isMounted = false;
      
      this.didBlurSubscription.remove();
      this.willFocusSubscription.remove();

    }
    _handlechange = (name,text) =>{
        let errors = {...this.state};
        errors[name].value =text;
        if(name == "payment_date" || name == "storage_date" || name == "delivery_date" || name == "bl_date" || name == "confirmation_date"){
          errors[name].value = new Date(text);
          errors = this.cal_payment_date(errors);
        }
        
        if(name == "selling_type"){
          errors = this.clear_values(errors);
          errors = this.validate_selling_type(errors);
        }
        if(name == "selling_subtype"){
          errors = this.clear_values(errors);
          errors = this.validate_selling_subtype(errors);
        }
        if(name == "chemical_name" || name == "packing_type"  || name == "estimated_time"  
        || name == "delivery_place" || name == "broker_select" || name == "transportation_select" || name == "loan_basis" || name == "payment_type"
        || name == "currency_type" || name == "currency_subtype"){
          errors = this.validate_empty_input(errors,name,"select");
        }
        if(name == "supplier" || name == "vessel_name"  || name == "payment_date" || name == "payment_terms" || name == "storage_days"
        || name == "storage_date" || name == "extra_storage" || name == "delivery_date" || name == "bl_date" || name == "confirmation_date"){
          errors = this.validate_empty_input(errors,name,"input");
        }
        if(name == "packing_subtype" || name == "packing_weight" || name == "broker_name" || name == "broker_comission" || name == "transportation_rate" || name == "transportation_amount"
        || name == "currency_rate" || name == "clearance_cost"  || name == "custom_duty_cost" || name == "cess" || name == "finance_cost" || name == "estimated_month" 
        || name == "payment_terms_from" || name == "cess_per" || name == "insurance_cost"){
          errors = this.validate_dependent_values(errors,name);
        }
        if(name == "selling_quantity"){
          errors = this.validate_digits(errors,name,"Quantity");
        }  
        if(name == "selling_rate" ){
          errors = this.validate_digits(errors,name,"Amount");
        }
  
        if(name == "payment_terms_from" || name == "payment_terms"){
          errors = this.cal_payment_date(errors);
        } 
        //errors = this.validateInput(name,errors);
        if(name == "selling_quantity" || name == "currency_rate" || name == "clearance_cost" || name == "custom_duty_cost"  || name == "cess" 
        || name == "total_amount" || name == "selling_rate" || name == "transportation_rate" || name == "finance_cost" || name == "cess_per" || name == "insurance_cost" 
        || name == "broker_comission" || name == "broker_select" || name == "transportation_select" || name == "currency_subtype"){
          errors = this.calculate_amount(errors);
        }
        if(name == "delivery_date"){
          errors = this.validate_delivery_date(errors);
        }
        errors = this.change_helper(errors);
        if(this._isMounted){
          this.setState({...this.state,...errors});
        }    
    }
    validate_delivery_date = (errors) =>{
      let choice = false;
      var message = "Delivery Date of Link Purchased Order is greater than the selected date";
      if(errors.old !== null && errors.old !== false){
          if(errors.old.delivery_date !== null && errors.old.delivery_date != '' && errors.delivery_date.value != ''){
            if(new Date(errors.old.delivery_date) >= new Date(errors.delivery_date.value)){
              choice =  AlertAsync(
                'Warning',
                'Delivery Date of Link Purchased Order is greater than the selected date. Please Select new Date',
                [
                  {text:'Okay',onPress:() => true},
                ],
                {cancelable:false}
              );
              if(choice){
                errors.delivery_date.err = true;
                errors.delivery_date.helperText = 'Please select the correct date';
              }
            }
          }
      }
      return errors;
    }
    change_helper = (errors) =>{
      if(errors.currency_type.value != "inr" && errors.currency_type.value != "" && errors.selling_rate_in_inr.err === false){
        errors.selling_rate_in_inr.helperText = errors.selling_rate_in_inr.label +" = "+errors.selling_rate.label+" * "+errors.currency_rate.label;
      }
      if(errors.export_flag && errors.cess.err === false){
        errors.cess.helperText = errors.cess.label+" = ( "+errors.cess_per.label+" * "+errors.custom_duty_cost.label+" )/100";
      }
      if(errors.transportation_select.value == "accord" && errors.transportation_amount.err === false){
        errors.transportation_amount.helperText = errors.transportation_amount.label+" = "+errors.transportation_rate.label+" * "+errors.selling_quantity.label;
      }
      if(errors.export_flag && errors.currency_type.value != "inr" && errors.currency_type.value != "" && errors.net_amount.err === false){
        errors.net_amount.helperText = errors.net_amount.label+" = ( "+errors.selling_rate.label+" * "+errors.currency_rate.label+" ) - "+errors.clearance_cost.label+" - "+errors.custom_duty_cost.label+" - "+errors.cess.label+" - "+errors.finance_cost.label;  
      }
      if(errors.export_flag && errors.currency_type.value == "inr" && errors.currency_type.value != "" && errors.net_amount.err === false){
        errors.net_amount.helperText = errors.net_amount.label+" = "+errors.selling_rate.label+" - "+errors.clearance_cost.label+" - "+errors.custom_duty_cost.label+" - "+errors.cess.label+" - "+errors.finance_cost.label;
      }
      if(!errors.export_flag && errors.net_amount.err === false){
        errors.net_amount.helperText =  errors.net_amount.label+" = "+errors.selling_rate.label;
      }
      if(errors.transportation_select.value == "accord"){
        errors.net_amount.helperText += " - "+errors.transportation_rate.label;
      }
      if(errors.broker_select.value == "yes"){
        errors.net_amount.helperText += " - "+errors.broker_comission.label;
      }
      if(errors.exp_flag){
        errors.net_amount.helperText += "-EC";
      }
      if(errors.currency_subtype.value == "CFR" || errors.currency_subtype.value == "FOD"){
        errors.net_amount.helperText += "- "+errors.insurance_cost.label;
      }
      if(errors.total_amount.err === false){
        errors.total_amount.helperText = errors.total_amount.label+" = "+errors.net_amount.label+" * "+errors.selling_quantity.label;
      }
      return errors;
    }
    calculate_amount = (errors) =>{
        let error_check = false;
        let list  = ["selling_quantity","currency_rate","clearance_cost","custom_duty_cost","cess","finance_cost","cess_per","transportation_rate","broker_comission","exp1","exp2","exp3","exp4"];
        for (x in list){
          if(errors[list[x]].err){
            error_check = true;
            break;
          }
        }
        if(error_check && errors.currency_type.value == ""){
          return errors;
        }
        else{
          //do calculations
          let quantity = errors.selling_quantity.value == null ? 0 : parseFloat(errors.selling_quantity.value.replace(/\D+[^0-9.]/gm,0));
          
           
          let selling_rate = errors.selling_rate.value == "" ? 0 : parseFloat(errors.selling_rate.value.replace(/\D+[^0-9.]/gm,0));
          let currency_rate = errors.currency_rate.value == "" ? 1 : parseFloat(errors.currency_rate.value.replace(/\D+[^0-9.]/gm,0));
          if(errors.currency_type.value == "inr"){
            currency_rate = 1;
          }
          let total_amount = 0 ;
          let net_amount = 0;
          let transportation_rate = 0;
          let insurance_cost = 0;
          let comission = 0;
          let exp1=0,exp2=0,exp3=0,exp4=0;
          if(errors.transportation_select.value == "accord"){
            transportation_rate = errors.transportation_rate.value == "" ? 0 : parseFloat(errors.transportation_rate.value.replace(/\D+[^0-9.]/gm,0));
            errors.transportation_amount.value =  parseFloat(quantity * transportation_rate).toString();
          }
          if(errors.currency_subtype.value == "CFR" || errors.currency_subtype.value == "FOB"){
              insurance_cost = errors.insurance_cost.value == "" ? 0: parseFloat(errors.insurance_cost.value.replace(/\D+[^0-9.]/gm,0));
          }
          if(errors.currency_type.value == "usd" || errors.currency_type.value == "aed"){
            errors.selling_rate_in_inr.value = (selling_rate * currency_rate).toString();
          }
          if(errors.broker_select.value == "yes"){
            comission = errors.broker_comission.value == "" ? 0 : parseFloat(errors.broker_comission.value.replace(/\D+[^0-9.]/gm,0));
          }
          if(errors.exp_flag){
            exp1 = errors.exp1.value == "" ? 0: parseFloat(errors.exp1.value.replace(/\D+[^0-9.]/gm,""));
            exp2 = errors.exp2.value == "" ? 0:parseFloat(errors.exp2.value.replace(/\D+[^0-9.]/gm,""));
            exp3 = errors.exp3.value == "" ? 0:parseFloat(errors.exp3.value.replace(/\D+[^0-9.]/gm,""));
            exp4 = errors.exp4.value == "" ? 0:parseFloat(errors.exp4.value.replace(/\D+[^0-9.]/gm,""));        
          }
          if(errors.export_flag){
            let clearance_cost = errors.clearance_cost.value == "" ? 0 : parseFloat(errors.clearance_cost.value.replace(/\D+[^0-9.]/gm,0));
            let custom_duty_cost = errors.custom_duty_cost.value == "" ? 0 : parseFloat(errors.custom_duty_cost.value.replace(/\D+[^0-9.]/gm,0));
            let cess_per  =  errors.cess_per.value == "" ? 0 : parseFloat(errors.cess_per.value.replace(/\D+[^0-9.]/gm,0));
            let cess = parseFloat(cess_per * custom_duty_cost )/100;
            let finance_cost = errors.finance_cost.value == "" ? 0 : parseFloat(errors.finance_cost.value.replace(/\D+[^0-9.]/gm,0));
            errors.cess.value = cess.toString();
            net_amount = parseFloat((selling_rate * currency_rate) - clearance_cost - finance_cost - custom_duty_cost - cess - transportation_rate - insurance_cost - comission - exp1 - exp2 - exp3 - exp4);
            total_amount = parseFloat(net_amount * quantity);
          }
          else if(!errors.export_flag){
            net_amount = parseFloat(selling_rate) - parseFloat(transportation_rate) - parseFloat(insurance_cost) - parseFloat(comission) - exp1 -  exp2 - exp3  - exp4;
            total_amount = parseFloat((net_amount * quantity));
            errors.custom_duty_cost.value = "";
            errors.cess.value = "";
            errors.currency_type.value = "inr";
            errors.currency_rate.value = "";
            errors.clearance_cost.value = ""; 
          }
          errors.total_amount.value = total_amount.toString();
          errors.net_amount.value = net_amount.toString();
          return errors;
        }
    }
    validate_dependent_values = (errors,name) =>{
      if(name == "insurance_cost"){
        if((errors.currency_subtype.value == "CFR" || errors.currency_subtype.value == "FOB") && errors.insurance_cost.value == "" || errors.insurance_cost.value.toString().match(/\D+[^0-9.]/gm) != null){
          errors.insurance_cost.err = true;
          errors.insurance_cost.helperText = "Please fill the details properly"
        }
        else{
          errors.insurance_cost.err = false;
          errors.insurance_cost.helperText = "";
        }
      }
      if(name == "estimated_month"){
        if(errors.estimated_time.value != "" && errors.estimated_time.value != "ready" && errors[name].value.length === 0  && errors[name].value == ""){
          errors[name].err = true;
          errors[name].helperText = "Please Select Estimated Month";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if(name == "packing_subtype"){
        if(errors.packing_type.value == "drums" && errors[name].value.length === 0  && errors[name].value == ""){
              errors[name].err = true;
              errors[name].helperText = "Please Select the details properly";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
        
      }
      if(name == "packing_weight"){
        if((errors.packing_type.value == "drums" || errors.packing_type.value == "bags") && (errors[name].value == '0' || errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
          errors[name].err = true;
          errors[name].helperText = "Weight cannot be empty or zero";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if(name == "broker_name"){
        if(errors.broker_select.value == "yes" && errors[name].value.length === 0  && (errors[name].value == "" )){
          errors.broker_name.err = true;
          errors.broker_name.helperText = "Please fill the details properly";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if(name == "broker_comission"){
        if(errors.broker_select.value == "yes" && (errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
          errors[name].err = true;
          errors[name].helperText = "Comission cannot be empty or zero";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if(name == "transportation_rate" || name == "transportation_amount"){
        if(errors.transportation_select.value == "yes" && (errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
          errors[name].err = true;
          errors[name].helperText = "Amount cannot be empty or zero";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if( name == "clearance_cost"  || name == "custom_duty_cost" || name == "cess" || name == "finance_cost"){
        if(errors.export_flag && (errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
          errors[name].err = true;
          errors[name].helperText = "Amount cannot be empty or zero";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }
      if(name == "currency_rate"){
        if((errors.currency_type.value == "usd" && errors.currency_type.value == "aed") && (errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
          errors[name].err = true;
          errors[name].helperText = "Rate cannot be empty or zero";
        }
        else{
          errors[name].err = false;
          errors[name].helperText = "";
        }
      }

      if(name == "payment_terms_from"){
        if(errors.payment_terms.value.length > 0 && errors.payment_terms_from.value == "" && errors.payment_terms_from.value.length === 0){
          errors.payment_terms_from.err == true;
          errors.payment_terms_from.helperText = "Please Select the option properly";
        }
        else{
          errors.payment_terms_from.err = false;
          errors.payment_terms_from.helperText = "";
        }
      }
      if(name == "cess_per"){
        if(errors.import_flag && errors.cess_per.value.toString().match(/\D+[^0-9.]/gm) != null && errors.cess_per.value.length === 0){
          errors.cess_per.err = true;
          errors.cess_per.helperText= "Please fill the details properly";
        }
        else{
          errors.cess_per.err = false;
          errors.cess_per.helperText = "";
        }
      }

      return errors;
    }

    cal_payment_date = (errors)=>{
      errors = this.validate_empty_input(errors,"payment_terms","input");
      errors = this.validate_dependent_values(errors,"payment_terms_from");
      if(!errors.payment_terms.err && !errors.payment_terms_from.err){
        if(errors.payment_terms.value.length > 0 && errors.payment_terms.value.toString().match(/\D+[^0-9]/gm) == null){
          var x = parseInt(errors.payment_terms.value);
          if(errors.payment_terms_from.value == "BL Date"){
            errors = this.validate_empty_input(errors,"bl_date","input");
            if(!errors.bl_date.err){
              var d = new Date(errors.bl_date.value);
              errors.payment_date.value = d.setDate(d.getDate() + x);
            }
          }
          if(errors.payment_terms_from.value == "Confirmation Date"){
            errors = this.validate_empty_input(errors,"confirmation_date","input");
            if(!errors.confirmation_date.err){
              var d = new Date(errors.confirmation_date.value);
              errors.payment_date.value = d.setDate(d.getDate() + x);
            }
          }
          if(errors.payment_terms_from.value == "Delivery Date"){
            errors = this.validate_empty_input(errors,"delivery_date","input");
            if(!errors.delivery_date.err){
              var d = new Date(errors.delivery_date.value);
              errors.payment_date.value = d.setDate(d.getDate() + x);
            }
          }
        }
      }
      return errors;  
    }

    validate_empty_input = (errors,name,type) =>{
      if(errors[name].value.length === 0 && errors[name].value == ""){
        errors[name].err = true;
        if(type == "input"){
          errors[name].helperText = "Please fill the details properly";
        }
        else{
          errors[name].helperText = "Please Select the details properly";
        }  
      }
      else{
        errors[name].err  = false;
        errors[name].helperText = "";
      }
      if(name == "estimated_time" && errors.estimated_time.value == "ready"){
        errors.estimated_month.value = "";
      }
      if(name == "transportation_select" && errors.transportation_select.value != "accord"){
        errors.transportation_rate.value = "";
        errors.transportation_amount.value = "";
      }
      if(name == "broker_select" && errors.broker_select.value != "yes"){
        errors.broker_name.value = "";
        errors.broker_comission.value = "";
      }
      if(name == "packing_type"){
        if(errors.packing_type.value != "drums"){
          errors.packing_subtype.value = "";
        }
        if(errors.packing_type.value != "drums" && errors.packing_type.value != "bags"){
          errors.packing_weight.value = "";
        }
        
      }
      if(name == "currency_subtype"){
        //console.log("value: "+errors.currency_subtype.value);
        if(errors.currency_subtype.value != "CFR" && errors.currency_subtype.value != "FOB"){
          //console.log("-----------------In currecny subtype----------");
          errors.insurance_cost.value = "";
          errors.insurance_cost.err = false;
          errors.insurance_cost.helperText = "";
        }
      }
      return errors;
    }
    validate_digits = (errors,name,label) =>{
      if(errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null){
        errors[name].err = true;
        errors[name].helperText = label +" cannot be empty or zero";
      }
      else{
        errors[name].err = false;
        errors[name].helperText = "";
      }
      return errors;
    }
    
    validate_selling_type = (errors) =>{
      console.log("Inside selling type function");
      if(errors.selling_type.value == "" || errors.selling_type.value.length ===  0){
        errors.selling_type.err = true;
        errors.selling_type.helperText = "Please select the fields properly";
        errors.selling_type_flag = false;
        errors.selling_subtype.value = "";
        errors.currency_type.value = "";
        console.log("In if");
      }
      else{
        errors.selling_type.err = false;
        errors.selling_type.helperText = "";
        console.log("In else");
        if(errors.selling_type.value == "Contract" || errors.selling_type.value == "Highseas" || errors.selling_type.value == "Bond Transfer" || errors.selling_type.value == "Indent Sales"){
          errors.selling_type_flag = true;
          errors.selling_subtype.value = "";
          errors.export_flag = false;
          errors.currency_type.value = ""; 
        }
        if(errors.selling_type.value == "GST"){
          errors.selling_type_flag = false;
          errors.export_flag = false;
          errors.selling_subtype.value = "regular";
          errors.currency_type.value = "inr";
        }
      }
      return errors;
    }
    clear_values = (errors) =>{
      errors.selling_rate_in_inr.helperText = "";
      errors.cess.helperText = "";
      errors.net_amount.helperText = "";
      errors.total_amount.helperText = "";
      errors.cess.value = "";
      errors.cess_per.value = "";
      errors.net_amount.value = "";
      errors.finance_cost.value = "";
      errors.total_amount.value ="";
      errors.custom_duty_cost.value = "";
      errors.clearance_cost.value = "";
      errors.currency_rate.value = "";
      errors.currency_type.value = "";
      errors.selling_rate.value = "";
      errors.selling_rate_in_inr.value = "";
      return errors;
    }
    validate_selling_subtype = (errors) =>{
      if((errors.selling_type.value == "Contract" || errors.selling_type.value == "Highseas" || errors.selling_type.value == "Bond Transfer" || errors.selling_type.value == "Indent Sales") && errors.selling_subtype.value == "" && errors.selling_subtype.value.length === 0){
        errors.selling_subtype.err = true;
        errors.selling_subtype.helperText = "Please select the fields properly";
      }
      else{
        errors.selling_subtype.err = false;
        errors.selling_subtype.helperText = "";
        if(errors.selling_subtype.value == "export"){
          console.log("In sutype local flag");
          errors.export_flag = true;
        }
        else{
          errors.export_flag = false;
          errors.currency_type.value = "inr";
        }
      }
      return errors;
    }
    
    validate = async() =>{
      let errors = {...this.state};
      var selectlist = ["chemical_name","packing_type",
                      "estimated_time","delivery_place","broker_select",
                        "transportation_select","payment_type","loan_basis","currency_type","currency_subtype"];
      
      var inputlist = ["supplier","vessel_name","payment_date","payment_terms","storage_days","storage_date","extra_storage","delivery_date","bl_date","confirmation_date"];
      var dependentlist = ["packing_subtype", "packing_weight","broker_name","broker_comission","transportation_rate","transportation_amount",
      "currency_rate","clearance_cost","custom_duty_cost","cess","finance_cost","estimated_month","payment_terms_from","cess_per","insurance_cost"];
      var extra_expense = ["exp1","exp2","exp3","exp4"];
      if(errors.exp_flag){
        for (i in extra_expense){
          errors = this._handleName(errors,extra_expense[i]);
          errors = this._handleValue(errors,extra_expense[i]);
        }
      }
      for (i in selectlist){
        errors = this.validate_empty_input(errors,selectlist[i],"select");
      }
      for(j in inputlist){
        errors = this.validate_empty_input(errors,inputlist[j],"input");
      }
      for(k in dependentlist){
        errors = this.validate_dependent_values(errors,dependentlist[k]);
      }
      errors = this.cal_payment_date(errors);
      errors = this.validate_digits(errors,"selling_quantity","Quantity");
      errors = this.validate_digits(errors,"selling_rate","Amount");
      errors = this.calculate_amount(errors);
      errors = this.validate_delivery_date(errors);
      let err_chk = false;
      for (var x in errors){
        if(errors[x].err !== undefined && errors[x].err !== null ){
          if (errors[x].err === true){
            err_chk = true;
            break;
          }
        }   
      }
      if(errors.old !== null && errors.old !== undefined && errors.old !== false){
        let choice = false;
        if(parseFloat(errors.old.extra_purchase_quantity) < parseFloat(errors.selling_quantity.value)){
          errors.selling_quantity.err = true;
          errors.selling_quantity.helperText= 'Please Select quantity less than'+errors.old.extra_purchase_quantity.toString()+' MT';
          choice = await AlertAsync(
            'Warning',
            'Purchase Quantity of Linked Purchase Order is less than Selling Quantity Please fill Purchase pending form if you want to buy more quantity',
            [
              {text:'Okay',onPress:() => true},
            ],
            {cancelable:false}
          );
          err_chk = true;
        }
        else{
          errors.selling_quantity.err = false;
          errors.selling_quantity.helperText = ''; 
        }
      }
      if (err_chk === false){
        console.log("In If of validate");
        this.sendform();
      }  
      else{
        console.log("In else of validtae");
        choice = await AlertAsync(
          'Errors',
          'Please Fill all the details properly',
          [
            {text:'Okay',onPress:() => true}
          ],
          {cancelable:true}
        );
        this.setState({ ...this.state, ...errors, });
      }
        
    }
    renderlist = () =>{
        let extra = {...this.state};
        const mainlist = [{label:"Contract",value:"Contract"},{label:"Highseas",value:"Highseas"},{label:"Bond Transfer",value:"Bond Transfer"},
        {label:"GST",value:"GST"},{label:"Indent Sales",value:"Indent Sales"}];
        var choice = false;
        for (x in mainlist){
            choice = this.renderStyles(mainlist[x].value);
            if(choice){
                extra.pickerlist.push(mainlist[x]);
            }
        }
        if(this._isMounted){
            this.setState({...this.state,...extra});
        }
    }

    renderStyles = (name) =>{
        let extra = {...this.state};
        if(extra.old !== null && extra.old !== undefined && extra.old !== false){
            if((extra.old.purchase_type.type == "Self Import" || extra.old.purchase_type.type == "Highseas" || extra.old.purchase_type.type == "Contract") && extra.old.purchase_type.type != "Bond Transfer" && name != "Indent Sales"){
                return true;                
            }
            else if(extra.old.purchase_type.type == "Bond Transfer" && name != "Highseas" && name != "Indent Sales"){
                return true;    
            }
            else if(extra.old.purchase_type.type == "GST" && name == "GST"){
                return true;
            }
            else if(extra.old.purchase_type.type == "Indent Purchase" && name == "Indent Sales"){
                return true;
            }
            else{
                return false;
            }
        }
        else{
            return true;
        }
    }
    async sendform(){
      console.log("Sending selling form data ");
      this.setState({ ...this.state, loading: true, });
      //console.log(this.state);
      if(this._isMounted){
        this.setState({loading:true});
      }
      let resp = await sales.uploadform(this.state);
      if(resp !== false){
        if(resp.status === 'error'){
          console.log("Error in uploding the data");
          if(this._isMounted){
            this.setState({loading:false});
          }
        }
        else{
          console.log("Data successfully uploaded.... Printing Data......................");
          console.log(resp.result);
          if(this._isMounted){
            this.setState({loading:false});
          }
          this.props.navigation.navigate('SalesDetail',{...resp.result})
        }
      }
      else{
        if(this._isMounted){
          this.setState({loading:false});
        }
        console.log("False error received");
      }
      
    }
    _showInfo =() =>{
      choice = AlertAsync(
        'Form Information',
        messages.sales,
        [
          {text:'Okay',onPress:() => true}
        ],
        {cancelable:true}
      );

    }
    _openExtra =()=>{
      let extra = {...this.state};
      extra.exp_flag = !this.state.exp_flag;
      if(this.state.exp_flag === true){
        extra.exp1 = {name:"",value:'',err:false,helperText:''};
        extra.exp2 = {name:"",value:'',err:false,helperText:''};
        extra.exp3 = {name:"",value:'',err:false,helperText:''};
        extra.exp4 = {name:"",value:'',err:false,helperText:''};
      }
      extra = this.change_helper(extra);
      this.setState({...this.state,...extra});
    } 
    _handleExtrachange = (name,type,text) =>{
      let errors = {...this.state};
      
      if(type == "name"){
        errors[name].name = text;
        errors = this._handleName(errors,name);
      }
      else{
        errors[name].value = text;
        errors = this._handleValue(errors,name);
      }
      errors = this.calculate_amount(errors);
      this.setState({...this.state,...errors});

    } 
    _handleName = (errors,data) =>{
      if(errors[data].value != "" && errors[data].name == ""){
        errors[data].err = true;
        errors[data].nhelperText = "Please Enter the label properly";
      }
      else{
        errors[data].err = false;
        errors[data].nhelperText = "";
      }
      return errors;
    }
    _handleValue = (errors,data) =>{
      if(errors[data].name != "" && (errors[data].value == "" || errors[data].value.toString().match(/\D+[^0-9.]/gm) != null)) {
        errors[data].err = true;
        errors[data].vhelperText = "Please Enter a valid Amount";
      }
      else{
        errors[data].err = false;
        errors[data].vhelperText = "";
      }
      return errors;
    }  
    render() {
      return (
            <Container style={styles.container_background}>
              <Loader loading = {this.state.loading} />
              <View style={hstyles.header}>
                <View style={hstyles.headerContainer}>
                  <Left style={hstyles.left}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                      <MaterialCommunityIcons name="home" style={hstyles.icon} />
                    </TouchableOpacity>
                  </Left>
                  <Body style={hstyles.body}>
                    <Title style={hstyles.headtitle}>Sales Form</Title>
                  </Body>
                  <Right style={hstyles.right}>
                      <TouchableOpacity onPress={() => this._showInfo()}>
                        <MaterialCommunityIcons name="information" style={hstyles.icon} />
                      </TouchableOpacity>
                  </Right>
                </View>
              </View>
              <ScrollView contentContainerStyle={styles.scrollview} keyboardDismissMode="none" keyboardShouldPersistTaps="always">
                <View><Text style={styles.h1}>Selling Form</Text></View>
              <List>

                <ListItem itemDivider style={fstyles.divider}>
                  <Text style={styles.listItemheader}>Selling Type</Text>
                </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Selling Type :</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Picker 
                      mode="dropdown"
                      style={{width:undefined}}
                      selectedValue={this.state.selling_type.value}
                      onValueChange={(text) => this._handlechange('selling_type',text)}
                    > 
                      {this.state.pickerlist.map((item,i) =>{
                          return <Picker.Item key={i} label={item.label} value={item.value} />
                      })}

                    </Picker> 
                  </Item>
                  <Text style={styles.helpertext}>{this.state.selling_type.helperText}</Text>
                </Body>
              </ListItem>
                {this.state.selling_type_flag && 
                  <ListItem style= {fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Subcategory: </Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular  style={styles.ouritem}>
                         <Picker
                          mode="dropdown"
                          selectedValue={this.state.selling_subtype.value}
                          onValueChange= {(text) => this._handlechange('selling_subtype',text)}
                          >
                            <Picker.Item label="Select Subtype" value="" />
                            <Picker.Item label="Export" value="export" />
                            <Picker.Item label="Regular" value="regular" />
                          </Picker>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.selling_subtype.helperText}</Text>
                    </Body>
                  </ListItem>
                }
                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Product :</Label></Left>
                  <Body style={fstyles.formBody}>
                    <Item regular style={styles.ouritem}>
                      <Picker
                        mode="dropdown"
                        style={{ width: undefined }}
                        selectedValue={this.state.chemical_name.value}
                        enabled={!this.state.hasData}
                        onValueChange={(text) => this._handlechange('chemical_name',text)}
                      >
                        <Picker.Item label="Select Chemical" value="" />
                        <Picker.Item label="Alchol" value="alchol" />
                        <Picker.Item label="Aromatics" value="aromatics" />
                        <Picker.Item label="Glycols" value="glycols" />
                        <Picker.Item label="Ketones" value="ketones" />
                        <Picker.Item label="Acrylates" value="acrylates" />
                        <Picker.Item label="Speciality Acrylates" value="speciality acrylates" />
                        <Picker.Item label="Chlorinated Solvents and Chemicals" value="chlorinated solvents and chemicals" />
                        <Picker.Item label="Ethylene Amines" value="ethylene amines" />
                      </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.chemical_name.helperText}</Text>
                </Body>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Selling Quantity (PMT): <Text style={styles.formulaLabel}>{this.state.selling_quantity.label}</Text></Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.selling_quantity.value} keyboardType="numeric" onChangeText={(text) => this._handlechange('selling_quantity',text)}   />
                  </Item>
                  <Text style={styles.helpertext}>{this.state.selling_quantity.helperText}</Text>
                </Body>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Customer :</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.supplier.value}  onChangeText={(text) => this._handlechange('supplier',text)}   />
                  </Item>
                  <Text style={styles.helpertext}>{this.state.supplier.helperText}</Text>
                </Body>
              </ListItem>


              <ListItem itemDivider style={fstyles.divider}>
                <Text style={styles.listItemheader}>Packing Details</Text>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Packing Type :</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                  <Picker
                        mode="dropdown"
                        style={{width:undefined}}
                        selectedValue={this.state.packing_type.value}
                        onValueChange={(text) => this._handlechange('packing_type',text)}
                      >
                        <Picker.Item label= "Select options" value="" />
                        <Picker.Item label= "Bulk" value="bulk" />
                        <Picker.Item label= "ISO tanks" value="iso tanks" />
                        <Picker.Item label="Drums" value="drums" />
                        <Picker.Item label="Bags" value="bags" />
                      </Picker>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.packing_type.helperText}</Text>
                </Body>
              </ListItem>

              {this.state.packing_type.value == "drums" &&
                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Packing SubType :</Label></Left>
                  <Body style={fstyles.formBody}>
                    <Item regular style={styles.ouritem}>
                    <Picker
                          mode="dropdown"
                          style={{width:undefined}}
                          selectedValue={this.state.packing_subtype.value}
                          onValueChange={(text) => this._handlechange('packing_subtype',text)}
                        >
                          <Picker.Item label= "Select options" value="" />
                          <Picker.Item label= "Intact" value="intact" />
                          <Picker.Item label="Refill" value="refill" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.packing_subtype.helperText}</Text>
                  </Body>
                </ListItem>
              }


{(this.state.packing_type.value == "drums" || this.state.packing_type.value == "bags") &&
                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Kgs :</Label></Left>
                  <Body style={fstyles.formBody}>
                    <Item regular style={styles.ouritem} >
                      <Input keyboardType="numeric" value={this.state.packing_weight.value} onChangeText={(text) => this._handlechange('packing_weight',text)}/>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.packing_weight.helperText}</Text>
                  </Body>
                </ListItem>
              }

              
              <ListItem itemDivider style={fstyles.divider}>
                  <Text style={styles.listItemheader}>ETA</Text>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Estimated time:</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem} >
                  <Picker
                        mode="dropdown"
                        selectedValue={this.state.estimated_time.value}
                        onValueChange={(text) => this._handlechange('estimated_time',text)}
                      >
                        <Picker.Item label= "Select Time" value="" />
                        <Picker.Item label= "First Half" value="first half" />
                        <Picker.Item label="Second Half" value="second half" />
                        <Picker.Item label="Ready" value="ready" />
                      </Picker>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.estimated_time.helperText}</Text>
                </Body>
              </ListItem>

              {(this.state.estimated_time.value != "" && this.state.estimated_time.value != "ready") ? (
                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Estimated Month</Label></Left>
                  <Body style={fstyles.formBody}>
                    <Item regular style={[styles.ouritem,{height:50}]} >
                          <Picker
                            mode="dropdown"
                            selectedValue={this.state.estimated_month.value}
                            onValueChange={(text) => this._handlechange('estimated_month',text)}
                          >
                            <Picker.Item label= "Select Month" value="" />
                            <Picker.Item label= "January" value="january" />
                            <Picker.Item label="Feburary" value="feburary" />
                            <Picker.Item label="March" value="march" />
                            <Picker.Item label="April" value="april" />
                            <Picker.Item label="May" value="may" />
                            <Picker.Item label="June" value="june" />
                            <Picker.Item label="July" value="july" />
                            <Picker.Item label="August" value="august" />
                            <Picker.Item label="September" value="september" />
                            <Picker.Item label="October" value="october" />
                            <Picker.Item label="November" value="november" />
                            <Picker.Item label="December" value="december" />
                          </Picker>
                      </Item>
                    <Text style={styles.helpertext}>{this.state.estimated_month.helperText}</Text>
                  </Body>
                </ListItem>
              ):
              (null)}

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Confirmation Date:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem}>
                    <TouchableOpacity style={{flex:1}}>
                      <DatePicker
                        defaultDate={new Date()}
                        locale={'en'}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        placeHolderText="Select date"
                        textStyle={{ color: 'black' }}
                        placeHolderTextStyle={{ color: 'black' }}
                        onDateChange={(text) => this._handlechange('confirmation_date',text)}
                      /> 
                    </TouchableOpacity>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.confirmation_date.helperText}</Text>
                  </Body>
                </ListItem>
              

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Delivery Place :</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem} >
                  <Picker
                        mode="dropdown"
                        selectedValue={this.state.delivery_place.value}
                        enabled={!this.state.hasData}
                        onValueChange={(text) => this._handlechange('delivery_place',text)}
                  >
                      <Picker.Item label= "Select Port" value="" />
                      <Picker.Item label="Bhiwandi" value="bhiwandi" />
                      <Picker.Item label="Hazira" value="hazira" />
                      <Picker.Item label="JNPT" value="jnpt" />
                      <Picker.Item label= "Kandla" value="kandla" />
                      <Picker.Item label="Mumbai" value="mumbai" />
                      <Picker.Item label="Mundra" value="mundra" />
                      </Picker>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.delivery_place.helperText}</Text>
                </Body>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Approx Delivery Date :</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem}>
                    <TouchableOpacity style={{flex:1}}>
                      <DatePicker
                        defaultDate={new Date()}
                        locale={'en'}
                        timeZoneOffsetInMinutes={undefined}
                        modalTransparent={false}
                        animationType={'fade'}
                        androidMode={'default'}
                        placeHolderText="Select date"
                        textStyle={{ color: 'black' }}
                        placeHolderTextStyle={{ color: 'black' }}
                        onDateChange={(text) => this._handlechange('delivery_date',text)}
                      /> 
                    </TouchableOpacity>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.delivery_date.helperText}</Text>
                  </Body>
                </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Vessel Name :</Label></Left>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem} >
                    <Input value={this.state.vessel_name.value} onChangeText={(text) => this._handlechange('vessel_name',text)}/>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.vessel_name.helperText}</Text>
                </Body>
              </ListItem>

              

              <ListItem itemDivider style={fstyles.divider}>
                  <Text style={styles.listItemheader}>Broker</Text>
              </ListItem>

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Broker :</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                    <Picker
                          mode="dropdown"
                          selectedValue={this.state.broker_select.value}
                          onValueChange={(text) => this._handlechange('broker_select',text)}
                    >
                        <Picker.Item label= "Select Option" value="" />
                          <Picker.Item label= "Yes" value="yes" />
                          <Picker.Item label="No" value="no" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.broker_select.helperText}</Text>
                  </Body>
                </ListItem>
                {this.state.broker_select.value == "yes" &&
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Broker Name :</Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem} >
                        <Input value= {this.state.broker_name.value} onChangeText={(text) => this._handlechange('broker_name',text)} />
                      </Item>
                      <Text style={styles.helpertext}>{this.state.broker_name.helperText}</Text>
                    </Body>
                  </ListItem>
                
                }
                {this.state.broker_select.value == "yes" &&
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Commission (Rs.PMT): <Text style={styles.formulaLabel}>{this.state.broker_comission.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem} >
                        <Input value={this.state.broker_comission.value} onChangeText={(text) => this._handlechange('broker_comission',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.broker_comission.helperText}</Text>
                    </Body>
                  </ListItem> 
                }


                <ListItem itemDivider style={fstyles.divider}>
                    <Text style={styles.listItemheader}>Transportation</Text>
                </ListItem>


                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                    <Picker
                          mode="dropdown"
                          selectedValue={this.state.transportation_select.value}
                          onValueChange={(text) => this._handlechange('transportation_select',text)}
                    >
                        <Picker.Item label= "Select Option" value="" />
                          <Picker.Item label= "Accord" value="accord" />
                          <Picker.Item label="Customer" value="customer" />
                          <Picker.Item label= "NA" value="na" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.transportation_select.helperText}</Text>
                  </Body>
                </ListItem>

                {this.state.transportation_select.value == "accord" &&
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Rate (PMT): <Text style={styles.formulaLabel}>{this.state.transportation_rate.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>    
                      <Item regular style={styles.ouritem} >
                        <Input value={this.state.transportation_rate.value} onChangeText={(text) => this._handlechange('transportation_rate',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.transportation_rate.helperText}</Text>
                    </Body>
                  </ListItem>
                }

                {this.state.transportation_select.value == "accord" &&
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Amount: <Text style={styles.formulaLabel}>{this.state.transportation_amount.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>    
                      <Item regular style={styles.ouritem} >
                        <Input value={this.state.transportation_amount.value} onChangeText={(text) => this._handlechange('transportation_amount',text)} keyboardType="numeric"/>
                        <FontAwesome name='rupee' style={fstyles.formIcon} />
                      </Item>
                      <Text style={this.state.transportation_amount.err ? styles.helpertext:styles.rightHelper}>{this.state.transportation_amount.helperText}</Text>
                    </Body>
                  </ListItem>
                }
              
              
              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Loan basis:</Label></Left>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem} >
                  <Picker
                        mode="dropdown"
                        selectedValue={this.state.loan_basis.value}
                        onValueChange={(text) => this._handlechange('loan_basis',text)}
                  >
                      <Picker.Item label= "Select option" value="" />
                        <Picker.Item label= "Yes" value="yes" />
                        <Picker.Item label="No" value="no" />
                      </Picker>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.loan_basis.helperText}</Text>
                </Body>
              </ListItem>
              
              <ListItem itemDivider style={fstyles.divider}>
                    <Text style={styles.listItemheader}>Payment Details</Text>
              </ListItem>
              
                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Type:</Label></Left>
                  <Body style={fstyles.formBody}> 
                    <Item regular style={styles.ouritem} >
                    <Picker
                          mode="dropdown"
                          selectedValue={this.state.payment_type.value}
                          onValueChange={(text) => this._handlechange('payment_type',text)}
                    >
                          <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "LC" value="LC" />
                          <Picker.Item label="PDC" value="PDC" />
                          <Picker.Item label="DA" value="DA" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_type.helperText}</Text>
                  </Body>
                </ListItem>

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Approx BL Date :</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item  regular style={styles.ouritem} >
                      <TouchableOpacity style={{flex:1}} >
                        <DatePicker
                          defaultDate={new Date()}
                          locale={'en'}
                          value={new Date(this.state.bl_date.value)}
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          placeHolderText="Select date"
                          animationType={'fade'}
                          androidMode={'default'}
                          textStyle={{ color: 'black' }}
                          onDateChange={(text) => this._handlechange('bl_date',text)}
                        /> 
                      </TouchableOpacity>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.bl_date.helperText}</Text>
                  </Body>
                </ListItem>


                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Term Days:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                      <Input keyboardType="numeric" value={this.state.payment_terms.value} onChangeText={(text) => this._handlechange('payment_terms',text)} />
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_terms.helperText}</Text>
                  </Body>
                </ListItem>

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Term From:</Label></Left>
                  <Body style={fstyles.formBody}> 
                    <Item regular style={styles.ouritem} >
                    <Picker
                          mode="dropdown"
                          selectedValue={this.state.payment_terms_from.value}
                          onValueChange={(text) => this._handlechange('payment_terms_from',text)}
                    >
                        <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "BL Date" value="BL Date" />
                          <Picker.Item label="Confirmation Date" value="Confirmation Date" />
                          <Picker.Item label="Delivery Date" value="Delivery Date" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_terms_from.helperText}</Text>
                  </Body>
                </ListItem>



                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Due Date :</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem}>
                      <Input disabled={true} value={format.Date(this.state.payment_date.value)} />
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_date.helperText}</Text>
                  </Body>
                </ListItem>

                
                
              <ListItem itemDivider style={fstyles.divider}>
                    <Text style={styles.listItemheader}>Storage</Text>
              </ListItem>


                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Days:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                      <Input keyboardType="numeric" multiline={true} value={this.state.storage_days.value} onChangeText={(text) => this._handlechange('storage_days',text)} />
                    </Item>
                    <Text style={styles.helpertext}>{this.state.storage_days.helperText}</Text>
                  </Body>
                </ListItem>

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Upto :</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                      <TouchableOpacity style={{flex:1}}>
                        <DatePicker
                          defaultDate={new Date()}
                          locale={'en'}
                          timeZoneOffsetInMinutes={undefined}
                          modalTransparent={false}
                          animationType={'fade'}
                          androidMode={'default'}
                          placeHolderText="Select date"
                          textStyle={{ color: 'black' }}
                          placeHolderTextStyle={{ color: 'black' }}
                          onDateChange={(text) => this._handlechange('storage_date',text)}
                        /> 
                      </TouchableOpacity>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.storage_date.helperText}</Text>
                  </Body>
                  </ListItem>

                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Extra Storage(PMT):</Label></Left>
                    <Body style={fstyles.formBody}>  
                      <Item regular style={styles.ouritem} >
                        <Input keyboardType="numeric" value={this.state.extra_storage.value} onChangeText={(text) => this._handlechange('extra_storage',text)}/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.extra_storage.helperText}</Text>
                    </Body>
                  </ListItem>
              
                  <ListItem itemDivider style={fstyles.divider}>
                    <Text style={styles.listItemheader}>Billing Details</Text>
                  </ListItem>
                
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Currency Type:</Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Picker mode="dropdown" enabled={this.state.export_flag ? true:false} selectedValue={this.state.currency_type.value} onValueChange={(text) => this._handlechange('currency_type',text)}>
                          <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "USD" value="usd" />
                          <Picker.Item label="INR" value="inr" />
                          <Picker.Item label="AED" value="aed" />
                        </Picker>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.currency_type.helperText}</Text>
                    </Body>
                  </ListItem>

                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Type:</Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Picker mode="dropdown" selectedValue={this.state.currency_subtype.value} onValueChange={(text) => this._handlechange('currency_subtype',text)}>
                          <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "CFR" value="CFR" />
                          <Picker.Item label="CIF" value="CIF" />
                          <Picker.Item label="FOB" value="FOB" />
                          <Picker.Item label="Bond Transfer" value="Bond Transfer" />
                          <Picker.Item label="Basic" value="Basic" />
                          <Picker.Item label="NA" value="NA" />
                        </Picker>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.currency_subtype.helperText}</Text>
                    </Body>
                  </ListItem>

                {(this.state.currency_subtype.value =="CFR" || this.state.currency_subtype.value == "FOB") ?(
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Insurance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.insurance_cost.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input value={this.state.insurance_cost.value} onChangeText={(text) => this._handlechange('insurance_cost',text)} keyboardType="numeric"/>
                        <FontAwesome name='rupee' style={fstyles.formIcon} />
                      </Item>
                      <Text style={styles.helpertext}>{this.state.insurance_cost.helperText}</Text>
                    </Body>
                </ListItem>
                ):(null)}


                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Selling Rate (PMT): <Text style={styles.formulaLabel}>{this.state.selling_rate.label}</Text></Label></Left>
                  <Body style={fstyles.formBody}>
                    <Item regular style={styles.ouritem} >
                      <Input value={this.state.selling_rate.value} onChangeText={(text) => this._handlechange('selling_rate',text)} keyboardType="numeric" />
                    </Item>
                    <Text style={styles.helpertext}> {this.state.selling_rate.helperText} </Text>
                  </Body>
                </ListItem>

                {(this.state.currency_type.value === "usd" || this.state.currency_type.value === "aed") ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Provisional Exchange Rate: <Text style={styles.formulaLabel}>{this.state.currency_rate.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input value={this.state.currency_rate.value} onChangeText={(text) => this._handlechange('currency_rate',text)} keyboardType="numeric"/>
                        <FontAwesome name='rupee' style={fstyles.formIcon} />
                      </Item>
                      <Text style={styles.helpertext}>{this.state.currency_rate.helperText}</Text>
                    </Body>
                  </ListItem>
                ):(null)}

                

                {(this.state.currency_type.value === "usd" || this.state.currency_type.value === "aed") ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Selling Rate PMT(in Inr): <Text style={styles.formulaLabel}>{this.state.selling_rate_in_inr.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input disabled={true} value={this.state.selling_rate_in_inr.value}  keyboardType="numeric"/>
                        <FontAwesome name='rupee' style={fstyles.formIcon} />
                      </Item>
                      <Text style={this.state.selling_rate_in_inr.err ? styles.helpertext:styles.rightHelper}>{this.state.selling_rate_in_inr.helperText}</Text>
                    </Body>
                  </ListItem> 
                ):null}
                
                {!!this.state.export_flag ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Clearance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.clearance_cost.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input value={this.state.clearance_cost.value} onChangeText={(text) => this._handlechange('clearance_cost',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.clearance_cost.helperText}</Text>
                    </Body>
                  </ListItem>
                ):null}

                

                {!!this.state.export_flag ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Custom Duty Cost (PMT): <Text style={styles.formulaLabel}>{this.state.custom_duty_cost.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem} >
                        <Input  value={this.state.custom_duty_cost.value} onChangeText={(text) => this._handlechange('custom_duty_cost',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.custom_duty_cost.helperText}</Text>
                    </Body>
                  </ListItem>
                ):null}

                {!!this.state.export_flag ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Finance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.finance_cost.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem} >
                        <Input  value={this.state.finance_cost.value} onChangeText={(text) => this._handlechange('finance_cost',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.finance_cost.helperText}</Text>
                    </Body>
                  </ListItem>
                ):null}

              {!!this.state.export_flag ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>CESS Percentage (%): <Text style={styles.formulaLabel}>{this.state.cess_per.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input  value={this.state.cess_per.value} maxLength={3} onChangeText={(text) => this._handlechange('cess_per',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={styles.helpertext}>{this.state.cess_per.helperText}</Text>
                    </Body>
                  </ListItem>
                ):null}

                {!!this.state.export_flag ? (
                  <ListItem style={fstyles.formContainer}>
                    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>CESS (PMT): <Text style={styles.formulaLabel}>{this.state.cess.label}</Text></Label></Left>
                    <Body style={fstyles.formBody}>
                      <Item regular style={styles.ouritem}>
                        <Input disabled={true} value={this.state.cess.value} onChangeText={(text) => this._handlechange('cess',text)} keyboardType="numeric"/>
                      </Item>
                      <Text style={this.state.cess.err ? styles.helpertext:styles.rightHelper}>{this.state.cess.helperText}</Text>
                    </Body>
                  </ListItem>
                ):null}

<ListItem itemDivider style={fstyles.divider}>
                  <Left style={fstyles.formLeft}>
                    <Text style={styles.listItemheader}>Extra Expenses (In PMT)</Text> 
                    <Text style={styles.formulaLabel}>EC</Text>
                  </Left>
                  <TouchableOpacity style={fstyles.plusback} onPress={() => this._openExtra()}>
                     <FontAwesome style={fstyles.plusicon} name={this.state.exp_flag === true ? "minus":"plus"} />
                  </TouchableOpacity>
              </ListItem>
              {this.state.exp_flag ? (
                <ListItem style={fstyles.formContainer}>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp1.name} placeholder="Label"  onChangeText={(text) => this._handleExtrachange('exp1','name',text)} />
                  </Item>
                <Text style={styles.helpertext}>{this.state.exp1.nhelperText}</Text>
                </Body>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp1.value} placeholder="Amount in PMT" onChangeText={(text) => this._handleExtrachange('exp1','value',text)} keyboardType="numeric" />
                  </Item>
                  <Text style={styles.helpertext}> {this.state.exp1.vhelperText} </Text>
                </Body>
              </ListItem>
              ):null}

              {this.state.exp_flag ? (
                <ListItem style={fstyles.formContainer}>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp2.name} placeholder="Label"  onChangeText={(text) => this._handleExtrachange('exp2','name',text)} />
                  </Item>
                <Text style={styles.helpertext}>{this.state.exp2.nhelperText}</Text>
                </Body>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp2.value} placeholder="Amount in PMT" onChangeText={(text) => this._handleExtrachange('exp2','value',text)} keyboardType="numeric" />
                  </Item>
                  <Text style={styles.helpertext}> {this.state.exp2.vhelperText} </Text>
                </Body>
              </ListItem>
              ):null}

              {this.state.exp_flag ? (
                <ListItem style={fstyles.formContainer}>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp3.name} placeholder="Label"  onChangeText={(text) => this._handleExtrachange('exp3','name',text)} />
                  </Item>
                <Text style={styles.helpertext}>{this.state.exp3.nhelperText}</Text>
                </Body>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp3.value} placeholder="Amount in PMT" onChangeText={(text) => this._handleExtrachange('exp3','value',text)} keyboardType="numeric" />
                  </Item>
                  <Text style={styles.helpertext}> {this.state.exp3.vhelperText} </Text>
                </Body>
              </ListItem>
              ):null}

              {this.state.exp_flag ? (
                <ListItem style={fstyles.formContainer}>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp4.name} placeholder="Label"  onChangeText={(text) => this._handleExtrachange('exp4','name',text)} />
                  </Item>
                <Text style={styles.helpertext}>{this.state.exp4.nhelperText}</Text>
                </Body>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.exp4.value} placeholder="Amount in PMT" onChangeText={(text) => this._handleExtrachange('exp4','value',text)} keyboardType="numeric" />
                  </Item>
                  <Text style={styles.helpertext}> {this.state.exp4.vhelperText} </Text>
                </Body>
              </ListItem>
              ):null}


              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Net Amount (PMT): <Text style={styles.formulaLabel}>{this.state.net_amount.label}</Text> </Label></Left>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input disabled={true} value={this.state.net_amount.value} onChangeText={(text) => this._handlechange('net_amount',text)} keyboardType="numeric" />
                  </Item>
                  <Text style={this.state.net_amount.err ? styles.helpertext:styles.rightHelper}> {this.state.net_amount.helperText}</Text>
                </Body>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Total Amount (Rs): <Text style={styles.formulaLabel}>{this.state.total_amount.label}</Text></Label></Left>
                <Body style={fstyles.formBody}>  
                  <Item regular style={styles.ouritem}>
                    <Input value={this.state.total_amount.value} onChangeText={(text) => this._handlechange('total_amount',text)} keyboardType="numeric" />
                    <FontAwesome name='rupee' style={fstyles.formIcon} />
                  </Item>
                  <Text style={this.state.total_amount.err ? styles.helpertext:styles.rightHelper}> {this.state.total_amount.helperText} </Text>
                </Body>
              </ListItem>

              <ListItem style={fstyles.formContainer}>
                <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Remarks :</Label></Left>
                <Body style={fstyles.formBody}>
                  <Item regular style={styles.ouritem} >
                    <Input value={this.state.remarks.value} onChangeText={(text) => this._handlechange('remarks',text)}/>
                  </Item>
                  <Text style={styles.helpertext}>{this.state.remarks.helperText}</Text>
                </Body>
              </ListItem>


              </List>
              <Button full danger onPress={() => this.validate()}>
                <Text style={{ textAlign: 'center', fontFamily: 'Raleway_bold',fontSize: 15 }} >Send Selling Request</Text>
              </Button>
              </ScrollView>
              </Container>
      ); 
    }

  }



export default SalesForm;
