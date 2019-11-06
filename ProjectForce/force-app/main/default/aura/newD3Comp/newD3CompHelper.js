({
    ////////////////////////////////////////////
    //    Gantt Chart Javascript Helper Class
    //    Created by: William Brown, Chao Chen, Auroiah Morgan, Geoffrey Murray
    //    First Published: 9/24
    //    Purpose: To Provide abstracted functionality for the ProjectForce Gantt Chart.
    //    *********************Functions included:****************************
    //    	array(SimpleTraining) = sortArray(SimpleTraining array, string)
    //    	|	takes an array of SimpleTraining Objects and sorts according to
    //    	|	the category listed in sortBy
    //    	
    //    	Chart = createChart(canvas, barOptions__stacked, data, list of colors, string to sort by)
    //    	|	creates chart using barOptions, data, and colors, and puts it on the canvas
    //    	
    //    	updateData(component)
    //    	|	find data in the tempList attribute and update the chart to display the data in tempList
    //    	|	additionally, reapply colors, to ensure continuity.
    //    	
    //    	Array(Integers) = convertDate(array of strings)
    //    	|	converts given array into an array of integers for the x-axis
    //    	
    //    	Array(SimpleTraining) filterData(track string, Location string, Date string, chart, SimpleTraining array, component)
    //    	|	take selected filter values, and find any SimpleTraining objects which match either
    //    	|	the location or the track, and start after the date given. then store the data in
    //    	|	tempList and run updateData to update the chart with the new tempList.
    //    	
    //    	setInitFilterValues(component, event)
    //    	|	set the initial values displayed and stored in the Filters, the SortBy, and the Color boxes
    //    	
    //    	Array(SimpleTraining) = applyColors(available tracks, colors selected, chart, SimpleTraining Array)
    //    	|	take the data given, and for each one, figure out which track, and assign color accordingly.
    //    	|	Note: the track array must be filtered before being passed in, so as to remove the "All" category.
    //    	|	Also, the colors array passed in is specifically the options selected in the colors section of
    //    	|	the component. NOT the colors already assigned to each SimpleTraining object.			
    //    
    //    If you have any questions, please email Geoffrey Murray @ geoffrey.murray.1995@gmail.com
    ////////////////////////////////////////////
    
    //Bubble Sort based on Sort By Filter
    sortArray:function(sortThis, sortColors, sortBy) {
        // console.log('newD3CompHelper.sortArray()');
        //Bubble sort each item in the array
        for(var currItem = 0; currItem < sortThis.length; currItem++) {
            for (var j = 0; j < sortThis.length-1; j++) 
                //compare the field on the SimpleTraining object with the category selected
                switch(sortBy) {
                    case 'Track':
                        if (JSON.stringify(sortThis[j].trackName) > JSON.stringify(sortThis[j+1].trackName)) { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp;
                            var tempColor = sortColors[j]; 
                            sortColors[j] = sortColors[j+1]; 
                            sortColors[j+1] = tempColor; 
                        }
                        break;
                    case 'Project':
                        if (JSON.stringify(sortThis[j].project) > JSON.stringify(sortThis[j+1].project)) { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp;
                            var tempColor = sortColors[j]; 
                            sortColors[j] = sortColors[j+1]; 
                            sortColors[j+1] = tempColor;
                        }
                        break;
                    case 'Date':
                        if (JSON.stringify(sortThis[j].startDate) > JSON.stringify(sortThis[j+1].startDate)) { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp;
                            var tempColor = sortColors[j]; 
                            sortColors[j] = sortColors[j+1]; 
                            sortColors[j+1] = tempColor; 
                        }
                        break;
                    case 'Trainer':
                        if (JSON.stringify(sortThis[j].trainer) > JSON.stringify(sortThis[j+1].trainer)) { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp;
                            var tempColor = sortColors[j]; 
                            sortColors[j] = sortColors[j+1]; 
                            sortColors[j+1] = tempColor;
                        }
                        break;
                } 
        } 
        return sortThis;
    }, 
    
    
    //creating the chart and passing in data
    createChart : function(ctx, options, dataSet, userColors, sortBy) {
        // console.log('newD3CompHelper.createChart()');

        //First, sort the data passed in according to the value in sortBy
        dataSet = this.sortArray(dataSet, sortBy);   

        //Here we take the dataset and split it into several different arrays to make it easier to use.
        var startTimes = [];
        var tracks =  [];
        var trainers = [];
        var projects = [];
        var rooms = [];
        for(let i = 0; i < dataSet.length; i++) {
            startTimes[i] = dataSet[i].startDate;
            tracks[i] = dataSet[i].name;
            projects[i] = dataSet[i].project;
            trainers[i] = dataSet[i].trainer;
            rooms[i] = dataSet[i].room; // not on Training__c pagelayout
        }
        // console.log("sample data: " + JSON.stringify(dataSet[3], null, 2));
        // location, name, project, room, startDate, trackName, trainer, trainingId
        
        //Once we have the startDates, we need it as an int.
        var days = this.convertDate(startTimes);
        
        //currently no reason to believe the duration of a project will be longer than 3 weeks.
        var batchDuration = [];
        var defaultDuration = 21;
        for(var i = 0; i < days.length; i++) batchDuration[i] = defaultDuration;
        
       //Setting the minimum date and maximum date displayed by the chart.
       //This is based on the first and last dates in the data passed in.
        var minDate = days[0];
        var maxDate = days[0];
        for(var i = 0; i < days.length - 1; i++) {
            if(days[i] >= maxDate) {
                maxDate = days[i] + 25;
            }
            if(days[i] <= minDate) {
                minDate = days[i] -1;
            }
        }
           
        maxDate += defaultDuration;
        //Set the keys in the options Javascript Object equal to the values just generated
        // options.scales.xAxes[0].ticks.beginAtZero = false;
        options.scales.xAxes[0].ticks.max = maxDate;
        options.scales.xAxes[0].ticks.min = minDate;
        options.scales.xAxes[0].offset = false;
        
        //Create the labels that show up on the sides and when hovered over.
        let tracksAndProjects = [];
        for(let i = 0; i < days.length; i++){
            var some = `${tracks[i]} - ${projects[i]} - ${trainers[i]}`;
            tracksAndProjects[i] = some;
        }
        
        //This is going to build the Chart. By this point the data has been brought in through dataSet
        //and it's been split into separate arrays, so that way it's easier to use in the Chart creation.
        return new Chart(ctx, {    
            type: 'horizontalBar',
            events:[],
            data: {
                labels: tracksAndProjects,
                datasets: [ {
                        //example of how to reference something in here: chart.data.datasets[0].data[i]
                        //This data is when the project is supposed to start
                        data: days,
                        backgroundColor: "rgba(63,103,126,0)" 
                        }, {
                        //example of how to reference something in here: chart.data.datasets[1].data[i]
                        //Data here is the duration of the project
                        data: batchDuration,
                        backgroundColor: userColors,
                    }
                ]
            },
            //This is where we describe the axes. Check the barOptions_stacked variable to see what we are setting here.
            options: options,
        });
    },
    
    //When a user selects a sort by filter, it will automatically sort the 
    //chart
    updateData : function(component)
    {
        //grabbing the attributes from the component that we will be
        //either using or updating
        var chart = component.get('v.dasChart');
        var data = component.get('v.tempList');
        // var currTracks = component.get('v.Tracks');
        var currColors = component.get('v.DisplayColors');
        //console.log('here\'s the data currently being displayed: '+chart.data.datasets[0].data);
        
         //declare arrays to hold new data being passed in
         var startDates = [];
         var holdBatchName = [];
         var holdColors = [];
         var holdProject = [];
         var holdLabels = [];
         var holdTrainers = [];
         //console.log('here\'s the data: '+data);
         for(var i = 0; i < data.length; i++) {
            startDates[i] = data[i].startDate;
            holdBatchName[i] = data[i].name;
            holdProject[i] = data[i].project;
            holdTrainers[i] = data[i].trainer;
         }
         //console.log('here are the colors about to be used: '+ currColors);
         for(let i =0;i<holdBatchName.length;i++){
             var some = `${holdBatchName[i]} - ${holdProject[i]} - ${holdTrainers[i]}`;
             holdLabels[i] = some;
         }
        //I'm pretty sure this combined with the chart.data.datasets[1].background color
        //don't actually do anything. But who knows, maybe I'm wrong.
        holdColors = currColors;
		
        //assign new values to the chart properties
        chart.data.datasets[1].backgroundColor = holdColors;
        chart.data.datasets[0].data = this.convertDate(startDates);
        chart.data.labels = holdLabels;
        //log the changes
        //console.log('list of colors list: '+holdColors);
        //console.log('converted dates' + this.convertDate(startDates));
        //console.log('last data of dates: '+chart.data.datasets[0].data);
        //update. Until this command is run, none of the changes are actually applied to the chart.
        chart.update();
    },
    
    /*	convert date method used for converting the date into a integer because the chart only takes in integers as data and not actual date
    */
    convertDate : function(data){
        
        //declare necessary variables
        var arraySize = data.length;
        var d = [];
        var dIntoInt = [];
        // console.log('convertDate has been entered.');
        //for all the data being passed in, take the string, and turn it into a number
        for(let currTI = 0; currTI<arraySize; currTI++)
        {
           //take the string and make it a date string readable by JS, then seperating it into month day and year
           var date = new Date(data[currTI]);
            var month = date.getMonth()+1;
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            
            var currentDate = new Date();
            var currentYear = currentDate.getUTCFullYear();
            
            /*	Checking the date year being passed in is within this year or next year; Don't want to show data that old or way far ahead.
             * 	The chart only takes in integers as data, thus, the work around is taking the date and generate it into an integer
             * 	then in the x-axis tick, it'll do a callback with the integer value as the index of the array already set and return the value date.
            */
            if(year>=currentYear && year<=(currentYear+1)) {
		//if this the date year is this current year
                if(year==currentYear) {
                    /*	Checking the date year is a leap year; 366 days
                     * 	1-31 is jan 1-31, 32-60 is feb 1-29, etc. 
                     * 	Takes the date and generate it into a integer within 366 days for leap year or 365 for normal year
                    */ 
                    if(year%4==0) {
                        if(month == 1) {
                            d[currTI] = day;
                        } else if(month == 2) {
                            d[currTI] = day + 31;
                        } else if(month == 3) {
                            d[currTI] = day + 31 + 29;
                        } else if(month == 4) {
                            d[currTI] = day + 31 + 29 + 31;
                        } else if(month == 5) {
                            d[currTI] = day + 31 + 29 + 31 + 30;
                        } else if(month == 6) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31;
                        } else if(month == 7) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30;
                        } else if(month == 8) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31;
                        } else if(month == 9) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31;
                        } else if(month == 10) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30;
                        } else if(month == 11) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31;
                        } else if(month == 12) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30;
                        } 
                    } else {
                        if(month == 1) {
                            d[currTI] = day;
                        } else if(month == 2) {
                            d[currTI] = day + 31;
                        } else if(month == 3) {
                            d[currTI] = day + 31 + 28;
                        } else if(month == 4) {
                            d[currTI] = day + 31 + 28 + 31;
                        } else if(month == 5) {
                            d[currTI] = day + 31 + 28 + 31 + 30;
                        } else if(month == 6) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31;
                        } else if(month == 7) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30;
                        } else if(month == 8) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31;
                        } else if(month == 9) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31;
                        } else if(month == 10) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30;
                        } else if(month == 11) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31;
                        } else if(month == 12) {
                            d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30;
                        } 
                    }
                } else if(year==(currentYear+1)) {
                    //checking if it's a leap year
                    if(year%4==0) {
                        if(month == 1) {
                            d[currTI] = day + 365;
                        } else if(month == 2) {
                            d[currTI] = day + 31 + 365;
                        } else if(month == 3) {
                            d[currTI] = day + 31 + 29 + 365;
                        } else if(month == 4) {
                            d[currTI] = day + 31 + 29 + 31 + 365;
                        } else if(month == 5) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 365;
                        } else if(month == 6) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 365;
                        } else if(month == 7) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 365;
                        } else if(month == 8) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 365;
                        } else if(month == 9) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 365;
                        } else if(month == 10) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 365;
                        } else if(month == 11) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 365;
                        } else if(month == 12) {
                            d[currTI] = day + 31 + 29 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 365;
                        } 
		      //checks if the previous year is a leap year, because if the previous year was a leap year then the current data year cannot be a leap year.
                    } else {
                        if((year-1)%4==0) {
                            if(month == 1) {
                                d[currTI] = day + 366;
                            } else if(month == 2) {
                                d[currTI] = day + 31 + 366;
                            } else if(month == 3) {
                                d[currTI] = day + 31 + 28 + 366;
                            } else if(month == 4) {
                                d[currTI] = day + 31 + 28 + 31 + 366;
                            } else if(month == 5) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 366;
                            } else if(month == 6) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 366;
                            } else if(month == 7) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 366;
                            } else if(month == 8) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 366;
                            } else if(month == 9) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 366;
                            } else if(month == 10) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 366;
                            } else if(month == 11) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 366;
                            } else if(month == 12) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 366;
                            }  
                        } else {
                            if(month == 1) {
                                d[currTI] = day + 365;
                            } else if(month == 2) {
                                d[currTI] = day + 31 + 365;
                            } else if(month == 3) {
                                d[currTI] = day + 31 + 28 + 365;
                            } else if(month == 4) {
                                d[currTI] = day + 31 + 28 + 31 + 365;
                            } else if(month == 5) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 365;
                            } else if(month == 6) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 365;
                            } else if(month == 7) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 365;
                            } else if(month == 8) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 365;
                            } else if(month == 9) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 365;
                            } else if(month == 10) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 365;
                            } else if(month == 11) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 365;
                            } else if(month == 12) {
                                d[currTI] = day + 31 + 28 + 31 + 30 + 31 + 30 + 31 + 31 + 30 + 31 + 30 + 365;
                            }  
                        }
                    }
                }
                
            }
            
            //console.log(tracks[currTI]);   
        }
        // console.log('D: '+d);
        return d;
        
    },
    
    filterData:function(selectedTrack, selectedLocation, selectedDate, chart, allData, component)
    {
        // console.log('filter data has been entered');
        //declare necessary variables
        var correctData = [];
        var correctDataCounter = 0;
        var correctColors = [];
        
        //If the filters haven't been used yet, assign the "all" field to them
        //This is so it doesn't throw off the rest of the loop
        if(selectedTrack == "")
        {
            selectedTrack = "All";
        }
        if(selectedLocation == "")
        {
            selectedLocation = "All";
        }
        
        //Take the date given and store it in an array
        var compareToDate = [];
        compareToDate[0] = selectedDate;
        
        //take the dates of the data and store them in an array
        var dataDates = [];
        for(let i = 0; i<allData.length; i++)
        {
            dataDates[i] = JSON.stringify(allData[i].startDate);
        }
        
        //convert the arrays from arrays of strings into arrays of numbers
        dataDates = this.convertDate(dataDates);
        compareToDate = this.convertDate(compareToDate);
        
        //console logs
        // console.log('This was the selected track: ' +selectedTrack);
        // console.log('This was the selected Location: ' +selectedLocation);
        // console.log('This is the compare To Date: ' +compareToDate[0]);
        // console.log('This is the list of dataDates: ' + dataDates);
        
        //For each record, determine if it meets the Filter Criteria.
        for(var currData = 0;currData < allData.length; currData++)
        {
            //**********************Filter Logic*****************
            
            //If either selectbox had an actual value, the code enters this if statement
            if((selectedTrack!="All" || selectedLocation!="All"))
            {
                // console.log('currently checking allData[currData].name: ' + JSON.stringify(allData[currData].trackName))
                // console.log('date int: ' + dataDates[currData])
                
                
                 //If the current record has the correct name or location, and the project starts after the listed date,
                //enter
                if((JSON.stringify(allData[currData].trackName) == selectedTrack 
                    && JSON.stringify(allData[currData].location) == selectedLocation)) 
                   //&& compareToDate[0] <= dataDates[currData])
                {
                    //Add the current record to the array to be set as the current data
                    // console.log('the second if statement has been entered.');
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                    // console.log('a correct match has been found' + correctData[correctDataCounter]);
                }

                else if(JSON.stringify(allData[currData].trackName) == selectedTrack 
                    && selectedLocation == 'All')
                {
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                }
                else if(selectedTrack == 'All' 
                    && JSON.stringify(allData[currData].location) == selectedLocation)
                {
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                }
                
            } else
            {
                //console.log('the All/All portion');
                correctData = allData;
            }
        }
        
        //once the data has been selected, update the attributes on the page to stay current.
        component.set('v.tempList', correctData);
        component.set('v.DisplayColors', correctColors);
        this.updateData(component);
 
        return correctData;
    }, 
    
    setInitFilterValues: function (component, event) {
        var allTrainings = component.get('v.qTraining');
        //console.log('here are all the trainings');
        //console.log(allTrainings);
        
        //Creating the Track List
        var TrackSet = new Set();
        TrackSet.add("All");
        
        
        //Creating Location List
        var LocationSet = new Set();
        LocationSet.add("All");

        for(var i=0; i<allTrainings.length; i++)
        {
            
            LocationSet.add(JSON.stringify(allTrainings[i].location));
            
            
            TrackSet.add(JSON.stringify(allTrainings[i].trackName));   
        }
        var LocationList = [];
        var LocationListCounter = 0;
        for(let currLocation of LocationSet)
        {
            LocationList[LocationListCounter]=currLocation;
            LocationListCounter++;
        }
        var TrackList = [];
        var TrackListCounter = 0;
        // console.log('The current length of TrackSet is: '+ TrackSet.size);
        for(let currTrack of TrackSet)
        {

            TrackList[TrackListCounter]=currTrack;
            TrackListCounter++;
        }

        //Creating Colors
        var UserColors = [];
        var PresetColors = ['#F26925', '#474C55', '#72A4C2', '#FCB414', '#B9B9BA'];
        var currColors = [];
        // console.log('The current length of TrackSet is: '+ TrackSet.size);
        for(var i=0; i<TrackSet.size; i++)
        {
            let colorSelector = (PresetColors.length)%i;

            currColors[i] = PresetColors[colorSelector];
        }

        //console.log('here is LocationList:')
        //console.log(LocationList);
        //console.log('here is the length of the UserColor array: ')
        //console.log(UserColors.length);
        component.set('v.Locations', LocationList);
        component.set('v.Tracks', TrackList);
        
        var allColors = this.applyColors(TrackList, currColors, allTrainings);
        component.set('v.UserColors', allColors);
        component.set('v.DisplayColors', allColors);
        component.set('v.tempList', allTrainings);
        
        //Setting Today's Date
        var today = new Date();
        component.set('v.today', today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
        //Setting User Colors
        
    },
    
    applyColors: function(tracks, colors, allBatches)
    {
        
        var colorsApplied = [];
        var colorsAppliedCounter = 0;
        for(let currBatch = 0; currBatch < allBatches.length; currBatch++)
        {
            // console.log('here is tracks.length: '+tracks.length);
            for(let currTrack = 0; currTrack < tracks.length; currTrack++)
            {
                // console.log('trackName: '+JSON.stringify(allBatches[currBatch].trackName));
                // console.log('tracks[currTrack]: '+tracks[currTrack]);
                if(JSON.stringify(allBatches[currBatch].trackName)==tracks[currTrack])
                {
                    
                    // console.log('The if statement has been entered. The new color is: ' + colors[currTrack]);
                    colorsApplied[colorsAppliedCounter] = colors[currTrack];
                    colorsAppliedCounter++;
                    
                }
            }
        }
         
        return colorsApplied;

    }
    
})