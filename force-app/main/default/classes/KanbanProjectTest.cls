@isTest
public with sharing class KanbanProjectTest {

    @TestSetup
    public static void testSetup() {
        DataFactory.createTestData(200);
    }
    
    @isTest
    public static void testSaveBacklog() {
        // Query and then Save one Backlog
        Backlog__c backlog = new Backlog__c();
        backlog = [Select Id, Stage__c From Backlog__c Where Stage__c = 'Doing' Limit 1];
        backlog.Stage__c = 'Done';
        KanbanProjectApexClass.saveBacklog(backlog); 
        
        // Query and then Save a List of Backlogs
        List<Backlog__c> backlogs = new List<Backlog__c>();
        backlogs = [Select Id, Stage__c From Backlog__c Where Stage__c = 'Doing'];
        for (backlog__c b : backlogs) {
            b.Stage__c = 'Done';
        }
        KanbanProjectApexClass.saveBacklogs(backlogs);
    }
    @isTest
    public static void testgetBacklogs() {
        // Query for one project
        Project__c project = new Project__c();
        project = [Select Id, Name, (Select Id, Stage__c From Backlogs__r) From Project__c];
        List<Backlog__c> backlogs = new List<Backlog__c>();
        
        // System.assertEquals(KanbanProjectApexClass.)
        
    }
}