({
    doInit : function(component, event, helper) {
        // Retrieve records from server-side controller
        var action = component.get('c.getKanbanColumns');
        var project = component.get("v.project");
        action.setParams({'project': project });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                // Retrieve accordion categories
                let categories = [];
                
                response.getReturnValue().forEach(function(record) {
                    //if (record.Label__c && categories.indexOf(record.Label__c) === -1) {
                        categories.push(record.Label__c);
//} 
                });
                component.set('v.categories', categories);
/*
                component.set('v.records', response.getReturnValue());
                component.set('v.recordsBackup', response.getReturnValue());
                component.set("v.showSaveCancelBtn",false);
                */
            }
        });

        /* var actionGetCards = component.get('c.getBacklogsProject');
        actionGetCards.setParams({'projectId': project });
        actionGetCards.setCallback(this, function(response2) {
            if (response2.getState() === 'SUCCESS') {
                //alert(response.getState());
                component.set('v.records', response2.getReturnValue());
                component.set('v.recordsBackup', response2.getReturnValue());
                component.set("v.showSaveCancelBtn",false);
            }
        });

        $A.enqueueAction(actionGetCards);   */       
        $A.enqueueAction(action); 
        
    },

    selectNew : function() {
        alert("new backlog modal goes here");
    },

    handleOpenClose : function(component) {
        let button = component.find("accordion")
        let sections = button.get('v.activeSectionName') ? '' : component.get('v.categories');
        button.set('v.activeSectionName', sections);
    },

    filter : function(component, event, helper) {
        let criteria = component.get('v.criteria');
        let recordsBackup = component.get('v.recordsBackup');
        let today = new Date();
        let filteredRecords = [];

        switch(criteria) {
            case 'dueNextWeek':
                today.setDate(today.getDate() + 7);
            case 'dueThisWeek':
                filteredRecords = recordsBackup.filter(
                    element=> helper.getWeek(element.DueDate__c, today)
                );
                component.set('v.records', filteredRecords);
                break;
            default:
                component.set('v.records', recordsBackup);
        }
    },
    
    sort : function(component, event, helper) {
        let order = component.get('v.order');
        let records = component.get('v.records');
        switch(order) {
            case 'nameAZ':
                records.sort((a, b)=> (a.Story__c > b.Story__c) ? 1 : -1);
                break;
            case 'nameZA':
                records.sort((a, b)=> (a.Story__c < b.Story__c) ? 1 : -1);
                break;
            case 'dueDateNew':
                records.sort((a, b)=> (a.DueDate__c > b.DueDate__c) ? 1 : -1);
                break;
            case 'dueDateOld':
                records.sort((a, b)=> (a.DueDate__c < b.DueDate__c) ? 1 : -1);
                break;
        }
        component.set('v.records', records);
    },
    
    saveEdits : function(component,event,helper){
        var action = component.get("c.saveBacklogs");
            action.setParams({
            'backlogs': component.get("v.records")
        });
        action.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var storeResponse = response.getReturnValue();
                component.set("v.records", storeResponse); 
                component.set("v.showSaveCancelBtn",false);
                var toastEvent = $A.get("e.force:showToast");
                toastEvent.setParams({
                    "title": "Success!",
                    "message": "The record has been updated successfully."
                });
                toastEvent.fire();
                var sorter = component.get('c.sort');
                var filterer = component.get('c.filter');
                $A.enqueueAction(sorter);
                $A.enqueueAction(filterer);
            }
        });
        $A.enqueueAction(action);
    }
})