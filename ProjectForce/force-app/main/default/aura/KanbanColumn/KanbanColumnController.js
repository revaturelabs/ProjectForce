({
	allowDrop: function(component, event, helper) {
        event.preventDefault();
    },
    
    onDrop: function(component, event, helper) {
        event.preventDefault();
        var droppedOnColumnEvent = component.getEvent('droppedOnColumn');
        droppedOnColumnEvent.setParams({
            'title': component.get('v.title'),
            'backlog': JSON.parse(event.dataTransfer.getData('DraggedBacklog')),
        });
        droppedOnColumnEvent.fire();
        console.log('title in KanbanColumnController is ',title);
    },
})