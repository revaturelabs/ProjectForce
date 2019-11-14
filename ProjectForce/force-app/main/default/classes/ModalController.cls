//change without sharing to with sharing when deploying
public without sharing class ModalController {

    //All queries are done when modal is loaded 
    static list<location__c> locList = [SELECT name FROM Location__c];
    static List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name, start_Date__c from trainings__r),
                                                (select trackTrainer__r.name from trainerTracks__r) from trainer__c WHERE name != 'External'];
    static Trainer__c ExternalTrainer = [SELECT name FROM trainer__c WHERE Name = 'External'];
    static List<Room__c> RoomList = [select name, location__r.name , (select start_date__c from trainings__r) from room__c];
    static list<Track__c> trackList = [SELECT name FROM Track__c];
    static List<Project__c> ProjectList = [select name, projectcomplete__c, track__r.name,(SELECT projectStartDate__c FROM trainings__r ORDER BY projectStartDate__c desc LIMIT 1) from Project__c];
    static List<training__c> trainingList = [SELECT Id, batchsize__c, room__r.location__r.name, track__r.Name, room__r.Name, trainer__r.Name, Project__r.Name FROM training__c];

    @AuraEnabled
    public static Training__c getBatch(String trainingID) {
        Training__c selectedBatch = new Training__c();
        try {
            if (schema.SObjectType.location__c.isAccessible()) {
                List<Training__c> batch = [SELECT Id, Batch_Number__c, BatchSize__c, Track__r.Name, ProjectStartDate__c, Project__r.Name, Trainer__r.Name, Room__r.Name, Room__r.Location__r.Name FROM Training__c WHERE Id =: Id.valueOf(trainingID) LIMIT 1];

                selectedBatch = batch[0];
                return selectedBatch;
            } else {
                return null;
            }
        } catch(Exception e) {
            throw new AuraHandledException('Batch cannot be found');
        }
    }

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

    @Auraenabled
    //Return a list of locations with the signiture location being the defualt option
    public static list<location__c> getLocation(string trainingID){
        //training__c training =[SELECT Id FROM training__c LIMIT 1];
        //trainingID = String.valueOf(training.Id);

        try{
            if (schema.SObjectType.location__c.isAccessible()){
                String SelectedLocation;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        SelectedLocation = t.room__r.location__r.name;
                    }
                }
                if(locList[0].name==SelectedLocation){return locList;}
                //list<location__c> locList = [SELECT name FROM Location__c];
                location__c temploc = loclist[0];
                location__c loc;
                integer locindex;
                for (location__c l : loclist){
                    if(selectedLocation == l.name){
                        locindex = loclist.indexOf(l);
                        loc=l;
                        
                    }
                }
                loclist[0]=loc;
                loclist.remove(locindex);
                loclist.add(temploc);
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

        /*
        //Get trainers based on the location, and the selected value being the first item in the list
	@AuraEnabled
    public static List<Trainer__c> getTrainer(String locationName, String trackName, Date startDateName, String trainingID){
        try{
            if (schema.SObjectType.Trainer__c.isAccessible()){
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
                //sort based on selected value
                String selectedTrainer;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        selectedTrainer = t.trainer__r.Name;
                    }
                }
                if(filterByTrackTrainerList[0].name==SelectedTrainer){return filterByTrackTrainerList;}
                trainer__c temptrainer = filterByTrackTrainerList[0];
                trainer__c tr;
                integer trindex;
                for (Trainer__c t : filterByTrackTrainerList){
                    if(selectedTrainer == t.name){
                        trindex = filterByTrackTrainerList.indexOf(t);
                        tr=t;
                    }
                }
                filterByTrackTrainerList[0]=tr;
                filterByTrackTrainerList.remove(trindex);
                filterByTrackTrainerList.add(temptrainer);
                    return filterByTrackTrainerList;
                }else{
                    finalTrainerList.add(ExternalTrainer);
                //sort based on selected value
                String selectedTrainer;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        selectedTrainer = t.trainer__r.Name;
                    }
                }
                if(finalTrainerList[0].name==SelectedTrainer){return finalTrainerList;}
                trainer__c temptrainer = finalTrainerList[0];
                trainer__c tr;
                integer trindex;
                for (Trainer__c t : finalTrainerList){
                    if(selectedTrainer == t.name){
                        trindex = finalTrainerList.indexOf(t);
                        tr=t;
                    }
                }
                finalTrainerList[0]=tr;
                finalTrainerList.remove(trindex);
                finalTrainerList.add(temptrainer);
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
    } */


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
    /*
    //get rooms based on the location
	@AuraEnabled
    public static List<Room__c> getRoom(String locationName, Date startDateName, string trainingID){
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
                //Put the selected room as the first item in the list
                String SelectedRoom;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        SelectedRoom = t.room__r.Name;
                    }
                }
                if(finalRoomList[0].name==SelectedRoom){return finalRoomList;}
                Room__c tempRoom = finalRoomList[0];
                Room__c tr;
                integer trindex;
                for (Room__c t : finalRoomList){
                    if(SelectedRoom == t.name){
                        trindex = finalRoomList.indexOf(t);
                        tr=t;
                    }
                }
                finalRoomList[0]=tr;
                finalRoomList.remove(trindex);
                finalRoomList.add(tempRoom);
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
    */



    //get all tracks
    @Auraenabled
    public static list<Track__c> getTrack(){
        try{
            if (schema.SObjectType.Track__c.isAccessible()){
                //list<Track__c> trackList = [SELECT name FROM Track__c]
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


    //get all tracks, put the selected track as the first item
    @Auraenabled
    public static list<Track__c> getTrack(string trainingID){


       // training__c training =[SELECT Id FROM training__c LIMIT 1];
        //trainingID = String.valueOf(training.Id);

        try{
            if (schema.SObjectType.Track__c.isAccessible()){
                String SelectedTrack;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        SelectedTrack = t.track__r.Name;
                    }
                }
                if(trackList[0].name==SelectedTrack){return trackList;}
                //list<Track__c> trackList = [SELECT name FROM Track__c]
                track__c temptrack = tracklist[0];
                track__c tr;
                integer trindex;
                for (track__c t : tracklist){
                    if(selectedtrack == t.name){
                        trindex = tracklist.indexOf(t);
                        tr=t;
                    }
                }
                tracklist[0]=tr;
                tracklist.remove(trindex);
                tracklist.add(temptrack);
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

                    if(p.trainings__r.size() == 0){
                        continue;
                    }else if(p.track__r.name==trackName && p.trainings__r[0].projectStartDate__c>=startDateName && p.trainings__r[0].projectStartDate__c!= null){
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
    /*
     //get project based on the track and set the track of the batch to default
	@AuraEnabled
    public static List<Project__c> getProject(String trackName, Date startDateName, String trainingID){
        try{
            if (schema.SObjectType.Project__c.isAccessible()){
                //List<Project__c> ProjectList = [select name, track__r.name, start_Date__c from Project__c];
                list<Project__c> filterProjectList = new list<Project__c>();
                //Find projects that matches all two filters and add to filterProjectList
                for(Project__c p : ProjectList){
                    if(p.trainings__r.size() == 0){
                        continue;
                    }else if(p.track__r.name==trackName && p.trainings__r[0].projectStartDate__c>=startDateName && p.trainings__r[0].projectStartDate__c!= null){
                        filterProjectList.add(p);
                    }
                }
                String SelectedProject;
                for(training__c t: trainingList){
                    if(t.Id == trainingID){
                        SelectedProject = t.project__r.Name;
                    }
                }
                if(filterProjectList[0].name==SelectedProject){return filterProjectList;}
                project__c tempproject = filterProjectList[0];
                project__c tr;
                integer trindex;
                for (project__c t : filterProjectList){
                    if(selectedProject == t.name){
                        trindex = filterProjectList.indexOf(t);
                        tr=t;
                    }
                }
                filterProjectList[0]=tr;
                filterProjectList.remove(trindex);
                filterProjectList.add(tempproject);
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
    } */


    //Saves changes to selected batch (training)
    @auraEnabled
    public static boolean Save(String trainingId, string newTrainerName, string newProjectName, string newRoomName, string newTrackName, date newStartDate){
        //Id trainingID = [SELECT Id FROM training__c WHERE name='Test Training 0' LIMIT 1].Id;//REMOVE THIS AFTER DEPLOYMENT!!!
        id newTrainerId = [SELECT Id FROM Trainer__c WHERE name = :newTrainerName LIMIT 1].id;
        Id trainerTrackID = [SELECT Id FROM trainertrack__c WHERE TrainerTrack__c =:newTrainerId LIMIT 1].Id;
        id newProjectId = [SELECT Id FROM Project__c WHERE name = :newProjectName LIMIT 1].id;
        id newRoomId = [SELECT Id FROM Room__c WHERE name = :newRoomName LIMIT 1].id;
        id newTrackId = [SELECT Id FROM Track__c WHERE name = :newTrackName LIMIT 1].id;
        Training__c newTraining=[SELECT id, name, Start_Date__c, Trainer__c, Project__c, Room__c, Track__c FROM Training__c WHERE id = : Id.valueOf(trainingID) LIMIT 1];
        trainertrack__c newTrainerTrack=[SELECT Id, TrackTrainer__c, TrackTrainer__r.name FROM trainertrack__c WHERE Id =:trainerTrackID LIMIT 1];

        newTraining.Trainer__c=newTrainerId;
        newTraining.Project__c=newProjectId;
        newTraining.room__c=newRoomId;
        newTraining.Track__c=newTrackId;
        newTraining.Start_Date__c=newStartDate;
        
        //newTrainerTrack.TrackTrainer__c=newTrackId;
        //update newTrainerTrack;
        database.saveResult result = Database.update(newTraining);
        return result.isSuccess();
    }


}