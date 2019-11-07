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
                maxDate = days[i];
            }
            if(days[i] <= minDate) {
                minDate = days[i];
            }
        }
        maxDate += defaultDuration;
           
        //Set the keys in the options Javascript Object equal to the values just generated
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
        var currColors = component.get('v.DisplayColors');
        
         //declare arrays to hold new data being passed in
         var startDates = [];
         var holdBatchName = [];
         var holdColors = [];
         var holdProject = [];
         var holdLabels = [];
         var holdTrainers = [];

         for(var i = 0; i < data.length; i++) {
            startDates[i] = data[i].startDate;
            holdBatchName[i] = data[i].name;
            holdProject[i] = data[i].project;
            holdTrainers[i] = data[i].trainer;
         }

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

        //update. Until this command is run, none of the changes are actually applied to the chart.

        chart.update();
    },
    
    /*	convert date method used for converting the date into a integer because the chart only takes in integers as data and not actual date
    */
    convertDate : function(data) { 
        //declare necessary variables
        var arraySize = data.length;

        var datesIntoInts = [];
        var monthDays = [31,28,31,30,31,31,31,31,30,31,30,31];
        
        //create an array with the running sum for the amount of days before a month in a regular year
        var addedMonthDays = [];
        var sum = 0;
        for(int i=0;i<monthdays.length;i++)
        {
            addedMonthDays.push(sum);
            sum+=monthDays[i];
        }

        //for all the data being passed in, take the string, and turn it into a number
        for(let dataIndex = 0; dataIndex<arraySize; dataIndex++)
        {
           //take the string and make it a date string readable by JS, then seperating it into month day and year
            var date = new Date(data[dataIndex]);
            var month = date.getMonth();
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            
            //current date
            var currentDate = new Date();
            var currentYear = currentDate.getUTCFullYear();   
            
            /*	Checking the date year being passed in is within this year or next year; Don't want to show data that old or way far ahead.
             * 	The chart only takes in integers as data, thus, the work around is taking the date and generate it into an integer
             * 	then in the x-axis tick, it'll do a callback with the integer value as the index of the array already set and return the value date.
            */

            if(currentYear<=year && year<=(currentYear+1))
            {
                let amount=0;
                //add days for previous years
                while(year!=currentYear)
                {
                    amount+=365;
                    //one more for leap year
                    if(year%400==0 || (year%4==0 && year%100!=0))
                    {
                        amount+=1;

                    }
                }
                
                //add days into the current year
                amount += addedMonthDays[month] + day;
                
                //one more if a leap year and past february
                if(month>1 && (year%400==0 || (year%4==0 && year%100!=0)))
                {
                    amount+=1;
                }
                
                datesIntoInts[dataIndex] = amount;
            }
            
         }
        
        return datesIntoInts;
    },
    
    filterData:function(selectedTrack, selectedLocation, selectedDate, chart, allData, component)
    { 
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
        
        //For each record, determine if it meets the Filter Criteria.
        for(var currData = 0;currData < allData.length; currData++)
        {
            //**********************Filter Logic*****************
            
            //If either selectbox had an actual value, the code enters this if statement
            if((selectedTrack!="All" || selectedLocation!="All"))
            { 
                 //If the current record has the correct name or location, and the project starts after the listed date,
                //enter
                if((JSON.stringify(allData[currData].trackName) == selectedTrack 
                    && JSON.stringify(allData[currData].location) == selectedLocation)) {

                    //Add the current record to the array to be set as the current data 
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++; 

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
                
            } else {

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

        for(let currTrack of TrackSet)
        {
            TrackList[TrackListCounter]=currTrack;
            TrackListCounter++;
        }

        //Creating Colors
        var UserColors = [];
        var PresetColors = ['#F26925', '#474C55', '#72A4C2', '#FCB414', '#B9B9BA'];
        var currColors = [];

        for(var i=0; i<TrackSet.size; i++)
        {
            let colorSelector = (PresetColors.length)%i;
            currColors[i] = PresetColors[colorSelector];
        }

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
    
    applyColors: function(tracks, colors, allBatches) {      
        var colorsApplied = [];
        var colorsAppliedCounter = 0;
        for(let currBatch = 0; currBatch < allBatches.length; currBatch++)
        {
            for(let currTrack = 0; currTrack < tracks.length; currTrack++)
            {
                if(JSON.stringify(allBatches[currBatch].trackName)==tracks[currTrack])
                {

                    colorsApplied[colorsAppliedCounter] = colors[currTrack];
                    colorsAppliedCounter++;
                }
            }
        }   
        return colorsApplied;
    }

})

