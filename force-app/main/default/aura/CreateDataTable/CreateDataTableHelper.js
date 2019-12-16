({
    /**
     * set the columns to be displayed on the table
     * @param {*} component 
     * @param {*} helper 
     */
    setColumns : function(component, helper){
        var fields = helper.getColumns(component.get("v.queryFields"));
        var columns = [];
        for(var i=0;i<fields.length;i++){
            columns.push({
                        label:fields[i][0], 
                        fieldName:fields[i][0], 
                        type:fields[i][1],
                        editable:fields[i][2],
                        sortable:true
                    });
        }
        component.set("v.columns",columns);
    },

    /**
     * query the database for the records to be displayed
     * @param {*} component 
     * @param {*} helper 
     */
    getTableData : function(component, helper){
        var height = component.get("v.height");
        var queryFields = helper.getQueryFields(component.get("v.queryFields"));
        var getTableData = component.get("c.getTableData");

        getTableData.setParams({
            "queryObject": component.get("v.queryObject"),
            "queryFields": queryFields
        });

        getTableData.setCallback(this, function(response){
            var state = response.getState();
            component.find("TableDiv").getElement().style.gridTemplateRows = `auto ${height}px`;
            if(state==="SUCCESS"){
                component.set("v.data", response.getReturnValue());
            }
            else if(state==="ERROR"){
                let errors = response.getError();
                let message = 'Unknown error'; // Default error message
                // Retrieve the error message sent by the server
                if (errors && Array.isArray(errors) && errors.length > 0) {
                    message = errors[0].message;
                }
                // Display the message
                console.error(message);
            }
        })
        
        $A.enqueueAction(getTableData);
    },

    /**
     * because the items in the list are lists themselves
     * only return the reference to the fields that will be queried
     * @param {List} queryFields 
     */
    getQueryFields : function(queryFields){
        var returnQueryFields = [];
        for(let i=0;i<queryFields.length;i++){
            returnQueryFields.push(queryFields[i][0]);
        }
        return returnQueryFields;
    },

    /**
     * because some items are queried but not displayed, dont return the ones with type set to false
     * @param {List} queryFields 
     */
    getColumns : function(queryFields){
        var columns = [];
        for(let i=0;i<queryFields.length;i++){
            if(queryFields[i][1]!=false){
                columns.push(queryFields[i]);
            }
        }
        return columns;
    }
})