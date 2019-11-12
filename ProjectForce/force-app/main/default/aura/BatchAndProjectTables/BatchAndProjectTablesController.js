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
        var parameters = event.getParam("selectedRows");

        if(tableObject=="Training__c"){
            // get the list of project ids from the selected batches
            var projectIds = [];
            for(let i=0;i<parameters.length;i++){
                projectIds.push(parameters[i].Project__c);
            }
            helper.markTableItemsAsSelected(projectIds, "project", component);
        }
        else if(tableObject=="Project__c"){
            // get the list of batch ids from the selected projects
            var batchIds = [];
            for(let i=0;i<parameters.length;i++){
                if(parameters[i].Trainings__r){
                    for(let j=0;j<parameters[i].Trainings__r.length;j++){
                        batchIds.push(parameters[i].Trainings__r[j].Id);
                    }
                }
            }
            helper.markTableItemsAsSelected(batchIds, "batch", component);
        }
    },

    handleSaveInlineEditsEvent : function(component, event, helper){
        alert(JSON.stringify(event.getParam("editedItems")));
    }
})
