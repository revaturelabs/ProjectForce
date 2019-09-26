({
	trainer : function(component, event) {
		var action = component.get("c.getTrainer");
		var location = component.get("v.selectedLocation");
		var track = component.get("v.selectedTrack");
		action.setParams({locationName:location, trackName:track});
		action.setCallback(this, function(response){
		var state = response.getState();
		if(state === "SUCCESS"){
			component.set("v.Trainer", response.getReturnValue());
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
},

	location : function(component, event) {
		var action = component.get("c.getLocation");
		action.setCallback(this, function(response){
		var state = response.getState();
		if(state === "SUCCESS"){
			component.set("v.Loc", response.getReturnValue());
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
},


	track : function(component, event) {
			var action = component.get("c.getTrack");		
			action.setCallback(this, function(response){
			var state = response.getState();
			if(state === "SUCCESS"){
				component.set("v.Track", response.getReturnValue());
			}
			else{
				console.log("Failed with state: "+state);
			}
			
			
		});
		
		$A.enqueueAction(action);
},

	room : function(component, event) {
		var action = component.get("c.getRoom");
        var location = component.get("v.selectedLocation");
		action.setParams({locationName:location});
		action.setCallback(this, function(response){
		var state = response.getState();
		if(state === "SUCCESS"){
			component.set("v.Room", response.getReturnValue());
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});

	$A.enqueueAction(action);
	},

	project : function(component, event) {
		var action = component.get("c.getProject");
		action.setParams({trackName:"Salesforce"});
		action.setCallback(this, function(response){
		var state = response.getState();
		if(state === "SUCCESS"){
			component.set("v.Project", response.getReturnValue());
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
}


})