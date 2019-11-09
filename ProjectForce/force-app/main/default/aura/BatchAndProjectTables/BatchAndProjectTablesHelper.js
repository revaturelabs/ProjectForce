({
    /**
     * given a list of ids, select those items on the table
     * @param {List} selectionIds list of ids
     * @param {String} selectionTableId aura:id of the table you want selected
     * @param {*} component 
     */
    markTableItemsAsSelected : function(selectionIds, selectionTableId, component){
        var selectionTable = component.find(selectionTableId).find("table");
        var projects = component.find(selectionTableId).get("v.data");
        var selectedRows = selectionTable.get("v.selectedRows");

        for(let i=0;i<projects.length;i++){
            if(selectionIds.includes(projects[i].Id)){
                selectedRows.push(`row-${i}`);
            }
        }
        selectionTable.set("v.selectedRows", selectedRows);
    },
})
