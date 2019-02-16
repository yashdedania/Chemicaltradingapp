const messages = {
    purchase : "\n 1.  Clearance Cost, CESS, Finance Cost, Custom Duty Cost should be in PMT\n"+
    "\n 2.  If Purchase Type = import  and currency is USD or AED then\n Total amount = ((Purchase Rate * Provisional Exchange Rate) + Clearance Cost + Finance Cost + Custom Duty Cost + CESS) * Quantity\n"+
    "\n 3.  If Purchase Type = import and currency is INR then provisional exchange rate will be 1 and same formula as point 2\n"+
    "\n 4.  If Purchase Type = regular then\n Total Amount = Purchase Rate * Quantity \n"+
    "\n 5.  Please fill all the details properly and in case of no data either enter 0 or NA",
    sales : "\n 1.  Clearance Cost, CESS, Finance Cost, Custom Duty Cost should be in PMT\n"+
    "\n 2.  If Sales Type = import  and currency is USD or AED then\n Total amount = ((Sales Rate * Provisional Exchange Rate) + Clearance Cost + Finance Cost + Custom Duty Cost + CESS) * Quantity\n"+
    "\n 3.  If Sales Type = import and currency is INR then provisional exchange rate will be 1 and same formula as point 2\n"+
    "\n 4.  If Sales Type = regular then\n Total Amount = Sales Rate * Quantity \n"+
    "\n 5.  Please fill all the details properly and in case of no data either enter 0 or NA"
};
export default messages;