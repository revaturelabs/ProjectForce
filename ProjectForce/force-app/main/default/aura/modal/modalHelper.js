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
			"trackName": params.paramTrack, 
			"startDateName": params.paramProjectDate
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

	saveModal : function(component, event) {
		var action = component.get("c.Save");

		//how many params do we need to pass
        action.setParams({
			"trainingId": component.get("v.saveTrainingID"),
			"newProjectName": component.get("v.updateProject"),
			"newComment" : component.get("v.updateComment")
		});

		action.setCallback(this, function(response){
			var state = response.getState();
			let saveComplete = response.getReturnValue();

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