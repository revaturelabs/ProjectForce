public class Test {
    public static void test(){
        for(integer i = 0; i < 10 ; i++){
        	Integer randomDate = Integer.valueof((Math.random() * 60));
            Date day = system.today();
            Date someDate = day.addDays(randomDate); 
            System.debug(someDate); 	   
        }
        
        /*
    	List<Trainer__c> tList = [select name, (select name, room__r.location__r.Name from trainings__r) from trainer__c];
        Map<Trainer__c, String> trainerMap= new Map<Trainer__c, String>();
        for(Trainer__c t: tList){
            for(Training__c tg: t.trainings__r){
                trainerMap.put(t, tg.room__r.location__r.name);
                //system.debug(t.name + ' ' + tg.room__r.location__r.name);   
            }
        }    
        for(Trainer__c t : trainerMap.keyset())
        {
           System.debug(t.Name + ' ' + trainerMap.get(t));
        }
		*/
    }
}