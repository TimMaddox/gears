public class BikeLightningService{

    @AuraEnabled
    public static Map<String, Object> retrieveBikeGears(String bikeId)
    {
		
	String bikeItems= '{"bikegears":[{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"53"},{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"45"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"28"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"23"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"17"}]}';

    Map<String, Object> rObj = (Map<String,Object>)JSON.deserializeUntyped(bikeItems);  
        
    return rObj;    

    }
    
    @AuraEnabled
    public static Map<String, Object> retrieveFrontBikeGears(String bikeId)
    {
		
	String bikeItems= '{"bikeitems":[{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"53"},{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"45"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"28"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"23"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"17"}]}';

    Map<String, Object> rObj = (Map<String,Object>)JSON.deserializeUntyped(bikeItems);  
        
    return rObj;    

    }
    @AuraEnabled
    public static Map<String, Object> retrieveRearBikeGears(String bikeId)
    {
		
	String bikeItems= '{"bikeitems":[{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"53"},{"Gear_Type__c":"Front (Drive)","Bike_Gear_Teeth__r":"45"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"28"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"23"},{"Gear_Type__c":"Rear (Driven)","Bike_Gear_Teeth__r":"17"}]}';

    Map<String, Object> rObj = (Map<String,Object>)JSON.deserializeUntyped(bikeItems);  
        
    return rObj;    

    }    
}