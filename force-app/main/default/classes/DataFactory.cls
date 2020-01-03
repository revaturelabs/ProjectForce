////////////////////////////////////////////
//    Test Data Factory
//    Created by: Ying Ma, Frank Yang
//    V2 created by: Brady Achterberg, Bailey Dawson
//    Created date: 9/24/2019
//    V2 creation date: 1/3/2020
//    Instructions:
//    Run the method createTestData(integer numOfRecords) to generate data in the org
//    Run the method deleteTestData() to delete all test data within the org.  Warning: this will also delete existing data
//
//    any questions, email at ma444699160@gmail.com to Ying Ma
////////////////////////////////////////////

// Consider making direct test class for datafactory

public class DataFactory 
{
    private static list<Track__c> trackList;
    private static list<Location__c> locList;
    
    private static void createTracks()
    {	trackList = new list<track__c>();
     	// Make dummy tracks with three plausible sample names
     	List<String> tnames = new List<String> { 'Salesforce', 'Java EE', 'Big Data' }; 
        for ( integer i = 0 ; i < tnames.size() ; i++ )
        {   track__c t = new track__c(name = tnames[i]);
            trackList.add(t);
        }
        Insert trackList;
    }
    
    private static void createLocs()
    {
        locList= new list<location__c>();
        // Make dummy locations at four plausible spots
        list<string> lnames = new list<string> { 'Online', 'Reston', 'Florida', 'Texas' };
        for(integer i = 0 ; i < lnames.size() ; i++ )
        {   location__c t = new location__c(name=lnames[i], city__c=lnames[i]);
            locList.add(t);
        }
        Insert locList;
    }
    
    public static void createTestData(integer numOfRecords)
    {    
        // Insert Trainer records
        list<trainer__c> TrainerList = new list<trainer__c>();
        for ( integer i = 0 ; i < numOfRecords-1 ; i++ )
        {	Trainer__c t = new Trainer__c(name='Test Trainer '+i);
            TrainerList.add(t);
        }
        TrainerList.add(new trainer__c(name='External'));  // Not sure yet what this is for
        Insert TrainerList;

		if ( trackList == null ) createTracks();     
		if ( locList == null ) createLocs();

        //Insert Trainer Track Records
        list<trainerTrack__c> TrainerTrackList= new list<trainerTrack__c>();
        // list<track__c> trackIdList = [SELECT id, name FROM track__c];

        // Add n trainers split evenly between the 3 tracks
        for( integer i = 0 ; i < numOfRecords ; i++ )
        {   trainerTrack__c t = new trainerTrack__c
            (	name='Test Trainer Track '+i, 
             	trackTrainer__c = trackList[ math.mod( i, trackList.size() ) ].id,
             	trainerTrack__c = trainerList[i].id
            );
            trainerTrackList.add(t);
        }
        Insert trainerTrackList;

        //Insert Room records
        list<Room__c> RoomList= new list<Room__c>();
        list<Location__c> LocIdList = [SELECT id, name FROM location__c];

        for(integer i = 0; i<numOfRecords-1; i++){
            Integer randomNumber = Integer.valueof((Math.random() * (LocIdList.size()-1))+1);
            Room__c r = new Room__c(name='Test Room '+i, location__c=LocIdList[randomNumber].id, Room_Number__c= 100+i, Capacity__c=20);
            RoomList.add(r);
        }
        Room__c online = new Room__c(name='Online', location__c=LocIdList[0].id, Room_Number__c=0, Capacity__c=0);
        RoomList.add(online);
        Insert RoomList;

        //Insert Project Records
        list<project__c> ProjectList= new list<project__c>();
        list<trainerTrack__c> TrainerTrackIdList = [SELECT trackTrainer__r.name FROM trainerTrack__c];

        for(integer i = 0; i<numOfRecords/2; i++){
            project__c t = new project__c(name='Test Project '+i, track__c=TrainerTrackIdList[i].trackTrainer__c, Details__c='Test Detail '+i);
            ProjectList.add(t);
        }
        Insert ProjectList;  

        //Insert Training Records
        list<Training__c> TrainingList= new list<Training__c>();
        list<Project__c> ProjectIdList = [SELECT Id, name, track__c, track__r.name FROM Project__c];
        list<Room__c> RoomIdList = [SELECT Id, name from Room__c];

        //Generate three lists of projects based on tracks
        list<project__c> SalesforceProject = new list<project__c>();
        list<project__c> JavaEEProject = new list<project__c>();
        list<project__c> BigDataProject = new list<project__c>();
        for(project__c p : ProjectIDList){
            if(p.track__r.name == 'Salesforce'){
                SalesforceProject.add(p);
            }else if(p.track__r.name == 'Java EE'){
                JavaEEProject.add(p);
            }else if(p.track__r.name == 'Big Data'){
                BigDataProject.add(p);
            }
        }

        //Assign the right project list based on the track
        for(integer i = 0; i<numOfRecords; i++){
            list<project__c> ProjectIDAssign = new list<project__c>();
            integer randomProject;
            if(TrainerTrackIdList[i].trackTrainer__r.name == 'Salesforce'){
                Integer randomProjectNumber = SalesforceProject.size();
                randomProject = Integer.valueof((Math.random() * randomProjectNumber));
                ProjectIDAssign = SalesforceProject;

            }else if (TrainerTrackIdList[i].trackTrainer__r.name == 'Java EE'){
                Integer randomProjectNumber = JavaEEProject.size();
                randomProject = Integer.valueof((Math.random() * randomProjectNumber));
                ProjectIDAssign = JavaEEProject;

            }else if(TrainerTrackIdList[i].trackTrainer__r.name == 'Big Data'){
                Integer randomProjectNumber = BigDataProject.size();
                randomProject = Integer.valueof((Math.random() * randomProjectNumber));
                ProjectIDAssign = BigDataProject;
            }

            Integer randomDate = Integer.valueof((Math.random() * 60));
            Integer batchDuration = Integer.valueof((Math.random() * 3)+10);
            Integer batchSize = Integer.valueof((Math.random() * 20));
            Date day = system.today();
            Date someDate = day.addDays(randomDate); 
            Training__c t = new Training__c(name='Test Training '+i, Trainer__c=trainerList[i].id, Track__c=TrainerTrackIdList[i].trackTrainer__c,
                                            Room__c=RoomIdList[i].id, Project__c=ProjectIDAssign[randomProject].id, Batch_Number__c=1000+i, Start_Date__c = someDate, 
                                            BatchDuration__c=batchDuration, Color__c='#F26925', BatchSize__c=batchSize);
            TrainingList.add(t);
        }
        Insert TrainingList;
        createTasks(); 
    }

    public static void deleteTestData(){
        List<track__c> trackList = [SELECT Id FROM track__c];
        List<trainer__c> trainerList = [SELECT Id FROM trainer__c];
        List<location__c> locationList = [SELECT Id FROM location__c];
        List<Backlog__c> backlogList = [SELECT Id FROM Backlog__c];
        if(trackList.size() > 0)
            delete trackList;
        if(trainerList.size() > 0)
            delete trainerList;
        if(locationList.size() > 0)
            delete locationList;
        if(backlogList.size() > 0)
            delete backlogList;
    }

    private static void createTasks() {
        List<Project__c> projects = [SELECT Id FROM Project__c];
        List<Backlog__c> backlogsToInsert = new List<Backlog__c>();

        for (Project__c p: projects) {
            Double randomToDo = Math.random() * 5.0;
            for (Integer i = 0; i < randomToDo; i++) {
                backlogsToInsert.add(new Backlog__c(Project__c=p.Id, Story__c='Test', Stage__c='To Do'));
            }

            Double randomDoing = Math.random() * 5.0;
            for (Integer i = 0; i < randomDoing; i++) {
                backlogsToInsert.add(new Backlog__c(Project__c=p.Id, Story__c='Test', Stage__c='Doing'));
            }

            Double randomDone = Math.random() * 5.0;
            for (Integer i = 0; i < randomDone; i++) {
                backlogsToInsert.add(new Backlog__c(Project__c=p.Id, Story__c='Test', Stage__c='Done'));
            }
        }

        insert backlogsToInsert;
    }
}