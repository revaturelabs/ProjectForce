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
<<<<<<< HEAD
    },

    /**
     * initalize the tables to have current projects selected by default
     * @param {} component 
     * @param {*} event 
     * @param {*} helper 
     */
    initSelections : function(component,event,helper){
        let tableName='batch';
        if(event.getParam('TableName')==tableName){
            let updateList=[];
            
            let tableData=component.find(tableName).get('v.data');
            
            let today=new Date();
            
            for(let i=0;i<tableData.length;i++){
                let startDate=new Date(tableData[i].ProjectStartDate__c);
                let endDate=new Date(tableData[i].End_Date__c);
                if(startDate.getTime()<=today.getTime() && endDate.getTime()>=today.getTime()){
                    updateList.push(tableData[i].Id);
                }

            }
            helper.markTableItemsAsSelected(updateList,tableName,component);
        	helper.fireBatchInfoEvent(component);
        }
=======
>>>>>>> parent of 195d3cd... Added event and event throwing for when tables finish loading
    }
})