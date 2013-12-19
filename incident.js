function Form_onload() {

    if (Xrm.Page.ui.getFormType() == 1) {
        LoadSubjects();
    }
    else {
        LoadSubjects();
        if (Xrm.Page.getAttribute("subjectid").getValue() != null) {
            $('#new_subject').val(Xrm.Page.getAttribute("subjectid").getValue()[0].id.replace('{', '').replace('}', '').toLowerCase());
        }
    }
}


function LoadSubjects() {
    retrieveRecord();
    return true;
}

function retrieveRecord() {
    // Get Server URL
    var serverUrl = Xrm.Page.context.getServerUrl();
    //The OData end-point
    var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
    //Asynchronous AJAX function to Retrieve a CRM record using OData
    $.ajax({
        async: false,
        type: "GET",
        contentType: "application/json; charset=utf-8",
        datatype: "json",
        url: serverUrl + ODATA_ENDPOINT + "/SubjectSet?$select=SubjectId,Title",
        beforeSend: function (XMLHttpRequest) {
            //Specifying this header ensures that the results will be returned as JSON.
            XMLHttpRequest.setRequestHeader("Accept", "application/json");
        },
        success: function (data, textStatus, XmlHttpRequest) {
            readRecord(data, textStatus, XmlHttpRequest)
        },
        error: function (XmlHttpRequest, textStatus, errorThrown) {
            alert("Error – " + errorThrown)
        }
    });
}



function readRecord(data, textStatus, XmlHttpRequest) {
    var account = data;
    if (account != null) {
        for (var i = 0; i < account.d.results.length; i++) {
            AddOptionSet(account.d.results[i].SubjectId, account.d.results[i].Title);
        }
    }
}


function AddOptionSet(value, text) {

    $('#new_subject').append('<option value=' + value + '>' + text + '</option>');
}

function Form_onsave(executionObj) {

    if (Xrm.Page.getAttribute("subjectid").getValue() == "" || Xrm.Page.getAttribute("subjectid").getValue() == null) {
        alert('You must provide a value for Requestor Type.');
        // Cancel the save operation.        
        Xrm.Page.getControl("new_subject").setFocus(true);
        executionObj.getEventArgs().preventDefault();
    }
    //$('#new_subject').html('');    
}


//Call this to set Subject on change of custom Subject Field
function SetOwnerUser(title, subjectId) {
    //Create an array to set as the DataValue for the lookup control.
    var lookupData = new Array();
    //Create an Object add to the array.
    var lookupItem = new Object();
    //Set the id, typename, and name properties to the object.
    lookupItem.id = subjectId;
    lookupItem.entityType = "subject";
    lookupItem.name = title;
    // Add the object to the array.
    lookupData[0] = lookupItem;
    // Set the value of the lookup field to the value of the array.
    Xrm.Page.getAttribute("subjectid").setValue(lookupData);
}

function new_subject_onchange() {

    if ($('#new_subject').val() != '') {
        SetOwnerUser($('#new_subject option:selected').text(), $('#new_subject').val());
    }
    else {
        Xrm.Page.getAttribute("subjectid").setValue(null);
    }
}