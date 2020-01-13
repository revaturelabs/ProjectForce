public with sharing class KanbanProjectApexClass {

    //Added by B.D. and F.W
    //get the kanban columns in the DB
    @AuraEnabled
    public static List<KanbanColumn__c> getKanbanColumns(String project) {
        return [
            SELECT Id, Name, Label__c, Order__c
            FROM  KanbanColumn__c
            WHERE Project__c =: project
            ORDER BY Order__c ASC
        ];
    }

    // Return list of options for the order picklist
    // To increase number of Columns add to order picklist
    @AuraEnabled
    public static List<String> getOrderOptions(String project) {
        // Query for the count of related Columns
        Integer ColumnCount = [Select Count()
            From KanbanColumn__c
            Where Project__c =: project
            ];
        // Add the order values to the list 
        // Also add the size of the list plus one
        List<String> orderOptions = new List<String>();
        for (Integer i=1; i<=(ColumnCount+1); i++ ) {
            orderOptions.add(String.valueOf(i));
        }
        return orderOptions;
    }

    // Add new column and reorder related columns
    @AuraEnabled
    public static KanbanColumn__c addNewColumn(String stage, String project, String order){
        KanbanColumn__c kan = new KanbanColumn__c();
        List<KanbanColumn__c> kanbanList = new List<KanbanColumn__c>();
        
        // Query for related Columns based on Project ID
        kanbanList = [ SELECT Id, Name, Label__c, Order__c
            FROM  KanbanColumn__c
            WHERE Project__c =: project
            ORDER BY Order__c ASC ];
        
        // Insert new Column
        try 
        {
            kan.Label__c = stage;
            kan.Project__c = project;
            kan.order__c = order;
            insert kan;  
        } catch (Exception e) 
        {
            System.debug(e.getMessage());
        }

        // Iterate Through list and change the order
        // Because Query is run before the insert of the new column
        // the new column is not included in the list
        // This makes the new column the only column with this order value
        Integer newOrder = Integer.ValueOf(order);
        try 
        {
            for (KanbanColumn__c kanban : kanbanList) {
                if (kanban.order__c == String.ValueOf(newOrder)) {
                    newOrder++;
                    kanban.order__c = String.ValueOf(newOrder);
                }
            }
            update kanbanList;
        } catch (Exception e) 
        {
            System.debug(e.getMessage());
        }
        return kan;
    }

    // Delete a column and reorder the other columns
    @AuraEnabled
    public static void removeColumn(String label, String project){
        KanbanColumn__c kanban= new KanbanColumn__c();
        List<KanbanColumn__c> kanbanList = new List<KanbanColumn__c>();
        try 
        {
            // Query for single Column based on the label
            // Think about using Column ID instead
            kanban = [SELECT Id, Name, Order__c 
                FROM KanbanColumn__c 
                WHERE Label__c=:label AND Project__c=:project 
                Limit 1];

            // The spot where the Column about to be deleted is in the order
            Integer DeletedOrderSpot = Integer.Valueof(kanban.Order__c);
            
            // Delete column if theres no label duplicates
            // Add in error message 
            /* if(kanban.size() > 0)
            {
                  
            } */
            delete kanban;

            // Query all related Columns to reorder
            kanbanList = [ SELECT Id, Name, Label__c, Order__c
                FROM  KanbanColumn__c
                WHERE Project__c =: project
                ORDER BY Order__c ASC ];
            // set Updated OrderSpot one above the deleted column
            Integer UpdatedOrderSpot = DeletedOrderSpot + 1;
            for (KanbanColumn__c kanbanSingle : kanbanList) {
                if (kanbanSingle.order__c == String.ValueOf(UpdatedOrderSpot)) {
                    kanbanSingle.order__c = String.ValueOf(DeletedOrderSpot);
                    UpdatedOrderSpot++;
                    DeletedOrderSpot++;
                }
            }
            update kanbanList;
        } catch (Exception e) {
            System.debug(e.getMessage());
        }
    }
    
    @AuraEnabled
    public static List<Backlog__c> getBacklogsProject(String projectId) {
        return [
            SELECT 
                Id, Name, Story__c, NumberOfCardLabels__c,
                CardLabel1__c, CardLabel1__r.Text__c, CardLabel1__r.Color__c, 
                CardLabel2__c, CardLabel2__r.Text__c, CardLabel2__r.Color__c,
                CardLabel3__c, CardLabel3__r.Text__c, CardLabel3__r.Color__c,
                DateLogged__c, PullRequest__c, Stage__c, Project__c, Project__r.Name, 
                StartDateTime__c, EndDateTime__c, DueDate__c, KanbanColumn__c 
            FROM  Backlog__c
            WHERE Project__c =: projectId
        ];
    }

    // Return list of Backlogs related to a Column
    @AuraEnabled
    public static List<Backlog__c> getBacklogs(String columnId) {
        return [
            SELECT 
                Id, Name, Story__c, NumberOfCardLabels__c,
                CardLabel1__c, CardLabel1__r.Text__c, CardLabel1__r.Color__c, 
                CardLabel2__c, CardLabel2__r.Text__c, CardLabel2__r.Color__c,
                CardLabel3__c, CardLabel3__r.Text__c, CardLabel3__r.Color__c,
                DateLogged__c, PullRequest__c, Stage__c, Project__c, Project__r.Name, 
                StartDateTime__c, EndDateTime__c, DueDate__c, KanbanColumn__c 
            FROM  Backlog__c
            WHERE KanbanColumn__c =: columnId
        ];
    }

    @AuraEnabled
    public static Backlog__c saveBacklog(Backlog__c backlog) {
        // Perform isUpdateable() checking first, then
        upsert backlog;
        return backlog;
    }

    // Refactor String Names
    @AuraEnabled
    public static List<Backlog__c> addNewBacklog(String columnId, String story, String l1, String l2, String l3, String c1, String c2, String c3, String project, String stage) {

        Backlog__c backlog = new Backlog__c();
        try {
            
            backlog.KanbanColumn__c = columnId;
            backlog.Story__c = story;
            //insert backlog;
        } 
        catch(Exception e)
        {
            System.debug(e.getMessage());
        }
        
        if (l1 == null){
            // System.debug('No Label');
            
            //backlog.Project__c = project;
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
            //backlog.Project__c = project;

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
            //backlog.Project__c = project;

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
            //backlog.Project__c = project;
            insert backlog;
        } 
        return getBacklogs(columnId);
    }
    
    @AuraEnabled
    public static List<String> getProjects(Id backlog){
        List<Project__c> rawProjects =[SELECT Name 
                                       FROM Project__c 
                                       WHERE Id =:backlog];
        List<String> projects = new List<String>();
        projects.add(rawProjects[0].Name);
        rawProjects =[SELECT Name 
                      FROM Project__c 
                      WHERE Id !=:backlog];
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

    @AuraEnabled
    public static /*List<Backlog__c>*/void removeCard(String card, String story){
        Backlog__c obj;
        //ID colId;
        try 
        {
            obj = [SELECT Id, Name, KanbanColumn__c FROM Backlog__c WHERE Id=:card AND Story__c=:story LIMIT 1];
            //colId = obj.KanbanColumn__c;
            delete obj;
        } catch (Exception e) 
        {
            System.debug(e.getMessage());
        }
        //return getBacklogs(colId);
    }

    @AuraEnabled
    public static void updateColumn(String stage, String title, String projectId){
        KanbanColumn__c obj;
        //ID colId;
        try 
        {
            obj = [SELECT Id, Name FROM KanbanColumn__c WHERE Id=:stage AND Project__c=:projectId LIMIT 1];
            obj.Label__c = title;
            update obj;
        } catch (Exception e) 
        {
            System.debug(e.getMessage());
        }
    }

    @AuraEnabled
    public static void updateCard(String card, String story){
        Backlog__c obj;
        //ID colId;
        try 
        {
            obj = [SELECT Id, Name, KanbanColumn__c FROM Backlog__c WHERE Id=:card LIMIT 1];
            obj.Story__c = story;
            update obj;
        } catch (Exception e) 
        {
            System.debug(e.getMessage());
        }
    }
}