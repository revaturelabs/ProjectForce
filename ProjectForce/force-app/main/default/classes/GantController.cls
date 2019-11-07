public with sharing class GantController {
    
    //getting a list of trainings
    @AuraEnabled
    public static List<SimpleTraining> getTrainings(){
        //Perform isAccessible check here
        String[] trainingAccessFields = new String[]{'Id',
            'Name',
            'Project__c',
            'Room__c',
            'Trainer__c',
            'projectstartdate__c',
            'Track__c' //added
            };
                // Obtain the field name/token map for the Expense object
                Map<String,Schema.SObjectField> m = Schema.SObjectType.Training__c.fields.getMap();
        
        for (String fieldToCheck : trainingAccessFields) {
            
            // Check if the user has access to view field
            if (!m.get(fieldToCheck).getDescribe().isAccessible()) {
                
                // Pass error to client
                throw new System.NoAccessException();
            }
        }
        
        //Simpletraining wrapper apex class
        List<SimpleTraining> simpleTrainings = new List<SimpleTraining>();
        
        // Query the object safely
        List<Training__c> trainings = [SELECT id, name, Track__r.Name, project__r.Name, room__r.Room_Number__c, trainer__r.Name, room__r.Location__r.Name, projectstartdate__c FROM Training__c];
        for(Training__c tc: trainings){
            simpleTrainings.add(new SimpleTraining(tc.id, tc.name, tc.project__r.Name, tc.room__r.Room_Number__c, tc.trainer__r.Name, tc.projectstartdate__c, tc.room__r.Location__r.Name, tc.Track__r.Name));
        }
        
        return simpleTrainings;
        
    }
    
    //getters and setters
    public class SimpleTraining{
        @AuraEnabled public Id trainingId {get; set;}
        @AuraEnabled public String name {get; set;}
        @AuraEnabled public String project {get; set;}
        @AuraEnabled public Decimal room {get; set;}
        @AuraEnabled public String trainer {get; set;}
        @AuraEnabled public Date startDate {get; set;}
        @AuraEnabled public String location {get;set;}
        @AuraEnabled public String trackName {get;set;}
        
        //constructor
        public SimpleTraining(String trainingID, String name, String project, Decimal room, String trainer, Date startDate, String location, String trackName){
            this.trainingId = trainingId;
            this.name = name;
            this.project = project;
            this.room = room;
            this.trainer = trainer;
            this.startDate = startDate;
            this.location = location;
            this.trackName = trackName;
        }
        
        public SimpleTraining(){}
        
        
    }
    
}