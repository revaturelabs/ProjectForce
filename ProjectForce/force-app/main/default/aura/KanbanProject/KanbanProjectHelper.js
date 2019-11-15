({
    openModel: function (component) {
            // for Display Model,set the "isOpen" attribute to "true"
            
            component.set("v.isOpen", true);
        },

    closeModel: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"  
        component.set("v.isOpen", false);

    },
})