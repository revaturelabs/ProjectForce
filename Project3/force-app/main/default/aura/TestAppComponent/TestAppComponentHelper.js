({
	//Function for the trainer drop down
	//sets the list of trainers by calling the server- side controller
	trainer : function(component, event) {
		

		//sets veriables by getting info from the view component
		var location = component.get("v.selectedLocation");
		var track = component.get("v.selectedTrack");
		var startDate = component.get("v.selectedDate");

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
	location : function(component, event) {
		var action = component.get("c.getLocation");
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

			//
			component.set("v.updateLocations", location);
			
			if(location.length !=0)
			{
				//sets the value for the location to the first value fo the array
				//let selectedLocation = location[0].Name;

				let selectedLocation = component.get("v.selectedLocation");

				//sets value only if the the list is not empty
				if(!selectedLocation){
					component.set("v.selectedLocation", location[0].Name);
				}

				//let updateLocation = component.get("v.updateLocation");
				
				//sets value only if the the list is not empty
				//if(!updateLocation){
					component.set("v.updateLocation", location[0].Name);
				//}

			}
		}
		else{
			console.log("Failed with state: "+state);
		}
		
		
	});
	
	$A.enqueueAction(action);
},

	//Funcation for the track drop down
	//sets the list of tracks by calling the server- side controller
	track : function(component, event) {
			var action = component.get("c.getTrack");		
			
			action.setCallback(this, function(response){
			
			var state = response.getState();
			
			let track = response.getReturnValue();

			if(state === "SUCCESS"){
				
				let trackList = component.get("v.tracks");
				
				if(!trackList){
					component.set("v.tracks", track);
				}

				component.set("v.updateTracks", track);
				
				if(track.length !=0)
				{
					let selectedTrack = component.get("v.selectedTrack");

					if(!selectedTrack)
					{
						component.set("v.selectedTrack",track[0].Name);
					}

					//let updateTrack = component.get("v.updateTrack");

					//if(!updateTrack)
					//{
						component.set("v.updateTrack",track[0].Name);
					//}					
					
				}
			}
			else{
				console.log("Failed with state: "+state);
			}
			
			
		});
		
		$A.enqueueAction(action);
},

	//Funcation for the room drop down
	//sets the list of rooms by calling the server- side controller
	room : function(component, event) {
		var action = component.get("c.getRoom");
       // var location = component.get("v.selectedLocation");
        //var date = component.get("v.selectedDate");
        action.setParams({
            "locationName": component.get("v.selectedLocation"),
            "startDateName": component.get("v.selectedDate")
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
		var action = component.get("c.getProject");
		action.setParams({
            "trackName": component.get("v.selectedTrack"),
            "startDateName": component.get("v.selectedDate")
        });
		action.setCallback(this, function(response){
		
		var state = response.getState();

		let project= response.getReturnValue();

		if(state === "SUCCESS"){
			component.set("v.updateProjects", project);

			if(project.length !=0)
			{
				component.set("v.updateProject", project[0].Name);
			}
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
		/*
		var action = component.get("c.getRoom");
		//how many params do we need to pass
        action.setParams({
            "locationName": component.get("v.selectedLocation"),
            "startDateName": component.get("v.selectedDate")
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
	$A.enqueueAction(action);*/
	}


})