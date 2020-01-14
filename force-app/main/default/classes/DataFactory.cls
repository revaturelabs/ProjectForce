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
	- 1.5*N Kanban Columns, three for each project: one with label 'To Do', one with 'Doing', one with 'Done'
   	- Three lists of Tasks for each project, to be exact:
   		> Between 0 and 10 (staggered, using math.mod) Tasks with story "Test" connected to 'To Do' column for that project
   		> Between 0 and 10 (staggered, using math.mod) Tasks with story "Test" connected to 'Doing' column for that project
   		> Between 0 and 10 (staggered, using math.mod) Tasks with and story "Test" connected to 'Done' column for that project
   		> A total of something like 16.5 tasks per project, with much variance
   		> 8.25*N tasks in total inserted in the org, with much variance
   	
   Run the method deleteTestData() to delete all records within the org that DataFactory created.

   any questions, email at ma444699160@gmail.com to Ying Ma
*/

public class DataFactory 
{
    private static final List<string> TNAMES = new List<string> { 'Salesforce', 'Java EE', 'Big Data' };
    private static final List<string> LNAMES = new List<string> { 'Online', 'Reston', 'Florida', 'Texas' };
    private static final List<string> CNAMES = new List<string> { 'To Do', 'Doing', 'Done' };
    
    // Initialize all lists of sObjects for us to insert in the createData() method
    // TO DO: make these vars in the createTestData method and move track and loc methods into it (maybe)
    private static list<Track__c> trackList;
    private static list<Location__c> locList;
    private static list<Trainer__c> TrainerList = new list<trainer__c>();
    private static list<TrainerTrack__c> TrainerTrackList= new list<trainerTrack__c>();
    private static list<Room__c> RoomList= new list<Room__c>();
    private static list<Project__c> ProjectList= new list<project__c>();
    private static list<Training__c> TrainingList= new list<Training__c>();
    private static list<KanbanColumn__c> ColumnList = new list<KanbanColumn__c>();
    private static list<Backlog__c> BacklogList = new List<Backlog__c>();
    
    public static void createTestData(integer numOfRecords)
    {   
        // Insert tracks and locations if you haven't already (only necessary on 1st run)
       	if ( trackList == null ) createTracks();     
		if ( locList == null ) createLocs();
        
        // Insert Trainer records
        for ( integer i = 0 ; i < numOfRecords ; i++ )
        {	trainerList.add(new Trainer__c(name='Test Trainer '+i));
        }
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
        for ( Track__c t : trackList )	// SOQL calls: always 3
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
        
        Map<String, List<KanbanColumn__c> > columnsByName = new Map<String, List<KanbanColumn__c> > ();
        for ( String s : CNAMES ) columnsByName.put(s, new List<KanbanColumn__c>() );
        
        // Insert kanban column records
       	// Loop through CNAMES, the list of labels for our sample kanban columns
        for ( integer i = 0 ; i < CNAMES.size() ; i++ )	// DML statements: always 3
        {	// Add a new list of columns indexed by current label
            columnsByName.put( CNAMES[i], new List<KanbanColumn__c>() );
            // Loop through all projects and add a column attached to that project to the list for this label
            for ( integer j = 0 ; j < numOfRecords / 2 ; j++ )
        	{	columnsByName.get(CNAMES[i]).add
                	(	new KanbanColumn__c(	Name = 'Test',
                                            	Label__c = CNAMES[i],
                                            	Order__c = String.valueOf(i+1),
                                            	Project__c = ProjectList[j].Id
                                           )
                	);
            }
            // Add the new list to the database
            insert columnsByName.get(CNAMES[i]);
        }

		// Insert task records
        for ( integer i = 0 ; i < numOfRecords / 2 ; i++ )
        {	for ( integer j = 0 ; j < Math.mod(i+6, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	KanbanColumn__c=columnsByName.get('To Do')[i].id, 
                                     	Story__c='Test'
                                    )
                				);
            }
            for ( integer j = 0 ; j < Math.mod(i+2, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	KanbanColumn__c=columnsByName.get('Doing')[i].id, 
                                     	Story__c='Test'
                                    )
                				);
            }
         	for ( integer j = 0 ; j < Math.mod(i, 10) + 1 ; j++ )
            {	backlogList.add	(	new Backlog__c
                                 	(	KanbanColumn__c=columnsByName.get('Done')[i].id, 
                                     	Story__c='Test'
                                    )
                				);
            }
        }
        insert backlogList;
        
        // Delete all tasks attached to our projects that don't have the name 'Test'
        // They got inserted in some magical way and we don't have time to figure out how
        List<String> allProjectIDs = new List<String>();
        for (Project__c p : [ SELECT Id FROM Project__c ] )
        {	allProjectIDs.add(p.Id);
        }
        List<KanbanColumn__c> colsToDelete = [ 	SELECT Id, Name, Project__c 
                                            	FROM KanbanColumn__c 
                                            	WHERE Project__c IN : allProjectIDs 
                                            	AND Name !='Test'
                                             ];
        delete colsToDelete;
    }
    // Insert three tracks if you haven't already
    private static void createTracks()
    {	trackList = new list<track__c>();
        for ( integer i = 0 ; i < tnames.size() ; i++ )
        {   track__c t = new track__c(name = tnames[i]);
            trackList.add(t);
        }
        Insert trackList;
    }
    // Insert four locations if you haven't already
    private static void createLocs()
    {	locList= new list<location__c>();
        for(integer i = 0 ; i < lnames.size() ; i++ )
        {   location__c t = new location__c(name=lnames[i], city__c=lnames[i]);
            locList.add(t);
        }
        Insert locList;
    }

    public static void deleteTestData ()
    {	// We only need to delete these five lists from the org
        // Everything else gets cascade deleted and will throw a DMLException if you try
        List<Trainer__c> trainerList = [ 	SELECT id 
                                        	FROM Trainer__c 
                                        	WHERE Name LIKE 'Test Trainer %' 
                                       ];
        if (TrainerList.size() > 0 ) delete TrainerList; 
        List<Backlog__c> backlogList = [ 	SELECT id 
                                        	FROM Backlog__c 
                                        	WHERE Story__c='Test' 
                                       ];
        if (BacklogList.size() > 0 ) delete BacklogList;
        List<Training__c> trainingList = [ 	SELECT id 
                                          	FROM Training__c 
                                          	WHERE Name LIKE 'Test Training %' 
                                         ];
        if (trainingList.size() > 0 ) delete trainingList;
        // Get lists of the dummy tracks and locations in the org
        List<Track__c> trackList = new List<Track__c>();
        for ( String s : tnames ) // SOQL calls: always 3
            trackList.addAll( [ SELECT id FROM Track__c WHERE Name=:s] );
        List<Location__c> locList = new List<Location__c>();
        for ( String s : lnames ) // SOQL calls: always 4
            locList.addAll( [ SELECT id FROM Location__C WHERE Name=:s ] );
        if (TrackList.size() > 0 ) delete TrackList; 
        if (LocList.size() > 0 ) delete LocList;
    }
}

/*    columnList.add( new KanbanColumn__c
                           		(	Name='Test',
                                 	Label__c='To Do',
                                 	Order__c='1',
                                 	Project__c=ProjectList[i].Id
                                ) 
                          );
            columnList.add( new KanbanColumn__c
                           		(	Name='Test',
                                 	Label__c='Doing',
                                 	Order__c='2',
                                 	Project__c=ProjectList[i].Id
                                )
                          );
            columnList.add( new KanbanColumn__c
                           		(	Name='Test',
                                 	Label__c='Done',
                                 	Order__c='3',
                                 	Project__c=ProjectList[i].Id
                                ) 
                          );
        }*/
        // System.debug(columnList.size());
        
        // Get full list of Kanban columns in projects mapped to the column's name
        //Map<String, List<KanbanColumn__c> > columnsByName = new Map<String, List<KanbanColumn__c> > ();
        /*for ( String s : CNAMES )	// SOQL calls: always 3
			columnsByName.put( s, [	SELECT Id, Name, Label__c, Project__c 
                                   	FROM KanbanColumn__c 
                                   	WHERE Name='Test' 
                                   	AND Label__c=:s 
                                  ] 
                             );
        */