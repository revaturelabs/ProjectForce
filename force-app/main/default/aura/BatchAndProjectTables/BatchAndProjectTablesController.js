({
    /**
     * when a batch or project is selected select the related items in the 
     * other table
     * @param {*} component 
     * @param {*} event 
     * @param {*} helper 
     */
    handleItemSelectedEvent : function(component, event, helper){
        var tableObject = event.getParam("tableObject");
        var selectionIds = [];
        var tableAuraId;
        if(tableObject=='Training__c'){
            selectionIds = helper.getProjectIds(event);
            tableAuraId = "project";
        }
        else if(tableObject=="Project__c"){
           selectionIds = helper.getBatchIds(event);
           tableAuraId = "batch";
        }
        helper.markTableItemsAsSelected(selectionIds, tableAuraId, component);
        helper.fireBatchInfoEvent(component);
    },

    /**
     * when an inline edit is made save the result to the database
     * @param {} component 
     * @param {*} event 
     * @param {*} helper 
     */
    handleSaveInlineEditsEvent : function(component, event, helper){
        var tableAuraId = helper.getTableAuraId(event);
        var updatedData = helper.getUpdatedData(component, event, tableAuraId); 
        helper.saveInlineEdits(component, helper, updatedData);
    }
})