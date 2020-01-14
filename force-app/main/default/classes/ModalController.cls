//change "without sharing" to "with sharing" when deploying
public without sharing class ModalController {
    //All queries are done when modal is loaded
    static List<Project__c> ProjectList = [SELECT Name, ProjectComplete__c, track__r.name, (SELECT ProjectStartDate__c FROM Trainings__r ORDER BY ProjectStartDate__c desc LIMIT 1) FROM Project__c];
    static List<training__c> trainingList = [SELECT Id, batchsize__c, room__r.location__r.name, track__r.Name, room__r.Name, trainer__r.Name, Project__r.Name FROM training__c];

    @AuraEnabled
    public static Training__c getBatch(String trainingID){
        Training__c selectedBatch = new Training__c();
        try {
            if (schema.SObjectType.location__c.isAccessible()) {
                List<Training__c> batch = [SELECT ID, Batch_Number__c, BatchSize__c, Track__r.Name, ProjectStartDate__c, Project__r.Name, Project__r.Id, Trainer__r.Name, Room__r.Name, Room__r.Location__r.Name FROM Training__c WHERE Id =: Id.valueOf(trainingID) LIMIT 1];

                selectedBatch = batch[0];
                return selectedBatch;
            } else {
                return null;
            }
        } catch(Exception e) {
            throw new AuraHandledException('Batch cannot be found');
        }
    }

    // Gets Projects based on the Batch's training track (e.g. Salesforce) 
	@AuraEnabled
    public static List<Project__c> getProject(String trackName, Date startDateName){
        try{
            if (schema.SObjectType.Project__c.isAccessible()){
                List<Project__c> projectListByTrack = [SELECT ID, Name, ProjectComplete__c, Track__r.Name FROM Project__c WHERE Track__r.Name =: trackName];
                return projectListByTrack;
            }else{
                return null;
            }
        //Catch logic below
        } catch(Exception e){
            throw new AuraHandledException('custom message');
        } finally{
            //Finally logic goes in here
        }
    } 

    //Saves changes to selected batch (training) 
    @auraEnabled
    public static boolean Save(String trainingId, string newProjectName, String newComment){
        id newProjectId = [SELECT Id, ProjectComplete__c FROM Project__c WHERE name = :newProjectName LIMIT 1].id;
        Training__c newTraining=[SELECT id, Project__c, Comments__c FROM Training__c WHERE id = : Id.valueOf(trainingID) LIMIT 1];

        if (newTraining.Comments__c==null){
            newTraining.Comments__c=' ';
        }
        newTraining.Comments__c =  newComment + '\n' + newTraining.Comments__c;
        newTraining.Project__c=newProjectId;

        database.saveResult result = Database.update(newTraining);
        return result.isSuccess();
    }
    
    //New Apex Method in order to update the checkbox status values inside the Project__c and Training__c objects
    @auraEnabled
    public static void updateCheckBoxStatusRecord(Project__c projectStatusToUpdate, Training__c reviewStatusToUpdate){
        UPDATE projectStatusToUpdate;
        UPDATE reviewStatusToUpdate;
    }
}