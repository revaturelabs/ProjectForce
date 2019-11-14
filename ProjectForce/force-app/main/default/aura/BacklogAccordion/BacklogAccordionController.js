({
    doInit : function(component, event, helper) {
        // Retrieve records from server-side controller
        var action = component.get('c.getBacklogs');
        var project = component.get("v.project");
        action.setParams({project: project });
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                // Retrieve accordion categories
                let categories = [];
                response.getReturnValue().forEach(function(record) {
                    if (record.Stage__c && categories.indexOf(record.Stage__c) === -1) {
                        categories.push(record.Stage__c);
                    } 

                    // Convert Date/Time to Date or Time
                    let d = new Date(record.StartDateTime__c);
                    record.StartDateTime__c = d.toLocaleDateString();
                    record['stime'] = d.toLocaleTimeString();
                    d = new Date(record.EndDateTime__c);
                    record.EndDateTime__c = d.toLocaleDateString();
                    record['etime'] = d.toLocaleTimeString();
                    d = new Date(record.DueDate__c);
                    record.DueDate__c = d.toLocaleDateString();
                });
                // component.set('v.categories', categories); // having trouble sorting
                component.set('v.records', response.getReturnValue());
                component.set('v.recordsBackup', response.getReturnValue());
            }
        });
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
        recordsBackup.forEach(function(element){
            helper.getWeek(element);
        });

        switch(criteria) {
            case 'my tasks':
                break;
            case 'neglected tasks':
                break;
            case 'due this week':
                break;
            case 'due next week':
                break;
        }
        component.set('v.records', recordsBackup);
    },
    sort : function(component, event, helper) {
        alert("sort function goes here");
    }
})