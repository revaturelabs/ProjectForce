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

    @AuraEnabled
    public static List<String> getProjects(Id backlog){
        List<Project__c> rawProjects =[SELECT Name FROM Project__c WHERE Id =:backlog];
        List<String> projects = new List<String>();
        projects.add(rawProjects[0].Name);
        rawProjects =[SELECT Name FROM Project__c WHERE Id !=:backlog];
        for(Project__c p: rawProjects){
            projects.add(p.Name);
        }
        return projects;
    }

    @AuraEnabled
    public static List <Backlog__c> saveBacklogs(List<Backlog__c> backlogs) {
        update backlogs;
        return backlogs;
    }

    @AuraEnabled
    public static Id findProject(String name){
        Project__c project = [SELECT Id FROM Project__c WHERE Name =:name];
        return project.Id;
    }

    
}