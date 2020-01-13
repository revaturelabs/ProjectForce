@isTest
public with sharing class KanbanProjectTest {

    @TestSetup
    static void testSetup() {
        DataFactory.createTestData(200);
    }
    
    @isTest
    static void testKanbanColumns ()
    {   string project = [ SELECT Id FROM Project__c LIMIT 1 ].id;
        List<KanbanColumn__c> expected = [	SELECT Id, Name, Label__c, Order__c
            								FROM KanbanColumn__c
                							WHERE Project__c =: project
                                         	ORDER BY Order__c ASC
        								 ];
        List<KanbanColumn__c> actual = KanbanProjectApexClass.getKanbanColumns(project);
        System.assertEquals(expected, actual);
    }
    
    @isTest
    static void testOrderOptions ()
    {	string project = [ SELECT Id FROM Project__c LIMIT 1 ].id;
     	List<string> expected = new List<string> { '1', '2', '3', '4' };
     	List<string> actual = KanbanProjectApexClass.getOrderOptions(project);
        System.assertEquals(expected, actual);
    }
    
    @isTest
    static void testAddCol ()
    {	string stage = 'Sprint Backlog';
     	string project = [ SELECT Id FROM Project__c LIMIT 1 ].id;
     	string order = '1';
     	KanbanColumn__c expected = KanbanProjectApexClass.addNewColumn(stage, project, order);
        KanbanColumn__c actual = [ 	SELECT Id, Label__c, Project__c, Order__c 
                                  	FROM KanbanColumn__c 
                                  	WHERE Label__c =: stage
                                  	AND Project__c =: project
                                  	AND Order__c =: order
                                 ];
     	System.assertEquals(expected, actual);
     	// TODO: Test negative cases and throw exceptions
    }
}
    /*
    @isTest
    public static void testSaveBacklog() {
        // Query, change Stage and then Save one Backlog
        Backlog__c backlog = new Backlog__c();
        backlog = [Select Id, Stage__c From Backlog__c Where Stage__c = 'Doing' Limit 1];
        backlog.Stage__c = 'Done';
        KanbanProjectApexClass.saveBacklog(backlog); 
        
        // Query, change Stage, and then Save a List of Backlogs
        List<Backlog__c> backlogs = new List<Backlog__c>();
        backlogs = [Select Id, Stage__c From Backlog__c Where Stage__c = 'Doing'];
        for (backlog__c b : backlogs) {
            b.Stage__c = 'Done';
        }
        KanbanProjectApexClass.saveBacklogs(backlogs);
    }
    
    @isTest
    public static void testgetBacklogs () 
    {   // Query for one project
        Project__c project = new Project__c();
        project = [Select Id, Name, (Select Id, Stage__c From Backlogs__r) From Project__c Limit 1];
        // Mimick the method but only fetch id from each backlog
        List<Backlog__c> expBacklogs = [ SELECT Id FROM Backlog__c WHERE Project__c =: project.Id ];
        List<Backlog__c> backlogs = KanbanProjectApexClass.getBacklogs(project.Id);
        System.assertEquals(expBacklogs.size(), backlogs.size());        
    }
    
    @isTest
    public static void testAddBacklogs ()
    {										// Test no labels
        KanbanProjectApexClass.addNewBacklog(	'Doing', 'Get test coverage to 90%', 
                                             	null, null, null, 
                                             	null, null, null, null
                                            );	// Test one label
        KanbanProjectApexClass.addNewBacklog(	'Doing', 'Get test coverage to 90%', 
                                             	'Label1', null, null, 
                                             	null, null, null, null
                                            );	// Test two labels
        KanbanProjectApexClass.addNewBacklog(	'Doing', 'Get test coverage to 90%', 
                                             	'Label1', 'Label2', null, 
                                             	null, null, null, null
                                            );	// Test one of many fail cases
        KanbanProjectApexClass.addNewBacklog(	'Doing', 'Get test coverage to 90%', 
                                             	'Label1', 'Label2', 'Label3', 
                                             	null, null, null, null
                                            );*/