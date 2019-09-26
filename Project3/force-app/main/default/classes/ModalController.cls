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
    public static List<Trainer__c> getTrainer(String locationName, String trackName){
        try{
            if (schema.SObjectType.Trainer__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name from trainings__r),
                                                (select trackTrainer__r.name from trainerTracks__r) from trainer__c];

                //Map the trainers with location name                                
                Map<Trainer__c, string> trainerLocationMap= new Map<Trainer__c, string>();
                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerLocationMap.put(t,tg.room__r.location__r.name);
                    }
                }

                //filters the trainers based on location 
                list<trainer__c> filterTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerLocationMap.keyset())
                {
                    if(trainerLocationMap.get(t)==locationName){
                        filterTrainerList.add(t);
                    }
                	//System.debug(t.Name + ' ' + trainerLocationMap.get(t));
                }


                //Map the trainers with tracks
                Map<Trainer__c, string> trainerTrackMap= new Map<Trainer__c, string>();
                for(Trainer__c t: TrainerList){
                    for(TrainerTrack__c tt: t.trainerTracks__r){
                        trainerTrackMap.put(t,tt.trackTrainer__r.name);
                    }
                }

                list<trainer__c> secondPassFilterTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerTrackMap.keyset())
                {
                    if(trainerTrackMap.get(t)==trackName){
                        secondPassFilterTrainerList.add(t);
                    }
                	//System.debug(t.Name + ' ' + trainerTrackMap.get(t));
                }


                list<trainer__c> finalTrainerList= new list<trainer__c>();
                for(trainer__c t:filterTrainerList){
                    if(secondPassFilterTrainerList.contains(t)){
                        finalTrainerList.add(t);
                    }
                }


                return finalTrainerList;
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


        //get rooms based on the location
	@AuraEnabled
    public static List<Project__c> getProject(String trackName){
        try{
            if (schema.SObjectType.Project__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Project__c> ProjectList = [select name, track__r.name from Project__c];

                list<Project__c> filterProjectList = new list<Project__c>();
                for(Project__c p : ProjectList)
                {
                    if(p.track__r.name==trackName){
                        filterProjectList.add(p);
                    }
                	//System.debug(t.Name + ' ' + trainerMap.get(t));
                }
                System.debug(filterProjectList);
                return filterProjectList;
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