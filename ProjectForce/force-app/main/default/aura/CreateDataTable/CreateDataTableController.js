({
    init : function(component, event, helper) {
        helper.setColumns(component);
        helper.getTableData(component);
    },

    fireSelectedTableItemsEvent : function(component, event, helper){
        var selectedTableItemsEvent = component.getEvent("tableItemSelected");
        //component.find("table").set("v.selectedRows",[{"Name":"Test Training 25","Start_Date__c":"2019-11-26","Trainer__c":"a0521000001mIvoAAE","Id":"a0621000003BvVdAAK"}])
        selectedTableItemsEvent.setParams({
            "tableObject" : component.get("v.queryObject"),
            "selectedObjects" : event.getParam("selectedRows")
        });
        selectedTableItemsEvent.fire();
        
    },

    save : function(component, event, helper){
       
    }
})
