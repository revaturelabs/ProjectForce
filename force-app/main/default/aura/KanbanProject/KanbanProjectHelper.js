({
    openModel: function (component) {
            // for Display Model,set the "isOpen" attribute to "true"
            component.set("v.isOpenAddColumn", true);
        },

    closeModel: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "False"
        component.set("v.isOpenAddColumn", false);
    },

    //for delete column functionality
    openModelDelCol: function (component) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpenDeleteColumn", true);
    },

    closeModelDelCol: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"
        component.set("v.isOpenDeleteColumn", false);
    },
})