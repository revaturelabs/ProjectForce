//change without sharing to with sharing when deploying
public without sharing class ModalController {

    //All queries are done when modal is loaded 
    static list<location__c> locList = [SELECT name FROM Location__c];
    static List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name, start_Date__c from trainings__r),
                                                (select trackTrainer__r.name from trainerTracks__r) from trainer__c WHERE name != 'External'];
    static Trainer__c ExternalTrainer = [SELECT name FROM trainer__c WHERE Name = 'External'];
    static List<Room__c> RoomList = [select name, location__r.name , (select start_date__c from trainings__r) from room__c];
    static list<Track__c> trackList = [SELECT name FROM Track__c];
    static List<Project__c> ProjectList = [select name, track__r.name ,(SELECT projectStartDate__c FROM trainings__r ORDER BY projectStartDate__c asc LIMIT 1) from Project__c];


	@Auraenabled
    //Return a list of locations available
    public static list<location__c> getLocation(){
        try{
            if (schema.SObjectType.location__c.isAccessible()){
                //list<location__c> locList = [SELECT name FROM Location__c];
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
        try{
            if (schema.SObjectType.Trainer__c.isAccessible()){
                //List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name, start_Date__c from trainings__r),
                //                                (select trackTrainer__r.name from trainerTracks__r) from trainer__c];

                //Map the trainers with Start Date                                
                Map<Trainer__c, date> trainerStartDateMap= new Map<Trainer__c, date>();
                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerStartDateMap.put(t,tg.start_Date__c);
                    }
                }

                //filters the trainers based on Start Date 
                list<trainer__c> filterByDateTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerStartDateMap.keyset()){  
                   if(trainerStartDateMap.get(t) >= startDateName){
                        filterByDateTrainerList.add(t);
                    }
                }

                //Map the trainers with location name                                
                Map<Trainer__c, string> trainerLocationMap= new Map<Trainer__c, string>();
                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerLocationMap.put(t,tg.room__r.location__r.name);
                    }
                }

                //filters the trainers based on location and start date
                list<trainer__c> filterByLocationTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerLocationMap.keyset())
                {
                    if(trainerLocationMap.get(t)==locationName && filterByDateTrainerList.contains(t)){
                        filterByLocationTrainerList.add(t);
                    }
                }

                //Map the trainers with tracks
                Map<Trainer__c, string> trainerTrackMap= new Map<Trainer__c, string>();
                for(Trainer__c t: TrainerList){
                    for(TrainerTrack__c tt: t.trainerTracks__r){
                        trainerTrackMap.put(t,tt.trackTrainer__r.name);
                    }
                }

                //filters the trainers based on track and start date
                list<trainer__c> filterByTrackTrainerList = new list<trainer__c>();
                for(trainer__c t : trainerTrackMap.keyset()){
                    if(trainerTrackMap.get(t)==trackName && filterByDateTrainerList.contains(t)){
                        filterByTrackTrainerList.add(t);
                    }
                }

                //Find trainers that matches all three filters and add to finalTrainerList
                list<trainer__c> finalTrainerList= new list<trainer__c>();
                for(trainer__c t:filterByDateTrainerList){
                    if(filterByTrackTrainerList.contains(t) && filterByLocationTrainerList.contains(t)){
                        finalTrainerList.add(t);
                    }
                }

                //finalTrainerList.addall(ExternalTrainerList);
                if(LocationName == 'Online'){
                    filterByTrackTrainerList.add(ExternalTrainer);
                    return filterByTrackTrainerList;
                }else{
                    finalTrainerList.add(ExternalTrainer);
                    return finalTrainerList;
                }
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
        //startDateName = Date.newInstance(2019, 10, 10);//only for testing, delete!!!!
        try{
            if (schema.SObjectType.Room__c.isAccessible()){
                //List<Room__c> RoomList = [select name, location__r.name , (select start_date__c from trainings__r) from room__c];

                //Map the rooms with Training Start Date
                Map<Room__c, date> roomStartDateMap= new Map<Room__c, date>();
                for(Room__c r: RoomList){
                    for(Training__c tg: r.trainings__r){
                        roomStartDateMap.put(r,tg.start_Date__c);
                    }
                }

                //filters the rooms based on Start Date 
                list<room__c> secondFilterRoomList = new list<room__c>();
                for(room__c r : roomStartDateMap.keyset()){
                    if(roomStartDateMap.get(r) >= startDateName){
                        secondFilterRoomList.add(r);
                    }
                }

                //filters the rooms based on location
                list<Room__c> filterRoomList = new list<Room__c>();
                for(room__c r : RoomList){
                    if(r.location__r.name==locationName){
                        filterRoomList.add(r);
                    }
                }
                //Find rooms that matches all two filters and add to finalRoomList
                list<room__c> finalRoomList= new list<room__c>();
                for(room__c r:filterRoomList){
                    if(secondFilterRoomList.contains(r)){
                        finalRoomList.add(r);
                    }
                }
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
                //list<Track__c> trackList = [SELECT name FROM Track__c];
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
        try{
            if (schema.SObjectType.Project__c.isAccessible()){
                //List<Project__c> ProjectList = [select name, track__r.name, start_Date__c from Project__c];
                list<Project__c> filterProjectList = new list<Project__c>();
                //Find projects that matches all two filters and add to filterProjectList
                for(Project__c p : ProjectList){
                    if(p.track__r.name==trackName && p.trainings__r[0].projectStartDate__c>=startDateName && p.trainings__r[0].projectStartDate__c!= null){
                        filterProjectList.add(p);
                    }
                }
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


    //Saves changes to selected batch (training)
    @auraEnabled
    public static boolean Save(/*Id trainingId, */string newTrainerName, string newProjectName, string newRoomName, string newTrackName, date newStartDate){
        Id trainingID = [SELECT Id FROM training__c WHERE name='Test Training 0' LIMIT 1].Id;//REMOVE THIS AFTER DEPLOYMENT!!!
        id newTrainerId = [SELECT Id FROM Trainer__c WHERE name = :newTrainerName LIMIT 1].id;
        Id trainerTrackID = [SELECT Id FROM trainertrack__c WHERE TrainerTrack__c =:newTrainerId LIMIT 1].Id;
        id newProjectId = [SELECT Id FROM Project__c WHERE name = :newProjectName LIMIT 1].id;
        id newRoomId = [SELECT Id FROM Room__c WHERE name = :newRoomName LIMIT 1].id;
        id newTrackId = [SELECT Id FROM Track__c WHERE name = :newTrackName LIMIT 1].id;
        Training__c newTraining=[SELECT id, name, Start_Date__c, Trainer__c, Project__c, Room__c, Track__c FROM Training__c WHERE id = :trainingID LIMIT 1];
        trainertrack__c newTrainerTrack=[SELECT Id, TrackTrainer__c, TrackTrainer__r.name FROM trainertrack__c WHERE Id =:trainerTrackID LIMIT 1];

        newTraining.Trainer__c=newTrainerId;
        newTraining.Project__c=newProjectId;
        newTraining.room__c=newRoomId;
        newTraining.Track__c=newTrackId;
        newTraining.Start_Date__c=newStartDate;
        
        //newTrainerTrack.TrackTrainer__c=newTrackId;
        //update newTrainerTrack;
        database.saveResult result = Database.update(newTraining);
        System.debug(result.isSuccess());
        return result.isSuccess();
    }


}