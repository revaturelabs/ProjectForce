({
	onDragStart : function(component, event, helper) {
		event.dataTransfer.dropEffect = "move";
        var backlog = component.get('v.backlog');
      	event.dataTransfer.setData('draggedBacklog', JSON.stringify(backlog));
	}
})