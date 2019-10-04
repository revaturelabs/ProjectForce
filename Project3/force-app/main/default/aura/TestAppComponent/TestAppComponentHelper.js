/*
 * Jabed Hossain
 * Vinny Sosa
 * Project 3
*/

({


	//Function for the trainer drop down
	//sets the list of trainers by calling the server- side controller
	trainer : function(component, event) {
		console.log("Trainer function");
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
	console.log("Trainer done!");
	$A.enqueueAction(action);
},
	//Funcation for the location drop down
	//sets the list of locations by calling the server- side controller
	location : function(component, event) {
		console.log("Location Funcation");

		let selectedLocation = component.get("v.selectedLocation");
		let action = component.get("c.getLocation");
		let params = event.getParam('arguments');

		if(!selectedLocation){
			selectedLocation = params.paramLocation;
			component.set("v.selectedLocation", selectedLocation);
			//component.set("v.location.Name", selectedLocation);
		}
		console.log("selectedLocation:"+selectedLocation);
		//set the parameters from the call
		action.setParams({
			SelectedLocation: selectedLocation
		});

		action.setCallback(this, function(response){
		var state = response.getState();
		let location =response.getReturnValue();
		
		if(state === "SUCCESS"){
			//sets the drop down lists for location
			//stops the list from resetting
			let locationList = component.get("v.locations");

			if(!locationList){
				component.set("v.locations", location);
			}

			if(location.length !=0)
			{
				//sets value only if the the list is not empty and location has not been set before
				if(!selectedLocation){
					
					//component.set("v.selectedLocation", location[1].Name);
					component.set("v.location.Name", selectedLocation);
					
				}
				//sets value only if the the list is not empty
					//component.set("v.updateLocation", location[0].Name);
			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		//console.log("hello"+component.get("v.selectedLocation"));
		
	});
	console.log("Location Done!");
	$A.enqueueAction(action);
},

	//Funcation for the track drop down
	//sets the list of tracks by calling the server- side controller
	track : function(component, event) {
			console.log("Track Function");
			let action = component.get("c.getTrack");
			let params = event.getParam('arguments');
			let selectedTrack = component.get("v.selectedTrack");

			if(!selectedTrack)
			{
				selectedTrack = params.paramTrack;
				component.set("v.selectedTrack", selectedTrack);
			}

			//set the parameters from the call
			action.setParams({
				SelectedTrack: selectedTrack
			});

			
			action.setCallback(this, function(response){
			
			let state = response.getState();
			
			let track = response.getReturnValue();

			//console.log("return trackk" + track);

			if(state === "SUCCESS"){

				let trackList = component.get("v.tracks");

				if(!trackList){
					component.set("v.tracks", track);
				}

				//component.set("v.updateTracks", track);
				
				if(track.length !=0)
				{


					if(!selectedTrack)
					{
						component.set("v.selectedTrack",params.paramTrack);
					}

						//component.set("v.updateTrack",track[0].Name);
					
					
				}
			}
			else{
				console.log("Failed with state: "+state);
			}
			
			
		});
		console.log("Track Function Done!");
		$A.enqueueAction(action);
		//return track[0].Name
},

	//Funcation for the room drop down
	//sets the list of rooms by calling the server- side controller
	room : function(component, event) {
		console.log("Entering room function");

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
	console.log("Done with Room function");
	$A.enqueueAction(action);
	},

	//Funcation for the project drop down
	//sets the list of projects by calling the server- side controller	
	project : function(component, event) {

		console.log("Entering project function");

		let params = event.getParam('arguments');

		var action = component.get("c.getProject");


		let selectedTrack = component.get("v.selectedTrack");
		let selectedDate = component.get("v.selectedDate");

		console.log("selectedTrack:"+selectedTrack);

		if(!selectedTrack)
		{
			selectedTrack = params.paramTrack;

		}
		
		action.setParams({
            "trackName": selectedTrack,
            "startDateName": selectedDate
		});
		
		action.setCallback(this, function(response){
		
		var state = response.getState();

		let project= response.getReturnValue();
		
		console.log("inside callback");
		
		if(state === "SUCCESS"){
			component.set("v.updateProjects", project);
			console.log("inside success");
			if(project.length !=0)
			{
				component.set("v.updateProject", project[0].Name);
			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	console.log("Done with project function");
	$A.enqueueAction(action);
},

	//Funcation for the Date selection
	//sets the date to today if there is not selected date
	date : function(component,event){
		console.log("entering date function");
        
        let selectedDate = component.get("v.selectedDate");

		//only sets the value of the selected date if it is null
        if(selectedDate == null)
        {
			console.log("entering IF date function");
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
			console.log("selectedDate: "+selectedDate);
			console.log("today: "+today);
		}

		console.log("Exiting Date function");
	},

	saveModal : function(component, event) {
		
		var action = component.get("c.Save");

		//how many params do we need to pass
        action.setParams({
            "newTrainerName": component.get("v.updateTrainer"),
			"newProjectName": component.get("v.updateProject"),
			"newRoomName": component.get("v.updateRoom"),
			"newTrackName": component.get("v.selectedTrack"),
			"newStartDate": component.get("v.selectedDate")
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
	   
	   /* let toast = this.toastCtrl.create({
		  message: component,
		  showCloseButton: true,
		  closeButtonText: event,
		  position: 'bottom'
		});
	   
	   
		toast.onDidDismiss((data) => {
		  clearTimeout(timeoutHandler);
		  console.log('time elapsed',data);
			if(!data || !data.autoclose)
			 callback()
		});
		toast.present();*/
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