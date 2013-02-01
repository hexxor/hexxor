// function movePieceTo($piece,newTop,newLeft) {
    // //set the css 'top' and 'left'
    // //attributes of the passed piece
    // //to the arguments newTop and newLeft
    // $piece.css('top',newTop);
    // $piece.css('left',newLeft);    
// }


$('document').ready(function() {

    //Setup up the background grid
	
		
	for (var i = 0;i<columnNames.length;i++) {
        
        //this line creates a new div with the class 'column'
        //and appends it to the div with id 'page'
        $('div#page').append($('<div id=' + columnNames[i] +'>' + columnNames[i] + '</div>').addClass('column'));
		//and appends it to the div with id 'page'
		if (columnNames[i] === TimeAxisName) {
			$('#'+columnNames[i]).addClass('time');
		};
		
		// set width of the columns to split evenly in the 
		$('.column').width(97/columnNames.length+'%');		
		for (var y = 0;y<slotCount;y++) {
			
			//this line creates a new div with the class 'slot'
			//and appends it to the div with id 'page'
			if (columnNames[i] === TimeAxisName) {
				$('div#'+ columnNames[i]).append($('<div/>').addClass('slot time'));
			}
			else {
				$('div#'+ columnNames[i]).append($('<div/>').addClass('slot'));
			};
		};
    }
	
    //set up the planning with the correct classes
    //for the light and dark columns
    setUpPage();
	setUpTimeLabels();
	//create some sample runs
	var ProductionRuns = [
							[0,"F1","2013-01-01","AZ","EF1","100'000","360","100"],
							[1,"F2","2013-01-02","AZ","EF2","100'000","420","30"],
							[2,"F3","2013-01-02","AZ","EF3","100'000","480","88"],
							[3,"F1","2013-01-03","AZ","EF4","100'000","460","30"],
							[4,"F1","2013-01-03","AZ","EF5","100'000","490","60"],
							[5,"F1","2013-01-03","AZ","EF6","100'000","600","45"],
							[6,"F1","2013-01-03","AZ","EF7","100'000","645","20"]
						];
							
    
    //creating the runs and adding them to the DOM
    var runCount = ProductionRuns.length;
    for (var i=0;i<runCount;i++) {
        
        //this line appends an empty div
        //with the class 'run' to the div with id 'runs'
        $('div#runs').append($('<div id=runNo' + (ProductionRuns[i][0]) + '>'+(ProductionRuns[i][3])+ " " + (ProductionRuns[i][4])+ " " + (ProductionRuns[i][5]) + " " + (ProductionRuns[i][6]) + '</div>').addClass('run'));		
        // set height of the run according to the duration of the run.
		$('#runNo' + (ProductionRuns[i][0])).height((ProductionRuns[i][7])*(slotHeight+border)/slotDurationInMin);				
		var pixelPosition = getPixels((ProductionRuns[i][1]),(ProductionRuns[i][6]));
        
        //YOUR CODE
        //actually moving the run to its initial position
        movePieceTo($('#runNo'+(ProductionRuns[i][0])),pixelPosition.top,pixelPosition.left);
    }
    $('.run').width($('.slot').width());			    
		
    //YOUR CODE
    //sets up the classes for the different types of piece
    setUpRuns();

});

//global variables for one square
var TimeAxisName = 'Time';
var slotWidth = 170;
var slotHeight= 20;
var border = 2;
var dayBegin = 6*60; // 6AM
// set duration of one row in grid
var slotDurationInMin = 15;
// set total time shown in one page
var pageDurationInMin = 24*60;
var slotCount = pageDurationInMin/slotDurationInMin;
var columnNames = [TimeAxisName,"F1","F2","F3"];
	
	

function movePieceTo($run,newTop,newLeft) {
    //set the css 'top' and 'left'
    //attributes of the passed run
    //to the arguments newTop and newLeft
    $run.css('top',newTop);
    $run.css('left',newLeft);
    
}

//utility function for translating an columnID,time coordinate
//to a pixel position
//the convention is that the run in the upper left
//corner is at position columnID,dayBegin
// //the run in the upper right, at last columnID,0
function getPixels(columnID,startingTime) {
	var left = '0px';
	var actualSlotWidth = $('.slot').width();
	for (var p=0;p<columnNames.length;p++) {
		if  (columnID === columnNames[p]) {
			left = (p*(actualSlotWidth+border))+'px';
		}
	}
	if (startingTime>=dayBegin) {
		return {
			'top':  ((startingTime-dayBegin) * (slotHeight+border) / 15)+slotHeight+border+'px',
			'left': left
			};
		}
	else {
			return {
			'top':  ((startingTime-dayBegin+1440) * (slotHeight+border) /15)+slotHeight+border+'px',
			'left': left
			};
		};
}

function setUpPage() {
    //iterate through all of the divs 
    //with class `column`
    //figure out whether each one should be
    //light or dark, and assign the proper class
    
    $('div.column').each(function(index, column) {
        if ( index%2 === 0 ) { $(column).addClass('light'); }
        else { $(column).addClass('dark'); }
    });
}
function setUpTimeLabels() {
    //iterate through all of the divs 
    //with class `time`    
    
    $('.slot.time').each(function(index, slot) {
        //$(slot).html(index);
		$(slot).html(index*slotDurationInMin+dayBegin);
		
    });
}
function setUpRuns() {
    //select all the divs with class 'run'
    //add the 'light' class to half of them
    $('div.run:even').addClass('light');    
}