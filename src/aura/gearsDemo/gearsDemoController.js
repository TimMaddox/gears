(
    {
        handleInit : function(component, event, helper) {        
            helper.getGearSet(component);
        },
        handleGearPopulation : function(component, event, helper) {
            helper.getGears(component);  
        },        
        handleSelectChange : function(component, event, helper) {
            helper.setGearRatio(component);  
        },
        setChainRing: function(component, event, helper)
        {
            helper.chainRing(component, event);    
        },
        setUpOrDown: function(component, event, helper)
        {	
            helper.upOrDown(component, event);
        },
        executeShift : function(component, event, helper)
        {
          helper.processShiftRequest(component, event);  
        }
	}
)