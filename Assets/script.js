var container = $(".container");

// Schedule start and end times
const startTime = 7;
const endTime = 17;

// Start with blank object and load any saved data that overlaps the current schedule hours
var eventData = {};
var savedData = loadLocal();

for (let ii = startTime; ii < endTime+1; ii++) {
  // This AM/PM scheme is implemented to simplify instantiation of hour blocks
  let key = 'h' + (ii>12?ii-12:ii) + (ii>=12?'PM':'AM')
  if ((savedData != null)&&((key) in savedData)) {
    eventData[key] = savedData[key];
  } else {
    eventData[key] = '';
  }
}

// Refresh time at 1s intervals
var currentTime = moment();
$('#currentDay').text(moment().format('MMMM Do YYYY — hh:mm:ss'));
setInterval(() => {
  $('#currentDay').text(moment().format('MMMM Do YYYY — hh:mm:ss'));
  currentTime = moment();
},1000)


// Add code to instantiate time blocks
let colorClass;
for (let ii = startTime; ii < endTime+1; ii++) {

  // timeblock instantiation
  let timeBlock = $('<div>');
  timeBlock.addClass('row timeblock d-flex align-items-center w-100')
  //imeBlock.addClass('row')

  let hour = $('<p>');
  hour.addClass('hour col-1 h-100');
  let hourText = (ii>12?ii-12:ii)+(ii>=12?'PM':'AM');
  hour.text(hourText);

  let eventBlock = $('<textarea>');

  // check status of hour (past, current, future)
  if (currentTime.hour() > ii) {
    colorClass = 'past'
  } else if (currentTime.hour() < ii) {
    colorClass = 'future'
  } else {
    colorClass = 'present';
  }
  eventBlock.addClass(colorClass);
  eventBlock.addClass('col-10 h-100');

  // Add previous data
  eventBlock.text(eventData['h'+hourText]);

  let lockButton = $('<button>');
  lockButton.text('🔒');
  lockButton.addClass('saveBtn col-1 h-100');


  // append objects to main container
  timeBlock.append(hour);
  timeBlock.append(eventBlock);
  timeBlock.append(lockButton);

  container.append(timeBlock);

}

// Add on save click listener for each lock button
container.on('click','.saveBtn',function(event){ 
  let contents = $(this).siblings('textarea').val();
  let hour = $(this).siblings('.hour').text();
  
  eventData['h' + hour] = contents;

  saveLocal()
});

function saveLocal() {
  window.localStorage.setItem('savedEvents',JSON.stringify(eventData));
}

function loadLocal() {
  if (window.localStorage.getItem('savedEvents') != null) {
    return JSON.parse(window.localStorage.getItem('savedEvents'));
  } else {
    return null;
  }
}