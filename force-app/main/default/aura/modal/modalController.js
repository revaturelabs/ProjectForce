({
    //Calls the helper to initialize the location, track and date
    doInit : function(component, event, helper){
            // helper.room(component, event);
            // helper.trainer(component, event);
            // helper.project(component, event);
    },
    
    save : function(component, event, helper) {
        let updateTrainer = component.get("v.updateTrainer");
        let updateProject = component.get("v.updateProject");
        let updateRoom = component.get("v.updateRoom");
  
        if(updateTrainer && updateProject && updateRoom){
            helper.saveModal(component, event);
            location.reload();
            helper.room(component, event);
            helper.trainer(component, event);
            helper.project(component, event);
        }else{
            alert("Save Problem");
        }
    },
  
    getFilter : function(component, event, helper){
      var x = document.getElementById("locationDiv");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
      
      helper.listOfTrackProject(component, event);
    },

    hideModal : function(component, event, helper) {
      helper.hideModal(component);
    },

    showModal : function(component, event, helper) {
      helper.batchById(component, event);
      helper.listOfTrackProject(component, event);
      helper.showModal(component);
    },

    openDiv : function(component, event, helper) {
      var x = document.getElementById("locationDiv");
      if (x.style.display === "block") {
        x.style.display = "none";
      } else {
        x.style.display = "block";
      }
    },   
    openKanban : function(component, event, helper) {
      var navService = component.find("navService");
      // Uses the pageReference definition in the init handler
      var pageReference = component.get("v.pageReference");
      event.preventDefault();
      navService.navigate(pageReference);
    }
})