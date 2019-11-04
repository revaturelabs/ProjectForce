({
	init : function(component, event, helper) {
		helper.countProjects(component, event);
		helper.overlappedProjects(component, event);
		helper.numberOfProjects(component, event);
	}
})