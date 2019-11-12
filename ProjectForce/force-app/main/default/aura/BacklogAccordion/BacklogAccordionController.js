({
    doInit : function(component, event, helper) {
        // Retrieve records from server-side controller
        var action = component.get('c.getBacklogs');
        action.setCallback(this, function(response) {
            if (response.getState() === 'SUCCESS') {
                component.set('v.records', response.getReturnValue());
                console.log(response.getReturnValue());

                // Retrieve accordion categories
                let categories = [];
                response.getReturnValue().forEach(function(record) {
                    if (record.Stage__c && categories.indexOf(record.Stage__c) === -1) {
                        categories.push(record.Stage__c);
                    }
                });
                component.set('v.categories', categories);
                console.log(categories);
            }
        });
        $A.enqueueAction(action);        
    },
    selectNew : function(component, event, helper) {
        alert("new backlog modal goes here");
    },
    handleOpenAll: function (component) {
        component.find("accordion").set('v.activeSectionName', component.get('v.categories'));
    },
    handleCloseAll: function (component) {
        component.find("accordion").set('v.activeSectionName', '');
    }
})
