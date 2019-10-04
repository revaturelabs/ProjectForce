@isTest
public class ModalControllerTest {
	@TestSetup
    static void setupData(){
        TestDataFactory.createTestData(50);
    }
    
    //test returned list of locations
    @isTest
    static void testLocation(){
        list<location__c> soqlLocationList = [SELECT Id FROM location__c];
        list<location__c> modalLocationList = ModalController.getLocation();
        //if getLocation returns the queried results
        System.assertEquals(soqlLocationList.size(), modalLocationList.size());
        
        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<location__c> userModalLocationList = ModalController.getLocation();
              System.assertEquals(null, userModalLocationList);
        }        
    }

    @isTest
    static void testLocationWithParam(){
        list<location__c> soqlLocationList = [SELECT Id FROM location__c];
        list<location__c> modalLocationList = ModalController.getLocation();
        //if getLocation returns the queried results
        System.assertEquals(soqlLocationList.size(), modalLocationList.size());
        
        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<location__c> userModalLocationList = ModalController.getLocation('Reston');
              System.assertEquals(null, userModalLocationList);
        }
        list<location__c> userModalLocationList = ModalController.getLocation('Reston');
              System.assertEquals('Reston', userModalLocationList[0].name);

    }

    //test returned list of tracks
    @isTest
    static void testTrack(){
        list<track__c> soqlTrackList = [SELECT Id FROM track__c];
        list<track__c> modalTrackList = ModalController.getTrack();
        //if getTrack returns the queried results
        System.assertEquals(soqlTrackList.size(), modalTrackList.size());

        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<track__c> userModalTrackList = ModalController.getTrack();
              System.assertEquals(null, userModalTrackList);
        }        
    }

    //test returned list of tracks
    @isTest
    static void testTrackWithParam(){
        list<track__c> soqlTrackList = [SELECT Id FROM track__c];
        list<track__c> modalTrackList = ModalController.getTrack();
        //if getTrack returns the queried results
        System.assertEquals(soqlTrackList.size(), modalTrackList.size());

        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<track__c> userModalTrackList = ModalController.getTrack('Salesforce');
              System.assertEquals(null, userModalTrackList);
        }        
        list<track__c> userModalTrackList = ModalController.getTrack('Big Data');
        System.assertEquals('Big Data', userModalTrackList[0].name);
    }

    //test returned list of filtered rooms
    @isTest
    static void testRoom(){
        list<room__c> soqlRoomList = [SELECT name, location__r.name , (select start_date__c from trainings__r) FROM room__c];
        Id locationId = soqlRoomList[1].Id;
        String locationName = soqlRoomList[1].location__r.name;
        Date startDateName = soqlRoomList[1].trainings__r[0].start_date__c;
        //filter the rooms based on the signatures of the second queried record
        list<room__c> modalRoomList = ModalController.getRoom(locationName, startDateName);
        //if getRoom returns the second queried results
        Room__c targetRoom;
        for(room__c r: modalRoomList){
            if(r.Id == locationId)
                targetRoom = r;
        }
        System.assertEquals(soqlRoomList[1].Id, targetRoom.Id);

        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<room__c> userModalRoomList = ModalController.getRoom(locationName, startDateName);
              System.assertEquals(null, userModalRoomList);
        }        
    }

    //test returned list of filtered projects
    @isTest
    static void testProject(){
        List<project__c> soqlProjectList = [SELECT name, track__r.name, (SELECT projectStartDate__c FROM trainings__r ORDER BY projectStartDate__c asc LIMIT 1) FROM project__c];
        project__c chosenProject;
        for(project__c p: soqlProjectList){
            if(p.trainings__r.size()>0){
                chosenProject = p;
                break;
            }
        }
        System.debug(chosenProject.trainings__r);
        Id projectId = chosenProject.Id;
        String trackName = chosenProject.track__r.name;
        Date startDateName = chosenProject.trainings__r[0].projectStartDate__c;
        System.debug(trackName);
        System.debug(startDateName);
        //filter the projects based on the signatures of the second queried record
        list<project__c> modalProjectList = ModalController.getProject(trackName, startDateName);
        //if getProject returns the second queried results
        project__c targetProject;
        for(project__c p: modalProjectList){
            if(p.Id == projectId)
                targetProject = p;
        }
        System.assertEquals(chosenProject.Id, targetProject.Id);

        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<project__c> userModalProjectList = ModalController.getProject(trackName, startDateName);
              System.assertEquals(null, userModalProjectList);
        }        
    }

     //test returned list of filtered trainers
    @isTest
    static void testTrainer(){
        List<trainer__c> soqlTrainerList = [SELECT name, (SELECT name, room__r.location__r.Name, start_Date__c FROM trainings__r),
                                                (SELECT trackTrainer__r.name FROM trainerTracks__r) FROM trainer__c];
        Id trainerId = soqlTrainerList[1].Id;
        String locationName = soqlTrainerList[1].trainings__r[0].room__r.location__r.Name;
        String trackName = soqlTrainerList[1].trainerTracks__r[0].trackTrainer__r.name;
        Date startDateName = soqlTrainerList[1].trainings__r[0].start_Date__c;
        //filter the trainers based on the signatures of the second queried record
        list<trainer__c> modalTrainerList = ModalController.getTrainer(locationName, trackName, startDateName);
        //if getTrainer returns the second queried results
        trainer__c targetTrainer;
        for(trainer__c t: modalTrainerList){
            if(t.Id == trainerId)
                targetTrainer = t;
        }
        System.assertEquals(soqlTrainerList[1].Id, targetTrainer.Id);

        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        //user does not have access to the records
        System.runAs(u) {
              list<trainer__c> userModalTrainerList = ModalController.getTrainer(locationName, trackName, startDateName);
              System.assertEquals(null, userModalTrainerList);
        }        
    }

    @isTest
    static void testSave(){
        Id trainingID = [SELECT Id FROM training__c WHERE name='Test Training 0' LIMIT 1].Id;
        Training__c newTraining=[SELECT id, name, Start_Date__c, Trainer__c, Project__c, Room__c, Track__c FROM Training__c WHERE id = :trainingID LIMIT 1];
        trainer__c newTrainer=[SELECT id, name FROM trainer__c LIMIT 1];
        project__c newProject=[SELECT id, name FROM project__c LIMIT 1];
        room__c newRoom=[SELECT id, name FROM room__c LIMIT 1];
        track__c newTrack=[SELECT id, name FROM track__c LIMIT 1];
        date newStartDate = System.today();
        ModalController.Save(newTrainer.name, newProject.name, newRoom.name, newTrack.name, newStartDate);
        System.debug(newTraining.name);
        System.assertEquals(newTrainer.Id, newTraining.trainer__c);
        //System.assertEquals(newProject.Id, newTraining.project__c);
        System.assertEquals(newRoom.Id, newTraining.room__c);
        //System.assertEquals(newTrack.Id, newTraining.track__c);
        //System.assertEquals(newStartDate, newTraining.start_date__c);
    }
}