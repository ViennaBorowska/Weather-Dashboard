//API call and append time to page

function displayTopTime() {
    var rightNow = moment().format('dddd MMMM DD YYYY [at] hh:mm a');
    $('#currentTime').text(rightNow);
    //console.log(rightNow);
  }

setInterval(displayTopTime, 1000);
displayTopTime();

//     var currentHour = moment().format("HH");
//     var dayNight = document.getElementById("#weatherHead")
// //Change background image if nightime NOT WORKING
//     if (currentHour >= "18") {
//     dayNight.setAttribute("class", "night");
 //} 


$(document).ready(function () {
// openweather.org API Key
    const myAPI = "ae943f70020bf5c485600b4ddddb5e34"
    // LocalStorage cities array - for LHS
    var searchedCities = [];
    // Variable to track last searched cities
    var lastSearched = "";

    // Searchbar event listener
    $('#search-btn').on("click", function (event) {
        event.preventDefault();
        var currentCity = $('#city-search').val().trim();
        getWeather(currentCity);
        lastSearched = currentCity;
    });

    function getWeather(currentCity) {
       
    //Get weather data
        $.ajax({
            url: `https://api.openweathermap.org/data/2.5/weather?q=${currentCity}&appid=${myAPI}&units=imperial`,
            method: "GET"
        }).then( (response) => {

            //console.log(response);

            var  latit = response.coord.lat;
            var longit = response.coord.lon;
            var city = response.name;

           
            //console.log(latit, longit);

            saveToLocal()
            renderPrevious()
            renderWeather(response);
            getUV(latit, longit);
            getFive(latit, longit);
        });
    }
        //Get UV data
        function getUV(lat, lon,) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=${myAPI}`,
                method: 'GET'
            }).then( (UVresponse) => {
               console.log(UVresponse);
            });
        }
            //Get 5 day data
        function getFive (lat, lon) {
            $.ajax({
                url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${myAPI}&units=imperial&exclude=current,minutely,hourly`,
                method: 'GET'
            }).then( (response) => {
                renderFive(response);
            })
            ;
            
        };    
    

        function renderWeather (response) {

            var currentWeather = $("#weathCurrent");
            currentWeather.empty();
            var title = $("<div class='card-title'>").text(`${response.name}`)
            var img = $("<img>").attr("src", `https://openweathermap.org/img/w/${response.weather[0].icon}.png`)
            var temp = $("<div class='card-text'>").text(`Temperature: ${response.main.temp} °F`);
            var humid = $("<div class='card-text'>").text(`Humidity: ${response.main.humidity}%`);
            var wind = $("<div class='card-text'>").text(`Wind Speed: ${response.wind.speed} MPH`);

            var card = $("<div class='card'>");
            var cardB = $("<div class='card-body'>");

            card.append(cardB);
            cardB.append(title, temp, humid, wind);
            title.append(img);
            currentWeather.append(card);    

            // if(UVresponse[0].value < 4) {
            //     $("weatherCurrent").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-success'>").text(UVresponse[0].value)));
            // }
            // else if(UVresponse[0].value >= 4 && UVresponse[0].value <= 7) {
            //     $("#weatherCurrent").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-warning'>").text(UVresponse[0].value)));
            // }
            // else {
            //     $("#weatherCurrent").append($("<p>").text("UV Index: ").append($("<span class='badge badge-pill badge-danger'>").text(UVresponse[0].value)));
            // }
        }
    
        function renderFive (response) {
            $("#weatherForecast").empty();
        // Dynamically create header and bootstrap 'card-deck' div for the loop to append elements to
        $("#weatherForecast").append($("<h3>").text("5-Day Forecast:"), $("<div class='forecast-cards'>")); 

            for (var i = 1; i <= 5; i++) {
                var d = new Date(response.daily[i].dt*1000);
                $(".forecast-cards").append($("<div class='card text-white bg-primary card-body'>").append($("<h5>").text(`${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`), 
                $("<p>").append($("<img>").attr("src", `https://openweathermap.org/img/w/${response.daily[i].weather[0].icon}.png`)),
                $("<p>").text(`Temp: ${response.daily[i].temp.day} °F`),
                $("<p>").text(`Humidity: ${response.daily[i].humidity}%`)));

            }
        }

        function saveToLocal() {
            if (searchedCities.includes($("city-search").val()) === false && $("#city-search").val().trim() != "") {
                searchedCities.push($('#city-search').val());
                localStorage.setItem("searchedCities", JSON.stringify(searchedCities));

                localStorage.setItem("lastSearhed", lastSearched);
            }
        }

        function renderPrevious() {
            $(".list-group").empty();
            var storedSearches = JSON.parse(localStorage.getItem("searchedCities"));
            if (storedSearches !== null) {
                searchedCities = storedSearches;
            }

            searchedCities.forEach(function (element) {
                $(".list-group").append($("<button type='button' class='list-group-item list-group-item-action'>").text(element));
                });
            }
            
            $(".list-group").on("click", ".list-group-item", function(event) {
                getWeather($(this).text());

            });

          renderPrevious();

          if(localStorage.getItem("searchedCities") !== null) {
                getWeather(localStorage.getItem("searchedCities"));
          }

          $("#clearStorage").on("click", function (event) {
            event.preventDefault();
            searchedCities = [];
          })
               
    
});


