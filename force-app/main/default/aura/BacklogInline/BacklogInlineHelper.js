({
    grabProjects :function(component) {
        var action = component.get("c.getProjects");
        action.setParams({
            "backlog": component.get("v.backlogRecord.Project__c"),
        });
        var opts = [];
        action.setCallback(this, function(response) {
            if (response.getState() == "SUCCESS") {
                var allValues = response.getReturnValue();
                for (var i = 0; i < allValues.length; i++) {
                    opts.push(allValues[i]);
                }
                component.set("v.projects", opts);
            }
        });
        $A.enqueueAction(action);
    }
})