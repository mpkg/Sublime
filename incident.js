// JScript source code
function Form_onload() {
    debugger
    if (Xrm.Page.ui.getFormType() == 1) {
        LoadSubjects();
    }
    else {
        LoadSubjects();
        if (Xrm.Page.getAttribute("subjectid").getValue() != null) {
            Xrm.Page.getAttribute("new_subject").setValue((Xrm.Page.getAttribute("subjectid").getValue()[0]).id);
        }
    }
}


function LoadSubjects() {
    retrieveRecord();
    return true;
}



//Remove all options from owner user dropdown.
function RemoveAllOptions() {
    var optionsLength = Xrm.Page.getAttribute("new_subject").getOptions().length;
    for (var i = optionsLength; i > 0; i--) {
        Xrm.Page.getControl('new_subject').removeOption(i);
    }
}


function retrieveRecord() {
    // Get Server URL
    var serverUrl = Xrm.Page.context.getServerUrl();
    //The OData end-point
    var ODATA_ENDPOINT = "/XRMServices/2011/OrganizationData.svc";
    //Asynchronous AJAX function to Retrieve a CRM record using OData
    $.ajax({
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
    var myNewOption = document.createElement("new_subject");
    myNewOption.value = value;

    myNewOption.text = text;
    Xrm.Page.getControl("new_subject").addOption(myNewOption);
}

function Form_onsave() {
    debugger
    if (Xrm.Page.getAttribute("new_subject").getValue() == "" || Xrm.Page.getAttribute("new_subject").getValue() == null) {
        alert('You must provide a value for Requestor Type.');
        // Cancel the save operation.
        event.returnValue = false;
        Xrm.Page.getControl("new_subject").setFocus(true);
        return false;
    }
    RemoveAllOptions();
    if (Xrm.Page.data.entity.getIsDirty() != true) {
        if (event.Mode == 1) {
            LoadSubjects();
            if (Xrm.Page.getAttribute("subjectid").getValue() != null) {
                Xrm.Page.getAttribute("new_subject").setValue((Xrm.Page.getAttribute("subjectid").getValue()[0]).id);
            }
            event.returnValue = false;
            return false;
        }
    }
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
    debugger
    if (Xrm.Page.getAttribute("new_subject").getValue() != null) {
        SetOwnerUser(Xrm.Page.getAttribute("new_subject").getSelectedOption().text, Xrm.Page.getAttribute("new_subject").getValue());
    }
    else {
        Xrm.Page.getAttribute("subjectid").setValue(null);
    }
}