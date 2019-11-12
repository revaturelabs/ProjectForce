({
    //Calls the helper to initialize the location, track and date
    doInit : function(component, event, helper){

           /* helper.showModal(component);
            helper.locationByID(component, event);
            helper.trackByID(component, event);
            helper.date(component,event);*/
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

        // let updateComment = component.get("v.updateComment");

        // let recordId = component.get("v.recordId");

        // set to what's retreived in the apex controller 
        //let updatedComments = component.get("v.updatedComments");

        // if only comments are being updated, don't fire a rerendering event
        // if {...}

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
        helper.locationByID(component, event);
        helper.trackByID(component, event);
        helper.date(component,event);
        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);
        helper.showModal(component);

        console.log("showModal completed");
    },
    openDiv : function(component, event, helper) {
        var x = document.getElementById("locationDiv");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }
      },

      changeButton : function(component, event, helper){
        var x = document.getElementById("locationDiv");
        if (x.style.display === "block") {
          x.style.display = "none";
        } else {
          x.style.display = "block";
        }



      },
   
    
})