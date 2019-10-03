@isTest
public class TestGantContrller {

    @isTest
    public static void testGantController()
    {
        TestDataFactory.createTestData(20);
        List<GantController.SimpleTraining> allTrainings = new List<GantController.SimpleTraining>();
        allTrainings = GantController.getTrainings();
    }
}