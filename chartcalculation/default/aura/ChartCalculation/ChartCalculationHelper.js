({
	countProjects : function(component, event) {
		
		//sets veriables by getting info from the view component

		//calls to method in the apex controller
		var action = component.get("c.getTrainingsWithProjects");
			
		//response from the apex method
		action.setCallback(this, function(response){
		
		var state = response.getState();
		
		//storing return value
		let trainer = response.getReturnValue();

		if(state === "SUCCESS"){

			component.set("v.trainingsWithProjects", response.getReturnValue());

		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
	},

	overlappedProjects : function(component, event) {
		
		//sets veriables by getting info from the view component

		//calls to method in the apex controller
		var action = component.get("c.getOverlappedProject");
			
		//response from the apex method
		action.setCallback(this, function(response){
		
		var state = response.getState();
		
		//storing return value
		let trainer = response.getReturnValue();

		if(state === "SUCCESS"){

			component.set("v.overlappedProjects", response.getReturnValue());

		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
	},


	
	numberOfProjects : function(component, event) {
		
		//sets veriables by getting info from the view component

		//calls to method in the apex controller
		var action = component.get("c.getNumProjects");
			
		//response from the apex method
		action.setCallback(this, function(response){
		
		var state = response.getState();
		
		//storing return value
		let trainer = response.getReturnValue();

		if(state === "SUCCESS"){

			component.set("v.numberOfProjects", response.getReturnValue());

		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
	}
})