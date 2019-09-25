//change without sharing to with sharing when deploying
public without sharing class ModalController {
	@Auraenabled

    //Return a list of locations available
    public static list<location__c> getLocation(){
        try{
            if (schema.SObjectType.location__c.isAccessible()){
                list<location__c> locList = [SELECT name FROM Location__c];
                return locList;
            }else{
                return null;
            }
        //Catch logic below
        }catch(Exception e){
            throw new AuraHandledException('custom message');
            
        }finally{
            //Finally logic goes in here
        }
    }


	@AuraEnabled
    //Replace account with actual objects
    public static List<Trainer__c> getTrainer(String locationName){
        try{
            if (schema.SObjectType.Account.isAccessible()){
            	//list<Trainer__c> TrainerList = [SELECT name FROM Trainer__c];
                List<Trainer__c> TrainerList = [select name, (select name, room__r.location__r.Name from trainings__r) from trainer__c];
                Map<string, Trainer__c> trainerMap= new Map<string, Trainer__c>();
                for(Trainer__c t: TrainerList){
                    for(Training__c tg: t.trainings__r){
                        trainerMap.put(tg.room__r.location__r.name,t);
                    }
                }

                list<trainer__c> filterTrainerList = new list<trainer__c>();
                for(string s : trainerMap.keyset())
                {
                    if(s==locationName){
                        filterTrainerList.add(trainerMap.get(s));
                    }
                	//System.debug(t.Name + ' ' + trainerMap.get(t));
                }
                System.debug(filterTrainerList);
                return filterTrainerList;
            }else{
                return null;
            }
        //Catch logic below
        }catch(Exception e){
            throw new AuraHandledException('custom message');
            
        }finally{
            //Finally logic goes in here
        }
    } 








}