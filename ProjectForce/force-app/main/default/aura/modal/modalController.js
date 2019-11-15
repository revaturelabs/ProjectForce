

      ({
        //Calls the helper to initialize the location, track and date
        doInit : function(component, event, helper){
  
        },
        
        save : function(component, event, helper) {

            
          let updateTrainer = component.get("v.updateTrainer");
          let updateProject = component.get("v.updateProject");


          if(updateTrainer && updateProject)
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

        //calls the frunctions in the helper class
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
            console.log("showModal");
            helper.batchById(component, event);
            helper.showModal(component);
            helper.listOfTrackProject(component, event);

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
    })

