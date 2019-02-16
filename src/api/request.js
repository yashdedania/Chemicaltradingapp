import fetchdata from './api';
const request = {
    uploadform : async function(params){
        //console.log("In Upload form api");
        //console.log(params);
        var result = await fetchdata('POST', '/uploadform', JSON.stringify(params), 'application/json');
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
        var result = await fetchdata('POST','/findall',JSON.stringify(params),'application/json');
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
        var result = await fetchdata('POST','/countall',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            //console.log("Error in retreiving the data");
            return false;
        }
    },
    singleupdate: async function(params){
        //console.log("Sending Accept request");
        var result = await fetchdata('POST','/singleupdate',JSON.stringify(params),'application/json');
        if(result !== false){
            //console.log("Printing Result");
            //console.log(result);
            return result;
        }
        else{
            //console.log("Error in retreiving the data");
            return false;
        }
    },
    update: async function(params){
        //console.log("Sending Accept request");
        var result = await fetchdata('POST','/update',JSON.stringify(params),'application/json');
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

}

export default request;
