({
    doInit: function(component, event, helper) {
        helper.getProjects(component);
      },
    
    inlineEdit: function(component,event,helper){   
        if(component.get("v.lastEdited") !== ""){
            component.set(component.get("v.lastEdited"), false);
            component.set("v.lastEdited","");
        }
        var ctarget = event.currentTarget;
        var idStr = "v." + ctarget.dataset.value;
        var inputStr = idStr.substring(2,idStr.indexOf("Edit"))+"Input";
        component.set(idStr, true);
        component.set("v.lastEdited",idStr);
        setTimeout(function(){ 
            component.find(inputStr).focus();
        }, 100);
    },

    inlineClose: function(component,event,helper){   
        component.set(component.get("v.lastEdited"), false);
        component.set("v.lastEdited","");
    },

    alwaysChange: function(component,event,helper){
        component.set("v.showSaveCancelBtn",true);
    },

    projectChange :function(component) {
        var action = component.get("c.findProject");
        action.setParams({
            "name" : component.find("projectInput").get("v.value")
        });
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                component.set("v.backlogRecord.Project__c", response.getReturnValue());
                component.set("v.showSaveCancelBtn",true);
                component.set("v.projectName",component.find("projectInput").get("v.value"))
            }
        });
        $A.enqueueAction(action);
    }
})
