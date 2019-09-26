//change without sharing to with sharing when deploying
public without sharing class ModalController {
	@Auraenabled

    //Return a list of locations available
    public static list<location__c> getLocation(){
        try{
            if (schema.SObjectType.location__c.isAccessible()){
                list<location__c> locList = [SELECT name FROM Location__c];
                return locList;
            }else{
                return null;
            }
        //Catch logic below
        }catch(Exception e){
            throw new AuraHandledException('custom message');
            
        }finally{
            //Finally logic goes in here
        }
    }

    //Get trainers based on the location 
	@AuraEnabled
    public static List<Trainer__c> getTrainer(String locationName){
        try{
            if (schema.SObjectType.Trainer__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name from trainings__r) from trainer__c];
                Map<Trainer__c, string> trainerMap= new Map<Trainer__c, string>();

                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerMap.put(t,tg.room__r.location__r.name);
                    }
                }

                list<trainer__c> filterTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerMap.keyset())
                {
                    if(trainerMap.get(t)==locationName){
                        filterTrainerList.add(t);
                    }
                	//System.debug(t.Name + ' ' + trainerMap.get(t));
                }
                System.debug(filterTrainerList);
                return filterTrainerList;
            }else{
                return null;
            }
        //Catch logic below
        }catch(Exception e){
            throw new AuraHandledException('custom message');
            
        }finally{
            //Finally logic goes in here
        }

        
    } 

    //get rooms based on the location
	@AuraEnabled
    public static List<Room__c> getRoom(String locationName){
        try{
            if (schema.SObjectType.Room__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Room__c> RoomList = [select name, location__r.name from room__c];


                list<Room__c> filterRoomList = new list<Room__c>();
                for(room__c r : RoomList)
                {
                    if(r.location__r.name==locationName){
                        filterRoomList.add(r);
                    }
                	//System.debug(t.Name + ' ' + trainerMap.get(t));
                }
                System.debug(filterRoomList);
                return filterRoomList;
            }else{
                return null;
            }
        //Catch logic below
        }catch(Exception e){
            throw new AuraHandledException('custom message');
            
        }finally{
            //Finally logic goes in here
        }

    } 

        //get all tracks
        @Auraenabled
        public static list<Track__c> getTrack(){
            try{
                if (schema.SObjectType.Track__c.isAccessible()){
                    list<Track__c> trackList = [SELECT name FROM Track__c];
                    system.debug(trackList);
                    return trackList;
                }else{
                    return null;
                }
            //Catch logic below
            }catch(Exception e){
                throw new AuraHandledException('custom message');
                
            }finally{
                //Finally logic goes in here
            }
        }


}