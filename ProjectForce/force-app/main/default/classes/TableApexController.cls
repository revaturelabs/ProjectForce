public with sharing class TableApexController {
    @AuraEnabled
    public static List<sObject> getTableData(String queryObject, List<String> queryFields){
        if(Schema.sObjectType.Training__c.isAccessible()){
            String fields = queryFields[0];
            for(Integer i=1;i<queryFields.size();i++){
                fields += ', ' + queryFields[i];
            }
            String queryString = 'SELECT ' + fields + ' FROM ' + queryObject;
            return Database.query(queryString);
        }
        else{
            return new List<sObject>();
        }
    }
}
