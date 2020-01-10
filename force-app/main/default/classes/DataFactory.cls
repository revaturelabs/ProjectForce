/* Test Data Factory
   Created by: Ying Ma, Frank Yang
   V2 created by: Brady Achterberg, Bailey Dawson
   Created date: 9/24/2019
   V2 creation date: 1/3/2020
   Instructions:
   
   Run the method createTestData(integer numOfRecords) to generate data in the org.
   It creates the following records:
   
   	- 3 predetermined Tracks if you don't have them already
   	- 4 predetermined Locations if you don't have them already
   	- N-1 Trainers with names "Test Trainer (0-n)" and one with name "External"
   	- N TrainerTracks, one connecting to each trainer, N/3 connected to each Track (using math.mod)
   	- N Rooms, N/4 connected to each Location (using math.mod), numbered 100+(0-n)
   	- N/2 Projects with names "Test Project (0-n/2)", N/6 connected to each Track (indexed via TrainerTrack)
   	- N Trainings with the following attributes:
   		> Name "Test Training (0-n)"
   		> Connected to one trainer
   		> Connected to that trainer's track
   		> Connected to a project in that track (we map a list of projects to a track to ensure this)
   		> Batch Number between 1000 and 1000+n
   		> Start Date between 5 days from today and 5+n days from today
   		> Batch Size between 10 and 20 (N/10 evenly in each amount, using math.mod)
   		> Color and Batch Duration are set to defaults, e.g. orange and 10 weeks respectively
   	- Three lists of Tasks for each project, to be exact:
   		> Between 0 and 10 (staggered, using math.mod) Tasks with stage "To Do" and story "Test"
   		> Between 0 and 10 (staggered, using math.mod) Tasks with stage "Doing" and story "Test"
   		> Between 0 and 10 (staggered, using math.mod) Tasks with stage "Done" and story "Test"
   		> A total of something like 16.5 tasks per project, with much variance
   		> 8.25*N tasks in total inserted in the org, with much variance
   	
   Run the method deleteTestData() to delete all records within the org that DataFactory created.

   any questions, email at ma444699160@gmail.com to Ying Ma
*/

public class DataFactory 
{
    // Initialize all lists of sObjects for us to insert in the createData() method
    private static list<Track__c> trackList;
    private static list<Location__c> locList;
    private static list<Trainer__c> TrainerList = new list<trainer__c>();
    private static list<TrainerTrack__c> TrainerTrackList= new list<trainerTrack__c>();
    private static list<Room__c> RoomList= new list<Room__c>();
    private static list<Project__c> ProjectList= new list<project__c>();
    private static list<Training__c> TrainingList= new list<Training__c>();
    private static list<Backlog__c> BacklogList = new List<Backlog__c>();
    
    public static void createTestData(integer numOfRecords)
    {   
        // Insert tracks and locations if you haven't already (only necessary on 1st run)
       	if ( trackList == null ) createTracks();     
		if ( locList == null ) createLocs();
        
        // Insert Trainer records
        for ( integer i = 0 ; i < numOfRecords-1 ; i++ )
        {	trainerList.add(new Trainer__c(name='Test Trainer '+i));
        }
        trainerList.add(new trainer__c(name='External'));  // Not sure yet what this is for
        insert trainerList;


        // Insert Trainer Track Records
        // Add one for each trainer, dividing the trainers evenly among the tracks
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
        for(integer i = 0; i < numOfRecords ; i++ )
        {   Room__c r = new Room__c
                (	name = 'Test Room ' + i, 
                 	location__c = locList[math.mod( i, locList.size() )].id, 
                 	Room_Number__c = 100 + i, 
                 	Capacity__c = 20
                );
            RoomList.add(r);
        }
        Insert RoomList;

        //Insert Project Records
        for(integer i = 0; i < numOfRecords/2 ; i++ )
        {	Project__c p = new project__c(	name = 'Test Project '+i, 
                                          	track__c = TrainerTrackList[i].trackTrainer__c, 
                                          	Details__c = 'Test Detail '+i
                                         );
            ProjectList.add(p);
        }
        Insert ProjectList;  

        // Get full list of dummy projects for each track mapped to the track's name
        Map<String, List<Project__c> > projectsByTrack = new Map<String, List<Project__c> > ();
        for ( Track__c t : trackList )
        	projectsByTrack.put(t.Name, [	SELECT Id, Name, Track__c, Track__r.name 
                                            FROM Project__c 
                                            WHERE Name LIKE 'Test Project %'
                                            AND Track__r.name =: t.Name
                                        ]
                               );
        // Get a list of all trainertracks with associated track names
        list<trainerTrack__c> TrackTrainers = [	SELECT Id, trackTrainer__r.name 
                                               	FROM trainerTrack__c
                                              ];
        
        // Insert Training Records
        for ( integer i = 0 ; i < numOfRecords ; i++ )
        {   // Assign the right project list based on the track for this trainer
            List<project__c> ProjectIDAssign = new list<project__c>();
         	ProjectIDAssign = projectsByTrack.get(TrackTrainers[i].trackTrainer__r.name);
         	Training__c t = new Training__c
                (	name='Test Training ' + i, 
					Trainer__c = trainerList[i].id, 
					Track__c = TrainerTrackList[i].trackTrainer__c,
                	Room__c = RoomList[i].id, 
					Project__c = ProjectIDAssign[Math.mod(i, ProjectIDAssign.size())].id, 
					Batch_Number__c = 1000+i, 
                 	Start_Date__c = system.today().addDays(5 + i), 
                    BatchDuration__c = 10, 
                 	Color__c = '#F26925', 
                 	BatchSize__c = 10 + Math.mod(i, 10)
                );
            TrainingList.add(t);
        }
        Insert TrainingList;
        
		// Insert task records
        for ( integer i = 0 ; i < numOfRecords / 2 ; i++ )
        {	for ( integer j = 0 ; j < Math.mod(i+6, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	Project__c=ProjectList[i].Id, 
                                     	Story__c='Test', 
                                     	Stage__c='To Do'
                                    )
                				);
            }
            for ( integer j = 0 ; j < Math.mod(i+2, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	Project__c=ProjectList[i].Id, 
                                     	Story__c='Test', 
                                     	Stage__c='Doing'
                                    )
                				);
            }
         	for ( integer j = 0 ; j < Math.mod(i, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	Project__c=ProjectList[i].Id, 
                                     	Story__c='Test', 
                                     	Stage__c='Done'
                                    )
                				);
            }
        }
        insert backlogList;
    }
    // Insert three tracks if you haven't already
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
    // Insert four locations if you haven't already
    private static void createLocs()
    {	locList= new list<location__c>();
        // Make dummy locations at four plausible spots
        list<string> lnames = new list<string> { 'Online', 'Reston', 'Florida', 'Texas' };
        for(integer i = 0 ; i < lnames.size() ; i++ )
        {   location__c t = new location__c(name=lnames[i], city__c=lnames[i]);
            locList.add(t);
        }
        Insert locList;
    }
    
	// TODO : Refactor to delete records based SOQL queries and known dummy fields (maybe)
    public static void deleteTestData ()
    {	// We only need to delete these four lists from the org
        // Everything else gets cascade deleted and will throw a DMLException if you try
    	if (TrackList != null ) delete TrackList; 
        if (LocList != null ) delete LocList;
        delete TrainerList; 
        delete BacklogList;
    }
}