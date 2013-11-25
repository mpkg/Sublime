var url;
if (Xrm.Page.context.getClientUrl)//Post UR 12
{
    url = Xrm.Page.context.getClientUrl() + '/';
}
else//Pre UR 12
{
    url = Xrm.Page.context.getServerUrl();
}
var ODATA_URL = url + "XRMServices/2011/OrganizationData.svc";

function Form_onload() {

}
function parentcustomerid_onchange() {
    if (Xrm.Page.getAttribute("parentcustomerid") != null && Xrm.Page.getAttribute("parentcustomerid").getValue() != null
    && Xrm.Page.getAttribute("address2_name") != null && Xrm.Page.getAttribute("address2_name").getValue() == null) {
        var select = "Address1_Name,Address1_Telephone1,Address1_City,Address1_Line1,Address1_Line2,Address1_Line3,Address1_StateOrProvince,Address1_PostalCode,Address1_Country";
        var odataSetName = "AccountSet";
        var odataUri = ODATA_URL + "/" + odataSetName + "(guid'" + Xrm.Page.getAttribute("parentcustomerid").getValue()[0].id + "')?";
        odataUri += "$select=" + select;
        $.ajax({
            async: false,
            type: "GET",
            contentType: "application/json; charset=utf-8",
            datatype: "json",
            url: odataUri,
            beforeSend: function (XMLHttpRequest) {
                //Specifying this header ensures that the results will be returned as JSON.
                XMLHttpRequest.setRequestHeader("Accept", "application/json");
            },
            success: function (data, textStatus, XmlHttpRequest) {
                if (Xrm.Page.getAttribute("address2_name") != null) Xrm.Page.getAttribute("address2_name").setValue(data.d.Address1_Name);
                if (Xrm.Page.getAttribute("address2_telephone1") != null) Xrm.Page.getAttribute("address2_telephone1").setValue(data.d.Address1_Telephone1);
                if (Xrm.Page.getAttribute("address2_city") != null) Xrm.Page.getAttribute("address2_city").setValue(data.d.Address1_City);
                if (Xrm.Page.getAttribute("address2_line1") != null) Xrm.Page.getAttribute("address2_line1").setValue(data.d.Address1_Line1);
                if (Xrm.Page.getAttribute("address2_line2") != null) Xrm.Page.getAttribute("address2_line2").setValue(data.d.Address1_Line2);
                if (Xrm.Page.getAttribute("address2_line3") != null) Xrm.Page.getAttribute("address2_line3").setValue(data.d.Address1_Line3);
                if (Xrm.Page.getAttribute("address2_stateorprovince") != null) Xrm.Page.getAttribute("address2_stateorprovince").setValue(data.d.Address1_StateOrProvince);
                if (Xrm.Page.getAttribute("address2_postalcode") != null) Xrm.Page.getAttribute("address2_postalcode").setValue(data.d.Address1_PostalCode);
                if (Xrm.Page.getAttribute("address2_country") != null) Xrm.Page.getAttribute("address2_country").setValue(data.d.Address1_Country);
            },
            error: function (XmlHttpRequest, textStatus, errorThrown) {
                alert('OData Retrieve Failed: ' + odataUri);
            }
        });
    }
}
function address1_name_onchange() {

}
function new_professiontype_onchange() {
    var proValue;
    proValue = Xrm.Page.getAttribute("new_professiontype").getValue();
    Xrm.Page.getAttribute("new_professiontype2").setValue(proValue);
}
function new_group1_onchange() {    
}
function new_nyassembly_onchange() {
    var nyA = Xrm.Page.getAttribute("new_nyassembly");
    var ny1A = Xrm.Page.getAttribute("new_ny1assemblyname");
    if(ny1A!=null) ny1A.setValue(nyA.getValue());
}
function new_ny1assemblyname_onchange() {
    var nyA = Xrm.Page.getAttribute("new_nyassembly");
    var ny1A = Xrm.Page.getAttribute("new_ny1assemblyname");
    if (nyA != null) nyA.setValue(ny1A.getValue());
}