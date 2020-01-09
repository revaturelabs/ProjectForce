@isTest
public with sharing class TableControllerTest {
	
    @isTest
    public static void testGetTableData() {
        // testing table data for trainers, only one field
        String queryObject = 'trainer__c';
        List<String> queryFields = new List<String>();
        	queryFields.add('Name');
        System.debug(queryFields);
    	TableApexController.getTableData(queryObject, queryFields);
        
        // testing a object with multiple fields, like project
        queryObject = 'Project__c';
        queryFields.clear();
            queryFields.add('Name');
            queryFields.add('Track__c');
            queryFields.add('Details__c');
        System.debug(queryFields);
    	TableApexController.getTableData(queryObject, queryFields);
        
        // testing security by creating a new new user to run assert with
		String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        				EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        				LocaleSidKey='en_US', ProfileId = p.Id, TimeZoneSidKey='America/Los_Angeles',
         				UserName=uniqueUserName);
        
        //user with Standard User profile should not have access to the records
        System.runAs(u) {
            try {
                TableApexController.getTableData(queryObject, queryFields);
            }
            catch(QueryException e) {
                System.assertEquals(e.getMessage(),'Insufficient permissions: secure query included inaccessible field');     
            }
        }
        
        // testing negative case, invalid field
        /*queryFields.add('InvalidField');
        
        try {
            	TableApexController.getTableData(queryObject, queryFields);
            }
        catch(QueryException e) {
                System.assertEquals(e.(),'No such column 'InvalidField' on entity 'Project__c'');     
            }*/
    }
    
    @isTest
    public static void testSingleItemUpdateTableData() {
        Trainer__c trainer = new Trainer__c();
        trainer.Name = 'Test Trainer';
        List<Trainer__c> trainerList = new List<Trainer__c>();
        trainerList.add(trainer);
        
        // test dml exception
        try {
            	TableApexController.updateTableData(trainerList);
            }
        catch(DmlException e) {
                System.assertEquals(e.getMessage(),'Update failed. First exception on row 0; first error: MISSING_ARGUMENT, Id not specified in an update call: []');     
            }
        
        insert trainer;
        trainerList.clear();
        TableApexController.updateTableData(trainerList);
    }
    
    @isTest
    public static void testBulkItemUpdateTableData() {
        List<Trainer__c> trainerList = new List<Trainer__c>();
        for (Integer i=0; i<25; i++)
            {
               	Trainer__c trainer = new Trainer__c();
        		trainer.Name = 'Test Trainer' +i;
                trainerList.add(trainer);
            } 
        insert trainerList;
        System.debug(trainerList);
        TableApexController.updateTableData(trainerList);
    }
}