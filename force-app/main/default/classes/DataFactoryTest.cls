@isTest
public class DataFactoryTest 
{
    @TestSetup
    static void makeData ()
    {	// DataFactory.createTestData(200);
    }
    
    @isTest
    static void runTest ()
    {	// Check that testsetup put in all the records we'd expect
        DataFactory.createTestData(200);
        list<Track__c> tracks = [ SELECT Id FROM Track__c ];
        list<Location__c> locations = [ SELECT Id FROM Location__c ];
        list<Trainer__c> trainers = [ SELECT Id FROM Trainer__c ];
        list<TrainerTrack__c> trainertracks = [ SELECT Id FROM TrainerTrack__c ];
        list<Room__c> rooms = [ SELECT Id FROM Room__c ];
        list<Project__c> projects = [ SELECT Id FROM Project__c ];
        list<Training__c> trainings = [ SELECT Id FROM Training__c ];
        List<KanbanColumn__c> columns = [ SELECT Id FROM KanbanColumn__c ];
        list<Backlog__c> backlogs = [ SELECT Id FROM Backlog__c ];
        System.assertEquals( 3, tracks.size() );
        System.assertEquals( 4, locations.size() );
        System.assertEquals( 200, trainers.size() );
        System.assertEquals( 200, trainertracks.size() );
        System.assertEquals( 200, rooms.size() );
        System.assertEquals( 100, projects.size() );
        System.assertEquals( 200, trainings.size() );
        System.assertEquals( 300, columns.size() );
        System.assert( backlogs.size() > 800 );
        
        // Check that we can delete all records
        DataFactory.deleteTestData();
        tracks = [ SELECT Id FROM Track__c ];
        locations = [ SELECT Id FROM Location__c ];
        trainers = [ SELECT Id FROM Trainer__c ];
        trainertracks = [ SELECT Id FROM TrainerTrack__c ];
        rooms = [ SELECT Id FROM Room__c ];
        projects = [ SELECT Id FROM Project__c ];
        trainings = [ SELECT Id FROM Training__c ];
       	columns = [ SELECT Id FROM KanbanColumn__c ]; 
        backlogs = [ SELECT Id FROM Backlog__c ];
        System.assertEquals( 0, tracks.size() );
        System.assertEquals( 0, locations.size() );
        System.assertEquals( 0, trainers.size() );
        System.assertEquals( 0, trainertracks.size() );
        System.assertEquals( 0, rooms.size() );
        System.assertEquals( 0, projects.size() );
        System.assertEquals( 0, trainings.size() );
        System.assertEquals( 0, columns.size() );
        System.assertEquals( 0, backlogs.size() );
    }

}