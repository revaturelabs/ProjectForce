({
    doInit: function(component, event, helper) {
        var getBacklogsaction = component.get("c.getBacklogs");

        // set paramter: column ID
        // Call Apex Method to return list of backlogs
        getBacklogsaction.setParams({ 'columnId' : component.get("v.columnId") });
        getBacklogsaction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                component.set("v.backlogs", response.getReturnValue());
            } else {
                console.log("Failed with state: " + state);
            }
        });

        $A.enqueueAction(getBacklogsaction); 
    },

	/* allowDrop: function(component, event, helper) {
        event.preventDefault();
    },
    
    onDrop: function(component, event, helper) {
        event.preventDefault();
        var droppedOnColumnEvent = component.getEvent('droppedOnColumn');
        droppedOnColumnEvent.setParams({
            'title': component.get('v.title'),
            'backlog': JSON.parse(event.dataTransfer.getData('DraggedBacklog'))
        });
        droppedOnColumnEvent.fire();
    }, */

    openModelAddCard: function (component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"
        helper.openModelAddTheCard(component);
    },

    closeModelAddCard: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        helper.closeModelAddTheCard(component);
    },

    // Add a backlog or Card to the related Column
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
            var savingBacklogAction = component.get('c.addNewBacklog');

            savingBacklogAction.setParams({
                "columnId" : component.get('v.columnId'),
                "story" : story
                });

            savingBacklogAction.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS"){
                    // Set List of Backlogs or Cards
                    component.set("v.backlogs", response.getReturnValue());
                    // rerender the board or column
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "message": "New card added to kanban board."
                    });
                    toastEvent.fire();
                    
                    helper.closeModelAddTheCard(component);
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

    updateColumnName : function(component, event, helper) {
		var columnId = component.get('v.columnId');
        var stage = component.get('v.title');

		var updateStageAction = component.get('c.updateColumn');

		updateStageAction.setParams({
            "columnId" : columnId,
            "title" : stage });
				
        updateStageAction.setCallback(this, function (response) {
            var state = response.getState();
            if (state === "SUCCESS"){

            $A.get("e.force:refreshView").fire();
            }
        });

        $A.enqueueAction(updateStageAction);  
	},
})