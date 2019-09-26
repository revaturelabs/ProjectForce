({
    init : function(component, event, helper) {
        helper.location(component, event);
        helper.track(component, event);
        helper.trainer(component, event);
        helper.room(component, event);
        helper.project(component, event);
    }
})