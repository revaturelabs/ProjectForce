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
     	// Negative case, add col to null project (throws DMLException presumably)
     	Track__c salesforce = [ SELECT Id FROM Track__c WHERE Name = 'Salesforce' LIMIT 1 ];
     	Project__c emptyProj = new Project__c( Name='ProjectForce', Track__c=salesforce.Id );
     	KanbanColumn__c neg1 = KanbanProjectApexClass.addNewColumn(stage, emptyProj.Id, order);
     	// Negative case, add col to project without cols
     	insert emptyProj;
     	KanbanColumn__c bad = KanbanProjectApexClass.addNewColumn(stage, emptyProj.id, order);
    }
    
    @isTest
    static void testRemoveCol()
    {
        // Positive, Expected Delete COlumn
        string project = [ SELECT Id FROM Project__c LIMIT 1 ].id;
        String label = 'To Do';
        KanbanProjectApexClass.removeColumn(label, project);
        
        // Negative, Input a wrong label
        label = 'Wrong label';
        try{
            KanbanProjectApexClass.removeColumn(label, project);
        }
        catch (Exception e)
        {
            System.debug(e.getMessage());
            System.assertEquals('List has no rows for assignment to SObject', e.getMessage());
        }
        
        // Testing Security would be nice
    }

    @isTest
    static void testgetBacklogs () {
        // Positive, pass in a valid ID
        string column = [ SELECT Id FROM KanbanColumn__c LIMIT 1 ].id;
        List<Backlog__c> backlogs = new List<Backlog__c>();
        backlogs = KanbanProjectApexClass.getBacklogs(column);
       	System.debug(backlogs);
        
        // Negative, pass in nonvalid ID
        try{
            column = 'Not a Valid ID';
            KanbanProjectApexClass.getBacklogs(column);
        }
        catch (Exception e)
        {
            System.debug(e.getMessage());
            //System.assertEquals('List has no rows for assignment to SObject', e.getMessage());
        }
    }
    
    @isTest
    public static void testSaveBacklog() {
        // Query, change Stage and then Save one Backlog
        Backlog__c backlog = new Backlog__c();
        backlog = [Select Id, Stage__c From Backlog__c Limit 1];
        backlog.Stage__c = 'Done';
        KanbanProjectApexClass.saveBacklog(backlog); 
        
        // Query, change Stage, and then Save a List of Backlogs
        List<Backlog__c> backlogs = new List<Backlog__c>();
        backlogs = [Select Id, Stage__c From Backlog__c Limit 50];
        for (backlog__c b : backlogs) {
            b.Stage__c = 'Done';
        }
        KanbanProjectApexClass.saveBacklogs(backlogs);
    }
    
    @isTest
    public static void testaddNewBacklog() {
        // Positive, pass in a valid ID
        string column = [ SELECT Id FROM KanbanColumn__c LIMIT 1 ].id;
        String Story = 'Order 66';
        List<Backlog__c> backlogs = new List<Backlog__c>();
        backlogs = KanbanProjectApexClass.addNewBacklog(column, story);
        System.debug(backlogs);
        
        // Negative, pass in non valid ID
        try{
            column = 'Not a Valid ID';
            KanbanProjectApexClass.addNewBacklog(column, story);
        }
        catch (Exception e)
        {
            System.debug(e.getMessage());
            //System.assertEquals('List has no rows for assignment to SObject', e.getMessage());
        }
        
    }
}   
/*
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