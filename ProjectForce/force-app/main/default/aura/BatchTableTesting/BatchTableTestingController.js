({
    handleItemSelectedEvent : function(component, event, helper){
        var table = event.getParam("tableObject");
        var parameters = event.getParam("selectedObjects");
        alert(JSON.stringify(parameters));
    },

    handleSaveInlineEditsEvent : function(component, event, helper){
        alert(JSON.stringify(event.getParam("editedItems")));
    }
})
