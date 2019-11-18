({
    doInit: function (component, event, helper) {
        component.set("v.project", "a0321000003asAQAAY");
        // store apex controller method to a variable
        var action = component.get("c.getBacklogs");
        // store given project to a variable
        // a kanban project controller shows the backlog of one project
        // v.project is a required attribute
        var project = component.get("v.project");
        // set paramters to the apex controller method
        // and execute the action
        action.setParams({ project: project });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.backlogs", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(action);
        component.set('v.EndDate','10/10/2019');
    },

    /*
    * Handles the event fired by a Kanban Column. A Kanban column fires this event whena card is dragged over it
    *
    */
    droppedHandler: function (component, event, helper) {
        // get event parameters
        // the droppedOnColumn event has two attributes. 
        // They are set by the Kanban Column before firing it.
        
        // Get the column title
        var title = event.getParam("title");
        // Get the backlog record that is currently dragged
        var backlog = event.getParam("backlog");
        // get the current list of back logs
        var listOfBacklogs = component.get("v.backlogs");
        
        // try to find the backlog that is dragged in the current list of backlogs
        // if it is find theBacklog will contain the found object, otherwise theBacklog will be null
        var theBacklog = listOfBacklogs.find(function (el) {
            return el.Story__c == backlog.Story__c;
        });
        // if backlog was found in the current list of backlogs
        if (theBacklog) {
            //change its title
            theBacklog.Stage__c = title;
            // refresh v.backlogs by setting the updated list.
            component.set("v.backlogs", listOfBacklogs);

            // setting the date
            var today = new Date();
            // if new title is Doing
            if (title == "Doing") {
                // set start datetime
                theBacklog.StartDateTime__c = today;
                // remove end datetime because the task is not completed
                theBacklog.EndDateTime__c = null;
                // if a card is dragged to the "Done" column
            } else if (title == "Done") {
                // if a card is dragged to the Done Column without having startdatetime
                if (theBacklog.StartDateTime__c == null) {
                    // set start date to today
                    theBacklog.StartDateTime__c = today;
                }
                // set end date to today
                theBacklog.EndDateTime__c = today;
               // if a card is dragged to "To Do", it should  have start and end date
            } else if (title == "To Do") {
                theBacklog.StartDateTime__c = null;
                theBacklog.EndDateTime__c = null;
            }

            // update database
            var action = component.get("c.saveBacklog");
            action.setParams({
                backlog: theBacklog 
            });
            action.setCallback(this, function (response) {
                // calling saveBacklog function
                var state = response.getState();
            });
            $A.enqueueAction(action);
        } else {
            console.log("Could not find this ", backlog);
        }
    },
    openModel: function (component, event, helper) {
            // for Display Model,set the "isOpen" attribute to "true"

            helper.openModel(component);

            var lab2 = component.find("label2");
            console.log(lab2);

            $A.util.addClass(lab2, 'toggle');


            // component.get("label3").className = "slds-hidden";
            // console.log(component.find("label2"));

        },

    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        helper.closeModel(component);

    },

    saveCard: function (component, event, helper) {

        var story = component.get('v.story');

        if (story === undefined || story === "" ){
            var toastEvent = $A.get("e.force:showToast");
            toastEvent.setParams({
                "title": "Save Failed",
                "message": "Please make sure you have filled story."
            });
            toastEvent.fire();
        }

        else {

            var stage = component.get('v.stage');

            var l1 = component.get('v.label1');
            var l2 = component.get('v.label2');
            var l3 = component.get('v.label3');

            var c1 = component.get('v.color1');
            var c2 = component.get('v.color2');
            var c3 = component.get('v.color3');
            var project = component.get('v.project');

            console.log('Stage: ' + stage);
            console.log('Story: ' + story);
            console.log('Label 1: ' + l1);
            console.log('Label 2: ' + l2);
            console.log('Label 3: ' + l3);
            console.log('Color 1: ' + c1);
            console.log('Color 2: ' + c2);
            console.log('Color 3: ' + c3);



            var savingBacklogAction = component.get('c.addNewBacklog');

            console.log(savingBacklogAction);

            savingBacklogAction.setParams({
                "stage" : stage,
                "story" : story,
                "l1" : l1,
                "l2": l2,
                "l3": l3,
                "c1": c1,
                "c2": c2,
                "c3": c3,
                "project": project
            });



            savingBacklogAction.setCallback(this, function (response) {

                var state = response.getState();

                if (state === "SUCCESS"){

                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "message": "New card added to kanban board."
                    });
                    toastEvent.fire();
                    
                    helper.closeModel(component);
                    $A.get("e.force:refreshView").fire();
                }

                else 
                {
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Failed",
                        "message": "New card could not be added to kanban board"
                    });
                    toastEvent.fire();
                }

            });

            $A.enqueueAction(savingBacklogAction);
            
            
        }
        


        
    },


    
})