public with sharing class KanbanProjectApexClass {
    @AuraEnabled
    public static List<Backlog__c> getBacklogs(String project) {
        return [SELECT Id, Name, Story__c, Stage__c, Project__c, Project__r.Name, 
                       StartDateTime__c, EndDateTime__c, DueDate__c 
                FROM Backlog__c
                WHERE Project__c =: project];
    }

    @AuraEnabled
    public static Backlog__c saveBacklog(Backlog__c backlog) {
        // Perform isUpdateable() checking first, then
        upsert backlog;
        return backlog;
    }
}