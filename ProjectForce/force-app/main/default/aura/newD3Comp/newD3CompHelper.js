({
    //Bubble Sort based on Sort By Filter
    sortArray:function(sortThis, sortBy)
    {
        for(var currItem = 0; currItem < sortThis.length; currItem++)
        {
            for (var j = 0; j < sortThis.length-1; j++) 
                switch(sortBy)
                {
                    case 'Track':
                        if (JSON.stringify(sortThis[j].name) > JSON.stringify(sortThis[j+1].name) )
                        { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp; 
                        }
                        break;
                    case 'Project':
                        if (JSON.stringify(sortThis[j].project) > JSON.stringify(sortThis[j+1].project)) 
                        { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp; 
                        }
                        break;
                    case 'Date':
                        if (JSON.stringify(sortThis[j].startDate) > JSON.stringify(sortThis[j+1].startDate)) 
                        { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp; 
                        }
                        break;
                    case 'Trainer':
                        if (JSON.stringify(sortThis[j].trainer) > JSON.stringify(sortThis[j+1].trainer)) 
                        { 
                            // swap arr[j+1] and arr[i] 
                            var temp = sortThis[j]; 
                            sortThis[j] = sortThis[j+1]; 
                            sortThis[j+1] = temp; 
                        }
                        break;
                }
            
        }
        
        
        return sortThis;
    }, 
    
    
    
    createChart : function(ctx, options, dataSet, userColors, sortBy)
    {
        var arraySize = dataSet.length;
        //Declaring arrays to be used in the chart creation later.
        var startTimes = [];
        var endTimes = [];
        var tracks =  [];
        var trainers = [];
        var rooms = [];
        var projects = [];
        
        var d = [];
        var dIntoInt = [];
        var minDate;
        var maxDate;
		
        dataSet = this.sortArray(dataSet, sortBy);        
        //Here we take the dataset and split it into several different arrays to make it easier to use.
        for(let currTI = 0; currTI<arraySize; currTI++)
        {
            tracks[currTI]=JSON.stringify(dataSet[currTI].name);
            startTimes[currTI]=JSON.stringify(dataSet[currTI].startDate);
            trainers[currTI]=JSON.stringify(dataSet[currTI].trainer);
            rooms[currTI]=JSON.stringify(dataSet[currTI].room);
            projects[currTI]=JSON.stringify(dataSet[currTI].project);
            console.log('original start times: ' + startTimes[currTI]);
            
            
            var date = new Date(startTimes[currTI]);
            var month = date.getMonth()+1;
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            
            var currentDate = new Date();
            var currentYear = currentDate.getUTCFullYear();
            
            if(year>=currentYear && year<=(currentYear+1)) {
                if(year==currentYear) {
                    //leap year
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
                    //leap year
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
        
        
        var batchDuration = [];
        for(var i=0; i<d.length; i++)
        {
            batchDuration[i] = 21;   
        }
        
        minDate = d[0];
        maxDate = d[0];
        for(var i=0; i<d.length-1;i++) {
            if(d[i]>=maxDate) {
                maxDate = d[i] + 22;
            }
            if(d[i]<=minDate) {
                minDate = d[i] -1;
            }
        }
           
        
        options.scales.xAxes[0].ticks.beginAtZero = false;
        options.scales.xAxes[0].ticks.max = maxDate;
        options.scales.xAxes[0].ticks.min = minDate;
        
        
        //This is going to build the Chart. By this point the data has been brought in through dataSet
        //and it's been split into separate arrays, so that way it's easier to use in the Chart creation.
        var returnThis= new Chart(ctx, {    
            type: 'horizontalBar',
            data: {
                
                labels: tracks,
                
                datasets: [{
                    data: d,                   
                    backgroundColor: "rgba(63,103,126,0)",
                    hoverBackgroundColor: "rgba(50,90,100,0)"
                    
                },{
                    data: batchDuration,
                    backgroundColor: userColors,
                }]
            },
            options: options,
        });
        
        return returnThis;
    },
    
    //When a user selects a sort by filter, it will automatically sort the 
    //chart
    updateData : function(component)
    {
        var chart = component.get('v.dasChart');
        var data = component.get('v.tempList');
        var currTracks = component.get('v.Tracks');
        var currColors = component.get('v.DisplayColors');
        console.log(chart.data.datasets[0].data)
        var startDates = [];
        var holdLabels = [];
        var holdColors = [];
        console.log('here\'s the data: '+data);
        for(var i = 0; i<data.length; i++)
        {
            startDates[i] = JSON.stringify(data[i].startDate);
            console.log(startDates[i]);
            holdLabels[i] = JSON.stringify(data[i].name);
        }
        //console.log('here are the colors about to be used: '+ currColors);
       
        holdColors = currColors;
		
        chart.data.datasets[1].backgroundColor = holdColors;
        chart.data.datasets[0].data = this.convertDate(startDates);
        chart.data.labels = holdLabels;
        console.log('list of colors list: '+holdColors);
        console.log('converted dates' + this.convertDate(startDates));
        console.log('last data of dates: '+chart.data.datasets[0].data);
        
        chart.update();
    },
    
    //
    convertDate : function(data){
        var arraySize = data.length;
        var d = [];
        var dIntoInt = [];
        
        for(let currTI = 0; currTI<arraySize; currTI++)
        {
            
           var date = new Date(data[currTI]);
            var month = date.getMonth()+1;
            var day = date.getUTCDate();
            var year = date.getUTCFullYear();
            
            var currentDate = new Date();
            var currentYear = currentDate.getUTCFullYear();
            
            if(year>=currentYear && year<=(currentYear+1)) {
                if(year==currentYear) {
                    //leap year
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
                    //leap year
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
        
        return d;
        console.log('D: '+d);
    },
    
    filterData:function(selectedTrack, selectedLocation, selectedDate, chart, allData, component)
    {
        console.log('filter data has been entered');
        var correctData = [];
        var correctDataCounter = 0;
        var correctColors = [];
        
        if(selectedTrack == "")
        {
            selectedTrack = "All";
        }
        if(selectedLocation == "")
        {
            selectedLocation = "All";
        }
        
        var compareToDate = [];
        compareToDate[0] = selectedDate;
        
        var dataDates = [];
        for(let i = 0; i<allData.length; i++)
        {
            dataDates[i] = JSON.stringify(allData[i].startDate);
        }
        dataDates = this.convertDate(dataDates);
        compareToDate = this.convertDate(compareToDate);
        console.log('This was the selected track: ' +selectedTrack);
        console.log('This was the selected Location: ' +selectedLocation);
        console.log('This is the compare To Date: ' +compareToDate[0]);
        console.log('This is the list of dataDates: ' + dataDates);
        for(var currData = 0;currData < allData.length; currData++)
        {
            //**********************Filter Logic*****************
            if((selectedTrack!="All" || selectedLocation!="All"))
            {
                console.log('currently checking allData[currData].name: ' + JSON.stringify(allData[currData].trackName))
                console.log('date int: ' + dataDates[currData])
                if(JSON.stringify(allData[currData].trackName) == selectedTrack 
                    || JSON.stringify(allData[currData].location) == selectedLocation 
                   && compareToDate[0] >= dataDates[currData])
                {
                    console.log('the second if statement has been entered.');
                    correctData[correctDataCounter] = allData[currData];
                    correctDataCounter++;
                    console.log('a correct match has been found' + correctData[correctDataCounter]);
                }
                
            } else
            {
                console.log('the All/All portion');
                correctData = allData;
            }
        }
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
        
        
        //Creating Colors
        var UserColors = [];
        
        for(var i=0; i<allTrainings.length; i++)
        {
            
            LocationSet.add(JSON.stringify(allTrainings[i].location));
            
            
            TrackSet.add(JSON.stringify(allTrainings[i].trackName));
            
            
            UserColors[i] = '#F26925';
            
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
        
        //console.log('here is LocationList:')
        //console.log(LocationList);
        //console.log('here is the length of the UserColor array: ')
        //console.log(UserColors.length);
        component.set('v.Locations', LocationList);
        component.set('v.Tracks', TrackList);
        component.set('v.UserColors', UserColors);
        component.set('v.DisplayColors', UserColors);
        component.set('v.tempList', allTrainings);
        
        //Setting Today's Date
        var today = new Date();
        component.set('v.today', today.getFullYear() + "-" + (today.getMonth() + 1) + "-" + today.getDate());
        //Setting User Colors
        
    },
    
    applyColors: function(tracks, colors, chart, allBatches)
    {
        
        var colorsApplied = [];
        var colorsAppliedCounter = 0;
        for(let currBatch = 0; currBatch < allBatches.length; currBatch++)
        {
            console.log('here is tracks.length: '+tracks.length);
            for(let currTrack = 0; currTrack < tracks.length; currTrack++)
            {
                console.log('trackName: '+JSON.stringify(allBatches[currBatch].trackName));
                console.log('tracks[currTrack]: '+tracks[currTrack]);
                if(JSON.stringify(allBatches[currBatch].trackName)==tracks[currTrack])
                {
                    
                    console.log('The if statement has been entered. The new color is: ' + colors[currTrack]);
                    colorsApplied[colorsAppliedCounter] = colors[currTrack];
                    colorsAppliedCounter++;
                    
                }
            }
        }
         
        return colorsApplied;

    }
    
})