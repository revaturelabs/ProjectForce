({
    setColumns : function(component){
        var fields = component.get("v.queryFields");
        var width = component.get("v.width");
        var columns = [];
        for(var i=0;i<fields.length;i++){
            columns[i] = {
                            label:fields[i], 
                            fieldName:fields[i], 
                            type:"text", 
                            fixedWidth:(width/fields.length)-(90/fields.length),
                            editable:true
                        };
        }
        component.set("v.columns",columns);
    },

    getTableData : function(component){
        var width = component.get("v.width");
        var height = component.get("v.height");
        var getTableData = component.get("c.getTableData");
        getTableData.setParams({
            "queryObject": component.get("v.queryObject"),
            "queryFields": component.get("v.queryFields")
        });
        getTableData.setCallback(this, function(response){
            var state = response.getState();
            component.find("TableDiv").getElement().style.width = `${width}px`;
            component.find("TableDiv").getElement().style.gridTemplateRows = `25px ${height-25}px`;
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
    }
})
