public class chart1Controller {
     @AuraEnabled
    public static List<Integer> getData(){
       
        // For this example, it's just a static data but it can be generated 
        // as per any business logic
        List<Integer> lstData = new List<Integer>();
        lstData.add(1);
        return lstData;
    }
     
    public class NameThisClass {
        @AuraEnabled public String age;
        @AuraEnabled public Integer candidates;
         
        public NameThisClass( String age, Integer candidates ) {
            this.age = age;
            this.candidates = candidates;
        }
    }

}