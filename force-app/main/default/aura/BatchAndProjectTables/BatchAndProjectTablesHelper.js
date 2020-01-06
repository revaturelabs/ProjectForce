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

    /**
     * get a list of project ids based on selected batches
     * @param {*} event 
     */
    getProjectIds : function(event){
        var projectIds = [];
        var selectedBatches = event.getParam("selectedRows");
        for(let i=0;i<selectedBatches.length;i++){
            if(selectedBatches[i].Project__c){
               projectIds.push(selectedBatches[i].Project__c);
            }
        }
        return projectIds;
    },

    /**
     * get a list of the batch ids based on the selected projects
     * @param {*} event
     */
    getBatchIds : function(event){
        var batchIds = [];
        var selectedProjects = event.getParam("selectedRows");
        for(let i=0;i<selectedProjects.length;i++){
            if(selectedProjects[i].Trainings__r){
                for(let j=0;j<selectedProjects[i].Trainings__r.length;j++){
                    batchIds.push(selectedProjects[i].Trainings__r[j].Id);
                }
            }
        }
        return batchIds;
    },

    /**
     * get the information for the selected batches and fire the event
     * @param {*} component 
     */
    fireBatchInfoEvent : function(component){
        var selectedRows = component.find("batch").find("table").get("v.selectedRows");
        var batchData = component.find("batch").get("v.data");
        var selectedBatches = [];
        for(let i=0;i<batchData.length;i++){
            if(selectedRows.includes(`row-${i}`)){
                selectedBatches.push(batchData[i]);
            }
        }
        var batchInfoEvent = $A.get("e.c:BatchInformationEvent");
        batchInfoEvent.setParams({
            "batchInfo" : selectedBatches
        });
        batchInfoEvent.fire();
    }, 

    /**
     * commit the changed information to the database
     * @param {*} component 
     * @param {*} helper 
     * @param {Object[]} dataToUpdate - key value pairs of the changed data, needs the id of the updated items
     */
    saveInlineEdits : function(component, helper, dataToUpdate){
        var updateTableData = component.get("c.updateTableData");
        updateTableData.setParams({
            "itemsToUpdate" : dataToUpdate
        });

        updateTableData.setCallback(this, function(response){
            var state = response.getState();
            
            if(state==="SUCCESS"){
                // update the colors on the graph
                helper.fireBatchInfoEvent(component);
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

    /**
     * return the aura ids of the table based on wich object was edited
     * @param {*} event 
     */
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

    /**
     * get the object that contains what the values of what was changed
     * @param {*} component 
     * @param {*} event 
     * @param {String} tableAuraId - Id of the createDataTable component that was edited
     */
    getUpdatedData : function(component, event, tableAuraId){
        var modifiedElements = event.getParam("editedItems");
        var newTableData = component.find(tableAuraId).get("v.data");
        var dataToUpdate = [];
        var keys = Object.keys(newTableData[0]);
        
        //new variable to check for correct Color__c field hexadecimal values, Keaton C. 01/05/2020
        var selectedElements = event.getParam("selectedRows");
        
        //See: <c:CreateDataTable aura:id="batch" ... /> inside BatchAndProjectTables.cmp Aura Component file
        //check for correct range of Color__c field hexadecimal values inside the cObject Training__c, Keaton C. 01/05/2020
        for(let i=0;i<selectedElements.length;i++){
			var colorValue = selectedElements[i].Trainings__r.Color__c;
            dataToUpdate[i] = {};
            //check for validity of hexadecimal string in colorValue
            let test = RegExp('^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$');
            if(test.test(colorValue)){
                console.log('Hexadecimal Color: ' + colorValue);
            }else{
                console.log('Invalid Color, Setting Color to default value of Black, #FFFFFF');
                dataToUpdate[i].Trainings__r.Color__c = '#FFFFFF';
            }
        }
        
        for(let i=0;i<modifiedElements.length;i++){
            var rowNumber = modifiedElements[i].id.split('-')[1];
            dataToUpdate[i] = {};
            // have to update id here because modified elements id is the row id
            dataToUpdate[i].Id = newTableData[rowNumber].Id;
            for(let j=0;j<keys.length;j++){
                var currentKey = keys[j];
                var currentValue = modifiedElements[i][currentKey];
                if(currentValue && currentKey!='Id'){
                    dataToUpdate[i][currentKey] = currentValue;
                    // this updates the values in the datatable(not database) and is necessary
                    newTableData[rowNumber][currentKey] = currentValue;
                }
            }
        }
        return dataToUpdate;
    }
})