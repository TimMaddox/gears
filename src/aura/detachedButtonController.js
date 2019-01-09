({
    fireButtonEvent : function(component, event) {
        // Get the component event by using the
        // name value from aura:registerEvent
        var cmpEvent = component.getEvent("buttonEvent");
        cmpEvent.setParams({
            "message" : "shifted" });
        cmpEvent.fire();
    },
    onChangeUpdateGearRatio: function(component, event, helper)
    {
        //alert(component.get("v.gearRatioInChild"));
        
    }
})