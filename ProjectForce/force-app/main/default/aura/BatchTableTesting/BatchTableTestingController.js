({
    handleItemSelectedEvent : function(component, event, helper){
        var table = event.getParam("tableObject");
        var parameters = event.getParam("selectedObjects");
        alert(JSON.stringify(parameters));
    }
})
