({
    openModelAddTheCard: function (component) {
        // for Display Model,set the "isOpen" attribute to "true"
        component.set("v.isOpenAddCard", true);
    },

    closeModelAddTheCard: function (component) {
        // for Hide/Close Model,set the "isOpen" attribute to "Fasle"
        component.set("v.isOpenAddCard", false);
    },
})