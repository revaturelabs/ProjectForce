public without sharing class ChartCalculationController {
    static List<training__c> trainingList = [SELECT Id, project__c, Start_Date__c FROM training__c];
    static List<project__c> projectList = [SELECT Id, (SELECT projectStartDate__c FROM trainings__r ORDER BY projectStartDate__c ASC) FROM project__c];

    //Get the number of trainings with a project
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

    //Get the number of overlapping project
    @AuraEnabled
    public static Integer getOverlappedProject(){
        date today = System.today();
        Integer overlapCount=0;

        //filter out projects that ended before today
        list<project__c> projectsAfterToday=new list<project__c>();
        for (project__c p:projectList){
            if(p.trainings__r.size()==0){
                continue;
            }else if(p.trainings__r[p.trainings__r.size()-1].projectStartDate__c >= (today-21)){
                projectsAfterToday.add(p);
            }
        }

        for(project__c p: projectsAfterToday){
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

    //Get the number of project ended after today
    @AuraEnabled
    public static integer getNumProjects(){
        date today = System.today();
        list<project__c> projectsAfterToday=new list<project__c>();
        for (project__c p:projectList){
            if(p.trainings__r.size()==0){
                continue;
            }else if(p.trainings__r[p.trainings__r.size()-1].projectStartDate__c >= (today-21)){
                projectsAfterToday.add(p);
            }
        }
        return projectsAfterToday.size();
        
    }
}