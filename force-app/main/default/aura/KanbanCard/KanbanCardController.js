({
	doInit: function(component, event, helper){

		},
	
	onDragStart : function(component, event, helper) {
		event.dataTransfer.dropEffect = "move";
        var backlog = component.get('v.backlog');
      	event.dataTransfer.setData('draggedBacklog', JSON.stringify(backlog));
	},

	deleteCard : function(component, event, helper) {
		var cardId = component.get('v.backlogId');
		var story = component.get('v.Story');

		var deleteCardAction = component.get('c.removeCard');

           

		deleteCardAction.setParams({
                "card" : cardId,
				"story" : story });
				
				deleteCardAction.setCallback(this, function (response) {
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

            $A.enqueueAction(deleteCardAction);  
	},
})