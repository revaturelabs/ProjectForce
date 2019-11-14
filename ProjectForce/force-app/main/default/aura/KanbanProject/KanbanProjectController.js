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
        var backlog = event.getParam('backlog'); //title and backlog after drag
        var listOfBacklogs = component.get('v.backlogs');


        var theBacklog = listOfBacklogs.find(function (el) {// theBacklog is the one that we found
            return el.Story__c == backlog.Story__c; // using story instead of id
        });
        if (theBacklog) { //truthy
            theBacklog.Stage__c = title;
            component.set('v.backlogs', listOfBacklogs); //setting params

            //setting the date
           var today = new Date();
           if(title == 'Doing'){
                theBacklog.StartDateTime__c=today;
                theBacklog.EndDateTime__c=null;
            }else if(title == 'Done'){
                if(theBacklog.StartDateTime__c==null){
                    theBacklog.StartDateTime__c=today;
                }
                theBacklog.EndDateTime__c=today;
            }else if(title == 'To Do'){
                theBacklog.StartDateTime__c=null;
                theBacklog.EndDateTime__c=null;
            }

            // update database
            var action = component.get("c.saveBacklog");
            action.setParams({ // setting params for apex controller
                "backlog": theBacklog //setting in apex controller class
            });
            action.setCallback(this, function(response){ // calling saveBacklog function
                var state = response.getState();
                if (state === "SUCCESS") {
                    console.log('updated');
                }
            });
            $A.enqueueAction(action);
        } else {
            console.log('Could not find this', backlog);
        }
    }
}) 