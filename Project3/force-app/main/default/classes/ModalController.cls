public with sharing class ModalController {
	@Auraenabled
    //Replace account with actual objects
    public static list<account> getAccount(){
        try{
            if (schema.SObjectType.Account.isAccessible()){
            	list<account> AccList = [SELECT name FROM account];
                return AccList;
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