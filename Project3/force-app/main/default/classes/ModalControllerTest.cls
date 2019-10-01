@isTest
public class ModalControllerTest {
	@TestSetup
    static void setupData(){
        TestDataFactory.createTestData(5);
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
        List<project__c> soqlProjectList = [SELECT name, track__r.name, start_Date__c FROM project__c];
        Id projectId = soqlProjectList[1].Id;
        String trackName = soqlProjectList[1].track__r.name;
        Date startDateName = soqlProjectList[1].start_Date__c;
        //filter the projects based on the signatures of the second queried record
        list<project__c> modalProjectList = ModalController.getProject(trackName, startDateName);
        //if getProject returns the second queried results
        project__c targetProject;
        for(project__c p: modalProjectList){
            if(p.Id == projectId)
                targetProject = p;
        }
        System.assertEquals(soqlProjectList[1].Id, targetProject.Id);

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
}