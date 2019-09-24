////////////////////////////////////////////
//    Test Data Factory
//    Created by: Ying Ma, Frank Yang
//    Created date: 9/24
//    Run the method createTestDate() to generate data in the org, change the integer numOfRecords at the beginning,
//    to change the number of records to be genrated
//
//    any questions, email at ma444699160@gmail.com to Ying Ma
////////////////////////////////////////////





public class TestDataFactory {
    public static void createTestData(){

        Savepoint sp = Database.setSavepoint();

        //change the value to the num of records you want to create, or bind a signiture value to this variable
        integer numOfRecords=1;
       
        //Insert Trainer records
        list<trainer__c> TrainerList= new list<trainer__c>();
        for(integer i = 0; i<numOfRecords; i++){
            trainer__c t = new trainer__c(name='Test Trainer '+i);
            TrainerList.add(t);
        }
        Insert TrainerList;

        //Insert Track Records
        list<track__c> TrackList= new list<track__c>();
        for(integer i = 0; i<numOfRecords; i++){
            track__c t = new track__c(name='Test Track '+i);
            TrackList.add(t);
        }
        Insert TrackList;        

        //Insert location Records
        list<location__c> LocList= new list<location__c>();
        list<string> location = new list<string>{'Reston','Florida','Texas'}; //Insert Locations in the location list
        integer NumOfLocations = location.size();
        for(integer i = 0; i<numOfRecords; i++){
            Integer randomNumber = Integer.valueof((Math.random() * NumOfLocations));
            location__c t = new location__c(name=location[randomNumber], city__c=location[randomNumber]);
            LocList.add(t);
        }
        Insert LocList;

        //Insert Trainer Track Records
        list<trainerTrack__c> TrainerTrackList= new list<trainerTrack__c>();
        list<trainer__c> trainerIdList = [SELECT id, name FROM trainer__c];
        list<track__c> trackIdList = [SELECT id, name FROM track__c];

        for(integer i = 0; i<numOfRecords; i++){
            trainerTrack__c t = new trainerTrack__c(name='Test Trainer Track '+i, trackTrainer__c=trackIdList[i].id, trainerTrack__c=trainerIdList[i].id);
            trainerTrackList.add(t);
        }
        Insert trainerTrackList;

        //Insert Project Records
        list<project__c> ProjectList= new list<project__c>();
        for(integer i = 0; i<numOfRecords; i++){
            project__c t = new project__c(name='Test Project '+i, track__c=trackIdList[i].id, Details__c='Test Detail '+i);
            ProjectList.add(t);
        }
        Insert ProjectList;  

        //Insert Room records
        list<Room__c> RoomList= new list<Room__c>();
        list<Location__c> LocIdList = [SELECT id, name FROM location__c];
        for(integer i = 0; i<numOfRecords; i++){
            Room__c t = new Room__c(name='Test Room '+i, location__c=LocIdList[i].id, Room_Number__c= 100+i, Capacity__c=20);
            RoomList.add(t);
        }
        Insert RoomList;

        //Insert Training Records
        list<Training__c> TrainingList= new list<Training__c>();
        list<Project__c> ProjectIdList= [SELECT Id, name FROM Project__c];
        list<Room__c> RoomIdList = [SELECT Id, name from Room__c];

        for(integer i = 0; i<numOfRecords; i++){
            Training__c t = new Training__c(name='Test Training '+i, Trainer__c=trainerIdList[i].id, Track__c=trackIdList[i].id,
                                            Room__c=RoomIdList[i].id, Project__c=ProjectIdList[i].id, Batch_Number__c=1000+i);
            TrainingList.add(t);
        }
        Insert TrainingList; 

        /*try{
            
        }catch(Exception e){
            
        }
        return null;*/
    }

    /*public static void createTestData(){
        Database.rollback(sp);
    }*/
}