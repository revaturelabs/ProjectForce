({
    doInit : function(component, event, helper) {
        let myPageRef = component.get('v.pageReference');
        let opportunityId = myPageRef.state.c__project;
        component.set("v.project", opportunityId);
    },
    refresh : function(component, event, helper) {
        var child = component.find("accordionView");
        child.refresh();
    }
})