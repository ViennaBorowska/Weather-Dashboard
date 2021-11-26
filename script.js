// Display date & time in header
setInterval(displayTopTime, 1000);
displayTopTime();

//API call and append time to page
function displayTopTime() {
    var rightNow = moment().format('dddd MMMM DD YYYY [at] hh:mm:ss a');
    $('#currentTime').text(rightNow);

    var currentHour = moment().format("HH");
    var dayNight = document.getElementById("#weatherHead")
//Change background image if nightime NOT WORKING!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    if (currentHour >= "18") {
    dayNight.setAttribute("class", "night");
 } 
}

console.log("rightnow");

//Global variables
const myAPI = "ae943f70020bf5c485600b4ddddb5e34"
//const weatherAPI = "https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=${part}&appid=ae943f70020bf5c485600b4ddddb5e34"

