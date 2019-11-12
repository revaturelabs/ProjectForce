({
	batchById : function(component, event) {
		let action = component.get("c.getBatch");
		let params = event.getParam('arguments');

		action.setParams ({ trainingID: String(params.trainingID) });
		component.set("v.saveTrainingID", String(params.trainingID));

		action.setCallback (this, function (response) {
			var state = response.getState();
			let batchInformation = response.getReturnValue();

			if(state === "SUCCESS"){
				component.set("v.batchNumber", batchInformation.Batch_Number__c);
				component.set("v.batchSize", batchInformation.BatchSize__c);
				component.set("v.batchTrack", batchInformation.Track__r.Name);
				component.set("v.batchProjectDate", batchInformation.ProjectStartDate__c);
				component.set("v.updateProject", batchInformation.Project__r.Name);
				component.set("v.updateTrainer", batchInformation.Trainer__r.Name);
				component.set("v.batchRoom", batchInformation.Room__r.Name);
				component.set("v.batchLocation", batchInformation.Room__r.Location__r.Name);
			}
			else{
				console.log("Failed with state: "+state);
			}
		});
		$A.enqueueAction(action);
	},

	//Funcation for the project drop down
	//sets the list of projects by calling the server- side controller	
	listOfTrackProject : function(component, event) {
		var action = component.get("c.getProject");
		let params = event.getParam('arguments');

		action.setParams ({ 
			trackName: String(params.paramTrack), 
			startDateName: Date(params.paramProjectDate)
		});

		action.setCallback (this, function (response) {
			var state = response.getState();
			let projectList = response.getReturnValue();

			if(state === "SUCCESS"){
				component.set("v.batchProjectsList", projectList);
			}
			else{
				console.log("Failed with state: "+state);
			}
		});
		$A.enqueueAction(action);

	},

	//Function for the trainer drop down
	//sets the list of trainers by calling the server- side controller
	trainer : function(component, event) {
		//sets veriables by getting info from the component attributes 
		let location = component.get("v.selectedLocation");
		let track = component.get("v.selectedTrack");
		let startDate = component.get("v.selectedDate");

		let params = event.getParam('arguments');

		if(!location)
		{
			location = params.paramLocation;
			component.set("v.selectedLocation",location);
		}

		if(!track)
		{
			track = params.paramTrack;
			component.set("v.selectedTrack",track);
		}		

		//calls to method in the apex controller
		var action = component.get("c.getTrainer");
		
		//set the parameters from the call
		action.setParams({
            locationName:location,
            trackName:track, 
			startDateName:startDate});
			
		//response from the apex method
		action.setCallback(this, function(response){
		
		var state = response.getState();
		
		//storing return value
		let trainer = response.getReturnValue();

		if(state === "SUCCESS"){

			component.set("v.updateTrainers", response.getReturnValue());

			if(trainer.length !=0)
			{
				component.set("v.updateTrainer", trainer[0].Name);
			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	$A.enqueueAction(action);
},
	//Funcation for the location drop down
	//sets the list of locations by calling the server- side controller
	locationByID : function(component, event) {

		let selectedLocation = component.get("v.selectedLocation");
		let action = component.get("c.getLocation");
		let params = event.getParam('arguments');
		
		//set the parameters from the call

			action.setParams({
				trainingID: String(params.trainingID)
			});
			component.set("v.saveTrainingID", String(params.trainingID));


		action.setCallback(this, function(response){
		var state = response.getState();
		let location =response.getReturnValue();
		let locationList = component.get("v.locations");
		

		if(!locationList){
			component.set("v.locations", location);
		}
		component.set("v.selectedLocation", location[0].Name);
		
	});
	
	$A.enqueueAction(action);
},


	//Funcation for the track drop down
	//sets the list of tracks by calling the server- side controller
	trackByID : function(component, event) {
		
		let action = component.get("c.getTrack");
		let params = event.getParam('arguments');
		let selectedTrack = component.get("v.selectedTrack");


			//set the parameters from the call
			action.setParams({
				trainingID: String(params.trainingID)
			});
	
	
		action.setCallback(this, function(response){
		
		let state = response.getState();
		
		let track = response.getReturnValue();
		let trackList = component.get("v.tracks");

		if(!trackList){
			component.set("v.tracks", track);
		}
		component.set("v.selectedTrack",track[0].Name);
		
		
		
	});
	
	$A.enqueueAction(action);
	//return track[0].Name
},


	//Funcation for the room drop down
	//sets the list of rooms by calling the server- side controller
	room : function(component, event) {
		

		var action = component.get("c.getRoom");
       // var location = component.get("v.selectedLocation");
		//var date = component.get("v.selectedDate");
		let params = event.getParam('arguments');
		let selectedLocation = component.get("v.selectedLocation");
		let selectedDate = component.get("v.selectedDate");

		if(!selectedLocation)
		{
			selectedLocation = params.paramLocation;
		}	

        action.setParams({
            "locationName": selectedLocation,
            "startDateName": selectedDate
		});
		
		action.setCallback(this, function(response){
		var state = response.getState();

		let room = response.getReturnValue();

		if(state === "SUCCESS"){
			component.set("v.updateRooms", room);

			if(room.length !=0)
			{
				component.set("v.updateRoom", room[0].Name);
			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
	},

	//Funcation for the project drop down
	//sets the list of projects by calling the server- side controller	
	project : function(component, event) {
		
		let params = event.getParam('arguments');

		var action = component.get("c.getProject");


		let track = component.get("v.batchTrack");
		let startDate = component.get("v.batchProjectStartDate");

		console.log("selectedTrack:"+track);

		// if(!track)
		// {
		// 	track = params.paramTrack;

		// }
		
		action.setParams({
            "trackName": track,
            "startDateName": startDate
		});
		
		action.setCallback(this, function(response){
		
		var state = response.getState();

		let project= response.getReturnValue();
		
		
		if(state === "SUCCESS"){
			component.set("v.updateProjects", project);
			console.log("inside success");
			// if(project.length !=0)
			// {
			// 	component.set("v.updateProject", project[0].Name);
			// }
		}
		else{
			console.log("Failed with state: "+state);
		}
		
	});
	
	$A.enqueueAction(action);
},

	//Funcation for the Date selection
	//sets the date to today if there is not selected date
	date : function(component,event){
		
        
        let selectedDate = component.get("v.selectedDate");

		//only sets the value of the selected date if it is null
        if(selectedDate == null)
        {
			
            let today = new Date();
            let dd = today.getDate();
            let mm = today.getMonth() + 1;
            let year = today.getFullYear();

            if(dd<10)
            {
                dd='0'+dd;
            }

            if(mm<10)
            {
                mm='0'+mm
            }

			today = year + '-' + mm + '-' + dd;

			component.set('v.selectedDate', today);
			
		}
		
	},

	saveModal : function(component, event) {
		
		var action = component.get("c.Save");

		//how many params do we need to pass
        action.setParams({
			"trainingId": component.get("v.saveTrainingID"),
            "newTrainerName": component.get("v.updateTrainer"),
			"newProjectName": component.get("v.updateProject"),
			"newRoomName": component.get("v.updateRoom"),
			"newTrackName": component.get("v.selectedTrack"),
			"newStartDate": component.get("v.selectedDate"),
			"newComment" : component.get("v.updateComment")
		});

		action.setCallback(this, function(response){
		var state = response.getState();

		let saveComplete = response.getReturnValue();

		//this.hide(component,event);
		//this.showToast(component,event);
		

		if(state === "SUCCESS"){
			
			if(saveComplete)
			{
				
				this.hideModal(component,event);
				this.successToast(component,event);
			}

			else
			{
				this.failToast(component,event);
			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});

	$A.enqueueAction(action);
	},

	//hides the modals and removes the backdrop class
	hideModal : function(component) {

		var modal = component.find("modalSection");
		var backdrop = component.find("backdrop");
		$A.util.addClass(modal, 'hideModal');

		$A.util.removeClass(backdrop, 'slds-backdrop slds-backdrop_open');
	},

	//hides the modals and removes the backdrop class
	showModal : function(component) {

		var modal = component.find("modalSection");
		var backdrop = component.find("backdrop");
		$A.util.removeClass(modal, 'hideModal');

		$A.util.addClass(backdrop, 'slds-backdrop slds-backdrop_open');
	},
	
	successToast : function(component, event, helper) {

		var toastEvent = $A.get("e.force:showToast");  
		toastEvent.setParams({  
		  "title": "Success!",  
		  "message": "Save request has been completed!",  
		  "type": "success"  
		});  
		toastEvent.fire(); 
		
	   },

	   failToast : function(component, event, helper) {
		var toastEvent = $A.get("e.force:showToast");  
		toastEvent.setParams({  
		  "title": "Failed to Save!",  
		  "message": "Failed to Save!",  
		  "type": "error"  
		});  
		toastEvent.fire();
		
	}


})