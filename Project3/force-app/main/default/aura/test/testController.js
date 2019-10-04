({
  callSaveComp : function(component, event, helper){
    var childCmp = component.find("modalComp")
    childCmp.showModal("Reston","Salesforce");
    //childCmp.showModal();
    
    /*var evt = $A.get("e.force:navigateToComponent");
    console.log('Event '+evt);
    //var accountFromId = component.get("v.recordId");
    evt.setParams({
        componentDef  : "c:modal" ,
       /* componentAttributes : {
            accId : accountFromId
        }
    
    });
  
    evt.fire();*/
  }
})