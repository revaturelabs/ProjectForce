({
    /**
     * create the datatable
     */
    init : function(component, event, helper) {
        helper.setColumns(component, helper);
        helper.getTableData(component, helper);
    },

    /**
     * When an item in the table is selected fire an event that includes the
     * object the table references and the rows that were selected
     */
    fireSelectedTableItemsEvent : function(component, event, helper){
        var selectedTableItemsEvent = component.getEvent("TableItemSelectedEvent");
        selectedTableItemsEvent.setParams({
            "tableObject" : component.get("v.queryObject"),
            "selectedRows" : event.getParam("selectedRows"),
        });
        selectedTableItemsEvent.fire();
    },

    /**
     * When an inline edit is made fire an event that contains the items that were changed
     */
    save : function(component, event, helper){
       var saveInlineEdits = component.getEvent("saveInlineEdits");
       saveInlineEdits.setParams({
            "editedObject" : component.get("v.queryObject"),
            "editedItems": event.getParam("draftValues"),
            "selectedRows" : component.find("table").get("v.selectedRows")
       });
       saveInlineEdits.fire();
       component.find("table").set("v.draftValues", null);
    },
    
})