({
    processGears: function(component,name, gearsForBike)
    {
        let gears = []
        
        JSON.parse(gearsForBike).forEach
        (
            (item)=>
            {                
                gears.push(item.gearteeth__c)                
            }
        );
        
        gears.reverse(gears.sort());
                
        const list = 
        gears.map
        (
            (item, index)=>
        	{
            	return {
                			index: index, value: Number(item)
            			};
             }
        );
        
        
        component.set("v." + name + "Gears", list);
                
           
    },
    processGearSet :function(component, gearSetToProcess)
    {
        let gearSet = []
        
        JSON.parse(gearSetToProcess).forEach
        (
            (item)=>
            {                
                gearSet.push(item.Name)                
            }
        ); 
        gearSet.reverse(gearSet.sort());
                
        const list = 
        gearSet.map
        (
            (item, index)=>
        	{
            	return {
                			index: index, value: Number(item)
            			};
             }
        );
        
        
        component.set("v.gearSet", list);
        
    },  
    getApexGears : function(component, name, params) {
        
        return new Promise
        (
            function(resolve, reject)
            {
                const action = component.get(name);
                
                action.setParams(params);
                
                action.setCallback
                (
                    this, 
                    (response)=>
                    {
        
                        if(response.getState() === "SUCCESS")
                        {
                            resolve(response.getReturnValue());
                        }
                        else
                        {
                            reject(Error(response.getError()[0].message));
                        }
                            
                    }
                );
                $A.enqueueAction(action);
    		}
		);
  	
	},
	getGears: function(component)
    {
        let gearSetNameValue = (component.get("v.gearSet")[this.returnValue(component, "gearSet")].value).toString();
        
        
        this.getApexGears(component, "c.retrieveBikeGears", { recordId : gearSetNameValue, type:"crankset" })
        .then
        (   
        	(gearsToProcess)=>
            {
                this.processGears(component, "front", gearsToProcess);
            }                
        )
        .then
        (
                ()=>
                {
                return this.getApexGears(component, "c.retrieveBikeGears", { recordId :gearSetNameValue, type:"cassette" })
                }
        )
        .then
        (   
            (gearsToProcess)=>
            {
                this.processGears(component, "rear", gearsToProcess);
            }
                 
        )
        .then
        (
            ()=>
            {
            	    this.setGearRatio(component);  
            }
        )
        .catch
        (
          (message)=>      
          {      
                this.showErrorMessage
                (
                    component,     
                    message,
                    "Oh no!"
                )           
           }       
        )
        
    },
	getGearSet: function(component)
    {
        this.getApexGears(component, "c.retrieveBikeGearSet", { })
        .then
        (   
        	(gearSetToProcess)=>
            {
                this.processGearSet(component, gearSetToProcess);
            }                
        )
        .catch
        (
          (message)=>      
          {      
                this.showErrorMessage
                (
                    component,     
                    message,
                    "Oh no!"
                )           
           }       
        )
        
    },               
	setGearRatio : function(component){
        
        const selectedFront = component.get("v.currentFrontGear"),
              selectedRear = component.get("v.currentRearGear"),
              frontGears = component.get("v.frontGears"),
              rearGears = component.get("v.rearGears");
        
        const ratio = frontGears[selectedFront].value / rearGears[selectedRear].value;
        
        component.set("v.gearRatio", ratio);
    },
    ddlbLength: function(component, name)
    {
     	 return component.get("v." + name + "Gears").length;
    },  
    returnValue: function(component, name)
    {
      	return component.find(name).get("v.value");  
    },
    setValue: function(component, name, value)
    {
      	 component.find(name).set("v.value", value);  
    },     
    getShiftValue: function(component, shiftObject)
    {
        try{
            let cVal = this.returnValue(component, shiftObject.chainring);
            let gList = component.get( "v." + shiftObject.chainring + "Gears");
            let fIndex = 0;
            let rVal = 0;
            gList.forEach
            (
                (item, index)=>
                {
                    (index === cVal)?
                    fIndex = index
                    :0;
                }
            );
            
            if(shiftObject.upOrDown === "down")
            {
                rVal = (fIndex < gList.length )?
                        fIndex + 1
                        :gList.length;
            }
            else
            {
                rVal = (fIndex > 0)?
                        fIndex - 1
                        :0;
            }
			return rVal;
        }
        catch(err)
        {
            throw new Error(err.message);
        }
    },
    willThrowChain: function(component, shiftObject)
	{
        const crLen = this.ddlbLength(component, shiftObject.chainring);
        let retVal = false;
        
        if(shiftObject.upOrDown === "up")
        {
            if(this.returnValue(component, shiftObject.chainring) === 0)
            {
                retVal = true;
            }
        }  
        
        else if(shiftObject.upOrDown === "down")
        {
            if((this.returnValue(component, shiftObject.chainring) + 0) === (crLen - 1)  )
            {
                retVal = true;
            }
        }

        return retVal;
        
    },
   	checkShift: function(component)
    {
           let c = component;
           let cr = this.returnValue(c,"chainring");
           let uod = this.returnValue(c,"shiftUpOrDown");
           let shiftObject = 
           {
               chainring : null,
               upOrDown :  null,
           }
           
          return new Promise
          (
          	(resolve, reject)=>
              {
                  if(cr==="none")
                  {                  	
                      reject("Please select a chain ring.");
                  }
                  else if(uod === "none")
                  {
                      reject("Do you want to shift up or down?");
                  }
                      else
                      {
                          shiftObject.chainring = cr;
                          shiftObject.upOrDown = uod;
                          resolve(shiftObject);
                      }
              }  
          
          ); 
                   
    },
    checkChainring: function(component, shiftObject)
    {
    	let willCrash = this.willThrowChain(component, shiftObject);

       	   return new Promise
           (
               (resolve, reject)=>
               {
                   (willCrash)?                   
                   		reject("The requested shift will result in throwing your chain off the " + shiftObject.chainring + " chainring.")
                   :resolve(shiftObject);
               }
           );
    },
    processShiftRequest: function(component, event)
    {
		let eventMessage = event.getParam("message");
        
        this.checkShift(component)
        .then
        (
            (shiftObject)=>
            {              
                return this.checkChainring(component,shiftObject);
            }
        )
        .then
        (
            (shiftObject)=>
            {

                    this.setValue(component, shiftObject.chainring, this.getShiftValue(component, shiftObject));
                    this.showMessage
                    (
                    component, 
                    eventMessage + " the " + shiftObject.chainring + " gear " + shiftObject.upOrDown + ".",
                    "I just...",
                    this.setGearRatio	
                    );  
            }
        )                    
        .catch
        (
              (message)=>      
              {      
                    this.showErrorMessage
                    (
                        component,     
                        message,
                        "Oh no!"
                    );         
               }
        );
                    
    },
    processShiftRequesthold: function(component, event)
    {
       var message = event.getParam("message");
  
        this.checkShift(component, event)
        .then
        (            
            (shiftObject)=>
            {
                   this.checkChainring(component, shiftObject)
                   .then
                	(
                		()=>
                		{
                			this.setValue(component, shiftObject.chainring, this.getShiftValue(component, shiftObject));
                			this.showMessage
                			(
                				component, 
                				 message + " the " + shiftObject.chainring + " gear " + shiftObject.upOrDown + ".",
                				"I just...",
                		        this.setGearRatio	
                			);
        			
            			}
                	)
                	.catch
        			(
            			(message)=>
            			{
                
                            this.showErrorMessage
                			(
                				component,
                				message +  ".",
                				"Oh no!"
                			);
            			}
         			);
                	
            } 
        )                
        .catch
        (
            (message)=>
                { 
                
                this.showErrorMessage
                (
                    component, 
                    message + "."
                );
                
            }
         );	
                  
    },
    showToast: function(component,title, message, variant, callback)
	{
        console.log(message);
        variant = variant || "info";
        
        let header = (variant === "info")?
            		 "Wanted to let you know"
        			:"Please note";
        
        component.find('notifLib')
        .showNotice
        (
            {
                "variant": variant,
                "header": header,
                "title": title,
                "message": message + "",
                closeCallback: callback(component)
        	}
        );
    },
    showMessage: function( component, message, title, callback)
    {
    
        title = title || "";
        callback = callback || function(){}; //note: can't use arrow function here
        
        this.showToast(component, title, message, "info", callback);
    },
    showErrorMessage: function( component, message, title, callback)
    {
    
       	title = title || "";
        let variant = (title === "")?
            "warning":
        	"error"
        callback = callback || function(){}; //note: can't use arrow function here...
        
        this.showToast(component, title, message, variant,callback);
    }
        

})