@isTest
public class ModalControllerTest 
{
    static Profile STANDARD_USER = [SELECT Id FROM Profile WHERE Name='Standard User'];
    
    // put user creation in setup
	@TestSetup
    static void setupData()
    {	// make some data
        DataFactory.createTestData(50);
        // make a user who can't access the records
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        User baduser = new User
            (	Alias = 'standt', Email = 'standarduser@testorg.com',
        		EmailEncodingKey = 'UTF-8', LastName='Testing', LanguageLocaleKey = 'en_US',
        		LocaleSidKey = 'en_US', ProfileId = STANDARD_USER.id, 
             	TimeZoneSidKey = 'America/Los_Angeles', UserName = uniqueUserName
            );
        insert baduser;
    }
    // New Stuff
    @isTest
    static void testBatch() 
    {	User baduser = [ SELECT ID FROM User WHERE Lastname='Testing' ][0];
        Training__c sampleTraining = [	SELECT 	Id, Batch_Number__c, BatchSize__c, Track__r.Name, ProjectStartDate__c, Project__r.Name, 
                                           		Project__r.Id, Trainer__r.Name, Room__r.Name, Room__r.Location__r.Name 
                                     	FROM Training__c
                                      	WHERE Name='Test Training 0' 
                                     ][0];		// test positive
     	System.assertEquals( sampleTraining, ModalController.getBatch(sampleTraining.Id) );
     	try { ModalController.getBatch(null); }	// test negative
     	catch (AuraHandledException ahe) 
        {	System.assertEquals( 'Script-thrown exception', ahe.getMessage() ); 
        }
     	System.runAs(baduser) 					// test security
        {	System.assertEquals( null, ModalController.getBatch(sampleTraining.Id) );
     	}
    }
    
    @isTest
    static void testProject() 
    {	User baduser = [ SELECT ID FROM User WHERE Lastname='Testing' ][0];
     	System.debug( ModalController.getProject('Salesforce', null).size() );	// test positive
     	System.debug( ModalController.getProject(null, null) );					// test negative
     	System.runAs(baduser) 													// test security
        {	System.assertEquals( null, ModalController.getProject('Salesforce', null) );
     	}
    }
    
    @isTest
    static void testSave()
    {
        Id trainingID = [SELECT Id 
                         FROM training__c 
                         WHERE name='Test Training 0' 
                         LIMIT 1
                        ].Id;
        Training__c newTraining=[SELECT id, name, Start_Date__c, Trainer__c, Project__c, Room__c, Track__c 
                                 FROM Training__c 
                                 WHERE id = :trainingID 
                                 LIMIT 1
                                ];
        project__c newProject=[SELECT id, name 
                               FROM project__c 
                               LIMIT 1
                              ];
        String comment = 'Hello Im am a Project';
        ModalController.Save(String.valueOf(trainingID), newProject.name, comment);
        System.debug(newTraining.name);
    }
} 
    // Outdated Stuff
    // test nonexistant method
    // test returned list of locations
    /*@isTest
    static void testLocation(){
        list<location__c> soqlLocationList = [SELECT Id FROM location__c];
        training__c training =[SELECT Id FROM training__c LIMIT 1];
        String trainingId = String.valueOf(training.Id);
        list<location__c> modalLocationList = ModalController.getLocation();
        list<location__c> modalLocationWithIdList = ModalController.getLocation(trainingId);
        //if getLocation returns the queried results
        System.assertEquals(soqlLocationList.size(), modalLocationList.size());
        System.assertEquals(soqlLocationList.size(), modalLocationWithIdList.size());
        
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
            list<location__c> userModalLocationWithIdList = ModalController.getLocation(trainingId);
            System.assertEquals(null, userModalLocationList);
            System.assertEquals(null, userModalLocationWithIdList);
        }        
    }

    // test nonexistant method
    // test returned list of tracks
    @isTest
    static void testTrack(){
        list<track__c> soqlTrackList = [SELECT Id FROM track__c];
        training__c training =[SELECT Id FROM training__c LIMIT 1];
        String trainingId = String.valueOf(training.Id);
        list<track__c> modalTrackList = ModalController.getTrack();
        list<track__c> modalTrackWithIdList = ModalController.getTrack(trainingId);
        //if getTrack returns the queried results
        System.assertEquals(soqlTrackList.size(), modalTrackList.size());
        System.assertEquals(soqlTrackList.size(), modalTrackWithIdList.size());

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
            list<track__c> userModalTrackWithIdList = ModalController.getTrack(trainingId);
            System.assertEquals(null, userModalTrackList);
            System.assertEquals(null, userModalTrackWithIdList);
        }        
    }

    //test returned list of filtered rooms
    @isTest
    static void testRoom(){
        list<room__c> soqlRoomList = [SELECT name, location__r.name , (select start_date__c from trainings__r) FROM room__c];
        Integer index;
        for(Integer i =  10; i < soqlRoomList.size(); i++){
            if(soqlRoomList[i].trainings__r.size() > 0){
                index = i;
                break;
            }
        }
        Id locationId = soqlRoomList[index].Id;
        String locationName = soqlRoomList[index].location__r.name;
        Date startDateName = soqlRoomList[index].trainings__r[0].start_date__c;
        training__c training =[SELECT Id, room__r.Name FROM training__c WHERE room__c =: locationId LIMIT 1];
        String trainingId = String.valueOf(training.Id);
        //filter the rooms based on the signatures of the second queried record
        list<room__c> modalRoomList = ModalController.getRoom(locationName, startDateName);
        //list<room__c> modalRoomWithIdList = ModalController.getRoom(locationName, startDateName, trainingId);

        //if getRoom returns the second queried results
        Room__c targetRoom;
        for(room__c r: modalRoomList){
            if(r.Id == locationId)
                targetRoom = r;
        }
        
        Room__c targetRoomWithId;
        for(room__c r: modalRoomWithIdList){
            if(r.Id == locationId)
                targetRoomWithId = r;
        }
        System.assertEquals(locationId, targetRoom.Id);
        //System.assertEquals(locationId, targetRoomWithId.Id);
        //System.assertEquals(training.room__r.Name, modalRoomWithIdList[0].name);

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
            //list<room__c> userModalRoomWithIdList = ModalController.getRoom(locationName, startDateName, trainingId);
            System.assertEquals(null, userModalRoomList);
            //System.assertEquals(null, userModalRoomWithIdList);
        }        
    }

    //test returned list of filtered projects
    @isTest
    static void testProject(){
        List<project__c> soqlProjectList = [SELECT name, track__r.name, (SELECT projectStartDate__c 
                                            FROM trainings__r ORDER BY projectStartDate__c asc LIMIT 1) FROM project__c];
        project__c chosenProject;
        for(project__c p: soqlProjectList){
            if(p.trainings__r.size()>0){
                chosenProject = p;
                break;
            }
        }
        Id projectId = chosenProject.Id;
        String trackName = chosenProject.track__r.name;
        Date startDateName = chosenProject.trainings__r[0].projectStartDate__c;
        training__c training =[SELECT Id, project__r.Name FROM training__c WHERE project__c =: projectId LIMIT 1];
        String trainingId = String.valueOf(training.Id);
        //filter the projects based on the signatures of the second queried record
        list<project__c> modalProjectList = ModalController.getProject(trackName, startDateName);
        //list<project__c> modalProjectWithIdList = ModalController.getProject(trackName, startDateName, trainingId);

        //if getProject returns the second queried results
        project__c targetProject;
        for(project__c p: modalProjectList){
            if(p.Id == projectId)
                targetProject = p;
        }
        project__c targetProjectWithId;
        for(project__c p: modalProjectWithIdList){
            if(p.Id == projectId)
                targetProjectWithId = p;
        }
        System.assertEquals(chosenProject.Id, targetProject.Id);
        //System.assertEquals(chosenProject.Id, targetProjectWithId.Id);
        //System.assertEquals(training.project__r.Name, modalProjectWithIdList[0].name);

        
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
              //list<project__c> userModalProjectWithIdList = ModalController.getProject(trackName, startDateName, trainingId);
              System.assertEquals(null, userModalProjectList);
              //System.assertEquals(null, userModalProjectWithIdList);
        }        
    }

    // test nonexistant method
     //test returned list of filtered trainers
    @isTest
    static void testTrainer(){
        List<trainer__c> soqlTrainerList = [SELECT name, (SELECT name, room__r.location__r.Name, start_Date__c FROM trainings__r),
                                                (SELECT trackTrainer__r.name FROM trainerTracks__r) FROM trainer__c];
        Integer index;
        for(Integer i = 10; i < soqlTrainerList.size() ; i++){
            if(soqlTrainerList[i].trainings__r.size() > 0){
                index = i;
                break;
            }
        }
        Id trainerId = soqlTrainerList[index].Id;
        String locationName = soqlTrainerList[index].trainings__r[0].room__r.location__r.Name;
        String trackName = soqlTrainerList[index].trainerTracks__r[0].trackTrainer__r.name;
        Date startDateName = soqlTrainerList[index].trainings__r[0].start_Date__c;
        training__c training =[SELECT Id, trainer__r.Name FROM training__c WHERE trainer__c =: trainerId LIMIT 1];
        String trainingId = String.valueOf(training.Id);
        //filter the trainers based on the signatures of the second queried record
        list<trainer__c> modalTrainerList = ModalController.getTrainer(locationName, trackName, startDateName);
        //list<trainer__c> modalTrainerWithIdList = ModalController.getTrainer(locationName, trackName, startDateName, trainingId);

        //if getTrainer returns the second queried results
        trainer__c targetTrainer;
        for(trainer__c t: modalTrainerList){
            if(t.Id == trainerId)
                targetTrainer = t;
        }
        trainer__c targetTrainerWithId;
        for(trainer__c t: modalTrainerWithIdList){
            if(t.Id == trainerId)
                targetTrainerWithId = t;
        }
        System.assertEquals(trainerId, targetTrainer.Id);
        //System.assertEquals(trainerId, targetTrainerWithId.Id);
        //System.assertEquals(training.trainer__r.Name, modalTrainerWithIdList[0].name);

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
              //list<trainer__c> userModalTrainerWithIdList = ModalController.getTrainer(locationName, trackName, startDateName);
              System.assertEquals(null, userModalTrainerList);
              //System.assertEquals(null, userModalTrainerWithIdList);
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
        ModalController.Save(String.valueOf(trainingID),newTrainer.name, newProject.name, newRoom.name, newTrack.name, newStartDate);
        System.debug(newTraining.name);
        System.assertEquals(newTrainer.Id, newTraining.trainer__c);
        //System.assertEquals(newProject.Id, newTraining.project__c);
        System.assertEquals(newRoom.Id, newTraining.room__c);
        //System.assertEquals(newTrack.Id, newTraining.track__c);
        //System.assertEquals(newStartDate, newTraining.start_date__c);
    }*/