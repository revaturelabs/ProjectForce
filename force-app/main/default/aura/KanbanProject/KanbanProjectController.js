({
    doInit: function (component, event, helper) {
        // store apex controller method to a variable
        var action = component.get("c.getBacklogsProject");
        action.setParams({ 'projectId' : component.get("v.project") });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.backlogs", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        });


        var actionGetColumns = component.get("c.getKanbanColumns");

        // store given project to a variable
        // a kanban project controller shows the backlog of one project
        // v.project is a required attribute

        // Call Apex method to return Kanban Columns
        actionGetColumns.setParams({ 'project' : component.get("v.project") });
        actionGetColumns.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.kanbanColumns", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        });

        component.set('v.EndDate','10/10/2019');
        
        // Call Apex and get the list of Order Options
        // Set v.kanbanOrder 
        var getOrderAction = component.get("c.getOrderOptions");
        getOrderAction.setParams({ 'project' : component.get("v.project") });
        getOrderAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.kanbanOrder", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        })

        $A.enqueueAction(action);
        $A.enqueueAction(actionGetColumns);
        $A.enqueueAction(getOrderAction);
    },

    /*
    * Handles the event fired by a Kanban Column. A Kanban column fires this event whena card is dragged over it
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
        var listOfBacklogs = component.get('v.backlogs');
        
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
                var pr = theBacklog.PullRequest__c;
                //if pr contains any value
                if (pr) {
                    var prContainsPull = pr.includes('pull');

                    if (prContainsPull) {
                        // if a card is dragged to the Done Column without having startdatetime
                        if (theBacklog.StartDateTime__c == null) {
                            // set start date to today
                                theBacklog.StartDateTime__c = today;
                            }  
                            // set end date to today
                            theBacklog.EndDateTime__c = today;
                    }else{
                        console.log('pull request is',theBacklog.PullRequest__c);
                        theBacklog.Stage__c="Doing";
                        alert('Add the pull request url');
                        component.set("v.backlogs", listOfBacklogs);
                    }
                } else {
                    console.log('pull request is',theBacklog.PullRequest__c);
                    theBacklog.Stage__c="Doing";
                    alert('Add the pull request url');
                    component.set("v.backlogs", listOfBacklogs);
                }

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

    // Model for adding a column
    openModel: function (component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        helper.openModel(component);

        var lab2 = component.find("label2");
        console.log(lab2);

        $A.util.addClass(lab2, 'toggle');
        // component.get("label3").className = "slds-hidden";
        // console.log(component.find("label2"));
        
        
    },

    // action for closing the add column model
    closeModel: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        helper.closeModel(component);

    },

    // Model for deleting a column
    openModelDeleteTheColumn: function (component, event, helper) {
        // for Display Model,set the "isOpenDeleteColumn" attribute to "true"

        helper.openModelDelCol(component);

        var lab2 = component.find("label2");
        console.log(lab2);

        $A.util.addClass(lab2, 'toggle');
        // component.get("label3").className = "slds-hidden";
        // console.log(component.find("label2"));

    },

    // action for closing the delete column model
    closeModelDeleteTheColumn: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpenDeleteColumn" attribute to "Fasle"  
        helper.closeModelDelCol(component);

    },

    saveColumn: function (component, event, helper) {
        
            var stage = component.get('v.stage');
            var project = component.get('v.project');
            var order = component.get('v.selectedOrderValue');

            console.log('Stage: ' + stage);
          
            var savingColumnAction = component.get("c.addNewColumn");

            savingColumnAction.setParams({
                "stage": stage,
                "project": project,
                "order": order
            });

            savingColumnAction.setCallback(this, function (response) {
                var state = response.getState();

                if (state === "SUCCESS"){
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "message": "New column added to kanban board."
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
                        "message": "New column could not be added to kanban board"
                    });
                    toastEvent.fire();
                }
            });

           $A.enqueueAction(savingColumnAction);  
    },

    deleteColumn: function (component, event, helper) {
    
        var project = component.get('v.project');
        var label = component.get('v.selectedValue');
        var action = component.get("c.removeColumn");

        action.setParams({ 
                            'label' : label,
                            'project': project 
                        });
        action.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "message": "Column deleted from kanban board."
                    });
                    toastEvent.fire();
                helper.closeModel(component);
                $A.get("e.force:refreshView").fire();
            } else {
                var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Failed",
                        "message": "Column could not be deleted to kanban board"
                    });
                    toastEvent.fire();
            }
        });
    
        $A.enqueueAction(action);
    },
})