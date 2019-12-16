({
    doInit: function (component, event, helper) {
        var labelIndex = component.get("v.labelIndex");
        var color = "gray";
        if (labelIndex == 1) {
            color = "v.backlog.CardLabel1__r.Color__c";
        }
        else if (labelIndex == 2) {
            color = "v.backlog.CardLabel2__r.Color__c";
        }
        else if (labelIndex == 3) {
            color = "v.backlog.CardLabel3__r.Color__c";
        }
        component.set("v.labelColor", component.get(color));
    },
    toggle: function (component, event, helper) {
        component.set("v.showLabel", !component.get("v.showLabel"))
    }
})