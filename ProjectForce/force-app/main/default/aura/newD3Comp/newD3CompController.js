({
////////////////////////////////////////////
//    Gantt Chart Javascript Controller Class
//    Created by: William Brown, Chao Chen, Auroiah Morgan, Geoffrey Murray
//    First Published: 9/24
//    Purpose: To Provide the direct functionality for the ProjectForce Gantt Chart.
//    *********************Functions included:****************************
//    	myAction(component, event, helper)
//    	|	Creates the chart when the static resource finishes loading. Includes:
//    	|	-calling the Apex controller to get all data in org
//    	|	-setting initial values for filters/sortBy/colors
//    	|	-creating the Chart
//    	
//    	runSort(component, event, helper)
//    	|	when SortBy is changed, re-sorts the data displayed, and updates color fields
//    	
//    	applyColors(component, event, helper)
//    	|	when 'apply color' button is pressed, or data is updated, grab colors selected,
//    	|	and apply them to the chart
//    	
//		runFilter(component, event, helper)
//    	|	takes values given in the Filter section and throws them into Filter function
//    	
//    If you have any questions, please email Geoffrey Murray @ geoffrey.murray.1995@gmail.com
////////////////////////////////////////////
myAction : function(component, event, helper) {
    
    //creating a variable.
    var yLabels = {};
    var trackLabels = ['Java EE', 'Big Data', 'Salesforce'];
    //This gets the current date.
    var date = new Date();
    //only the current year
    var year = date.getUTCFullYear();
    
    /*	Making an array with 2 years worth of days. Taking into account if this year or the next are leap years or not.
     * 	The First index of the array is Jan 1 and every +1 added to the index goes up 1 day.
     * 	The reason for this is because the x-axis of the the chart only takes in an integer as data; Chart JS limitations
     * 	The data(integer) that gets passed into the chart then calls the array in x-axis ticks and the index of the array returns the date.
    */
    //checking if this year is a leap year
    if(year%4==0) {
        //this year is a leap year; 366 days
        for(let i=1;i<367;i++) {
            if(i<32) {
                yLabels[i] = 'Jan '+ i + ' ' + year
            } else if (i>31 && i<61) {
                yLabels[i] = 'Feb '+ (i-31) + ' ' + year
            } else if (i>60 && i<92) {
                yLabels[i] = 'Mar '+ (i-60) + ' ' + year
            } else if (i>91 && i<122) {
                yLabels[i] = 'Apr '+ (i-91) + ' ' + year
            } else if (i>121 && i<153) {
                yLabels[i] = 'May '+ (i-121) + ' ' + year
            } else if (i>152 && i<183) {
                yLabels[i] = 'Jun '+ (i-152) + ' ' + year
            } else if (i>182 && i<214) {
                yLabels[i] = 'Jul '+ (i-182) + ' ' + year
            } else if (i>213 && i<245) {
                yLabels[i] = 'Aug '+ (i-213) + ' ' + year
            } else if (i>244 && i<275) {
                yLabels[i] = 'Sep '+ (i-244) + ' ' + year
            } else if (i>274 && i<306) {
                yLabels[i] = 'Oct '+ (i-274) + ' ' + year
            } else if (i>305 && i<336) {
                yLabels[i] = 'Nov '+ (i-305) + ' ' + year
            } else if (i>335 && i<367) {
                yLabels[i] = 'Dec '+ (i-335) + ' ' + year
            }
        }
        //this is the next year after this year and since this year is a leap year then next year is not a leap year; 365 days
        for(let i=367;i<733;i++) {
            if(i>366 && i<398) {
                yLabels[i] = 'Jan '+ (i-366) + ' ' + (year+1)
            } else if (i>397 && i<426) {
                yLabels[i] = 'Feb '+ (i-397) + ' ' + (year+1)
            } else if (i>425 && i<457) {
                yLabels[i] = 'Mar '+ (i-425) + ' ' + (year+1)
            } else if (i>456 && i<487) {
                yLabels[i] = 'Apr '+ (i-456) + ' ' + (year+1)
            } else if (i>486 && i<518) {
                yLabels[i] = 'May '+ (i-486) + ' ' + (year+1)
            } else if (i>517 && i<548) {
                yLabels[i] = 'Jun '+ (i-517) + ' ' + (year+1)
            } else if (i>547 && i<579) {
                yLabels[i] = 'Jul '+ (i-547) + ' ' + (year+1)
            } else if (i>578 && i<610) {
                yLabels[i] = 'Aug '+ (i-578) + ' ' + (year+1)
            } else if (i>609 && i<641) {
                yLabels[i] = 'Sep '+ (i-609) + ' ' + (year+1)
            } else if (i>640 && i<672) {
                yLabels[i] = 'Oct '+ (i-640) + ' ' + (year+1)
            } else if (i>671 && i<702) {
                yLabels[i] = 'Nov '+ (i-671) + ' ' + (year+1)
            } else if (i>701 && i<733) {
                yLabels[i] = 'Dec '+ (i-701) + ' ' + (year+1)
            }
        }
    } 
    //else if this year is not a leap year; 365 days
    else {
        for(let i=1;i<366;i++) {
            if(i<32) {
                yLabels[i] = 'Jan '+ i + ' ' + year
            } else if (i>31 && i<60) {
                yLabels[i] = 'Feb '+ (i-31) + ' ' + year
            } else if (i>59 && i<91) {
                yLabels[i] = 'Mar '+ (i-59) + ' ' + year
            } else if (i>90 && i<121) {
                yLabels[i] = 'Apr '+ (i-90) + ' ' + year
            } else if (i>120 && i<152) {
                yLabels[i] = 'May '+ (i-120) + ' ' + year
            } else if (i>151 && i<182) {
                yLabels[i] = 'Jun '+ (i-151) + ' ' + year
            } else if (i>181 && i<213) {
                yLabels[i] = 'Jul '+ (i-181) + ' ' + year
            } else if (i>212 && i<244) {
                yLabels[i] = 'Aug '+ (i-212) + ' ' + year
            } else if (i>243 && i<274) {
                yLabels[i] = 'Sep '+ (i-243) + ' ' + year
            } else if (i>273 && i<305) {
                yLabels[i] = 'Oct '+ (i-273) + ' ' + year
            } else if (i>304 && i<335) {
                yLabels[i] = 'Nov '+ (i-304) + ' ' + year
            } else if (i>334 && i<366) {
                yLabels[i] = 'Dec '+ (i-334) + ' ' + year
            }
        }
        //this is the next year after this year(checking if its a leap year)
        if((year+1)%4==0) {
            for(let i=366;i<732;i++) {
                if(i>365 && i<397) {
                    yLabels[i] = 'Jan '+ (i-365) + ' ' + (year+1)
                } else if (i>396 && i<426) {
                    yLabels[i] = 'Feb '+ (i-396) + ' ' + (year+1)
                } else if (i>425 && i<457) {
                    yLabels[i] = 'Mar '+ (i-425) + ' ' + (year+1)
                } else if (i>456 && i<487) {
                    yLabels[i] = 'Apr '+ (i-456) + ' ' + (year+1)
                } else if (i>486 && i<518) {
                    yLabels[i] = 'May '+ (i-486) + ' ' + (year+1)
                } else if (i>517 && i<548) {
                    yLabels[i] = 'Jun '+ (i-517) + ' ' + (year+1)
                } else if (i>547 && i<579) {
                    yLabels[i] = 'Jul '+ (i-547) + ' ' + (year+1)
                } else if (i>578 && i<610) {
                    yLabels[i] = 'Aug '+ (i-578) + ' ' + (year+1)
                } else if (i>609 && i<640) {
                    yLabels[i] = 'Sep '+ (i-609) + ' ' + (year+1)
                } else if (i>639 && i<671) {
                    yLabels[i] = 'Oct '+ (i-639) + ' ' + (year+1)
                } else if (i>670 && i<701) {
                    yLabels[i] = 'Nov '+ (i-670) + ' ' + (year+1)
                } else if (i>700 && i<732) {
                    yLabels[i] = 'Dec '+ (i-700) + ' ' + (year+1)
                }
            }
        } 
        //else if next year is also not a leap year
        else {
            for(let i=366;i<731;i++) {
                if(i>365 && i<397) {
                    yLabels[i] = 'Jan '+ (i-365) + ' ' + (year+1)
                } else if (i>396 && i<425) {
                    yLabels[i] = 'Feb '+ (i-396) + ' ' + (year+1)
                } else if (i>424 && i<456) {
                    yLabels[i] = 'Mar '+ (i-424) + ' ' + (year+1)
                } else if (i>455 && i<486) {
                    yLabels[i] = 'Apr '+ (i-455) + ' ' + (year+1)
                } else if (i>485 && i<517) {
                    yLabels[i] = 'May '+ (i-485) + ' ' + (year+1)
                } else if (i>516 && i<547) {
                    yLabels[i] = 'Jun '+ (i-516) + ' ' + (year+1)
                } else if (i>546 && i<578) {
                    yLabels[i] = 'Jul '+ (i-546) + ' ' + (year+1)
                } else if (i>577 && i<609) {
                    yLabels[i] = 'Aug '+ (i-577) + ' ' + (year+1)
                } else if (i>608 && i<639) {
                    yLabels[i] = 'Sep '+ (i-608) + ' ' + (year+1)
                } else if (i>638 && i<670) {
                    yLabels[i] = 'Oct '+ (i-638) + ' ' + (year+1)
                } else if (i>669 && i<700) {
                    yLabels[i] = 'Nov '+ (i-669) + ' ' + (year+1)
                } else if (i>699 && i<731) {
                    yLabels[i] = 'Dec '+ (i-699) + ' ' + (year+1)
                }
            }
        }
        //testing return
        /*for(let i=1;i<732;i++) {
            console.log(yLabels[i])
        }*/
    }

    //Once you click on the chart, you're able to modify and save/update the modifications
    component.find("myChart").getElement().onclick = function(evt){
        var activePoints = component.get('v.dasChart').getElementsAtEvent(evt);
        if(activePoints.length > 0 ){
            var currIndex = activePoints[0]._index;                
            var currSimpleTraining = component.get('v.tempList')[currIndex];
            //console.log('here is the current simple training: ');
            //console.log(currSimpleTraining.trainingId);

            var childCmp = component.find("modalComp")

            let location = currSimpleTraining.location;
            JSON.stringify(location);
            //console.log("location:"+location);

            let track = currSimpleTraining.trackName;
            JSON.stringify(track);
            //console.log("track:"+track); 

            //let newLocation = location.replace(/"/location,"");
            //console.log(newLocation);
            childCmp.showModal(currSimpleTraining.trainingId, location, track);
            
            
        }           
    };       
    
    //the charts options such as x-axis, y-axis, if hover/no hover
    var barOptions_stacked = {
        
        hover: {
            animationDuration:10,
            // onHover: function (e, element) {
            //     if (e.length) {
            //         const data = e[0]._chart.config.data.datasets[0].data[e[0]._index];
            //         console.log(e, data);
            //     }
            // }
        },
            events: {
                events: ['onClick']
            },
        animation: {
            onComplete: function () {
                var ctx = this.chart.ctx;
                var chartInstance = this.chart;
                ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                ctx.textAlign = 'left';
                ctx.fillStyle = '#FFFFFF'; // label color
              
                this.data.datasets.forEach(function (dataset, i) {
                    var meta = chartInstance.controller.getDatasetMeta(i);
                    meta.data.forEach(function (bar, index) {
                        var model = dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;                            
                        var label = model.label;
                        
                        ctx.fillText(label, bar._model.x+2, bar._model.y);
                        
                    });
                });
            }
        },
            scales: {
                series: [{
                    data:[100,200,0]
                }],
                
                plotOptions: {
                    bar: {
                        horizontal: true,
                        dataLabels: {
                            position: 'top',
                        },
                        
                    }  
                },
                
                dataLabels: {
                    enabled: true,
                    offsetX: -6,
                    style: {
                        
                        colors: ['#FFFFFF']
                    }
                },
                xAxes: [{
                    ticks: {
                        //beginAtZero: true,
                        fontFamily: "'Futura', sans-serif",
                        fontSize:11,
                        //does a call back to the array and returns the array index of the data(integer) inputed
                        callback: function(value, index, values) {
                            return yLabels[value];
                        }
                    },
                    //x-axis label name
                    scaleLabel:{
                        display:true,
                        labelString: 'Month',
                    },
                    gridLines: {
                    }, 
                    stacked: true
                }],
                yAxes: [{
                    gridLines: {
                        display:false,
                        color: "#fff",
                        zeroLineColor: "#fff",
                        zeroLineWidth: 0
                    },
                    ticks: {
                        fontFamily: "'Futura', sans-serif",
                        fontSize:11,
                        display: true,
                        callback: function(value, index, values) {
                            var tra = JSON.parse(localStorage.getItem("tracks"));
                            console.log(tra[index]);
                            //let sortedTracks = tra.sort();
                            var trackString = tra[index].split("-");
                            return trackString[trackString.length - 1];
                            
                        }
                        
                        
                    },
                    //y-axis label name
                    scaleLabel:{
                        display:true,
                        labelString: 'Batches',
                    },
                    stacked: true
                }]
            },
            legend:{
                display:false
            },
        tooltips:{
            enabled: false
        }
        
            
        };
    
    //calls the apex controller and runs the method getTrainings then saves the return of the method into getTracks
    var getTracks = component.get("c.getTrainings");
    //run a callback
    getTracks.setCallback(this, function(response) {
        //gets the response state; fail,success
        var state = response.getState();
        if (state === "SUCCESS") {
            //place the response info somewhere safe :O
            component.set("v.qTraining", response.getReturnValue());
            component.set("v.tempList", response.getReturnValue());
            helper.setInitFilterValues(component, event);
            //pass the results to the chart creator.
            var ctx = component.find("myChart").getElement();
            var newChart = helper.createChart(
                ctx, 
                barOptions_stacked, 
                response.getReturnValue(),
                component.get('v.UserColors'),  
                component.find('select').get('v.value')
            );
            component.set("v.dasChart", newChart);
        }
        else {
            console.log("Failed with state: " + state);
        }
    });
    $A.enqueueAction(getTracks);   
},

runSort:function(component, event, helper)
{
    var sortBy= component.find('select').get('v.value');
    var allTrainings = component.get('v.tempList');
    var myChart = component.get('v.dasChart');
    var getColors = component.get('v.DisplayColors');
    console.log('here\'s the length of the array before sort:' + allTrainings.length);
    helper.sortArray(allTrainings, getColors, sortBy);
    console.log('here\'s the length of the array after sort: '+allTrainings.length);
    helper.updateData(component);
    console.log('here\s the length of the array after updateData: '+allTrainings.length);
    //console.log(myChart.data.datasets.data);
    //var a = component.get('c.applyColors');
    //$A.enqueueAction(a);
},



applyColors:function(component, event, helper)
{
    var myChart = component.get('v.dasChart');
    var currTrainings = component.get('v.tempList');
    var allTracks = [];
    var allColors = [];
    var colorElements = component.find('colors');
    console.log('colorElements length is: ' + colorElements.length);
    for(let i=0; i<colorElements.length; i++)
    {
        allTracks[i] = colorElements[i].get('v.id');
        allColors[i] = colorElements[i].get('v.value');
    }
    var newColors = helper.applyColors(allTracks, allColors, currTrainings);
    component.set('v.DisplayColors', newColors);
    helper.updateData(component);
    
},

runFilter: function (component, event, helper) {
    console.log('runFilter has been entered.');
    //Grabbing Relevant data
    var allTrainings = component.get('v.qTraining');
    var myChart = component.get('v.dasChart');
    var selectedTrack = component.find("TrackFilter").get("v.value");
    var selectedLocation = component.find("LocationFilter").get("v.value");
    var selectedDate = component.find("DateFilter").get("v.value");
    var newData = helper.filterData(selectedTrack, selectedLocation, selectedDate, myChart, allTrainings, component);
    var a = component.get('c.applyColors');
    $A.enqueueAction(a);
    component.set('v.tempList', newData);
    
},

callSaveComp : function(component, event, helper){
    var childCmp = component.find("modalComp")
    childCmp.showModal("Online","Salesforce");
    },

showmodal: function(component, event, helper){
    var activePoints = component.get('v.dasChart').getElementsAtEvent(event);
        if(activePoints.length > 0 )
        {
            var currIndex = activePoints[0]._index;                
            var currSimpleTraining = component.get('v.tempList')[currIndex];
            console.log('here is the current simple training: ');
            console.log(currSimpleTraining.trainingId);

            var childCmp = component.find("modalComp");

            let location = currSimpleTraining.location;
            JSON.stringify(location);
            console.log("location:"+location);

            let track = currSimpleTraining.trackName;
            JSON.stringify(track);
            console.log("track:"+track); 

            //let newLocation = location.replace(/"/location,"");
            //console.log(newLocation);
            childCmp.showModal(currSimpleTraining.trainingId, location, track);
            
            /*
        */
        }

        

        
        
},
modalUpdate:function(component,event,helper)
        {
            let action = component.get("c.getTrainings");
            action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                console.log('callout was a success');
                let returnedList = response.getReturnValue();
                component.set('v.qTraining', returnedList);
                let displayList = component.get('v.tempList');
                for(let currRecord = 0; currRecord < displayList.length; currRecord++)
                {
                    for(let currReturned = 0; currReturned < returnedList.length; currReturned++)
                    {
                    if(displayList[currRecord].trackName == returnedList[currReturned].trackName)
                    {
                        console.log('match was found: '+ returnedList[currReturned].trackName);
                        displayList[currReturned] = returnedList[currRecord];
                    }
                }
                }
                component.set('v.tempList', displayList);
                helper.updateData(component);

            }
            else {
                console.log('callout failed with state: ' + state);
            }
        });

        $A.enqueueAction(action);
        }  


})