({
    ////////////////////////////////////////////
    //    Gantt Chart Javascript Controller Class
    //    Created by: William Brown, Chou Chen, Auroiah Morgan, Geoffrey Murray
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
        
        var yLabels = {};
        
        var date = new Date();
        //current year and starting the for loop at the start of the current year
        var year = date.getUTCFullYear();
        
        //after taking the data which can only be integers, I change it to a date based on 365 or 366 days
        if(year%4==0) {
            //this year is a leap year
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
            //next year after a leap year, so not a leap year
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
        } else {
            //this year is not a leap year
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
            //next year after not a leap year, checking if next year is a leap year
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
            } else {
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
        
        var barOptions_stacked = {
            hover :{
                animationDuration:10
            },
            scales: {
                xAxes: [{
                    ticks: {
                        //beginAtZero: true,
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11,
                        callback: function(value, index, values) {
                        return yLabels[value];
                    	}
                    },
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
                        fontFamily: "'Open Sans Bold', sans-serif",
                        fontSize:11
                    },
                    scaleLabel:{
                        display:true,
                        labelString: 'Tracks',
                    },
                    stacked: true
                }]
            },
            legend:{
                display:false
            },
        };
        
        var getTrrrack = component.get("c.getTrainings");

        getTrrrack.setCallback(this, function(response) {
            var state = response.getState();
            if (state === "SUCCESS") {
                //place the response info somewhere safe :O
                component.set("v.qTraining", response.getReturnValue());
                component.set("v.tempList", response.getReturnValue());
                helper.setInitFilterValues(component, event);
                //pass the results to the chart creator.
                var ctx = component.find("myChart").getElement();
                var newChart = helper.createChart(ctx, barOptions_stacked, response.getReturnValue(),
                                                  component.get('v.UserColors'),  component.find('select').get('v.value'));
                component.set("v.dasChart", newChart);
                
                //console.log(n1);
            }
            else {
                console.log("Failed with state: " + state);
            }
        });
        //n1.push("4");
        //var n1 = response.getReturnValue();
        
        $A.enqueueAction(getTrrrack);
        
       
    },
    
    runSort:function(component, event, helper)
    {
        var sortBy= component.find('select').get('v.value');
        var allTrainings = component.get('v.tempList');
        var myChart = component.get('v.dasChart');
        console.log('here\'s the length of the array before sort:' + allTrainings.length);
        helper.sortArray(allTrainings, sortBy);
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
        var newColors = helper.applyColors(allTracks, allColors, myChart, currTrainings);
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
        
    }
        
})