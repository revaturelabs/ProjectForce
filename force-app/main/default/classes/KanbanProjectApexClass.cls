public with sharing class KanbanProjectApexClass {
    @AuraEnabled
    public static List<Backlog__c> getBacklogs(String project) {
        return [
            SELECT 
                Id, Name, Story__c, NumberOfCardLabels__c,
                CardLabel1__c, CardLabel1__r.Text__c, CardLabel1__r.Color__c, 
                CardLabel2__c, CardLabel2__r.Text__c, CardLabel2__r.Color__c,
                CardLabel3__c, CardLabel3__r.Text__c, CardLabel3__r.Color__c,
                DateLogged__c, PullRequest__c, Stage__c, Project__c, Project__r.Name, 
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

    //this is adding a new column
    @AuraEnabled
    public static Backlog__c addNewBacklog(String stage, String story, String l1, String l2, String l3, String c1, String c2, String c3, String project){

        //added by fw
        //check for existing backlog first
        Backlog__c backlog = new Backlog__c();
        List<Backlog__c> existingBlogs = getBacklogs( project );

        for(Backlog__c obj : existingBlogs)
        {
            if(obj.Stage__c == stage)
            {
                backlog = obj;
            }
        }

        if (l1 == null){
            // System.debug('No Label');
            
            backlog.Story__c = story;
            backlog.Stage__c = stage;
            backlog.Project__c = project;

            //changed by fw
            upsert backlog;
            //fw
            //List<Backlog__c> bLogs = [SELECT Id, Name FROM Backlog__c WHERE Project__c=:project LIMIT 1];
            //addColumnToDB(project, bLogs.get(0).Id);
         
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

            //changed by fw
            upsert backlog;
            //fw
            //List<Backlog__c> bLogs = [SELECT Id, Name FROM Backlog__c WHERE Project__c=:project LIMIT 1];
            //addColumnToDB(project, bLogs.get(0).Id);


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

            //changed by fw
            upsert backlog;
            //fw
            //List<Backlog__c> bLogs = [SELECT Id, Name FROM Backlog__c WHERE Project__c=:project LIMIT 1];
            //addColumnToDB(project, bLogs.get(0).Id);
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

            //changed by fw
            upsert backlog;
            //fw
            //List<Backlog__c> bLogs = [SELECT Id, Name FROM Backlog__c WHERE Project__c=:project LIMIT 1];
            //ddColumnToDB(project, bLogs.get(0).Id);
            

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

    //Added by fw
    //3 new functions to Create/Read/Delete Kanban columns
    @AuraEnabled
    public static List<KanbanColumn__c> getColumnsFromDB(String projectId){
        List<KanbanColumn__c> kans;
        try 
        {
            kans = [SELECT Id, Name FROM KanbanColumn__c WHERE Project__r.Id=:projectId];        
        } catch (Exception e) {
            System.debug(e);
        }
        return kans;
    }
    

    @AuraEnabled
    public static List<KanbanColumn__c> addColumnToDB(String projectId, String bLogId){
        List<KanbanColumn__c> ret;
        try 
        {
            Backlog__c b;
            if(null == bLogId){
                //get the backlog from the project if no backlogs are passed to this function
                b = [SELECT Id, Name FROM Backlog__c WHERE Project__c=:projectId LIMIT 1];
                bLogId = b.Id;
            }
            //need to actually add new backlog here ??
            //addNewBacklog();

            Integer count = [SELECT COUNT() FROM KanbanColumn__c];
            
            List<KanbanColumn__c> backLogLst = [SELECT Backlog__c FROM KanbanColumn__c WHERE Project__r.Id=:projectId LIMIT 1];
            KanbanColumn__c existingKcol;
            Id backlogId;
            if(backLogLst.size() > 0) 
            { 
                existingKcol = backLogLst.get(0);
                backlogId = existingKcol.Backlog__c;
            }
            KanbanColumn__c col = new KanbanColumn__c();
            //need multiple backlogs here ? array of backlog id's ??
            System.debug('backlogId -> ' + backlogId);
            col.Backlog__c = (null != backlogId ? backlogId : bLogId);//backlogId;
            col.Name = 'Column' + count; 
            col.Project__c = projectId;
            insert col;
            
        }
        catch(DmlException dmle)
        {
            //no backlog found ?
            System.debug(dmle.getMessage());
            //say that there aren't any backlogs
            ret = new List<KanbanColumn__c>();
            return ret; // ?
        } 
        catch (Exception e) {
            System.debug(e.getMessage());
        }
        return getColumnsFromDB(projectId);
    }

    //Added by fw
    // delete backlog ?
    @AuraEnabled
    public static List<Backlog__c> deleteBacklogFromDB(String id, String projectId){
        List<Backlog__c> kans;
        try 
        {
            Integer count = [SELECT COUNT() FROM Backlog__c WHERE Project__r.Id=:projectId];
            if(count >= 0)
            {
                //kans = [SELECT Name FROM KanbanColumn__c WHERE Id=:id LIMIT 1];        
                kans = [SELECT Name FROM Backlog__c WHERE Id=:id LIMIT 1];        
                delete kans;
            }
        } catch (Exception e) {
            System.debug(e);
        }
        return kans;
    }
    
}