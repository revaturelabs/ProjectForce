public with sharing class KanbanProjectApexClass {
    @AuraEnabled
    public static List<Backlog__c> getBacklogs() {
        return [SELECT Id, Name, Story__c, Stage__c, Project__c, Training__c, 
                       DateLogged__c 
                FROM Backlog__c];
    }

    @AuraEnabled
    public static Backlog__c saveBacklog(Backlog__c backlog) {
        // Perform isUpdateable() checking first, then
        upsert backlog;
        return backlog;
    }
}