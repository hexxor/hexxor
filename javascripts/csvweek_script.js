//global variables for the production schedule
var TimeAxisName = 'Zeit';
var slotWidth = 170;
var slotHeight= 20;
var border = 2;
var dayBegin = 6*60; // 6AM in minutes
// set duration of one row in grid
var slotDurationInMin = 15;
// set total time shown in one page
var pageDurationInMin = 24*60;
var slotCount = pageDurationInMin/slotDurationInMin;
var columnNames = ["F1","F2"];
var weekDayCols = [TimeAxisName, "Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
var filename = 'LongtermPlanningExport.csv';
//var filename = 'export.txt';
var selectedDateObject = new Date();
var selectedDate = $.format.date(selectedDateObject,"yy-MM-dd");
//console.log("Selected Date: " + selectedDate);

$('document').ready(function() {

    //Setup up the background grid
for (var w = 0;w<weekDayCols.length;w++) {   
    //this line creates a new div with the class 'weekDay'
    //and appends it to the div with id 'page'
    $('div#page').append($('<div id=' + weekDayCols[w] +'><div class=columnTitle>' + weekDayCols[w] +'</div></div>').addClass('weekDay'));
    if (weekDayCols[w] === TimeAxisName) {
        $('#'+weekDayCols[w]).addClass('timeaxis').removeClass('weekDay');
        $('#'+weekDayCols[w]).append$('<div>Falz</div>');               
    };
    else {
        for (var i = 0;i<columnNames.length;i++) {
        //this line creates a new div with the class 'column'
        //and appends it to the div with id 'weekDayCols[w]'
            $('div#' + weekDayCols[w]).append($('<div id=' + weekDayCols[w] + "_" + columnNames[i] +'>' + columnNames[i] + '</div>').addClass('column'));                
        }
    } 
}
// set width of the columns to split evenly in the        
$('.weekDay').width(97/weekDayCols.length+'%');  
$('.timeaxis').width(97/weekDayCols.length+'%');     
$('.column').width(97/columnNames.length+'%');        
for (var y = 0;y<slotCount;y++) {
        
    //this line creates a new div with the class 'slot'
    //and appends it to the div with id 'page'
   $('.column').append($('<div/>').addClass('slot'));
};
for (var y = 0;y<(slotCount+1);y++) {
        
    //this line creates a new div with the class 'slot'
    //and appends it to the div with id 'page'
   $('.timeaxis').append($('<div/>').addClass('slot time'));
};

    //set up the planning with the correct classes
    setUpPage();
setUpDatePicker();
setUpTimeLabels();
//create some sample runs
// var ProductionRuns = [
// [0,"F1","2013-01-01","AZ","EF1","100'000","360","100"],
// [1,"F2","2013-01-02","AZ","EF2","100'000","420","30"],
// [2,"F3","2013-01-02","AZ","EF3","100'000","480","88"],
// [3,"F1","2013-01-03","AZ","EF4","100'000","460","30"],
// [4,"F1","2013-01-03","AZ","EF5","100'000","490","60"],
// [5,"F1","2013-01-03","AZ","EF6","100'000","600","45"],
// [6,"F1","2013-01-03","AZ","EF7","100'000","645","20"]
// ];

    //sets up the classes for the different types of piece
    var result = [];
readCSVfile(filename);	
//creating the runs and adding them to the DOM

//$('div#test').append($('<div id=testdiv>' + result[0] + '</div>'));
});

function movePieceTo($run,newTop,newLeft) {
    //set the css 'top' and 'left'
    //attributes of the passed run
    //to the arguments newTop and newLeft
    $run.css('top',newTop);
    $run.css('left',newLeft);
}

//utility function for translating an columnID and startingtime
//to a pixel position
//the convention is that the run in the upper left
//corner is at position columnID,dayBegin
// //the run in the upper right, at last columnID,0
function getPixels(columnID,startingTimeHours,startingTimeMinutes) {
var left = '0px';
var actualSlotWidth = $('.slot').width();
for (var p=0;p<columnNames.length;p++) {
if (columnID === columnNames[p]) {
left = (p*(actualSlotWidth+border))+'px';
}
}
var startingTime = (startingTimeHours*60+startingTimeMinutes);
if (startingTime>=dayBegin) {
return {
'top': ((startingTime-dayBegin) * (slotHeight+border) / slotDurationInMin)+slotHeight+border+'px',
'left': left
};
}
else {
return {
'top': ((startingTime-dayBegin+pageDurationInMin) * (slotHeight+border) /slotDurationInMin)+slotHeight+border+'px',
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
function setUpDatePicker() {
    //include the JQuery UI datepicker plugin
    //add an Event that updates the selected date
    //after the datePicker has been closed
$(function() {
$( '#datepicker' ).datepicker({
onClose: function() {
selectedDateObject = $('#datepicker').datepicker("getDate");
selectedDate = $.format.date(selectedDateObject,"yy-MM-dd");
displaySelectedRuns(selectedDate);	
}	
});
$( '#datepicker' ).datepicker("option", "dateFormat", "dd.mm.yy");
$( '#datepicker' ).val("Daten werden geladen...");
});


}


function setUpTimeLabels() {
    //iterate through all of the slot divs
    //with class `time`
var thisDate = new Date();
    $('.slot.time').each(function(index, slot) {
// create the time labels according to the slot index and the chosen dayBegin time in minutes
thisDate.setMinutes(index*slotDurationInMin+dayBegin%60);
thisDate.setHours((index*slotDurationInMin+dayBegin)/60);
$(slot).html($.format.date(thisDate,"HH:mm"));
    });
}
function setUpRuns() {
    //select all the divs with class 'run'
    //add the 'light' class to half of them
    $('.run:even').addClass('light');
}

function readCSVfile(filename) {
// load the file and process it after loading it
var filecontents = jQuery.get(filename, function(data) {
//process text file line by line
var rawArray = $.csv.toArrays(data,{'separator':';'});
var returnarray = [];
for (var line=0;line<rawArray.length;line++) {
//filter away the lines that only contain one line with the printingDay
//which is not used and is not conform to the columns
if (rawArray[line].length > 1) {
returnarray.push(rawArray[line]);	
}
}
result = returnarray;
});
// display the results after the result is there
filecontents.done(function() {
generateResult();
setUpRuns();	
});
}
function generateResult() {
    //print out the result array to the console
//console.log(result);
var runCount = result.length;
var PrintingDayStart = Date.parse(selectedDateObject);	
    for (var i=1;i<runCount;i++) {
        
        //this line appends an empty div
        //with the class 'run' to the div with id 'runs'
        $('div#runs').append($('<div id=runNo' + i + '>'+(result[i][0])+ " " + (result[i][2])+ " " + (result[i][5]) + " Ex. " + (result[i][7]) + '</div>').addClass('run').hide());	
        // set height of the run according to the duration of the run.
//console.log("Starttime: " + result[i][3]);
//console.log("Endtime: " + result[i][4]);
setPrintingDayClass(result[i][3],dayBegin,$('#runNo' + i));
setRunPosition(result[i][3],dayBegin,i);	
    }
    $('.run').width($('.slot').width());
$( '#datepicker' ).val("Hier klicken...");

}

function setPrintingDayClass(time,newDayBegin,$runObject) {
    //decide whether the time is before or after the newDayBegin
    //add the class of the corresponding PrintingDayClass
     //console.log("Params: " + time + " " + newDayBegin);
     var dateParts = time.split(' ');
     var parsedDate = dateParts[0].split('-');
     var parsedTime = dateParts[1].split(':');
     var PrintingDayStartObject = new Date(parsedDate[0], parsedDate[1] - 1, parsedDate[2], parsedTime[0], parsedTime[1], parsedTime[2]);
     //console.log("PrintingDayStartObject: " + PrintingDayStartObject);
// Previous day starts 24h before the actual day
var PreviousPrintingDayStartObject = new Date();
PreviousPrintingDayStartObject.setDate(PrintingDayStartObject.getDate()-1);
//console.log("PreviousPrintingDayStartObject: " + PreviousPrintingDayStartObject);
var ActualStartObject = new Date(parsedDate[0], parsedDate[1] - 1, parsedDate[2], parsedTime[0], parsedTime[1], parsedTime[2]);
//console.log("ActStartObj: " + ActualStartObject);
var printingDayClass = $.format.date(PrintingDayStartObject,"yy-MM-dd");
var previousPrintingDayClass = $.format.date(PreviousPrintingDayStartObject,"yy-MM-dd");
// Set the DayStartObject according to the newDayBegin argument which must be in minutes
PrintingDayStartObject.setHours(newDayBegin/60);
PrintingDayStartObject.setMinutes(newDayBegin%60);
if (PrintingDayStartObject < ActualStartObject) {
//console.log(printingDayClass + "This is after Daybegin");
$runObject.addClass(printingDayClass);
}
else {
//console.log(printingDayClass + "This is before Daybegin");
$runObject.addClass(previousPrintingDayClass);
}
}

function setRunPosition(time,newDayBegin,runIndex) {
    //decide at what position the Run should be displayed
var startdateParts = result[runIndex][3].split(' ');
     var parsedStartDate = startdateParts[0].split('-');
     var parsedStartTime = startdateParts[1].split(':');
     var startingTimeDateObject = new Date(parsedStartDate[0], parsedStartDate[1] - 1, parsedStartDate[2], parsedStartTime[0], parsedStartTime[1], parsedStartTime[2]);
     //var startingTimeDateObject = new Date(Date.parse(result[runIndex][3]));
var startingTimeHours = startingTimeDateObject.getHours();
var startingTimeMinutes = startingTimeDateObject.getMinutes();
// this calculates the duration in minutes
var endDateParts = result[runIndex][4].split(' ');
     var parsedEndDate = endDateParts[0].split('-');
     var parsedEndTime = endDateParts[1].split(':');
     var endTimeDateObject = new Date(parsedEndDate[0], parsedEndDate[1] - 1, parsedEndDate[2], parsedEndTime[0], parsedEndTime[1], parsedEndTime[2]);
    
     var runDurationInMin = (endTimeDateObject - startingTimeDateObject)/(1000*60);
//update the height of the run
$('#runNo' + runIndex).height(runDurationInMin*(slotHeight+border)/slotDurationInMin);	
//calculate the Pixels according to the Line and the starting time
var pixelPosition = getPixels((result[runIndex][6]),startingTimeHours,startingTimeMinutes);
//actually moving the run to its initial position
movePieceTo($('#runNo'+runIndex),pixelPosition.top,pixelPosition.left);
}

function displaySelectedRuns(PrintingDay) {
//var testDay = "12-12-07";
//console.log(PrintingDay);
$('.run').hide();
$('.run.'+PrintingDay).show();
}
