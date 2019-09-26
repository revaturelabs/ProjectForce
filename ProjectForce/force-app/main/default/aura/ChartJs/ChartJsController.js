({
	myAction : function(component, event, helper) {
        var barOptions_stacked = {
    hover :{
        animationDuration:10
    },
    scales: {
        xAxes: [{
            label:"Duration",
            ticks: {
                beginAtZero:true,
                fontFamily: "'Open Sans Bold', sans-serif",
                fontSize:11
            },
            scaleLabel:{
                display:false
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
            stacked: true
        }]
    },
    legend:{
        display:false
    },
};

var ctx = component.find("myChart").getElement();
var myChart = new Chart(ctx, {    
    type: 'horizontalBar',
    data: {
        labels: ["1", "2", "3", "4", "5"],
        
        datasets: [{
            data: [50,150, 300, 400, 500],
            backgroundColor: "rgba(63,103,126,0)",
            hoverBackgroundColor: "rgba(50,90,100,0)"
            
        },{
            data: [100, 100, 200, 200, 400],
            backgroundColor: ['red', 'green', 'blue', 'yellow', 'orange'],
        }]
    },
    options: barOptions_stacked,
});

// this part to make the tooltip only active on your real dataset
var originalGetElementAtEvent = myChart.getElementAtEvent;
myChart.getElementAtEvent = function (e) {
    return originalGetElementAtEvent.apply(this, arguments).filter(function (e) {
        return e._datasetIndex === 1;
    });
}

		
	}
})