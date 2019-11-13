({
    /**
     * create the datatable
     * @param {*} component 
     * @param {*} event 
     * @param {*} helper 
     */
    init : function(component, event, helper) {
        helper.setColumns(component, helper);
        helper.getTableData(component, helper);
    },

    /**
     * When an item in the table is selected fire an event that includes the
     * object the table references and the rows that were selected
     * @param {*} component 
     * @param {*} event 
     * @param {*} helper 
     */
    fireSelectedTableItemsEvent : function(component, event, helper){
        console.log("fireSelectedTableItemsEvent");
        var selectedTableItemsEvent = component.getEvent("TableItemSelectedEvent");
        // var selectedTableItemsEvent = $A.get("e.c:TableItemSelectedEvent");
        selectedTableItemsEvent.setParams({
            "tableObject" : component.get("v.queryObject"),
            "selectedRows" : event.getParam("selectedRows"),
        });
        selectedTableItemsEvent.fire();
    },

    /**
     * when an inline edit is made fire an event that contains the items that were changed
     * @param {*} component 
     * @param {*} event 
     * @param {*} helper 
     */
    save : function(component, event, helper){
       var saveInlineEdits = component.getEvent("saveInlineEdits");
       saveInlineEdits.setParams({
            "editedObject" : component.get("v.queryObject"),
            "editedItems": event.getParam("draftValues")
       });
       saveInlineEdits.fire();
       component.find("table").set("v.draftValues", null);
    },

    
})
