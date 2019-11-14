({
	doInit: function(component, event, helper){
		//component.set("v.labelColor", component.get("v.backlog.CardLabel__r.Color__c"));
        //var backlog = component.get("v.backlog");
        // action.setParams({backlog: backlog });
        // // Add callback behavior for when response is received
        // action.setCallback(this, function (response) {
        //     var state = response.getState();
        //     if (state === "SUCCESS") {
        //         console.log(response.getReturnValue())
        //         component.set("v.cardlabels", response.getReturnValue());
        //     }
        //     else {
        //         console.log("Failed with state: " + state);
        //     }
        // });
        
        // // Send action off to be executed
        // $A.enqueueAction(action);
	},
	
	onDragStart : function(component, event, helper) {
		event.dataTransfer.dropEffect = "move";
        var backlog = component.get('v.backlog');
      	event.dataTransfer.setData('draggedBacklog', JSON.stringify(backlog));
	},
	// toggle : function(component, event, helper){
	// 	component.set("v.showLabel", !component.get("v.showLabel"))
	// }
})