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

                    $A.get("e.force:refreshView").fire();
                }
            });

		$A.enqueueAction(deleteCardAction);  
	},

	updateStory : function(component, event, helper) {
		var cardId = component.get('v.backlogId');
		var story = component.get('v.Story');

		var updateCardAction = component.get('c.updateCard');

		updateCardAction.setParams({
                "card" : cardId,
				"story" : story });
				
				updateCardAction.setCallback(this, function (response) {
                var state = response.getState();
                if (state === "SUCCESS"){

                    $A.get("e.force:refreshView").fire();
                }
            });

		$A.enqueueAction(updateCardAction);  
	},
})