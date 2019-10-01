public without sharing class ChartCalculationController {
    static List<training__c> trainingList = [SELECT Id, project__c, Start_Date__c FROM training__c];
    static List<project__c> projectList = [SELECT Id, (SELECT projectStartDate__c FROM trainings__r ORDER BY projectStartDate__c ASC) FROM project__c];

    public ChartCalculationController() {

    }

    @AuraEnabled
    public static Integer getTrainingsWithProjects(){
        Integer trainingsCount=0;
        Date Today = system.today();
        for(training__c t: trainingList){
            if(t.project__c != null && t.Start_Date__c >= Today){
                trainingsCount++;
            }
        }
        return trainingsCount;
    }

    @AuraEnabled
    public static Integer getOverlappedProject(){
        Integer overlapCount=0;
        for(project__c p: projectList){
            if(p.trainings__r.size()<=1){
                continue;
            }
            else{
                for(Integer i = 0; i < p.trainings__r.size()-1; i++){
                    Date ProjectDate = p.trainings__r[i].projectStartDate__c;
                    Date nextProjectDate = p.trainings__r[i+1].projectStartDate__c;
                    if((nextProjectDate >= ProjectDate) &&  (nextProjectDate <= (ProjectDate+21))){
                        System.debug(overlapCount);
                        overlapCount++;
                        break;
                    }
                }
            }
        }
        return overlapCount;
    }
}