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
           selectionIds = helper.getBatchIds(component);
           tableAuraId = "batch";
        }
        helper.markTableItemsAsSelected(selectionIds, tableAuraId, component);
        helper.fireBatchInfoEvent(component);
    },


    handleSaveInlineEditsEvent : function(component, event, helper){
        var tableAuraId = helper.getTableAuraId(event);
        var updatedData = helper.getUpdatedData(component, event, tableAuraId); 
        helper.saveInlineEdits(component, updatedData[0], updatedData[1], tableAuraId);
    }
})
