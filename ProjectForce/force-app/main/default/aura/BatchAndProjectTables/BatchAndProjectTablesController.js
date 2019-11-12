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


    handleSaveInlineEditsEvent : function(component, event, helper){
        var modifiedElements = event.getParam("editedItems");
        var newTableData = component.find("batch").get("v.data");
        var dataToUpdate = [{}];
        var keys = Object.keys(newTableData[0]);
        for(let i=0;i<modifiedElements.length;i++){
            var rowNumber = modifiedElements[i].id.split('-')[1];
            dataToUpdate[i].Id = newTableData[rowNumber].Id;
            for(let j=0;j<keys.length;j++){
                var currentKey = keys[j];
                if(modifiedElements[i][currentKey] && modifiedElements[i][currentKey]!='id'){
                    dataToUpdate[i][currentKey] = modifiedElements[i][currentKey];
                    newTableData[rowNumber][currentKey] = modifiedElements[i][currentKey];
                }
            }
        }
       helper.saveInlineEdits(component, dataToUpdate, newTableData);
    }
})
