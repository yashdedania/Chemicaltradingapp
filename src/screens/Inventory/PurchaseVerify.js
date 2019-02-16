import React, { Component } from 'react';
import { View, Container, Text, ListItem, 
    Left, Body, List, Label, Input, Button,Item,Picker,DatePicker,Right,Title,CheckBox,Toast} from 'native-base';
import {TouchableOpacity,ScrollView} from 'react-native';
import AlertAsync from "react-native-alert-async";
import { connect } from 'react-redux';
import styles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import fstyles from '../../theme/styles/formstyles';
import request from '../../api/request';
import color from '../../theme/color';
import format from '../../components/dateformat';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import hstyles from '../../theme/styles/header';
import Loader from '../../components/Loader';
import messages from '../../components/messages';

class PurchaseVerify extends Component{
    constructor(props){
        super(props);
        const { params = {} } = props.navigation.state;
        this.state = {
          chemical_name: { value: params.chemical_name == null ? '': params.chemical_name,previousvalue: params == null? '': params.chemical_name,heading:"Chemical Name",changeable:false}, 
          purchase_quantity:{value:params.purchase_quantity == null ? '': params.purchase_quantity.toString(),previousvalue:params == null ? '': params.purchase_quantity.toString(),heading:"Purchase Quantity",changeable:true,err:false,helperText:'',label:'Q'},
          extra_purchase_quantity:{value:params.extra_purchase_quantity == null ? '' : params.extra_purchase_quantity,previousvalue:params == null ? '': params.extra_purchase_quantity.toString(),heading:"Extra Purchase Quantity",changeable:false,err:false,helperText:''},        
          packing_type:{value:params.packing.type == null ? '': params.packing.type,previousvalue:params == null ? '': params.packing.type,heading:"Packing Type",changeable:true,err:false,helperText:''},
          packing_subtype:{value:params.packing.subtype == null? '':params.packing.subtype,previousvalue:params.packing.subtype == null ? '' : params.packing.subtype,heading:"Packing Subtype",changeable:true,err:false,helperText:''},
          packing_weight:{value:params.packing.weight == null? '':params.packing.weight,previousvalue:params.packing.weight == null ? '' : params.packing.weight,heading:"Packing Weight",changeable:true,err:false,helperText:''},
          purchase_type:{value:params.purchase_type.type == null ? '': params.purchase_type.type,previousvalue:params == null ? '': params.purchase_type.type,heading:"Purchase Type",changeable:false},
          purchase_subtype:{value:params.purchase_type.subtype == null ? '': params.purchase_type.subtype,previousvalue:params.purchase_type.subtype == null ? '': params.purchase_type.subtype,heading:"Purchase SubType",changeable:false},
          estimated_time:{value:params.eta.time == null ? '': params.eta.time,previousvalue:params == null ? '': params.eta.time,heading:"Estimated Time",changeable:true,err:false,helperText:''},
          estimated_month:{value:params.eta.month == null ? '': params.eta.month,previousvalue:params == null ? '': params.eta.month,heading:"Estimated Month",changeable:true,err:false,helperText:''},
          delivery_place:{value:params.delivery_place == null ? '': params.delivery_place,previousvalue:params == null ? '': params.delivery_place,heading:"Delivery Place",changeable:true,err:false,helperText:''},
          delivery_date:{value:params.delivery_date == null ? '': params.delivery_date,previousvalue:params == null ? '': params.delivery_date,heading:"Arrival Date",changeable:true,err:false,helperText:''},
          confirmation_date:{value:params.confirmation_date == null ? '': params.confirmation_date,previousvalue:params == null ? '': params.confirmation_date,heading:"Confirmation Date",changeable:true,err:false,helperText:''},
          vessel_name:{value:params.vessel_name == null? '': params.vessel_name,previousvalue:params == null? '': params.vessel_name,heading:"Vessel Name",changeable:false},
          supplier:{value:params.supplier == null ? '': params.supplier,previousvalue:params == null ? '': params.supplier,heading:"Supplier",changeable:false},
          broker_select:{value:params.broker.flag == null ? '' : params.broker.flag,heading:"Broker Select",changeable:false},
          broker_name:{value:params.broker.name == null ? '': params.broker.name,previousvalue:params.broker.name == null ? '': params.broker.name,heading:"Broker Name",changeable:false},
          broker_comission:{value:params.broker.commission == null ? '': params.broker.commission,previousvalue:params.broker.commission == null ? '': params.broker.commission,heading:"Commission",changeable:true,err:false,helperText:'',label:'C'},
          purchase_rate:{value:params.purchase_rate.usd == null ? '': params.purchase_rate.usd,previousvalue:params.purchase_rate.usd == null ? '': params.purchase_rate.usd,heading:"Purchase Rate",changeable:true,err:false,helperText:'',label:'PR'},
          purchase_rate_in_inr:{value:params.purchase_rate.inr == null ? '': params.purchase_rate.inr,previousvalue:params.purchase_rate.inr == null ? '': params.purchase_rate.inr,heading:"Purchase Rate in Inr",changeable:false,label:'PRI'},
          currency_type:{value:params.currency.type == null ? '': params.currency.type,previousvalue:params.currency.type == null ? '' : params.currency.type, heading:"Currency type",changeable:true,err:false,helperText:''},
          currency_subtype:{value:params.currency.subtype == null ? '': params.currency.subtype,previousvalue:params.currency.subtype == null ? '' : params.currency.subtype, heading:"Currency Subtype",changeable:true,err:false,helperText:''},
          currency_rate:{value:params.currency.rate == null ? '': params.currency.rate,previousvalue:params.currency.rate == null ? '' : params.currency.rate,heading:"Provisional Exchange Rate",changeable:true,err:false,helperText:'',label:'CR'},
          custom_duty_cost:{value:params.custom == null ? '': params.custom,previousvalue:params.custom == null ? '' : params.custom,heading:"Custom Duty Cost",changeable:true,err:false,helperText:'',label:'CDC'},
          clearance_cost:{value:params.clearance_cost == null ? '': params.clearance_cost,previousvalue:params.clearance_cost == null ? '' : params.clearance_cost,heading:"Clearance Cost",changeable:true,err:false,helperText:'',label:'CC'},
          cess_per:{value:params.cess_per == null ? '' : params.cess_per,previousvalue:params.cess_per == null ? '' : params.cess_per,heading:"CESS Percentage",changeable:true,err:false,helperText:'',label:'CPR'},
          cess:{value:params.cess == null ? '' : params.cess,previousvalue:params.cess == null ? '' : params.cess,heading:"CESS",changeable:true,err:false,helperText:'',label:'CS'},
          finance_cost:{value:params.finance_cost == null ? '': params.finance_cost,previousvalue:params.finance_cost == null ? '' : params.finance_cost,heading:"Finance Cost",changeable:true,err:false,helperText:'',label:'FC'},
          insurance_cost:{value:params.insurance_cost == null ? '': params.insurance_cost,previousvalue:params.insurance_cost == null ? '' : params.insurance_cost,heading:"Insurance Cost",changeable:true,err:false,helperText:'',label:'IC'},
          net_amount:{value:params.net_amount == null ? '' : params.net_amount,previousvalue:params.net_amount == null ? '' : params.net_amount,heading:"Net Amount",changeable:true,err:false,helperText:'',label:'NA'},
          total_amount:{value:params.total_amount == null ? '' : params.total_amount,previousvalue:params.total_amount == null ? '' : params.total_amount,heading:"Total Amount",changeable:true,err:false,helperText:'',label:'T'},
          payment_type:{value:params.payment.type == null ? '': params.payment.type,previousvalue:params.payment.type == null ? '': params.payment.type,heading:"Payment Type",changeable:true,err:false,helperText:''},
          payment_terms:{value:params.payment.terms == null ? '': params.payment.terms,previousvalue:params.payment.terms == null ? '': params.payment.terms,heading:"Payment Terms",changeable:true,err:false,helperText:''},
          payment_terms_from:{value:params.payment.from == null ? '': params.payment.from,previousvalue:params.payment.from == null ? '': params.payment.from,heading:"Payment from",changeable:true,err:false,helperText:''},
          payment_date:{value:params.payment.date == null ? '': params.payment.date,previousvalue:params.payment.date == null ? '': params.payment.date,heading:"Payment Date",changeable:true,err:false,helperText:''},
          bl_date:{value:params.bl_date == null ? '': params.bl_date,previousvalue:params.bl_date == null ? '': params.bl_date,heading:"BL Date",changeable:true,err:false,helperText:''},
          storage_date:{value:params.storage.date == null ? '': params.storage.date,previousvalue:params.storage.date == null ? '': params.storage.date,heading:"Storage Upto",changeable:true,err:false,helperText:''},
          storage_days:{value:params.storage.days == null ? '': params.storage.days,previousvalue:params.storage.days == null ? '': params.storage.days,heading:"Storage Days",changeable:true,err:false,helperText:''},
          extra_storage:{value:params.extra_storage == null ? '': params.extra_storage,previousvalue:params.extra_storage == null ? '': params.extra_storage,heading:" Extra Storage",changeable:true,err:false,helperText:''},
          remarks:{value:params.remarks == null ? '': params.remarks,previousvalue:params == null ? '': params.remarks,heading:"Remarks",changeable:true},
          loan_basis:{value:params.loan_basis == null ? '' : params.loan_basis,previousvalue:params.loan_basis == null ? '' : params.loan_basis,heading:"Loan Basis",changeable:true,err:false,helperText:''},
          transportation_select:{value:params.transportation.flag == null  ? '': params.transportation.flag,previousvalue:params.transportation.flag == null ? '': params.transportation.flag,heading:"Transportation",changeable:true,err:false,helperText:''},
          transportation_rate:{value:params.transportation.rate == null  ? '': params.transportation.rate,previousvalue:params.transportation.rate == null ? '': params.transportation.rate,heading:"Transportation Rate",changeable:true,err:false,helperText:'',label:'TR'},
          transportation_amount:{value:params.transportation.amount == null  ? '': params.transportation.amount,previousvalue:params.transportation.amount == null ? '': params.transportation.amount,heading:"Transportation Amount" ,changeable:true,err:false,helperText:'',label:'TA'},          
          remarks:{value:params.remarks == null? '':params.remarks,changeable:false},
          changesummary:{value:params.changesummary == null ? '' : params.changesummary,changeable:false},
          id:{value:params.id == null ? '':params.id,previousvalue:params == null ? '':params.id},
          createdAt:{value:params.createdAt == null ? '' : params.createdAt,previousvalue:params == null ? '' : params.createdAt},
          userid:params.user == null ? '' :params.user.id,
          loading:false,
          import_flag:params.purchase_type.subtype == "import" ? true : false,
          request_status:params.request_status == null ? '' : params.request_status,
          editable:false,
          showToast: false,
          exp_flag:(params.extra_expense !== null && params.extra_expense.length > 0)? true:false,
          extra_expense:params.extra_expense == null ? [] : params.extra_expense,
          exp1:{name:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[0] !== null && params.extra_expense[0] !== undefined) ? params.extra_expense[0].name:'',value:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[0] !== null && params.extra_expense[0] !== undefined) ? params.extra_expense[0].value:'',previousvalue:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[0] !== null && params.extra_expense[0] !== undefined) ? params.extra_expense[0].value:'',err:false,nhelperText:'',vhelperText:'',changeable:true},
          exp2:{name:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[1] !== null && params.extra_expense[1] !== undefined) ? params.extra_expense[1].name:'',value:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[1] !== null && params.extra_expense[1] !== undefined) ? params.extra_expense[1].value:'',previousvalue:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[1] !== null && params.extra_expense[1] !== undefined) ? params.extra_expense[1].value:'',err:false,nhelperText:'',vhelperText:'',changeable:true},
          exp3:{name:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[2] !== null && params.extra_expense[2] !== undefined) ? params.extra_expense[2].name:'',value:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[2] !== null && params.extra_expense[2] !== undefined) ? params.extra_expense[2].value:'',previousvalue:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[2] !== null && params.extra_expense[2] !== undefined) ? params.extra_expense[2].value:'',err:false,nhelperText:'',vhelperText:'',changeable:true},
          exp4:{name:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[3] !== null && params.extra_expense[3] !== undefined) ? params.extra_expense[3].name:'',value:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[3] !== null && params.extra_expense[3] !== undefined) ? params.extra_expense[3].value:'',previousvalue:(params.extra_expense !== null && params.extra_expense.length > 0 && params.extra_expense[3] !== null && params.extra_expense[3] !== undefined) ? params.extra_expense[3].value:'',err:false,nhelperText:'',vhelperText:'',changeable:true}
        };
        this._isMounted = false;
        //console.log("printing props");
        //console.log(props);
    }
    componentDidMount = () =>{
      this._isMounted = true;
    }
    componentWillUnmount = () =>{
      this._isMounted = false;
    }
    _editData = async() =>{
        console.log("In Edit Data");
        const choice = await AlertAsync(
            'Edit Data',
            'Are you sure you want to edit the data?',
            [
              {text:'Yes',onPress:() => true},
              {text:'No',onPress:() => false}
            ],
            {cancelable:false}
        );
        if(choice){
            this.setState({editable:true})
        }
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
    _renderButtons = (name) => {
        var role = this.props.user.details.role;
        var id = this.props.user.details.id;
        var request_status = this.state.request_status;
        if((name == 'update' || name == 'edit' || name == 'editTouch')){
            return 'flex';
        }
        else{
            return 'none';
        }
    }
    _handlechange= (name,text) =>{
      let errors = {...this.state};
      errors[name].value =text;
      if((name == "payment_date" || name == "storage_date" || name == "delivery_date" || name == "bl_date" || name == "confirmation_date") && errors.editable){
        errors[name].value = new Date(text);
        errors = this.cal_payment_date(errors);
      }
      /*if(name == "purchase_type"){
        errors = this.validate_purchase_type(errors);
      }
      if(name == "purchase_subtype"){
        errors = this.validate_purchase_subtype(errors);
      }*/
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
      if(name == "purchase_quantity" ){
        errors = this.validate_digits(errors,name,"Quantity");
        
      }  
      if(name == "purchase_rate"){
        errors = this.validate_digits(errors,name,"Amount");
      } 

      if(name == "payment_terms_from" || name == "payment_terms"){
        errors = this.cal_payment_date(errors);
      }  
      //errors = this.validateInput(name,errors);
      if(name == "purchase_quantity" || name == "currency_rate" || name == "clearance_cost" || name == "custom_duty_cost"  || name == "cess" 
      || name == "total_amount" || name == "purchase_rate" || name == "transportation_rate" || name == "finance_cost" || name == "cess_per" || name == "insurance_cost" 
      || name == "broker_select" || name == "transportation_select" || name == "broker_comission" || name == "currency_subtype"){
        errors = this.calculate_amount(errors);
        
      }
      errors = this.change_helper(errors)
      if(this._isMounted){
        this.setState({...this.state,...errors});
      }
      
      
  }
  cal_Purchase = (errors) =>{
      var difference = 0;
      var extra_quantity = parseFloat(errors.extra_purchase_quantity.value);
    if(errors.purchase_quantity.err === false && errors.purchase_quantity.value != '' && errors.purchase_quantity.value.length !== 0 && errors.purchase_quantity.value.toString().match(/\D+[^0-9.]/gm) == null){
      if(parseFloat(errors.purchase_quantity.value) < parseFloat(errors.purchase_quantity.previousvalue)){
            difference  = parseFloat(errors.purchase_quantity.previousvalue) - parseFloat(errors.purchase_quantity.value);
            extra_quantity = extra_quantity - difference;
      }
      if(parseFloat(errors.purchase_quantity.value) > parseFloat(errors.purchase_quantity.previousvalue)){
        difference  = parseFloat(errors.purchase_quantity.value) - parseFloat(errors.purchase_quantity.previousvalue);
        extra_quantity = extra_quantity + difference;
        }
        if(extra_quantity > 0){
            errors.extra_purchase_quantity.value = extra_quantity;
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
        if(errors.payment_terms_from.value == "Arrival Date"){
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
  change_helper = (errors) =>{
    if(errors.currency_type.value != "inr" && errors.currency_type.value != "" && errors.purchase_rate_in_inr.err === false){
      errors.purchase_rate_in_inr.helperText = errors.purchase_rate_in_inr.label +" = "+errors.purchase_rate.label+" * "+errors.currency_rate.label;
    }
    if(errors.import_flag && errors.cess.err === false){
      errors.cess.helperText = errors.cess.label+" = ( "+errors.cess_per.label+" * "+errors.custom_duty_cost.label+" )/100";
    }
    if(errors.transportation_select.value == "accord" && errors.transportation_amount.err === false){
      errors.transportation_amount.helperText = errors.transportation_amount.label+" = "+errors.transportation_rate.label+" * "+errors.purchase_quantity.label;
    }
    if(errors.import_flag && errors.currency_type.value != "inr" && errors.currency_type.value != "" && errors.net_amount.err === false){
      errors.net_amount.helperText = errors.net_amount.label+" = ( "+errors.purchase_rate.label+" * "+errors.currency_rate.label+" ) + "+errors.clearance_cost.label+" + "+errors.custom_duty_cost.label+" + "+errors.cess.label+" + "+errors.finance_cost.label;  
    }
    if(errors.import_flag && errors.currency_type.value == "inr" && errors.currency_type.value != "" && errors.net_amount.err === false){
      errors.net_amount.helperText = errors.net_amount.label+" = "+errors.purchase_rate.label+" + "+errors.clearance_cost.label+" + "+errors.custom_duty_cost.label+" + "+errors.cess.label+" + "+errors.finance_cost.label;
    }
    if(!errors.import_flag && errors.net_amount.err === false){
      errors.net_amount.helperText =  errors.net_amount.label+" = "+errors.purchase_rate.label;
    }
    if(errors.transportation_select.value == "accord"){
      errors.net_amount.helperText += " + "+errors.transportation_rate.label;
    }
    if(errors.broker_select.value == "yes"){
      errors.net_amount.helperText += " + "+errors.broker_comission.label;
    }
    if(errors.exp_flag){
      errors.net_amount.helperText += "+ EC";
    }
    if(errors.currency_subtype.value == "CFR" || errors.currency_subtype.value == "FOD"){
      errors.net_amount.helperText += "+ "+errors.insurance_cost.label;
    }
    if(errors.total_amount.err === false){
      errors.total_amount.helperText = errors.total_amount.label+" = "+errors.net_amount.label+" * "+errors.purchase_quantity.label;
    }
    return errors;
  }
  calculate_amount = (errors) =>{
    let error_check = false;
    let list  = ["purchase_quantity","currency_rate","clearance_cost","custom_duty_cost","cess","finance_cost","cess_per","transportation_rate","broker_comission","exp1","exp2","exp3","exp4"];
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
      let quantity = errors.purchase_quantity.value == null ? 0 : parseFloat(errors.purchase_quantity.value.replace(/\D+[^0-9.]/gm,0));
      
       
      let purchase_rate = errors.purchase_rate.value == "" ? 0 : parseFloat(errors.purchase_rate.value.replace(/\D+[^0-9.]/gm,0));
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
        errors.purchase_rate_in_inr.value = (purchase_rate * currency_rate).toString();
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
      if(errors.import_flag){
          let clearance_cost = errors.clearance_cost.value == "" ? 0 : parseFloat(errors.clearance_cost.value.replace(/\D+[^0-9.]/gm,0));
          let custom_duty_cost = errors.custom_duty_cost.value == "" ? 0 : parseFloat(errors.custom_duty_cost.value.replace(/\D+[^0-9.]/gm,0));
          let cess_per  =  errors.cess_per.value == "" ? 0 : parseFloat(errors.cess_per.value.replace(/\D+[^0-9.]/gm,0));
          let cess = parseFloat(cess_per * custom_duty_cost )/100;
          let finance_cost =errors.finance_cost.value == "" ? 0 : parseFloat(errors.finance_cost.value.replace(/\D+[^0-9.]/gm,0));
          errors.cess.value = cess.toString();
          net_amount = parseFloat((purchase_rate * currency_rate) + clearance_cost + finance_cost + custom_duty_cost + cess+transportation_rate+insurance_cost+comission+exp1+exp2+exp3+exp4);
          total_amount = parseFloat(net_amount * quantity);
          
      }
      else{
        net_amount = parseFloat(purchase_rate) + parseFloat(transportation_rate) + parseFloat(insurance_cost) + parseFloat(comission)+exp1 + exp2 + exp3 +exp4;
        total_amount = parseFloat((net_amount * quantity));
        errors.custom_duty_cost.value = "";
        errors.cess.value = "";
        errors.currency_type.value = "inr";
        errors.currency_rate.value = ""; 
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
    if(name == "clearance_cost"  || name == "custom_duty_cost" || name == "cess" || name == "finance_cost"){
      if(errors.import_flag && (errors[name].value == '' || errors[name].value.toString().match(/\D+[^0-9.]/gm) != null)){
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
      if(errors.currency_subtype.value !== "CFR" && errors.currency_subtype.value !== "FOB"){
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
  
    validateInput = async (name) =>{
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
      errors = this.validate_digits(errors,"purchase_quantity","Quantity");
      errors = this.validate_digits(errors,"purchase_rate","Amount");
      errors = this.calculate_amount(errors);
      let error_check = false;
      var changesummary = '';
      var i = 1;
        for (var x in errors){
            if(errors[x].changeable !== null && errors[x].changeable !== undefined && errors[x].changeable == true){
              if(x == "exp1" || x == "exp2" || x == "exp3" || x == "exp4"){
                if(errors[x].previousvalue !== errors[x].value){
                  changesummary +="\n "+i+". "+errors[x].name+" (Extra Expense)"+" changed from "+errors[x].previousvalue+" to "+errors[x].value;
                  i++;
                }
              }  
              else if(errors[x].err !== null && errors[x].err !== undefined){
                  if(errors[x].heading == "Storage Upto" || errors[x].heading == "Payment Date" || errors[x].heading == "Arrival Date" || errors[x].heading == "BL Date" || errors[x].heading == "Confirmation Date"){
                    if(format.Date(errors[x].value) != format.Date(errors[x].previousvalue)){
                      changesummary += "\n"+i+'. '+errors[x].heading+" Changed from "+format.Date(errors[x].previousvalue)+" to "+ format.Date(errors[x].value)+"\n";
                      i++;
                    }
                  }
                  else{
                    if(errors[x].value != errors[x].previousvalue){
                      changesummary += "\n"+i+'. '+errors[x].heading+" Changed from "+errors[x].previousvalue+" to "+ errors[x].value+"\n";
                      i++;
                    }
                  }  
                }
                else{
                  error_check = true;
                  console.log("Before one found:");
                  
                  console.log(errors[x]);
                  break;
                }
            }
        }
        if(error_check === false){
          if(changesummary != ''){
            errors.changesummary.value = changesummary;
            await this.setState({...this.state,...errors});
          }
          console.log("Request Form successfully validated");
          this._update(name);
        }
        else{
          console.log("Request form has errors");
            choice = await AlertAsync(
                'Errors',
                'Please Fill all the details properly',
                [
                  {text:'Okay',onPress:() => true}
                ],
                {cancelable:true}
            );
          this.setState({...this.state,...errors});
        }   
    }
    
    _handlecheckchange = (name) =>{
      let errors = {...this.state};
      errors.ready_flag = !this.state.ready_flag;
      if(errors.ready_flag){
        errors.request_status = "verified";
      }
      else{
        errors.request_status = "added to inventory";
      }
      this.setState({...this.state,...errors});
    }
    _update = async(name) =>{
        var choice = false;
        if(name == 'update'){
            choice = await AlertAsync(
                'Update Order',
                'Are you sure you want to update this order?',
                [
                  {text:'Yes',onPress:() => true},
                  {text:'No',onPress:() => false}
                ],
                {cancelable:false}
            );
            if(choice){
                await this.setState({loading:true});
                let resp = await request.update(this.state);
                if(resp !== false){
                    if(resp.status !== 'error'){
                        console.log("Chemical successfully Updated");
                        Toast.show({text: "Order Details successfully updated",buttonText: "Okay",type: "success",duration: 3000});
                        this.props.navigation.goBack();
                    }
                    else{
                        console.log("In request detail error recieved");
                        Toast.show({text: resp.result,buttonText: "Okay",type: "warning",duration: 3000});
                        this.props.navigation.goBack();
                    }
                }
                else{
                    console.log("False data recieved in Request Details");
                    Toast.show({text: "Error connecting to server",buttonText: "Okay",type: "danger",duration: 3000});
                    this.props.navigation.goBack();
                }
            } 
        }
        
    }
    _openExtra =()=>{
      let extra = {...this.state};
      extra.exp_flag = !this.state.exp_flag;
      extra = this.change_helper(extra);
      this.setState({...this.state,...extra});
    }
    _showInfo =() =>{
      choice = AlertAsync(
        'Form Information',
        messages.purchase,
        [
          {text:'Okay',onPress:() => true}
        ],
        {cancelable:true}
      );

    }
    render(){
        return(
            <Container style={gstyles.container_background}>
            <Loader loading={this.state.loading} />
          <View style={hstyles.header}>
            <View style={hstyles.headerContainer}>
              <Left style={hstyles.left}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Dashboard')}>
                  <MaterialCommunityIcons name="home" style={hstyles.icon} />
                </TouchableOpacity>
              </Left>
              <Body style={hstyles.body}>
                <Title style={hstyles.headtitle}>Purchase Request Details</Title>
              </Body>
              <Right style={hstyles.right}>
                <TouchableOpacity onPress={() => this._showInfo()}>
                  <MaterialCommunityIcons name="information" style={hstyles.icon} />
                </TouchableOpacity>
              </Right>
            </View>
          </View>
            <View style={styles.requestdetailheaderview}>
                <Text style={styles.requestdetailheadertext}> Request Details </Text>
                <TouchableOpacity  style={{display:this._renderButtons('edit')}} onPress={() => {this._editData()}} disabled={this._renderButtons('editTouch') == 'none' ? true: false }><MaterialCommunityIcons name='pencil-circle' style={styles.editIcon} /></TouchableOpacity>
            </View>

            
            <ScrollView contentContainerStyle={gstyles.scrollview} keyboardDismissMode="none" keyboardShouldPersistTaps="always">
            <List style={{backgroundColor:color.background}}>

<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>Purchase Type</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Type :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable}>
      <Picker 
        mode="dropdown"
        style={{width:undefined}}
        selectedValue={this.state.purchase_type.value}
        enabled={false}
        onValueChange={(text) => this._handlechange('purchase_type',text)}
      > 
        <Picker.Item label="Select type" value="" />
        <Picker.Item label="Indent Purchase" value="Indent Purchase"/>
                      <Picker.Item label="GST" value="GST" />
                      <Picker.Item label="Highseas" value="Highseas" />
                      <Picker.Item label="Bond Transfer" value="Bond Transfer"/>
                      <Picker.Item label="Self Import" value="Self Import" />
                      <Picker.Item label="Contract" value="Contract" />
      </Picker> 
    </Item>
    <Text style={gstyles.helpertext}>{this.state.purchase_type.helperText}</Text>
</Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Subcategory: </Label></Left>
    <Body style={fstyles.formBody}>
      <Item   style={styles.disable}>
         <Picker
          mode="dropdown"
          selectedValue={this.state.purchase_subtype.value}
          enabled={false}
          onValueChange= {(text) => this._handlechange('purchase_subtype',text)}
          >
            <Picker.Item label="Select Subtype" value="" />
            <Picker.Item label="Import" value="import" />
            <Picker.Item label="Regular" value="regular" />
          </Picker>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.purchase_subtype.helperText}</Text>
    </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Product :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable}>
      <Picker
        mode="dropdown"
        style={{ width: undefined }}
        selectedValue={this.state.chemical_name.value}
        enabled={false}
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
    <Text style={gstyles.helpertext}>{this.state.chemical_name.helperText}</Text>
</Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Quantity (MT) :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable}>
      <Input disabled={!this.state.editable} value={this.state.purchase_quantity.value} keyboardType="numeric" onChangeText={(text) => this._handlechange('purchase_quantity',text)}   />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.purchase_quantity.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Supplier :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable}>
      <Input disabled={true} value={this.state.supplier.value}  onChangeText={(text) => this._handlechange('supplier',text)}   />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.supplier.helperText}</Text>
  </Body>
</ListItem>


<ListItem itemDivider style={fstyles.divider}>
<Text style={styles.listItemheader}>Packing Details</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Packing Type :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable}>
    <Picker
          mode="dropdown"
          style={{width:undefined}}
          selectedValue={this.state.packing_type.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('packing_type',text)}
        >
          <Picker.Item label= "Select options" value="" />
          <Picker.Item label= "Bulk" value="bulk" />
          <Picker.Item label= "ISO tanks" value="iso tanks" />
          <Picker.Item label="Drums" value="drums" />
          <Picker.Item label="Bags" value="bags" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.packing_type.helperText}</Text>
  </Body>
</ListItem>

{this.state.packing_type.value == "drums" &&
<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Packing SubType :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable}>
    <Picker
          mode="dropdown"
          style={{width:undefined}}
          selectedValue={this.state.packing_subtype.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('packing_subtype',text)}
        >
          <Picker.Item label= "Select options" value="" />
          <Picker.Item label= "Intact" value="intact" />
          <Picker.Item label="Refill" value="refill" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.packing_subtype.helperText}</Text>
  </Body>
</ListItem>
}


{(this.state.packing_type.value == "drums" || this.state.packing_type.value == "bags") &&
<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Kgs :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <Input keyboardType="numeric" value={this.state.packing_weight.value} onChangeText={(text) => this._handlechange('packing_weight',text)}/>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.packing_weight.helperText}</Text>
  </Body>
</ListItem>
}


<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>ETA</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Estimated time:</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.estimated_time.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('estimated_time',text)}
        >
          <Picker.Item label= "Select Time" value="" />
          <Picker.Item label= "First Half" value="first half" />
          <Picker.Item label="Second Half" value="second half" />
          <Picker.Item label="Ready" value="ready" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.estimated_time.helperText}</Text>
  </Body>
</ListItem>

{(this.state.estimated_time.value != "" && this.state.estimated_time.value != "ready") ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Estimated Month</Label></Left>
    <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable} >
          <Picker
            mode="dropdown"
            selectedValue={this.state.estimated_month.value}
            enabled={this.state.editable}
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
      <Text style={gstyles.helpertext}>{this.state.estimated_month.helperText}</Text>
    </Body>
  </ListItem>
):(null)}

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Confirmation Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <TouchableOpacity style={{flex:1}} >
        <DatePicker
          defaultDate={new Date(this.state.confirmation_date.value)}
          locale={'en'}
          value={new Date(this.state.confirmation_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          textStyle={{ color: 'black' }}
          onDateChange={(text) => this._handlechange('confirmation_date',text)}
        /> 
      </TouchableOpacity>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.delivery_date.helperText}</Text>
  </Body>
  </ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Delivery Place:</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.delivery_place.value}
          enabled={false}
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
    <Text style={gstyles.helpertext}>{this.state.delivery_place.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Approx Arrival Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <TouchableOpacity style={{flex:1}} >
        <DatePicker
          defaultDate={new Date(this.state.delivery_date.value)}
          locale={'en'}
          value={new Date(this.state.delivery_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          textStyle={{ color: 'black' }}
          onDateChange={(text) => this._handlechange('delivery_date',text)}
        /> 
      </TouchableOpacity>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.delivery_date.helperText}</Text>
  </Body>
  </ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Vessel Name :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable} >
      <Input disabled={true} value={this.state.vessel_name.value} onChangeText={(text) => this._handlechange('vessel_name',text)}/>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.vessel_name.helperText}</Text>
  </Body>
</ListItem>



<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>Broker</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Broker :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable : styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.broker_select.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('broker_select',text)}
    >
        <Picker.Item label= "Select Option" value="" />
          <Picker.Item label= "Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.broker_select.helperText}</Text>
  </Body>
</ListItem>

{this.state.broker_select.value === "yes" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Broker Name :</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value= {this.state.broker_name.value} onChangeText={(text) => this._handlechange('broker_name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.broker_name.helperText}</Text>
    </Body>
  </ListItem>
):null}
{this.state.broker_select.value === "yes" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Commission (Rs.PMT): <Text style={styles.formulaLabel}>{this.state.broker_comission.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable} >
        <Input keyboardType="numeric" disabled={!this.state.editable} value={this.state.broker_comission.value} onChangeText={(text) => this._handlechange('broker_comission',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.broker_comission.helperText}</Text>
    </Body>
  </ListItem>
):null}


<ListItem itemDivider style={fstyles.divider}>
    <Text style={styles.listItemheader}>Transportation</Text>
</ListItem>


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.transportation_select.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('transportation_select',text)}
    >
        <Picker.Item label= "Select Option" value="" />
          <Picker.Item label= "Accord" value="accord" />
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label= "NA" value="na" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.transportation_select.helperText}</Text>
  </Body>
</ListItem>

{this.state.transportation_select.value === "accord" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Rate(PMT): <Text style={styles.formulaLabel}>{this.state.transportation_rate.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>    
      <Item style={this.state.editable ? styles.enable:styles.disable} >
        <Input disabled={!this.state.editable} value={this.state.transportation_rate.value} onChangeText={(text) => this._handlechange('transportation_rate',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.transportation_rate.helperText}</Text>
    </Body>
  </ListItem>
):null}

{this.state.transportation_select.value === "accord" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Amount: <Text style={styles.formulaLabel}>{this.state.transportation_amount.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>    
      <Item style={this.state.editable ? styles.enable:styles.disable} >
        <Input disabled={!this.state.editable} value={this.state.transportation_amount.value} onChangeText={(text) => this._handlechange('transportation_amount',text)} keyboardType="numeric"/>
        <FontAwesome name='rupee' style={fstyles.formIcon} />
      </Item>
      <Text style={this.state.transportation_amount.err ? gstyles.helpertext:gstyles.rightHelper}>{this.state.transportation_amount.helperText}</Text>
    </Body>
  </ListItem>
):null}


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Loan basis:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable}>
    <Picker
          mode="dropdown"
          selectedValue={this.state.loan_basis.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('loan_basis',text)}
    >
        <Picker.Item label= "Select option" value="" />
          <Picker.Item label= "Yes" value="yes" />
          <Picker.Item label="No" value="no" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.loan_basis.helperText}</Text>
  </Body>
</ListItem>

<ListItem itemDivider style={fstyles.divider}>
    <Text style={styles.listItemheader}>Payment Details</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Type:</Label></Left>
  <Body style={fstyles.formBody}> 
    <Item style={this.state.editable ? styles.enable:styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.payment_type.value}
          enabled={this.state.editable}
          onValueChange={(text) => this._handlechange('payment_type',text)}
    >
        <Picker.Item label= "Select option" value="" />
          <Picker.Item label= "LC" value="LC" />
          <Picker.Item label="PDC" value="PDC" />
          <Picker.Item label="DA" value="DA" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.payment_type.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Approx BL Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <TouchableOpacity style={{flex:1}} >
        <DatePicker
          defaultDate={new Date(this.state.bl_date.value)}
          locale={'en'}
          value={new Date(this.state.bl_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          textStyle={{ color: 'black' }}
          onDateChange={(text) => this._handlechange('bl_date',text)}
        /> 
      </TouchableOpacity>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.bl_date.helperText}</Text>
  </Body>
</ListItem>


            <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Term Days:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item style={this.state.editable ? styles.enable:styles.disable} >
                      <Input  disabled={!this.state.editable} value={this.state.payment_terms.value} keyboardType="numeric" onChangeText={(text) => this._handlechange('payment_terms',text)} />
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_terms.helperText}</Text>
                  </Body>
                </ListItem>

                <ListItem style={fstyles.formContainer}>
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Term From:</Label></Left>
                  <Body style={fstyles.formBody}> 
                    <Item style={this.state.editable ? styles.enable:styles.disable} >
                    <Picker
                          mode="dropdown"
                          selectedValue={this.state.payment_terms_from.value}
                          enabled={this.state.editable}
                          onValueChange={(text) => this._handlechange('payment_terms_from',text)}
                    >
                        <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "BL Date" value="BL Date" />
                          <Picker.Item label="Confirmation Date" value="Confirmation Date" />
                          <Picker.Item label="Arrival Date" value="Arrival Date" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_terms_from.helperText}</Text>
                  </Body>
                </ListItem>


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Due Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <Input disabled={true} value={format.Date(this.state.payment_date.value)} />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.payment_date.helperText}</Text>
  </Body>
</ListItem>




<ListItem itemDivider style={fstyles.divider}>
    <Text style={styles.listItemheader}>Storage</Text>
</ListItem>


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Days:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <Input keyboardType="numeric" multiline={true} value={this.state.storage_days.value} onChangeText={(text) => this._handlechange('storage_days',text)} />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.storage_days.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Upto:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <TouchableOpacity style={{flex:1}} >
        <DatePicker
          defaultDate={new Date(this.state.storage_date.value)}
          locale={'en'}
          disabled={this.state.editable ? false : true}
          value={new Date(this.state.storage_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          animationType={'fade'}
          androidMode={'default'}
          textStyle={{ color: 'black' }}
          onDateChange={(text) => this._handlechange('storage_date',text)}
        /> 
      </TouchableOpacity>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.storage_date.helperText}</Text>
  </Body>
  </ListItem>

  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Extra Storage(PMT) :</Label></Left>
    <Body style={fstyles.formBody}>  
      <Item style={this.state.editable ? styles.enable:styles.disable} >
        <Input keyboardType="numeric" disabled={!this.state.editable} value={this.state.extra_storage.value} onChangeText={(text) => this._handlechange('extra_storage',text)}/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.extra_storage.helperText}</Text>
    </Body>
  </ListItem>

<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>Billing Details</Text>
</ListItem>

<ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Currency Type:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Picker enabled={this.state.import_flag === false? false : this.state.editable} mode="dropdown" selectedValue={this.state.currency_type.value} onValueChange={(text) => this._handlechange('currency_type',text)}>
          <Picker.Item label= "Select option" value="" />
          <Picker.Item label= "USD" value="usd" />
          <Picker.Item label="INR" value="inr" />
          <Picker.Item label="AED" value="aed" />
        </Picker>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.currency_type.helperText}</Text>
    </Body>
  </ListItem>

  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Type:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Picker enabled={this.state.editable} mode="dropdown" selectedValue={this.state.currency_subtype.value} onValueChange={(text) => this._handlechange('currency_subtype',text)}>
          <Picker.Item label= "Select option" value="" />
          <Picker.Item label= "CFR" value="CFR" />
          <Picker.Item label="CIF" value="CIF" />
          <Picker.Item label="FOB" value="FOB" />
          <Picker.Item label="Bond Transfer" value="Bond Transfer" />
          <Picker.Item label="Basic" value="Basic" />
          <Picker.Item label="NA" value="NA" />
        </Picker>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.currency_subtype.helperText}</Text>
    </Body>
  </ListItem>

{(this.state.currency_subtype.value == "CFR" || this.state.currency_subtype.value == "FOB")?(
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Insurance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.insurance_cost.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.insurance_cost.value} onChangeText={(text) => this._handlechange('insurance_cost',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.insurance_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Rate(PMT): <Text style={styles.formulaLabel}>{this.state.purchase_rate.label}</Text></Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable} >
      <Input disabled={!this.state.editable} value={this.state.purchase_rate.value} onChangeText={(text) => this._handlechange('purchase_rate',text)} keyboardType="numeric"/>
    </Item>
    <Text style={gstyles.helpertext}> {this.state.purchase_rate.helperText} </Text>
  </Body>
</ListItem>

{(this.state.currency_type.value === "usd" || this.state.currency_type.value === "aed") ? (
  <ListItem style={fstyles.formContainer}>
      <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Provisional Exchange Rate: <Text style={styles.formulaLabel}>{this.state.currency_rate.label}</Text></Label></Left>
      <Body style={fstyles.formBody}>  
        <Item style={this.state.editable ? styles.enable:styles.disable} >
          <Input disabled={!this.state.editable} value={this.state.currency_rate.value} onChangeText={(text) => this._handlechange('currency_rate',text)} keyboardType="numeric"/>
          <FontAwesome name='rupee' style={fstyles.formIcon} />
        </Item>
        <Text style={gstyles.helpertext}>{this.state.currency_rate.helperText}</Text>
      </Body>
  </ListItem>
):null}




{(this.state.currency_type.value === "usd" || this.state.currency_type.value === "aed") &&
<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Rate PMT(in Inr): <Text style={styles.formulaLabel}>{this.state.purchase_rate_in_inr.label}</Text></Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable} >
      <Input disabled={true} value={this.state.purchase_rate_in_inr.value}  keyboardType="numeric"/>
      <FontAwesome name='rupee' style={fstyles.formIcon} />
    </Item>
    <Text style={this.state.purchase_rate_in_inr.err ? gstyles.helpertext : gstyles.rightHelper}>{this.state.purchase_rate_in_inr.helperText}</Text>
  </Body>
</ListItem>
}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Clearance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.clearance_cost.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.clearance_cost.value} onChangeText={(text) => this._handlechange('clearance_cost',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.clearance_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}




{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Custom Duty Cost (PMT): <Text style={styles.formulaLabel}>{this.state.custom_duty_cost.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.custom_duty_cost.value} onChangeText={(text) => this._handlechange('custom_duty_cost',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.custom_duty_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Finance Cost (PMT): <Text style={styles.formulaLabel}>{this.state.finance_cost.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.finance_cost.value} onChangeText={(text) => this._handlechange('finance_cost',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.finance_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>CESS Percentage (%): <Text style={styles.formulaLabel}>{this.state.cess_per.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} maxLength={3} value={this.state.cess_per.value} onChangeText={(text) => this._handlechange('cess_per',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.cess.helperText}</Text>
    </Body>
  </ListItem>
):null}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>CESS (PMT): <Text style={styles.formulaLabel}>{this.state.cess.label}</Text></Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Input disabled={true} value={this.state.cess.value} onChangeText={(text) => this._handlechange('cess',text)} keyboardType="numeric"/>
      </Item>
      <Text style={this.state.cess.err ? gstyles.helpertext : gstyles.rightHelper}>{this.state.cess.helperText}</Text>
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

{this.state.exp_flag  ?(
  <ListItem style={fstyles.formContainer}>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp1.name} onChangeText={(text) => this._handleExtrachange('exp1','name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp1.nhelperText}</Text>
    </Body>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp1.value} onChangeText={(text) => this._handleExtrachange('exp1','value',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp1.vhelperText}</Text>
    </Body>
  </ListItem>
):null}
{this.state.exp_flag ?(
  <ListItem style={fstyles.formContainer}>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp2.name} onChangeText={(text) => this._handleExtrachange('exp2','name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp2.nhelperText}</Text>
    </Body>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp2.value} onChangeText={(text) => this._handleExtrachange('exp2','value',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp2.vhelperText}</Text>
    </Body>
  </ListItem>
):null}
{this.state.exp_flag ?(
  <ListItem style={fstyles.formContainer}>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp3.name} onChangeText={(text) => this._handleExtrachange('exp3','name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp3.nhelperText}</Text>
    </Body>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp3.value} onChangeText={(text) => this._handleExtrachange('exp3','value',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp3.vhelperText}</Text>
    </Body>
  </ListItem>
):null}
{this.state.exp_flag ?(
  <ListItem style={fstyles.formContainer}>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp4.name} onChangeText={(text) => this._handleExtrachange('exp4','name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp4.nhelperText}</Text>
    </Body>
    <Body style={fstyles.formBody}>
      <Item style={this.state.editable ? styles.enable:styles.disable}>
        <Input disabled={!this.state.editable} value={this.state.exp4.value} onChangeText={(text) => this._handleExtrachange('exp4','value',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.exp4.vhelperText}</Text>
    </Body>
  </ListItem>
):null}


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Net Amount(PMT): <Text style={styles.formulaLabel}>{this.state.net_amount.label}</Text></Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <Input disabled={true} value={this.state.net_amount.value} onChangeText={(text) => this._handlechange('net_amount',text)} keyboardType="numeric" />
    </Item>
    <Text style={this.state.net_amount.err ? gstyles.helpertext : gstyles.rightHelper}> {this.state.net_amount.helperText} </Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Total Amount: <Text style={styles.formulaLabel}>{this.state.total_amount.label}</Text></Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <Input disabled={true} value={this.state.total_amount.value} onChangeText={(text) => this._handlechange('total_amount',text)} keyboardType="numeric" />
      <FontAwesome name='rupee' style={fstyles.formIcon} />
    </Item>
    <Text style={this.state.total_amount.err ? gstyles.helpertext : gstyles.rightHelper}> {this.state.total_amount.helperText} </Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Remarks :</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable} >
      <Input disabled={true} onChangeText={(text) => this._handlechange('remarks',text)}/>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.remarks.helperText}</Text>
  </Body>
</ListItem>
<View>
<TouchableOpacity style={fstyles.checkConatainer} onPress={() => this._handlecheckchange('Ready')}>
  <CheckBox checked={this.state.ready_flag} color={color.primary} />
  <Body style={fstyles.formBody}>
    <Text>Ready</Text>
  </Body>
</TouchableOpacity>
</View>
<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>Change Summary</Text>
</ListItem>


<ListItem>
  <Body>
    <Text>{this.state.changesummary.value}</Text>
  </Body>
</ListItem>
</List>
            </ScrollView>
            <View style={styles.ButtonContainer}>
                <Button onPress={() => this.validateInput('update')} primary style={{display:this._renderButtons('update')}}>
                    <Text>Update details </Text>
                </Button>
            </View>
        </Container>
        );

    }

};
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
};
export default (connect(mapStateToProps)(PurchaseVerify));