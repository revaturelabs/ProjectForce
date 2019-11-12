({
    /**
     * set the columns to be displayed on the table
     * @param {*} component 
     * @param {*} helper 
     */
    setColumns : function(component, helper){
        var fields = helper.getColumns(component.get("v.queryFields"));
        var width = component.get("v.width");
        var columns = [];
        for(var i=0;i<fields.length;i++){
            columns.push({
                            label:fields[i], 
                            fieldName:fields[i], 
                            type:"text", 
                            fixedWidth:(width/fields.length)-(90/fields.length),
                            editable:true
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
        var width = component.get("v.width");
        var height = component.get("v.height");
        var headerHeight = 30;
        var queryFields = helper.getQueryFields(component.get("v.queryFields"));
        var getTableData = component.get("c.getTableData");

        getTableData.setParams({
            "queryObject": component.get("v.queryObject"),
            "queryFields": queryFields
        });

        getTableData.setCallback(this, function(response){
            var state = response.getState();
            // set the width and height of the table here because there is no reference until its created
            component.find("TableDiv").getElement().style.width = `${width}px`;
            component.find("TableDiv").getElement().style.gridTemplateRows = `${headerHeight}px ${height-headerHeight}px`;
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
     * because some items in the list are lists themselves
     * only return the reference to the fields that will be queried
     * @param {List} queryFields 
     */
    getQueryFields : function(queryFields){
        var returnQueryFields = [];
        for(let i=0;i<queryFields.length;i++){
            if(queryFields[i][1]===false || queryFields[i][1]===true){
                returnQueryFields.push(queryFields[i][0]);
            }
            else{
                returnQueryFields.push(queryFields[i]);
            }
        }
        return returnQueryFields;
    },

    /**
     * Some items that you want queried don't need to be shown in the table,
     * so this returns only the ones that aren't marked as false
     * @param {List} queryFields 
     */
    getColumns : function(queryFields){
        var queryColumns = [];
        for(let i=0;i<queryFields.length;i++){
            if(queryFields[i][1]!=false){
                queryColumns.push(queryFields[i]);
            }
        }
        return queryColumns;
    }
})
