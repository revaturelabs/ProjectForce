({
    doInit: function (component, event, helper) {
        var action = component.get("c.getBacklogs");
        var project = component.get("v.project");
        action.setParams({project: project });
        // Add callback behavior for when response is received
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                console.log(response.getReturnValue())
                component.set("v.backlogs", response.getReturnValue());
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        
        // Send action off to be executed
        $A.enqueueAction(action);
    },

    droppedHandler: function (component, event, helper) {
        var title = event.getParam('title');
        var backlog = event.getParam('backlog');
        var listOfBacklogs = component.get('v.backlogs');


        var theBacklog = listOfBacklogs.find(function (el) {
            return el.Story__c == backlog.Story__c;
        });
        if (theBacklog) {
            theBacklog.Stage__c = title;
            component.set('v.backlogs', listOfBacklogs);

            // update database
            var action = component.get("c.saveBacklog");
            action.setParams({
                "backlog": theBacklog
            });
            action.setCallback(this, function(response){
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('updated');
                }
            });
            $A.enqueueAction(action);
        } else {
            console.log('Could not find this', backlog);
        }
    },
    openModel: function (component, event, helper) {
            // for Display Model,set the "isOpen" attribute to "true"
            component.set("v.isOpen", true);
        },

        closeModel: function (component, event, helper) {
            // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
            component.set("v.isOpen", false);
        },

        saveCard: function (component, event, helper) {
            // Display alert message on the click on the "Like and Close" button from Model Footer 
            // and set set the "isOpen" attribute to "False for close the model Box.
            var Story = component.get('v.Story');
            alert(Story);




            
            component.set("v.isOpen", false);
        },


    
})