public with sharing class TableApexController {
    @AuraEnabled
    public static List<Training__c> getTableData(String queryObject, List<String> queryFields){
        if(Schema.sObjectType.Training__c.isAccessible()){
            String fields = queryFields[0];
            for(Integer i=1;i<queryFields.size();i++){
                fields += ', ' + queryFields[i];
            }
            String queryString = 'SELECT ' + fields + ' FROM ' + queryObject;
            return Database.query(queryString);
        }
        else{
            return new List<Training__c>();
        }
    }

    @AuraEnabled
    public static Boolean updateTableData(List<sObject> itemsToUpdate){
        try{
            update itemsToUpdate;
            return true;
        }
        catch(Exception e){
            return false;
        }
    }
}
