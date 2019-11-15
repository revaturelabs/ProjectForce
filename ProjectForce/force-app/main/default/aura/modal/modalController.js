({
    //Calls the helper to initialize the location, track and date
    doInit : function(component, event, helper){

            helper.room(component, event);
            helper.trainer(component, event);
            helper.project(component, event);
            
           

    },
    
    save : function(component, event, helper) {
        
        let updateTrainer = component.get("v.updateTrainer");
        let updateProject = component.get("v.updateProject");
        let updateRoom = component.get("v.updateRoom");
       
        if(updateTrainer && updateProject && updateRoom)
        {
            helper.saveModal(component, event);
            
            // Create new instance of event to be fired. This prevents the 
            // whole page from reloading
            var modalCompletedEvent = component.getEvent("modalCompleteEvent");
            modalCompletedEvent.fire();
        }
        else
        {
            alert("Invalid drop");
        }
	},
    
    //calls the frunctions in the helper class
    getFilter : function(component, event, helper){

        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);
    },

    hideModal : function(component, event, helper) {
    	helper.hideModal(component);
    },

    showModal : function(component, event, helper) {
        helper.locationByID(component, event);
        helper.trackByID(component, event);
        helper.date(component,event);
        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);
        helper.showModal(component);
    }    
})