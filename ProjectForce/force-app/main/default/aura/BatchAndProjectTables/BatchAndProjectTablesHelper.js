({
    /**
     * given a list of ids, select those items on the table
     * @param {List} selectionIds list of ids
     * @param {String} selectionTableId aura:id of the table you want selected
     * @param {*} component 
     */
    markTableItemsAsSelected : function(selectionIds, tableAuraId, component){
        var selectionTable = component.find(tableAuraId).find("table");
        var tableData = component.find(tableAuraId).get("v.data");
        var selectedRows = selectionTable.get("v.selectedRows");

        for(let i=0;i<tableData.length;i++){
            if(selectionIds.includes(tableData[i].Id)){
                selectedRows.push(`row-${i}`);
            }
        }
        selectionTable.set("v.selectedRows", selectedRows);
    },

    getProjectIds : function(event){
        var parameters = event.getParam("selectedRows");
        var projectIds = [];
        for(let i=0;i<parameters.length;i++){
            projectIds.push(parameters[i].Project__c);
        }
        return projectIds;
    },

    getBatchIds : function(event){
        var parameters = event.getParam("selectedRows");
        var batchIds = [];
        for(let i=0;i<parameters.length;i++){
            if(parameters[i].Trainings__r){
                for(let j=0;j<parameters[i].Trainings__r.length;j++){
                    batchIds.push(parameters[i].Trainings__r[j].Id);
                }
            }
        }
        return batchIds;
    },

    fireBatchInfoEvent : function(component){
        var selectedRows = component.find("batch").find("table").get("v.selectedRows");
        var batchData = component.find("batch").get("v.data");
        var selectedBatches = [];
        for(let i=0;i<batchData.length;i++){
            if(selectedRows.includes(`row-${i}`)){
                selectedBatches.push(batchData[i]);
            }
        }
        var batchInfoEvent = component.getEvent("batchInfoEvent");
        batchInfoEvent.setParams({
            "batchInfo" : selectedBatches
        });
        batchInfoEvent.fire();
    }, 

    saveInlineEdits : function(component, dataToUpdate, newTableData, tableAuraId){
        var updateTableData = component.get("c.updateTableData");
        
        updateTableData.setParams({
            "itemsToUpdate" : dataToUpdate
        });

        updateTableData.setCallback(this, function(response){
            var state = response.getState();
            
            if(state==="SUCCESS"){
                component.find(tableAuraId).set("v.data", newTableData);
            }
            else if(state==="ERROR"){
                let errors = response.getError();
                let message = 'Unknown error'; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                // Display the message
                console.error(message);
            }
        })
        $A.enqueueAction(updateTableData);
    }
})
