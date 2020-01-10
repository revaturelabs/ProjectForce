({
    ////////////////////////////////////////////
    //    newD3Comp Javascript Controller Class (originally Gantt Chart Javascript Controller Class)
    //    Created by: William Brown, Chao Chen, Auroiah Morgan, Geoffrey Murray
    //    First Published: 9/24
    //    Updated/Modified by: Ben Learn, January 2020
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
    myAction: function(component, event, helper) {
        // array to hold labels for x axis of chart, will contain all dates for the 
        // previous three months and next six months
        var xLabels = [];
        var threeMonthsBefore = new Date();
        threeMonthsBefore.setMonth(threeMonthsBefore.getMonth() - 3);
        var sixMonthsAfter = new Date();
        sixMonthsAfter.setMonth(sixMonthsAfter.getMonth() + 6);
        
        // make arrays for the names of the months for pretty labels
        var monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        /* Populate the xlabels array. Each index of this array will sequentially
         * contain the days from three months before today's date to six months after
         * today's date. We need to populate the array in this way because the x-axis
         * of Chart JS can only take in integer values. The integer that gets passed
         * to the x-axis of the chart will later call the xlabels array to display a 
         * nicely formatted date to label the x-axis in the form of e.g. Jan 1 2020
       	 */
        
        // iteration date
        var iterationDate = threeMonthsBefore;

        // populate xlabels
        // it is important to note that the getMonth function in the Javascript Date
        // class is zero indexed (i.e. January is zero), but the getDate function is
        // not
        while(iterationDate < sixMonthsAfter){
            xLabels.push(monthNames[iterationDate.getMonth()] + " " + 
                         iterationDate.getDate() + " " + iterationDate.getFullYear());
			iterationDate.setDate(iterationDate.getDate() + 1);
        }
      
      //Once you click on the chart, you're able to modify and save/update the modifications
      component.find("myChart").getElement().onclick = function(evt) {
          var activePoints = component.get("v.dasChart").getElementsAtEvent(evt);
          var activePoint = component.get("v.dasChart").getElementAtEvent(evt)[0]; //WIP
          if (activePoints.length > 0) {
              if (activePoint._datasetIndex === 1) {
                  activePoint.hidden = true;
                  var currIndex = activePoints[0]._index;
                  var currSimpleTraining = component.get("v.tempList")[currIndex];
                  var childCmp = component.find("modalComp");
                  let location = currSimpleTraining.location;
                  let track = currSimpleTraining.trackName;
                  let projectStartDate = currSimpleTraining.startDate;
                  childCmp.showModal(currSimpleTraining.trainingId, track, projectStartDate); 
              }
          }
      };
      
      var myChartComponent = component.find("myChart").getElement();
      //the chart's options such as x-axis, y-axis, if hover/no hover
      var barOptions_stacked = {hover: {animationDuration: 10,
          onHover: function(e, elements) {
              myChartComponent.style.cursor = e[0] ? "pointer" : "default";
          }},

          events: {events: ["onClick"]},
          
          animation: {onComplete: function() {
              var ctx = this.chart.ctx;
              var chartInstance = this.chart;
              ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, "normal", Chart.defaults.global.defaultFontFamily);
              ctx.textAlign = "left";
              ctx.fillStyle = "black"; // text color in bar label
              //console.log(this.data.datasets);
              this.data.datasets.forEach(function(dataset, i) {
                  var meta = chartInstance.controller.getDatasetMeta(i);
                                        
                                        meta.data.forEach(function(bar, index) {
                                            // only fillText for the first bar, otherwise we get double label overflow
                                            // Also hide the first bar so it cannot be hovered over and clicked.
                                            //if (bar._datasetIndex === 0) {
                                                var model = dataset._meta[Object.keys(dataset._meta)[0]].data[index]._model;
                                               // var label = model.label;
                                                // meta.hidden = true;
                                                ctx.fillText('label', bar._model.x + 2, bar._model.y);
                                           // }
                                        });
                                    });
                                }},
                                
                                scales: {series: [{data: [100, 200, 400]
                                                  }],
                                         
                                         plotOptions: {bar: {
                                             horizontal: true, dataLabels: {position: "top"}
                                         }},
                                         
                                         //dataLabels: {enabled: true, offsetX: -6, style: {colors: ["#FFFFFF"]}},
                                         
                                         xAxes: [{barPercentage: 0.4,
                                                  ticks: {
                                                      //beginAtZero: true,
                                                      fontFamily: "'Futura', sans-serif", fontSize: 11,
                                                      //does a call back to the array and returns the array index of the data(integer) inputed
                                                      callback: function(value, index, values) {
                                                          return xLabels[value];
                                                      }},
                                                  //x-axis label name
                                                  scaleLabel: {display: true, labelString: "Month"},
                                                  gridLines: {}, stacked: true}],
                                         
                                         yAxes: [{barThickness : 30,
                                                  gridLines: {display: false, color: "#fff", 
                                                              zeroLineColor: "#fff", zeroLineWidth: 0},
                                                  ticks: {fontFamily: "'Futura', sans-serif", fontSize: 11,
                                                          display: false},
                                                  //y-axis label name
                                                  scaleLabel: {display: false, labelString: "Batches"},
                                                  stacked: true}]},
                                
                                legend: {display: false},
                                tooltips: {enabled: false}};
      
      //calls the apex controller and runs the method getTrainings then saves the return of the method into getTracks
      var getTracks = component.get("c.getTrainings");
      //run a callback
      getTracks.setCallback(this, function(response) {
          //gets the response state; fail, success
          var state = response.getState();
          if (state === "SUCCESS") {

              //place the response info somewhere safe :O
              component.set("v.qTraining", response.getReturnValue());
              // component.set("v.tempList", response.getReturnValue());
              helper.setInitFilterValues(component, event);

              //pass the results to the chart creator.
              var ctx = component.find("myChart").getElement();
              // var theseColors = component.get('v.UserColors');
              // var theseSortBys = component.find('select').get('v.value');
              var newChart = helper.createChart(ctx, barOptions_stacked, 
                                                response.getReturnValue());
              component.set("v.dasChart", newChart);
              let completeEvent= $A.get("e.c:TableInitCompleteEvent");
              completeEvent.setParams({"TableName":'chart'});
              completeEvent.fire();
          } else {
              console.log("Failed with state: " + state);
          }
      });
      $A.enqueueAction(getTracks);
  },
    
    runSort: function(component, event, helper) {
        var sortBy = component.find("select").get("v.value");
        var allTrainings = component.get("v.tempList");
        var getColors = component.get('v.DisplayColors');
        helper.sortArray(allTrainings, getColors, sortBy);
        helper.updateData(component);
        helper.sortArray(allTrainings, getColors, sortBy);
        
        // change options of what to color bars by
        var fieldToSortBy = component.get('v.fieldToSortBy');
        switch(sortBy){
            case "Track":
                break;
            case "Project":
                break;
            
                /*
            case "Date":
                break;
                */
                
                //
            case "Review Completed":
                break;
                //
                
            case "Location":
                break;
            case "Trainer":
                break;
            default:
                // if it made it this far, then the user has selected choose one from
                // Sort By, do nothing
        }
    },
    
    runFilter: function(component, event, helper) {
        //Grabbing Relevant data
        var allTrainings = component.get("v.qTraining");
        var myChart = component.get("v.dasChart");
        var selectedTrack = component.find("TrackFilter").get("v.value");
        var selectedLocation = component.find("LocationFilter").get("v.value");
        var selectedDate = component.find("DateFilter").get("v.value");
        var newData = helper.filterData(selectedTrack, selectedLocation, selectedDate,
                                        myChart, allTrainings, component);
        var a = component.get("c.applyColors");
        $A.enqueueAction(a);
        component.set("v.tempList", newData);
    },
    
    
    callSaveComp: function(component, event, helper) {
        var childCmp = component.find("modalComp");
        childCmp.showModal("Online", "Salesforce");
    },
    
    showmodal: function(component, event, helper){
        var activePoints = component.get('v.dasChart').getElementsAtEvent(event);
        if(activePoints.length > 0 )
        {
            var currIndex = activePoints[0]._index;                
            var currSimpleTraining = component.get('v.tempList')[currIndex];
            console.log('here is the current simple training: ');
            console.log(currSimpleTraining);
            
            var childCmp = component.find("modalComp");
            
            let location = currSimpleTraining.location;
            JSON.stringify(location);
            let track = currSimpleTraining.trackName;
            JSON.stringify(track);
            console.log("track:"+track);
            
            let projectStartDate = currSimpleTraining.startDate;
            JSON.stringify(projectStartDate);
            console.log("projectStartDate:"+projectStartDate);
            
            //let newLocation = location.replace(/"/location,"");
            //console.log(newLocation);
            childCmp.showModal(currSimpleTraining.trainingId, track, projectStartDate);
        }
        
        let track = currSimpleTraining.trackName;
        JSON.stringify(track);
        
        childCmp.showModal(currSimpleTraining.trainingId, location, track);
    },
    
    modalUpdate: function(component, event, helper) {
        let action = component.get("c.getTrainings");
        action.setCallback(this, function(response) {
            let state = response.getState();
            if (state === "SUCCESS") {
                let returnedList = response.getReturnValue();
                component.set("v.qTraining", returnedList);
                let displayList = component.get("v.tempList");
                for (let currRecord = 0; currRecord < displayList.length; currRecord++) {
                    for (let currReturned = 0; currReturned < returnedList.length; 
                         currReturned++) {
                        if(displayList[currRecord].trackName == 
                           returnedList[currReturned].trackName) {
                            displayList[currReturned] = returnedList[currRecord];
                        }
                    }
                }
                component.set("v.tempList", displayList);
                helper.updateData(component);
            } else {
                console.log("callout failed with state: " + state);
            }
        });
        
        $A.enqueueAction(action);
    },
    
    /*
        handleBatchInformationEvent catches an application event that's fired 
        when a project or batch gets selected from the BatchAndProjectTables component.
        Then, sends information to the helper to be added to the Gantt Chart.
    */
    handleBatchInformationEvent: function(component, event, helper) {
        var batchInfo = event.getParam("batchInfo"); //all selected projects
        helper.addToChart(component, batchInfo);
    },
    
    updateData : function(component,event,helper){
        helper.updateData(component);
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
});