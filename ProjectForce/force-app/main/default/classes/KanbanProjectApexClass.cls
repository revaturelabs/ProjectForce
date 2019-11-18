public with sharing class KanbanProjectApexClass {
    @AuraEnabled
    public static List<Backlog__c> getBacklogs(String project) {
        return [
            SELECT 
                Id, Name, Story__c, NumberOfCardLabels__c,
                CardLabel1__c, CardLabel1__r.Text__c, CardLabel1__r.Color__c, 
                CardLabel2__c, CardLabel2__r.Text__c, CardLabel2__r.Color__c,
                CardLabel3__c, CardLabel3__r.Text__c, CardLabel3__r.Color__c,
                Stage__c, Project__c, Project__r.Name, 
                StartDateTime__c, EndDateTime__c, DueDate__c  
            FROM  Backlog__c
            WHERE Project__c =: project];
    }

    @AuraEnabled
    public static Backlog__c saveBacklog(Backlog__c backlog) {
        // Perform isUpdateable() checking first, then
        upsert backlog;
        return backlog;
    }

    @AuraEnabled
    public static Backlog__c addNewBacklog(String stage, String story, String l1, String l2, String l3, String c1, String c2, String c3, String project){


        Backlog__c backlog = new Backlog__c();

        if (l1 == null){
            // System.debug('No Label');
            
            backlog.Story__c = story;
            backlog.Stage__c = stage;
            backlog.Project__c = project;

            insert backlog;
         
        }

        else if (l2 == null){
            // System.debug('One Label');

            CardLabel__c cl1 =  new CardLabel__c();
            cl1.Text__c = l1;
            cl1.Color__c = c1;

            insert cl1;

            System.debug(cl1);

            backlog.Story__c = story;
            backlog.Stage__c = stage;
            backlog.CardLabel1__c = cl1.Id;
            backlog.Project__c = project;

            insert backlog;


        }

        else if (l3 == null){
            // System.debug('Two Labels');

            List<sObject> labels = new List<sObject>();

            CardLabel__c cl1 =  new CardLabel__c();
            cl1.Text__c = l1;
            cl1.Color__c = c1;
            labels.add(cl1);



            CardLabel__c cl2 =  new CardLabel__c();
            cl2.Text__c = l2;
            cl2.Color__c = c2;
            labels.add(cl2);

            insert labels;


            backlog.Story__c = story;
            backlog.Stage__c = stage;
            backlog.CardLabel1__c = cl1.Id;
            backlog.CardLabel2__c = cl2.Id;
            backlog.Project__c = project;

            insert backlog;

        }

        else {
            // System.debug('Three Labels');


            List<sObject> labels = new List<sObject>();

            CardLabel__c cl1 =  new CardLabel__c();
            cl1.Text__c = l1;
            cl1.Color__c = c1;
            labels.add(cl1);



            CardLabel__c cl2 =  new CardLabel__c();
            cl2.Text__c = l2;
            cl2.Color__c = c2;
            labels.add(cl2);


            CardLabel__c cl3 =  new CardLabel__c();
            cl3.Text__c = l3;
            cl3.Color__c = c3;
            labels.add(cl3);

            insert labels;


            backlog.Story__c = story;
            backlog.Stage__c = stage;
            backlog.CardLabel1__c = cl1.Id;
            backlog.CardLabel2__c = cl2.Id;
            backlog.CardLabel3__c = cl3.Id;
            backlog.Project__c = project;

            insert backlog;



        }
        

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