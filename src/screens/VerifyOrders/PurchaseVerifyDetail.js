import React, { Component } from 'react';
import { View, Container, Text, ListItem, 
    Left, Body, List, Label, Input, Button,Item,Picker,DatePicker } from 'native-base';
import {TouchableOpacity,ActivityIndicator,ScrollView} from 'react-native';
import AlertAsync from "react-native-alert-async";
import { connect } from 'react-redux';
import styles from '../../theme/styles/requestsent';
import gstyles from '../../theme/styles/general';
import fstyles from '../../theme/styles/formstyles';
import request from '../../api/request';
import format from '../../components/dateformat';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import colors from '../../theme/color';
class PurchaseVerifyDetails extends Component{
    constructor(props){
        super(props);
        const { params = {} } = props.navigation.state;
        props.navigation.setParams({ title: 'Request Details' });
        console.log("Prinitng params");
        console.log(params);
        this.state = {
          chemical_name: { value: params.chemical_name == null ? '': params.chemical_name,previousvalue: params == null? '': params.chemical_name,heading:"Chemical Name",changeable:false}, 
          purchase_quantity:{value:params.purchase_quantity == null ? '': params.purchase_quantity.toString(),previousvalue:params == null ? '': params.purchase_quantity.toString(),heading:"Purchase Quantity",changeable:true,err:false,helperText:''},
          extra_purchase_quantity:{value:params.extra_purchase_quantity == null ? '': params.extra_purchase_quantity.toString(),previousvalue:params == null ? '': params.extra_purchase_quantity.toString(),heading:"Current Quantity",changeable:true,err:false,helperText:''},
          packing_type:{value:params.packing.type == null ? '': params.packing.type,previousvalue:params == null ? '': params.packing.type,heading:"Packing Type",changeable:false,err:false,helperText:''},
          packing_subtype:{value:params.packing.subtype == null? '':params.packing.subtype,previousvalue:params.packing.subtype == null ? '' : params.packing.subtype,heading:"Packing Subtype",changeable:false,err:false,helperText:''},
          packing_weight:{value:params.packing.weight == null? '':params.packing.weight,previousvalue:params.packing.weight == null ? '' : params.packing.weight,heading:"Packing Weight",changeable:false,err:false,helperText:''},
          purchase_type:{value:params.purchase_type.type == null ? '': params.purchase_type.type,previousvalue:params == null ? '': params.purchase_type.type,heading:"Purchase Type",changeable:false},
          purchase_subtype:{value:params.purchase_type.subtype == null ? '': params.purchase_type.subtype,previousvalue:params.purchase_type.subtype == null ? '': params.purchase_type.subtype,heading:"Purchase SubType",changeable:false},
          estimated_time:{value:params.eta.time == null ? '': params.eta.time,previousvalue:params == null ? '': params.eta.time,heading:"Estimated Time",changeable:false,err:false,helperText:''},
          estimated_month:{value:params.eta.month == null ? '': params.eta.month,previousvalue:params == null ? '': params.eta.month,heading:"Estimated Month",changeable:false,err:false,helperText:''},
          delivery_place:{value:params.delivery_place == null ? '': params.delivery_place,value:params == null ? '': params.delivery_place,heading:"Delivery Place",changeable:false,err:false,helperText:''},
          delivery_date:{value:params.delivery_date == null ? '': params.delivery_date,value:params == null ? '': params.delivery_date,heading:"Arrival Date",changeable:true,err:false,helperText:''},
          vessel_name:{value:params.vessel_name == null? '': params.vessel_name,previousvalue:params == null? '': params.vessel_name,heading:"Vessel Name",changeable:false},
          supplier:{value:params.supplier == null ? '': params.supplier,previousvalue:params == null ? '': params.supplier,heading:"Supplier",changeable:false},
          broker_select:{value:params.broker.flag == null ? '' : params.broker.flag,heading:"Broker Select",changeable:false},
          broker_name:{value:params.broker.name == null ? '': params.broker.name,previousvalue:params.broker.name == null ? '': params.broker.name,heading:"Broker Name",changeable:false},
          broker_comission:{value:params.broker.commission == null ? '': params.broker.commission,previousvalue:params.broker.commission == null ? '': params.broker.commission,heading:"Commission",changeable:false,err:false,helperText:''},
          purchase_rate:{value:params.purchase_rate.usd == null ? '': params.purchase_rate.usd,previousvalue:params.purchase_rate.usd == null ? '': params.purchase_rate.usd,heading:"Purchase Rate",changeable:false,err:false,helperText:''},
          purchase_rate_in_inr:{value:params.purchase_rate.inr == null ? '': params.purchase_rate.inr,previousvalue:params.purchase_rate.inr == null ? '': params.purchase_rate.inr,heading:"Purchase Rate in Inr",changeable:false},
          currency_type:{value:params.currency.type == null ? '': params.currency.type,previousvalue:params.currency.type == null ? '' : params.currency.type, heading:"Currency type",changeable:false,err:false,helperText:''},
          currency_rate:{value:params.currency.rate == null ? '': params.currency.rate,previousvalue:params.currency.rate == null ? '' : params.currency.rate,heading:"Provisional Exchange Rate",changeable:false,err:false,helperText:''},
          custom_duty_cost:{value:params.custom == null ? '': params.custom,previousvalue:params.custom == null ? '' : params.custom,heading:"Custom Cost",changeable:false,err:false,helperText:''},
          finance_cost:{value:params.finance_cost == null ? '' : params.finance_cost,previousvalue:params.finance_cost == null ? '' : params.finance_cost,heading:"Finance Cost",changeable:false,err:false,helperText:''},
          clearance_cost:{value:params.clearance_cost == null ? '': params.clearance_cost,previousvalue:params.clearance_cost == null ? '' : params.clearance_cost,heading:"Clearance Cost",changeable:false,err:false,helperText:''},
          cess:{value:params.cess == null ? '' : params.cess,previousvalue:params.cess == null ? '' : params.cess,heading:"CESS",changeable:false,err:false,helperText:''},
          total_amount:{value:params.total_amount == null ? '' : params.total_amount,previousvalue:params.total_amount == null ? '' : params.total_amount,heading:"Total Amount",changeable:false,err:false,helperText:''},
          payment_type:{value:params.payment.type == null ? '': params.payment.type,previousvalue:params.payment.type == null ? '': params.payment.type,heading:"Payment Type",changeable:false,err:false,helperText:''},
          payment_terms:{value:params.payment.terms == null ? '': params.payment.terms,previousvalue:params.payment.terms == null ? '': params.payment.terms,heading:"Payment Terms",changeable:false,err:false,helperText:''},
          payment_date:{value:params.payment.date == null ? '': params.payment.date,previousvalue:params.payment.date == null ? '': params.payment.date,heading:"Payment Date",changeable:false,err:false,helperText:''},
          bl_date:{value:params.bl_date == null ? '': params.bl_date,value:params == null ? '': params.bl_date,heading:"BL Date",changeable:false,err:false,helperText:''},
          storage_date:{value:params.storage.date == null ? '': params.storage.date,previousvalue:params.storage.date == null ? '': params.storage.date,heading:"Storage Upto",changeable:false,err:false,helperText:''},
          storage_days:{value:params.storage.days == null ? '': params.storage.days,previousvalue:params.storage.days == null ? '': params.storage.days,heading:"Storage Days",changeable:false,err:false,helperText:''},
          extra_storage:{value:params.extra_storage == null ? '': params.extra_storage,previousvalue:params.extra_storage == null ? '': params.extra_storage,heading:" Extra Storage",changeable:false,err:false,helperText:''},
          remarks:{value:params.remarks == null ? '': params.remarks,previousvalue:params == null ? '': params.remarks,heading:"Remarks",changeable:false},
          loan_basis:{value:params.loan_basis == null ? '' : params.loan_basis,previousvalue:params.loan_basis == null ? '' : params.loan_basis,heading:"Loan Basis",changeable:false,err:false,helperText:''},
          transportation_select:{value:params.transportation.flag == null  ? '': params.transportation.flag,previousvalue:params.transportation.flag == null ? '': params.transportation.flag,heading:"Transportation",changeable:false,err:false,helperText:''},
          transportation_rate:{value:params.transportation.rate == null  ? '': params.transportation.rate,previousvalue:params.transportation.rate == null ? '': params.transportation.rate,heading:"Transportation Rate",changeable:false,err:false,helperText:''},
          transportation_amount:{value:params.transportation.amount == null  ? '': params.transportation.amount,previousvalue:params.transportation.amount == null ? '': params.transportation.amount,heading:"Transportation" ,changeable:false,err:false,helperText:''},          
          remarks:{value:params.remarks == null? '':params.remarks,changeable:false},
          changesummary:{value:params.changesummary == null? '':params.changesummary,changeable:false},
          id:{value:params.id == null ? '':params.id,previousvalue:params == null ? '':params.id},
          createdAt:{value:params.createdAt == null ? '' : params.createdAt,previousvalue:params == null ? '' : params.createdAt},
          loading:false,
          import_flag:params.purchase_type.subtype == "import" ? true : false,
          request_status:params.request_status == null ? '' : params.request_status,
          editable:false,
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
    _renderButtons = (name) => {
        var role = this.props.user.details.role;
        var request_status = this.state.request_status;
        /*if((name == 'accept' || name == 'reject' || name == 'delete' || name == 'edit' || name == 'editTouch') && role == 'admin' && request_status == 'pending'){
            return 'flex';
        }
        if((name == 'update' || name == 'edit' || name == 'editTouch')  && role == 'purchaser' && request_status == 'rejected'){
            return 'flex';
        }
        if(name =='addinventory' && role == 'purchaser' && request_status == 'accepted'){
            return 'flex';
        }
        if(name == 'inprocess' && ((role == 'admin' && (request_status == 'rejected' || request_status == 'accepted') ) || (role=='purchaser' && request_status == 'pending') ) ){
            return 'flex';
        }
        else{
            return 'none';
        }*/
        return 'flex';
    }
    _handlechange= (name,text) =>{
      let errors = {...this.state};
      errors[name].value =text;
      if((name == "payment_date" || name == "storage_date" || name == "delivery_date" || name == "bl_date") && errors.editable){
        errors[name].value = new Date(text);
      }
      /*if(name == "purchase_type"){
        errors = this.validate_purchase_type(errors);
      }
      if(name == "purchase_subtype"){
        errors = this.validate_purchase_subtype(errors);
      }*/
      if(name == "chemical_name" || name == "packing_type"  || name == "estimated_time"  
      || name == "delivery_place" || name == "broker_select" || name == "transportation_select" || name == "loan_basis" || name == "payment_type"
      || name == "currency_type"){
        errors = this.validate_empty_input(errors,name,"select");
      }
      if(name == "supplier" || name == "vessel_name"  || name == "payment_date" || name == "payment_terms" || name == "storage_days"
      || name == "storage_date" || name == "extra_storage" || name == "delivery_date" || name == "bl_date"){
        errors = this.validate_empty_input(errors,name,"input");
      }
      if(name == "packing_subtype" || name == "packing_weight" || name == "broker_name" || name == "broker_comission" || name == "transportation_rate" || name == "transportation_amount"
      || name == "currency_rate" || name == "clearance_cost"  || name == "custom_duty_cost" || name == "cess" || name == "finance_cost" || name == "estimated_month"){
        errors = this.validate_dependent_values(errors,name);
      }
      if(name == "purchase_quantity"){
        errors = this.validate_digits(errors,name,"Quantity");
      }  
      if(name == "purchase_rate"){
        errors = this.validate_digits(errors,name,"Amount");
      }   
      //errors = this.validateInput(name,errors);
      /*if(name == "purchase_quantity" || name == "currency_rate" || name == "clearance_cost" || name == "custom_duty_cost"  || name == "cess" 
      || name == "total_amount" || name == "purchase_rate" || name == "transportation_rate"){
        errors = this.calculate_amount(errors);
      }*/
      if(this._isMounted){
        this.setState({...this.state,...errors});
      }
      
      
  }

  calculate_amount = (errors) =>{
      let error_check = false;
      let list  = ["purchase_quantity","currency_rate","clearance_cost","custom_duty_cost","cess","finance_cost"];
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
        let clearance_cost = errors.clearance_cost.value == "" ? 0 : parseFloat(errors.clearance_cost.value.replace(/\D+[^0-9.]/gm,0));
        let transportation_rate = errors.transportation_rate.value == "" ? 0 : parseFloat(errors.transportation_rate.value.replace(/\D+[^0-9.]/gm,0));
        let custom_duty_cost = parseFloat(errors.custom_duty_cost.value.replace(/\D+[^0-9.]/gm,0));
        let finance_cost = parseFloat(errors.finance_cost.value.replace(/\D+[^0-9.]/gm,0));
        let cess  =  parseFloat(errors.cess.value.replace(/\D+[^0-9.]/gm,0));
        let total_amount = 0 ;
        if(errors.currency_type.value == "usd" || errors.currency_type.value == "aed"){
          errors.purchase_rate_in_inr.value = (purchase_rate * currency_rate).toString();
        }
        if(errors.import_flag){
            total_amount = parseFloat((purchase_rate * quantity * currency_rate) + (clearance_cost) + finance_cost + custom_duty_cost + cess);
        }
        else{
          total_amount = parseFloat((purchase_rate * quantity));
          errors.custom_duty_cost.value = "";
          errors.cess.value = "";
          errors.currency_type.value = "inr";
          errors.currency_rate.value = ""; 
        }
        if(errors.transportation_select.value == "accord"){
          errors.transportation_amount.value =  parseFloat(quantity * transportation_rate).toString();
        }
        errors.total_amount.value = total_amount.toString();
        return errors;
      }
  }
  validate_dependent_values = (errors,name) =>{
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
                        "transportation_select","payment_type","loan_basis","currency_type"];
      
      var inputlist = ["supplier","vessel_name","payment_date","payment_terms","storage_days","storage_date","extra_storage","delivery_date","bl_date"];
      var dependentlist = ["packing_subtype", "packing_weight","broker_name","broker_comission","transportation_rate","transportation_amount",
      "currency_rate","clearance_cost","custom_duty_cost","cess","finance_cost","estimated_month"];
      for (i in selectlist){
        errors = this.validate_empty_input(errors,selectlist[i],"select");
      }
      for(j in inputlist){
        errors = this.validate_empty_input(errors,inputlist[j],"input");
      }
      for(k in dependentlist){
        errors = this.validate_dependent_values(errors,dependentlist[k]);
      }
      errors = this.validate_digits(errors,"purchase_quantity","Quantity");
      errors = this.validate_digits(errors,"purchase_rate","Amount");
      errors = this.calculate_amount(errors);
      let error_check = false;
      errors.changesummary.value = "";
        for (var x in errors){
            if(errors[x].changeable !== null && errors[x].changeable !== undefined && errors[x].changeable == true){
                if(!errors[x].err){
                  if(errors[x].value != errors[x].previousvalue){
                    if(errors[x].heading == "Storage Upto" || errors[x].heading == "Payment Date" || errors[x].heading == "Arrival Date" || errors[x].heading == "BL Date"){
                      errors.changesummary.value += "\n "+errors[x].heading+" Changed from "+format.Date(errors[x].previousvalue)+" to "+ format.Date(errors[x].value);
                    }
                    else{
                      errors.changesummary.value += "\n "+errors[x].heading+" Changed from "+errors[x].previousvalue+" to "+ errors[x].value;
                    }
                  }
                }
                else{
                  error_check = true;
                  console.log("Before one found:");
                  
                  console.log(errors[x]);
                  errors.changesummary.value = "";
                  break;
                }
            }
        }
        if(error_check === false){
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
    _singleupdate = async(request_type) =>{
        var body = {};
        var choice = false;
        if(request_type == 'verify'){
            choice = await AlertAsync(
                'Verify Order',
                'Are you sure you want to approver this order?',
                [
                  {text:'Yes',onPress:() => true},
                  {text:'No',onPress:() => false}
                ],
                {cancelable:false}
            );
            if(choice){
                console.log("Yeahh i waited");
                await this.setState({request_status:'verified'});
                body = {
                  request_status : this.state.request_status,
                  id:this.state.id.value
              }
              this.setState({loading:true});
              
              let resp = await request.singleupdate(body);
              if(resp !== false){
                  if(resp.status !== 'error'){
                      console.log("Chemical request status successfully updated");
                      this.props.navigation.goBack();
                      console.log("ROutes changed");
                  }
                  else{
                      console.log("In request detail error recieved");
                      this.props.navigation.goBack();
                  }
              }
              else{
                  console.log("False data recieved in Request Details");
                  this.props.navigation.goBack();
              }
            }
        }      
    }
    render(){
        if(this.state.loading){
            return (<View>
                <ActivityIndicator  size="large"/>
                </View>);
        }
        else{
        return(
            <Container style={gstyles.container_background}>
            <View style={styles.requestdetailheaderview}>
                <Text style={styles.requestdetailheadertext}> Order Details </Text>
                <TouchableOpacity  style={{display:this._renderButtons('edit')}} onPress={() => {this._editData()}} disabled={this._renderButtons('editTouch') == 'none' ? true: false }><MaterialCommunityIcons name='pencil-circle' style={styles.editIcon} /></TouchableOpacity>
            </View>

            
            <ScrollView contentContainerStyle={gstyles.scrollview} keyboardDismissMode="none" keyboardShouldPersistTaps="always">
            <List>

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
        <Picker.Item label="Import" value="import"/>
        <Picker.Item label="Contract" value="contract" />
        <Picker.Item label="HIGHSEAS" value="highseas" />
        <Picker.Item label="Bond Transfer" value="bond transfer" />
        <Picker.Item label="CGST/SGST" value="cgst/sgst" />
        <Picker.Item label="IGST" value="igst" />
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
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Quantity(MT):</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={this.state.editable ? styles.enable:styles.disable}>
      <Input disabled={!this.state.editable} value={this.state.purchase_quantity.value} keyboardType="numeric" onChangeText={(text) => this._handlechange('purchase_quantity',text)}   />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.purchase_quantity.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Quantity in Stock:</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable}>
      <Input disabled={true} value={this.state.extra_purchase_quantity.value} keyboardType="numeric" />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.extra_purchase_quantity.helperText}</Text>
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
    <Item style={styles.disable}>
    <Picker
          mode="dropdown"
          style={{width:undefined}}
          selectedValue={this.state.packing_type.value}
          enabled={false}
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
    <Item style={styles.disable}>
    <Picker
          mode="dropdown"
          style={{width:undefined}}
          selectedValue={this.state.packing_subtype.value}
          enabled={false}
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
    <Item style={styles.disable} >
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
    <Item style={styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.estimated_time.value}
          enabled={false}
          onValueChange={(text) => this._handlechange('estimated_time',text)}
        >
          <Picker.Item label= "Select Time" value="" />
          <Picker.Item label= "First Half" value="intact" />
          <Picker.Item label="Second Half" value="refill" />
          <Picker.Item label="Ready" value="ready" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.estimated_time.helperText}</Text>
  </Body>
</ListItem>
{(this.state.estimated_time.value != "ready" && this.state.estimated_time.value != "") ?(
  <ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Estimated Month</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable} >
          <Picker
            mode="dropdown"
            selectedValue={this.state.estimated_month.value}
            enabled={false}
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
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Delivery Place :</Label></Left>
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
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Arrival Date :</Label></Left>
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
    <Item style={styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.broker_select.value}
          enabled={false}
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
      <Item style={styles.disable}>
        <Input disabled={true} value= {this.state.broker_name.value} onChangeText={(text) => this._handlechange('broker_name',text)} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.broker_name.helperText}</Text>
    </Body>
  </ListItem>
):null}
{this.state.broker_select.value === "yes" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Commission:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable} >
        <Input disabled={true} value={this.state.broker_comission.value} onChangeText={(text) => this._handlechange('broker_comission',text)} />
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
    <Item style={styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.transportation_select.value}
          enabled={false}
          onValueChange={(text) => this._handlechange('transportation_select',text)}
    >
        <Picker.Item label= "Select Option" value="" />
          <Picker.Item label= "Accord" value="accord" />
          <Picker.Item label="Customer" value="customer" />
          <Picker.Item label="NA" value="na" />
        </Picker>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.transportation_select.helperText}</Text>
  </Body>
</ListItem>

{this.state.transportation_select.value === "accord" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Rate(PMT):</Label></Left>
    <Body style={fstyles.formBody}>    
      <Item style={styles.disable} >
        <Input disabled={true} value={this.state.transportation_rate.value} onChangeText={(text) => this._handlechange('transportation_rate',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.transportation_rate.helperText}</Text>
    </Body>
  </ListItem>
):null}

{this.state.transportation_select.value === "accord" ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Transportation Amount:</Label></Left>
    <Body style={fstyles.formBody}>    
      <Item style={styles.disable} >
        <Input disabled={true} value={this.state.transportation_amount.value} onChangeText={(text) => this._handlechange('transportation_amount',text)} keyboardType="numeric"/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.transportation_amount.helperText}</Text>
    </Body>
  </ListItem>
):null}


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Loan basis:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
    <Picker
          mode="dropdown"
          selectedValue={this.state.loan_basis.value}
          enabled={false}
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
    <Item style={styles.disable} >
    <Picker
          mode="dropdown"
          selectedValue={this.state.payment_type.value}
          enabled={false}
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
                  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Term Days:</Label></Left>
                  <Body style={fstyles.formBody}>  
                    <Item regular style={styles.ouritem} >
                      <Input multiline={true} value={this.state.payment_terms.value} onChangeText={(text) => this._handlechange('payment_terms',text)} />
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
                          selectedValue={this.state.payment_type.value}
                          onValueChange={(text) => this._handlechange('payment_terms_from',text)}
                    >
                        <Picker.Item label= "Select option" value="" />
                          <Picker.Item label= "BL Date" value="BL Date" />
                          <Picker.Item label="Confirmation Date" value="Confirmation Date" />
                          <Picker.Item label="Arrival Date" value="Arrival Date" />
                        </Picker>
                    </Item>
                    <Text style={styles.helpertext}>{this.state.payment_type.helperText}</Text>
                  </Body>
                </ListItem>


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Payment Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <TouchableOpacity style={{flex:1}}>
        <DatePicker
          defaultDate={new Date(this.state.payment_date.value)}
          locale={'en'}
          value={new Date(this.state.payment_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          disabled={true}
          animationType={'fade'}
          androidMode={'default'}
          textStyle={{ color: 'black' }}
          onDateChange={(text) => this._handlechange('payment_date',text)}
        /> 
      </TouchableOpacity>
    </Item>
    <Text style={gstyles.helpertext}>{this.state.payment_date.helperText}</Text>
  </Body>
</ListItem>



<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>BL Date :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <TouchableOpacity style={{flex:1}}>
        <DatePicker
          defaultDate={new Date(this.state.bl_date.value)}
          locale={'en'}
          value={new Date(this.state.bl_date.value)}
          timeZoneOffsetInMinutes={undefined}
          modalTransparent={false}
          disabled={true}
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


<ListItem itemDivider style={fstyles.divider}>
    <Text style={styles.listItemheader}>Storage</Text>
</ListItem>


<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Days:</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable} >
      <Input disabled={true} keyboardType="numeric" multiline={true} value={this.state.storage_days.value} onChangeText={(text) => this._handlechange('storage_days',text)} />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.storage_days.helperText}</Text>
  </Body>
</ListItem>

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Storage Upto :</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable} >
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
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Extra Storage(PMT):</Label></Left>
    <Body style={fstyles.formBody}>  
      <Item style={styles.disable} >
        <Input disabled={true} value={this.state.extra_storage.value} onChangeText={(text) => this._handlechange('extra_storage',text)}/>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.extra_storage.helperText}</Text>
    </Body>
  </ListItem>

<ListItem itemDivider style={fstyles.divider}>
  <Text style={styles.listItemheader}>Billing Details</Text>
</ListItem>

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Currency Type:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Picker enabled={false} mode="dropdown" selectedValue={this.state.currency_type.value} onValueChange={(text) => this._handlechange('currency_type',text)}>
          <Picker.Item label= "Select option" value="" />
          <Picker.Item label= "USD" value="usd" />
          <Picker.Item label="INR" value="inr" />
        </Picker>
      </Item>
      <Text style={gstyles.helpertext}>{this.state.currency_type.helperText}</Text>
    </Body>
  </ListItem>
):null}

{this.state.currency_type.value === "usd" ? (
  <ListItem style={fstyles.formContainer}>
      <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Provisional Exchange Rate:</Label></Left>
      <Body style={fstyles.formBody}>  
        <Item style={styles.disable} >
          <Input disabled={true} value={this.state.currency_rate.value} onChangeText={(text) => this._handlechange('currency_rate',text)} keyboardType="numeric"/>
          <FontAwesome name='rupee' style={fstyles.formIcon} />
        </Item>
        <Text style={gstyles.helpertext}>{this.state.currency_rate.helperText}</Text>
      </Body>
  </ListItem>
):null}

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Rate(PMT):</Label></Left>
  <Body style={fstyles.formBody}>
    <Item style={styles.disable} >
      <Input disabled={true} value={this.state.purchase_rate.value} onChangeText={(text) => this._handlechange('purchase_rate',text)} keyboardType="numeric"/>
        {this.state.currency_type.value == "usd" ? 
          (<FontAwesome name='usd' style={fstyles.formIcon} />):
          (<FontAwesome name='rupee' style={fstyles.formIcon} />)
        }
    </Item>
    <Text style={gstyles.helpertext}> {this.state.purchase_rate.helperText} </Text>
  </Body>
</ListItem>

{this.state.currency_type.value == "usd" &&
<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Purchase Rate (in Inr):</Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable} >
      <Input disabled={true} value={this.state.purchase_rate_in_inr.value}  keyboardType="numeric"/>
      <FontAwesome name='rupee' style={fstyles.formIcon} />
    </Item>
    <Text style={gstyles.helpertext}>{this.state.purchase_rate_in_inr.helperText}</Text>
  </Body>
</ListItem>
}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Clearance Cost:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Input disabled={true} value={this.state.clearance_cost.value} onChangeText={(text) => this._handlechange('clearance_cost',text)} keyboardType="numeric"/>
        <FontAwesome name='rupee' style={fstyles.formIcon} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.clearance_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Finance Cost:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Input disabled={true} value={this.state.finance_cost.value} onChangeText={(text) => this._handlechange('finance_cost',text)} keyboardType="numeric"/>
        <FontAwesome name='rupee' style={fstyles.formIcon} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.finance_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}




{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>Custom Duty Cost:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Input disabled={true} value={this.state.custom_duty_cost.value} onChangeText={(text) => this._handlechange('custom_duty_cost',text)} keyboardType="numeric"/>
        <FontAwesome name='rupee' style={fstyles.formIcon} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.custom_duty_cost.helperText}</Text>
    </Body>
  </ListItem>
):null}

{!!this.state.import_flag ? (
  <ListItem style={fstyles.formContainer}>
    <Left style={fstyles.formLeft}><Label style={styles.inputlabel}>CESS:</Label></Left>
    <Body style={fstyles.formBody}>
      <Item style={styles.disable}>
        <Input disabled={true} value={this.state.cess.value} onChangeText={(text) => this._handlechange('cess',text)} keyboardType="numeric"/>
        <FontAwesome name='rupee' style={fstyles.formIcon} />
      </Item>
      <Text style={gstyles.helpertext}>{this.state.cess.helperText}</Text>
    </Body>
  </ListItem>
):null}

<ListItem style={fstyles.formContainer}>
  <Left style={fstyles.formLeft}><Label style={styles.inputlabel}> Total Amount: </Label></Left>
  <Body style={fstyles.formBody}>  
    <Item style={styles.disable}>
      <Input disabled={true} value={this.state.total_amount.value} onChangeText={(text) => this._handlechange('total_amount',text)} keyboardType="numeric" />
      <FontAwesome name='rupee' style={fstyles.formIcon} />
    </Item>
    <Text style={gstyles.helpertext}> {this.state.total_amount.helperText} </Text>
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
                <Button onPress={ () => this._singleupdate('verify') } success  style={{display:this._renderButtons('verify')}}>
                    <Text>Verify</Text>
                </Button>
            </View>
        </Container>
        );
        }
    }

};
const mapStateToProps = (state) => {
    return {
      user: state.user,
    };
};
export default (connect(mapStateToProps)(PurchaseVerifyDetails));