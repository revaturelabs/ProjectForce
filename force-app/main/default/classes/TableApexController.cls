public with sharing class TableApexController {
    @AuraEnabled
    public static List<sObject> getTableData(String queryObject, List<String> queryFields){
        String fields = queryFields[0];
        for(Integer i=1; i<queryFields.size(); i++){
            fields += ',' + queryFields[i];
        }
        String queryString = 'SELECT ' + fields + ' FROM ' + queryObject + ' WITH SECURITY_ENFORCED';
        return Database.query(queryString);
    }

    @AuraEnabled
    public static void updateTableData(List<sObject> itemsToUpdate){
        UPDATE itemsToUpdate;
    }
}