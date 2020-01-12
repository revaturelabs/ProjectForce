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

	allowDrop: function(component, event, helper) {
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
    },

    openModelAddCard: function (component, event, helper) {
        // for Display Model,set the "isOpen" attribute to "true"

        helper.openModelAddTheCard(component);

        var lab2 = component.find("label2");
        console.log(lab2);

        $A.util.addClass(lab2, 'toggle');

        // component.get("label3").className = "slds-hidden";
        // console.log(component.find("label2"));
    },

    closeModelAddCard: function (component, event, helper) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        helper.closeModelAddTheCard(component);

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

            var column = component.get('v.colId');

            var l1 = component.get('v.label1');
            var l2 = component.get('v.label2');
            var l3 = component.get('v.label3');

            var c1 = component.get('v.color1');
            var c2 = component.get('v.color2');
            var c3 = component.get('v.color3');
            var project = component.get('v.projectId');

            console.log('ColId: ' + column);
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
                "columnId" : component.get('v.columnId'),
                "story" : story,
                "l1" : l1,
                "l2": l2,
                "l3": l3,
                "c1": c1,
                "c2": c2,
                "c3": c3,
                "project": project });
            savingBacklogAction.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS"){

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

    updateStage : function(component, event, helper) {
		var stageId = component.get('v.columnId');
        var stage = component.get('v.title');
        var projId = component.get('v.projectId');

		var updateStageAction = component.get('c.updateColumn');

           

		updateStageAction.setParams({
                "stage" : stageId,
                "title" : stage,
                "projectId" :  projId});
				
				updateStageAction.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS"){

                    //component.set("v.backlogs", response.getReturnValue());
					// rerender the board or column
					/*
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Success",
                        "message": "New card added to kanban board."
                    });
					toastEvent.fire();
					*/
                    
                    $A.get("e.force:refreshView").fire();
                }
                else 
                {
					/*
                    var toastEvent = $A.get("e.force:showToast");
                    toastEvent.setParams({
                        "title": "Failed",
                        "message": "New card could not be added to kanban board"
                    });
					toastEvent.fire();
					*/
                }

            });

            $A.enqueueAction(updateStageAction);  
	},
})