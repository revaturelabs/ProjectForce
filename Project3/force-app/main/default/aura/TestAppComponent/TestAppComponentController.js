({
    //Calls the helper to initialize the location, track and date
    init : function(component, event, helper) {
            
        helper.location(component, event);
        helper.track(component, event);
        helper.date(component,event);

        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);        
    },
    
    showToast : function(component, event, helper) {
     var toastEvent = $A.get("e.force:showToast");  
     toastEvent.setParams({  
       "title": "Success!",  
       "message": "Here is your Success Toast Message!",  
       "type": "success"  
     });  
     toastEvent.fire(); 
	},
    
    //save this for warning for the date later.....
    ////alert(component.find('myLocation').get('v.value') + ' is your location.');
    
    
    //calls the frunctions in the helper class
    getFilter : function(component, event, helper){
        //helper.getFilters(component, event);
        
        helper.location(component, event);
        helper.track(component, event);
        helper.room(component, event);
        helper.trainer(component, event);
        helper.project(component, event);
    }
})