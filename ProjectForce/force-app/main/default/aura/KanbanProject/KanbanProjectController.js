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
        component.set('v.EndDate','10/10/2019');
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
            helper.openModel(component);
        },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        helper.closeModel(component);

    },

    saveCard: function (component, event, helper) {
        // Display alert message on the click on the "Like and Close" button from Model Footer 
        // and set set the "isOpen" attribute to "False for close the model Box.
        var stage = component.get('v.stage');
        var story = component.get('v.story');
        var l1 = component.get('v.label1');
        var l2 = component.get('v.label2');
        var l3 = component.get('v.label3');
        var c1 = component.get('v.color1');
        var c2 = component.get('v.color2');
        var c3 = component.get('v.color3');


        if (story === undefined || story === "" ){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Save Failed",
                "message": "Please make sure you have filled story."
            });
            toastEvent.fire();
        }

        else {

            console.log('Stage: ' + stage);
            console.log('Story: ' + story);
            console.log('Label 1: ' + l1);
            console.log('Label 2: ' + l2);
            console.log('Label 3: ' + l3);
            console.log('Color 1: ' + c1);
            console.log('Color 2: ' + c2);
            console.log('Color 3: ' + c3);
            helper.closeModel(component);

        }
        


        
    },


    
})