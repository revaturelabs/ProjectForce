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
    public static List<Trainer__c> getTrainer(String locationName, String trackName, Date startDateName){
        startDateName = Date.newInstance(2019, 10, 5);
        locationName = 'Reston';
        trackName='Java EE';
        try{
            if (schema.SObjectType.Trainer__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name, start_Date__c from trainings__r),
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
                }


                //Map the trainers with tracks
                Map<Trainer__c, string> trainerTrackMap= new Map<Trainer__c, string>();
                for(Trainer__c t: TrainerList){
                    for(TrainerTrack__c tt: t.trainerTracks__r){
                        trainerTrackMap.put(t,tt.trackTrainer__r.name);
                    }
                }

                list<trainer__c> secondFilterTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerTrackMap.keyset())
                {
                    System.debug(trainerTrackMap.get(t));
                    if(trainerTrackMap.get(t)==trackName){
                        secondFilterTrainerList.add(t);
                    }
                }

                 //Map the trainers with Start Date                                
                Map<Trainer__c, date> trainerStartDateMap= new Map<Trainer__c, date>();
                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerStartDateMap.put(t,tg.start_Date__c);
                    }
                }

                //filters the trainers based on Start Date 
                list<trainer__c> thirdFilterTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerStartDateMap.keyset())
                {   System.debug('signaniture:'+startDateName);
                    System.debug('trainterStartDate:' +trainerStartDatemap.get(t));
                    if(trainerStartDateMap.get(t) >= startDateName){
                        thirdFilterTrainerList.add(t);
                    }
                }

                //Find trainers that matches all three filters and add to finalTrainerList
                list<trainer__c> finalTrainerList= new list<trainer__c>();
                for(trainer__c t:filterTrainerList){
                    if(secondFilterTrainerList.contains(t) && thirdFilterTrainerList.contains(t)){
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
    public static List<Room__c> getRoom(String locationName, Date startDateName){
        startDateName = Date.newInstance(2019, 10, 10);//only for testing, delete!!!!
        try{
            if (schema.SObjectType.Room__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Room__c> RoomList = [select name, location__r.name , (select start_date__c from trainings__r) from room__c];

                //Map the rooms with Training Start Date
                Map<Room__c, date> roomStartDateMap= new Map<Room__c, date>();
                for(Room__c r: RoomList){
                    for(Training__c tg: r.trainings__r){
                        roomStartDateMap.put(r,tg.start_Date__c);
                    }
                }

                //filters the rooms based on Start Date 
                list<room__c> secondFilterRoomList = new list<room__c>();
                for(room__c r : roomStartDateMap.keyset())
                {
                    if(roomStartDateMap.get(r) >= startDateName){
                        secondFilterRoomList.add(r);
                    }
                }

                //filters the rooms based on location
                list<Room__c> filterRoomList = new list<Room__c>();
                for(room__c r : RoomList)
                {
                    if(r.location__r.name==locationName){
                        filterRoomList.add(r);
                    }
                	//System.debug(t.Name + ' ' + trainerMap.get(t));
                }


                //Find rooms that matches all two filters and add to finalRoomList
                list<room__c> finalRoomList= new list<room__c>();
                for(room__c r:filterRoomList){
                    if(secondFilterRoomList.contains(r)){
                        finalRoomList.add(r);
                    }
                }

                System.debug(finalRoomList);
                return finalRoomList;
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
    public static List<Project__c> getProject(String trackName, Date startDateName){
        startDateName = Date.newInstance(2019, 11, 11);//only for testing, delete!!!!
        try{
            if (schema.SObjectType.Project__c.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Project__c> ProjectList = [select name, track__r.name, start_Date__c from Project__c];

                list<Project__c> filterProjectList = new list<Project__c>();
                for(Project__c p : ProjectList)
                {
                    if(p.track__r.name==trackName && p.start_Date__c>=startDateName){
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