import fetchdata from './api';
const sales = {
    uploadform : async function(params){
        //console.log("In Upload form api");
        //console.log(params);
        var result = await fetchdata('POST', '/salesupload', JSON.stringify(params), 'application/json');
        if(result !== false){
            //console.log("Printing result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in Updating the form");
            return false;
        }
    },
    findall: async function(params){
        //console.log("Finding all the data");
        var result = await fetchdata('POST','/salesfindall',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Result received");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    },
    countall: async function(params){
        //console.log("Finding all the data");
        var result = await fetchdata('POST','/salescountall',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    },
    singleupdate: async function(params){
        //console.log("Sending Accept request");
        var result = await fetchdata('POST','/salessingleupdate',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    },
    update: async function(params){
        //console.log("Sending Accept request");
        var result = await fetchdata('POST','/salesupdate',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    },
    pendingpurchase:async function(params){
        //console.log("Sending Pending Purchase update");
        var result = await fetchdata('POST','/pendingpurchase',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    },
    unlink:async function(params){
        var result = await fetchdata('POST','/unlink',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            console.log("Error in retreiving the data");
            return false;
        }
    }
}

export default sales;