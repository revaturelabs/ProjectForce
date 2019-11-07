({
    //Calls the helper to initialize the location, track and date
    doInit : function(component, event, helper){

            //helper.showModal(component);
            helper.locationByID(component, event);
            helper.trackByID(component, event);
            helper.date(component,event);
            helper.room(component, event);
            helper.trainer(component, event);
            helper.project(component, event);
            
           

    },
    
    save : function(component, event, helper) {
        
        //helper.showToast(component, event);
        let updateTrainer = component.get("v.updateTrainer");
        let updateProject = component.get("v.updateProject");
        let updateRoom = component.get("v.updateRoom");
       // let selectedTrack = "v.selectedTrack";
        //let selectedDate = "v.selectedDate";

        //alert(updateTrainer+" "+updateProject+" "+updateRoom);
        if(updateTrainer && updateProject && updateRoom)
        {
            helper.saveModal(component, event);
            location.reload();
            //alert("works");
        }
        else
        {
            alert("Invalid drop");
        }
	},
    
    //save this for warning for the date later.....
    ////alert(component.find('myLocation').get('v.value') + ' is your location.');
    
    
    //calls the frunctions in the helper class
    getFilter : function(component, event, helper){
        //helper.getFilters(component, event);
        
        //helper.location(component, event);
        //helper.track(component, event);
        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);
    },

    hideModal : function(component, event, helper) {
    	helper.hideModal(component);
    },

    showModal : function(component, event, helper) {
        console.log("showModal");

        helper.batchById(component, event);

        //helper.locationByID(component, event);
        //helper.trackByID(component, event);
        //helper.date(component,event);
        //helper.room(component, event);
        //helper.trainer(component, event);
        //helper.project(component, event);
        helper.showModal(component);

        console.log("showModal completed");
    }    
})