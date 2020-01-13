({
    ////////////////////////////////////////////
    //    Gantt Chart Javascript Helper Class
    //    Created by: William Brown, Chao Chen, Auroiah Morgan, Geoffrey Murray
    //    Modified by: Brady Achterberg, Ben Learn
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
    //    	|	find data in the filteredTrainings attribute and update the chart to display the data in
    //      |   filteredTrainings additionally, reapply colors, to ensure continuity.
    //
    //    	Array(Integers) = convertDate(array of strings)
    //    	|	converts given array into an array of integers for the x-axis
    //
    //    	Array(SimpleTraining) = filterData(track string, Location string, Date string, chart, SimpleTraining array, component)
    //    	|	take selected filter values, and find any SimpleTraining objects which match either
    //    	|	the location or the track, and start after the date given. then store the data in
    //    	|	filteredTrainings and run updateData to update the chart with the new filteredTrainings.
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
    
    // Bubble Sort based on a field (trackName, project, startDate, trainer) passed as a param
    sortArray: function (sortThis, sortColors, sortBy) {
        //Bubble sort each item in the array
        for (var i = 0; i < sortThis.length; i++)
            for (var j = 0; j < sortThis.length - 1; j++)
                //compare the field on the SimpleTraining object with the category selected
                switch (sortBy) {
                    case "Track":
                        if (sortThis[j].trackName > sortThis[j + 1].trackName) {
                            // swap arr[j+1] and arr[i]
                            var temp = sortThis[j];
                            sortThis[j] = sortThis[j + 1];
                            sortThis[j + 1] = temp;
                            var tempColor = sortColors[j];
                            sortColors[j] = sortColors[j + 1];
                            sortColors[j + 1] = tempColor;
                        }
                        break;
                    case "Project":
                        if (sortThis[j].project > sortThis[j + 1].project) {
                            // swap arr[j+1] and arr[i]
                            var temp = sortThis[j];
                            sortThis[j] = sortThis[j + 1];
                            sortThis[j + 1] = temp;
                            var tempColor = sortColors[j];
                            sortColors[j] = sortColors[j + 1];
                            sortColors[j + 1] = tempColor;
                        }
                        break;
                    case "Date":
                        if (sortThis[j].startDate > sortThis[j + 1].startDate) {
                            // swap arr[j+1] and arr[i]
                            var temp = sortThis[j];
                            sortThis[j] = sortThis[j + 1];
                            sortThis[j + 1] = temp;
                            var tempColor = sortColors[j];
                            sortColors[j] = sortColors[j + 1];
                            sortColors[j + 1] = tempColor;
                        }
                        break;
                    case "Trainer":
                        if (sortThis[j].trainer > sortThis[j + 1].trainer) {
                            // swap arr[j+1] and arr[i]
                            var temp = sortThis[j];
                            sortThis[j] = sortThis[j + 1];
                            sortThis[j + 1] = temp;
                            var tempColor = sortColors[j];
                            sortColors[j] = sortColors[j + 1];
                            sortColors[j + 1] = tempColor;
                        }
                        break;
                }
        return sortThis;
    },
    
    //creating the chart and passing in data
    /*createChart: function (ctx, options, dataSet) 
    {   // First, sort the data passed in according to the value in sortBy
        // dataSet = this.sortArray(dataSet, sortBy);
        
        //Here we take the dataset and split it into several different arrays to make it easier to use.
        var startTimes = [];
        var tracks = [];
        var trainers = [];
        var projects = [];
        // var rooms = [];
        for (let i = 0; i < dataSet.length; i++) 
        {   // Populate each array with respective fields of the dataset items
            startTimes[i] = dataSet[i].startDate;
            tracks[i] = dataSet[i].name;
            projects[i] = dataSet[i].project;
            trainers[i] = dataSet[i].trainer;
            // rooms[i] = dataSet[i].room; // not on Training__c pagelayout
        }
        
        // location, name, project, room, startDate, trackName, trainer, trainingId
        
        // Once we have the startDates, we need them as ints.
        var startTimesConverted = this.convertDate(startTimes);
        
        //currently no reason to believe the duration of a project will be longer than 3 weeks.
        var batchDuration = [];
        let projLength = 21;
        
        for (var i = 0; i < startTimesConverted.length; i++)
        {   batchDuration[i] = projLength;
        }
        
        // Set the minimum date and maximum date displayed by the chart.
        // This is based on the first and last dates in the data passed in.
        var earliest = startTimesConverted[0];
        var latest = startTimesConverted[0];
        for (var i = 0; i < startTimesConverted.length - 1; i++) 
        {   if (startTimesConverted[i] > latest) latest = startTimesConverted[i];
            if (startTimesConverted[i] < earliest) earliest = startTimesConverted[i];
        }
        latest += projLength;  // add the default batch duration
        
        // Set the keys in the options Javascript Object equal to the values just generated
        options.scales.xAxes[0].ticks.max = latest;
        options.scales.xAxes[0].ticks.min = earliest;
        return sortThis;
    },*/
    
    //creating the chart and passing in data
    createChart: function(ctx, options, dataSet) {
        //First, sort the data passed in according to the value in sortBy
        // dataSet = this.sortArray(dataSet, sortBy);
        
        //Here we take the dataset and split it into several different arrays to make it easier to use.
        var startTimes = [];
        var tracks = [];
        var trainers = [];
        var projects = [];
        var rooms = [];
        for (let i = 0; i < dataSet.length; i++) {
            startTimes[i] = dataSet[i].startDate;
            tracks[i] = dataSet[i].name;
            projects[i] = dataSet[i].project;
            trainers[i] = dataSet[i].trainer;
            rooms[i] = dataSet[i].room; // not on Training__c pagelayout
        }
        
        //Once we have the startDates, we need it as an int.
        var minMaxDates = this.calcChartAxisLabels(startTimes);
        
        //Set the keys in the options Javascript Object equal to the values just generated
        options.scales.xAxes[0].ticks.max = minMaxDates[1];
        options.scales.xAxes[0].ticks.min = minMaxDates[0];
        options.scales.xAxes[0].offset = false;
        
        // Create the labels that show up on the sides and when hovered over.
        let tracksAndProjects = [];
        for (let i = 0; i < startTimes.length; i++) {
            var some = `${tracks[i]} - ${projects[i]} - ${trainers[i]}`;
            tracksAndProjects[i] = some;
        }
        
        //This is going to build the Chart. By this point the data has been brought in through dataSet
        //and it's been split into separate arrays, so that way it's easier to use in the Chart creation.
        return new Chart(ctx, {
            type: "horizontalBar",
            events: [],
            data: {
                labels: tracksAndProjects,
                datasets: [
                    {
                        //example of how to reference something in here: chart.data.datasets[0].data[i]
                        //This data is when the project is supposed to start
                        data: [],
                        backgroundColor: "rgba(63,103,126,0)"
                    },
                    {
                        //example of how to reference something in here: chart.data.datasets[1].data[i]
                        //Data here is the duration of the project
                        data: [],
                        backgroundColor: "orange"
                    }
                ]
            },
            //This is where we describe the axes. Check the barOptions_stacked variable to see what we are setting here.
            options: options
        });
    },
    
    /*
        addToChart clears the current gantt chart, formats each selected project
        into the correct JSON Format, then adds it to the views v.selectedTrainings and 
        v.filteredTrainings for 
        this.updateData() to populate the gantt chart with the v.filteredTrainings.
    */
    addToChart : function (component, projectsToAdd) 
    {   // Sweep clean the current Data on the gantt chart to avoid
        // duplicate population of previously selected projects.
        var currentData = [];
        
        
        //flatten the JSON into a compatible object.
        for (var i = 0; i < projectsToAdd.length; i++) {
            var newData = {
                location: projectsToAdd[i].Room__r.Location__r.Name,
                name: projectsToAdd[i].Name,
                project: projectsToAdd[i].Project__r.Name,
                room: projectsToAdd[i].Room__r.Room_Number__c,
                startDate: projectsToAdd[i].Start_Date__c,
                projectStartDate:projectsToAdd[i].ProjectStartDate__c,
                endDate: projectsToAdd[i].End_Date__c,
                trackName: projectsToAdd[i].Track__r.Name,
                trainer: projectsToAdd[i].Trainer__r.Name,
                trainingId: projectsToAdd[i].Id,
                color: projectsToAdd[i].Color__c
            };
            currentData.push(newData);
        }
        
        // Populate selectedTrainings and filteredTrainings with newly loaded project data
        component.set("v.selectedTrainings", currentData);
        component.set('v.filteredTrainings', currentData);
        this.updateData(component);
    },
    
    // When a user selects a sort by filter, it will automatically sort the chart
    updateData : function (component) 
    {   // Get the batch length
        let projLength = 21;
        // Grabbing the attributes from the component that we will be either using or updating
        var chart = component.get("v.dasChart");
        var data = component.get("v.filteredTrainings");
        var currColors = component.get('v.DisplayColors');
        
        // Declare arrays to hold new data being passed in
        var startDates = [];
        var labels = [];
        var durations = [];
        var colors = [];
        // var holdColors = [];
        console.log(data);
        for (var i = 0; i < data.length; i++) 
        {   colors[i] = data[i].color;
        }
        // set start dates to batch start date, or project start date if project filter is selected
        if ( component.get("v.ChartStartFilter") == "projectStart" )
            for (let i=0 ; i<data.length ; i++ ) 
                startDates[i]=data[i].projectStartDate;
        else
            for ( let i=0 ; i<data.length ; i++ ) 
                startDates[i]=data[i].startDate;
        
        //sets variable name for coloring
        let colorByField=component.find("select").get("v.value");
        switch (colorByField){
            case "Track":
                colorByField="trackName";
                break; 
            case "Project":
                colorByField="project";
                break;  
                /*
            case "Date":
                break;
                */
            case "Review Completed":
                colorByField=null; //need to fetch review status from database
                break;
            case "Location":
                colorByField="location";
                break;
            case "Trainer":
                colorByField="trainer";
                break;
            default:
                colorByField=null;
        }
        
        for (let i = 0; i < data.length; i++) 
        {   
            var label = `${data[i].name} - ${data[i].project} - ${data[i].trainer}`;
            labels[i] = label;
            durations[i] = projLength;
            if(colorByField && currColors){
                
                colors[i]=currColors.get(data[i][colorByField]);
            }
        }
        // set the color of the bars to user-selected color
        component.set("v.UserColors", colors);
        
        // Assign new values to the chart properties
        chart.data.datasets[0].data = this.convertDate(startDates);
        chart.data.datasets[1].data = durations;
        chart.data.datasets[1].backgroundColor = component.get("v.UserColors");
        chart.data.labels = labels;
        // console.log(chart.controller.getDatasetMeta(0));
        
        //Once we have the startDates, we need it as an int.
        var minMaxDates = this.calcChartAxisLabels(startDates);
        
        //Set the keys in the options Javascript Object equal to the values just generated
        chart.options.scales.xAxes[0].ticks.max = minMaxDates[1];
        chart.options.scales.xAxes[0].ticks.min = minMaxDates[0];
        chart.options.scales.xAxes[0].offset = true;
        
        //update. Until this command is run, none of the changes are actually applied to the chart.
        chart.update();
    },
    
    //	convert date method used for converting the date into an integer
    convertDate: function(data) {
        // sort so dates are arranged earliest date to latest date and declare 
        // populate date variables, we're leveraging built-in JavaScript date methods
        // to find the difference in days between the minimum date and every other
        // date, but JavaScript doesn't know that these are dates (thinks they're 
        // strings), so we have to declare new dates
        data = data.sort();
        
        // we've arbitrarily decided that our chart should run from three months
        // prior to six months after today's date, so set the date three months
        // before today
        var minDate = new Date();
        minDate.setMonth(minDate.getMonth() - 3);
       	var d = [];
        var currentDate, dateDifference;
        for(let i = 0; i < data.length; i++){
            // populate variable for current iteration
            currentDate = new Date(data[i]);
            
			// find difference in dates
			dateDifference = currentDate.getTime() - minDate.getTime();
            
            // dateDifference is in milliseconds, so divide it by milliseconds in a 
            // second (1000), seconds in an hour (3600), and hours in a day (24) to 
            // get a difference in days, push that to the list
            d.push(Math.floor(dateDifference / (1000 * 3600 * 24)));
            //console.log(Math.floor(dateDifference / (1000 * 3600 * 24)));
        }
        return d;
    },
    
    filterData: function(selectedTrack, selectedLocation, selectedDate, chart, allData,
                         component) {
        //declare necessary variables
        var correctData = [];
        var correctDataCounter = 0;
        var correctColors = [];
        
        //If the filters haven't been used yet, assign the "all" field to them
        //This is so it doesn't throw off the rest of the loop
        if (selectedTrack == "") {
            selectedTrack = "All";
        }
        if (selectedLocation == "") {
            selectedLocation = "All";
        }
        
        //Take the date given and store it in an array
        var compareToDate = [];
        compareToDate[0] = selectedDate;
        
        //take the dates of the data and store them in an array
        var dataDates = [];
        for (let i = 0; i < allData.length; i++) {
            dataDates[i] = JSON.stringify(allData[i].startDate);
        }
        
        //convert the arrays from arrays of strings into arrays of numbers
        dataDates = this.convertDate(dataDates);
        compareToDate = this.convertDate(compareToDate);
        
        //For each record, determine if it meets the Filter Criteria.
        for (var currData = 0; currData < allData.length; currData++) {
            /**********************Filter Logic*****************/
            
            //If either selectbox had an actual value, the code enters this if statement
            if (selectedTrack != "All" || selectedLocation != "All") {
                //If the current record has the correct name or location, and the project starts after the listed date,
                //enter
                if (JSON.stringify(allData[currData].trackName) == selectedTrack &&
                    JSON.stringify(allData[currData].location) == selectedLocation) {
                    //Add the current record to the array to be set as the current data
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                } else if (JSON.stringify(allData[currData].trackName) == selectedTrack &&
                           selectedLocation == "All") {
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                } else if (selectedTrack == "All" && JSON.stringify(
                    allData[currData].location) == selectedLocation) {
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                }
            } else {
                correctData = allData;
            }
        }
        
        //once the data has been selected, update the attributes on the page to stay current.
        component.set("v.filteredTrainings", correctData);
        component.set("v.DisplayColors", correctColors);
        this.updateData(component);
        
        return correctData;
    },
    
    setInitFilterValues: function(component, event) {
        var allTrainings = component.get("v.allTrainings");
        
        // Create lists for Track, Location, Project, and Trainer and set the appropriate aura attribute
        // in the component (note: we're mimicking the functionality of a set in our lists because setting
        // a set to an aura attribute doesn't play nice)
        var TrackList = ['All'];
        var LocationList = ['All'];
        var ProjectList = ['All'];
        var TrainerList = ['All'];
        for (var i = 0; i < allTrainings.length; i++) {
            if(TrackList.indexOf(allTrainings[i].trackName) == -1) TrackList.push(allTrainings[i].trackName);
            if(LocationList.indexOf(allTrainings[i].location) == -1) LocationList.push(allTrainings[i].location); 
            if(ProjectList.indexOf(allTrainings[i].project) == -1) ProjectList.push(allTrainings[i].project);
            if(TrainerList.indexOf(allTrainings[i].trainer) == -1) TrainerList.push(allTrainings[i].trainer);
        }
        component.set("v.Tracks", TrackList);
        component.set("v.Locations", LocationList);
        component.set("v.Projects", ProjectList);
        component.set("v.Trainers", TrainerList);
        
        //Setting Today's Date
        var today = new Date();
        component.set("v.today", today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
    },
    
    calcChartAxisLabels:function(startTimes, endTimes) {
        var days = this.convertDate(startTimes);
        let defaultDuration=21;
        //Setting the minimum date and maximum date displayed by the chart.
        //This is based on the first and last dates in the data passed in.
        var minDate = days[0];
        var maxDate = days[0];
        for (var i = 0; i < days.length - 1; i++) {
            if (days[i] >= maxDate) {
                maxDate = days[i];
            }
            if (days[i] <= minDate) {
                minDate = days[i];
            }
        }
        maxDate += defaultDuration;
        return [minDate,maxDate,days];
    },
    
    applyColors: function(tracks, colors, allBatches) {
        var colorsApplied = [];
        var colorsAppliedCounter = 0;
        for(let currBatch = 0; currBatch < allBatches.length; currBatch++) {
            console.log('here is tracks.length: '+tracks.length);
            for(let currTrack = 0; currTrack < tracks.length; currTrack++) {
                console.log('trackName: '+JSON.stringify(allBatches[currBatch].trackName));
                console.log('tracks[currTrack]: '+tracks[currTrack]);
                if(JSON.stringify(allBatches[currBatch].trackName)==tracks[currTrack]){
                    console.log('The if statement has been entered. The new color is: ' + colors[currTrack]);
                    colorsApplied[colorsAppliedCounter] = colors[currTrack];
                    colorsAppliedCounter++;  
                }
            }
        }
        return colorsApplied;
    }
});
