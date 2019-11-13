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
        var selectedRows = [];
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

    getBatchIds : function(component){
        var projects = component.find("project").get("v.data");
        var selectedProjects = component.find("project").find("table").get("v.selectedRows");
        var batchIds = [];
        var rowNumber;
        for(let i=0;i<selectedProjects.length;i++){
            rowNumber = selectedProjects[i].split('-')[1];
            for(let j=0;j<projects[rowNumber].Trainings__r.length;j++){
                batchIds.push(projects[rowNumber].Trainings__r[j].Id);
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
    },

    getTableAuraId : function(event){
        var modifiedTable = event.getParam("editedObject");
        var tableAuraId;
        if(modifiedTable==='Training__c'){
            tableAuraId = 'batch';
        }
        else if(modifiedTable==='Project__c'){
            tableAuraId = "project";
        }
        return tableAuraId;
    }, 

    getUpdatedData : function(component, event, tableAuraId){
        var modifiedElements = event.getParam("editedItems");
        var newTableData = component.find(tableAuraId).get("v.data");
        var dataToUpdate = [];
        var keys = Object.keys(newTableData[0]);
        for(let i=0;i<modifiedElements.length;i++){
            var rowNumber = modifiedElements[i].id.split('-')[1];
            dataToUpdate[i] = {};
            dataToUpdate[i].Id = newTableData[rowNumber].Id;
            for(let j=0;j<keys.length;j++){
                var currentKey = keys[j];
                var currentValue = modifiedElements[i][currentKey];
                if(currentValue && currentKey!='Id'){
                    dataToUpdate[i][currentKey] = currentValue;
                    newTableData[rowNumber][currentKey] = currentValue;
                }
            }
        }
        return [dataToUpdate, newTableData];
    }
})
