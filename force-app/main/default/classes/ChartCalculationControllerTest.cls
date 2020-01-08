@isTest
public with sharing class ChartCalculationControllerTest {
    public ChartCalculationControllerTest() {

    }

    @TestSetup
    public static void makeData(){
        trainer__c newTrainer1 = new trainer__c(name='Test Trainer 1');
        trainer__c newTrainer2 = new trainer__c(name='Test Trainer 2');
        list<trainer__c> trainerList = new list<trainer__c> {newTrainer1, newTrainer2};
        insert trainerList;

        track__c newTrack = new track__c(name='Salesforce');
        insert newTrack;

        location__c newLocation = new location__c(name='Reston', city__c='Reston');
        insert newLocation;

        list<trainerTrack__c> trainerTrackList = new list<trainerTrack__c>();
        list<track__c> trackIdList = [SELECT id, name FROM track__c];
        list<trainer__c> trainerIdList = [SELECT id, name FROM trainer__c];
        for(integer i = 0; i<2; i++){
            trainerTrack__c t = new trainerTrack__c(name='Test Trainer Track '+i, trackTrainer__c=trackIdList[0].id, trainerTrack__c=trainerIdList[i].id);
            trainerTrackList.add(t);
        }
        Insert trainerTrackList;

        list<Location__c> LocIdList = [SELECT id, name FROM location__c];
        Room__c newRoom1 = new Room__c(name='Test Room 1', location__c=LocIdList[0].id, Room_Number__c= 100, Capacity__c=20);
        Room__c newRoom2 = new Room__c(name='Test Room 2', location__c=LocIdList[0].id, Room_Number__c= 101, Capacity__c=20);
        list<room__c> RoomList = new list<room__c> {newRoom1, newRoom2};
        insert RoomList;

        list<trainerTrack__c> TrainerTrackIdList = [SELECT trackTrainer__r.name FROM trainerTrack__c];
        list<project__c> ProjectList = new list<project__c>();
        project__c newProject = new project__c(name='Test Project', track__c=TrainerTrackIdList[0].trackTrainer__c, Details__c='Test Detail');
        project__c newProject2 = new project__c(name='Test Project2', track__c=TrainerTrackIdList[0].trackTrainer__c, Details__c='Test Detail2');
        ProjectList.add(newProject);
        ProjectList.add(newProject2);
        insert ProjectList;

        list<Room__c> RoomIdList = [SELECT Id, name from Room__c];
        list<project__c> ProjectIDList = [SELECT id FROM Project__c];
        list<training__c> TrainingList = new list<training__c> ();
        Training__c newTraining = new Training__c(name='Test Training 1', Trainer__c=trainerIdList[0].id, Track__c=TrainerTrackIdList[0].trackTrainer__c,
                                            Room__c=RoomIdList[0].id, Project__c=ProjectIDList[0].id, Batch_Number__c=1000, Start_Date__c = System.today()+1, 
                                            BatchDuration__c=10);
        TrainingList.add(newTraining);
        Training__c newTraining2 = new Training__c(name='Test Training 2', Trainer__c=trainerIdList[1].id, Track__c=TrainerTrackIdList[0].trackTrainer__c,
                                            Room__c=RoomIdList[1].id, Project__c=ProjectIDList[0].id, Batch_Number__c=1001, Start_Date__c = System.today()+1, 
                                            BatchDuration__c=10);
        TrainingList.add(newTraining2);
        insert TrainingList;
    }


    @isTest
    public static void TestTrainingsWithProject(){
        integer result = ChartCalculationController.getTrainingsWithProjects();
        System.assertEquals(2, result);
    }

    @isTest
    public static void TestOverLappedProjects(){
        integer result = ChartCalculationController.getOverlappedProject();
        System.assertEquals(1, result);
    }

    @isTest
    public static void TestNumOfProjects(){
        integer result = ChartCalculationController.getNumProjects();
        System.assertEquals(1, result);
    }
}