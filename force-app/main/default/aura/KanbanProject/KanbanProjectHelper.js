({
    openModel: function (component) {
            // for Display Model,set the "isOpen" attribute to "true"
            component.set("v.isOpenAddColumn", true);
        },

    closeModel: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"

        // component.set("v.Stage", "");
        
        component.set("v.story", "");
        component.set("v.label1", "");
        component.set("v.label2", "");
        component.set("v.label3", "");
        component.set("v.color1", "");
        component.set("v.color2", "");
        component.set("v.color3", "");
        
        component.set("v.isOpenAddColumn", false);
    },

    //for delete column functionality
    openModelDelCol: function (component) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpenDeleteColumn", true);
    },

    closeModelDelCol: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"

        // component.set("v.Stage", "");
        
        component.set("v.story", "");
        component.set("v.label1", "");
        component.set("v.label2", "");
        component.set("v.label3", "");
        component.set("v.color1", "");
        component.set("v.color2", "");
        component.set("v.color3", "");
        
        component.set("v.isOpenDeleteColumn", false);
    },
})