public with sharing class KanbanProjectApexClass {
    @AuraEnabled
    public static List<Backlog__c> getBacklogs(String project) {
        return [SELECT Id, Name, Story__c, Stage__c, Project__c, 
                       DateLogged__c 
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