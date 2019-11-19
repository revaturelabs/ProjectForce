({
    doInit : function(component, event, helper) {
        let myPageRef = component.get('v.pageReference');
        let projectId = myPageRef.state.c__project;
        component.set("v.project", projectId);
    },
    refresh : function(component, event, helper) {
        var child = component.find("accordionView");
        child.refresh();
    }
})