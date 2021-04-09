const api = {
    key: "28fd15358cdecbc1a1dfef367e71acef",
    base: "https://api.openweathermap.org/data/2.5/"
}
var APIKey="28fd15358cdecbc1a1dfef367e71acef";
const search = document.querySelector(".search");
const btn = document.querySelector(".btn");
btn.addEventListener("click", getInput);
$("#weatherResult").css("display","none")
$("#forecastResult").css("display","none")
$("#5day").css("display","none")
// For testing
// $("#cityName").val("Pune")
// $("#showWeather").click();
showOutputFields=function(){
    $("#weatherResult").show("slow")
    $("#forecastResult").show("slow")
    $("#5day").show("slow")
    $("#main").css("padding-top","")
}
function getInput (event) {
    event.preventDefault();
    
    if (event.type == "click") {
        getData(search.value);
        console.log(search.value);
    }
}

function getData () {
    fetch(`${api.base}weather?q=${search.value}&units=metric&appid=${api.key}`)
        .then(response => {
            return response.json();
        }).then(displayData);
}

function displayData (response) {
    console.log(response);
    
    if (response.cod == "400") {
        const error = document.querySelector(".error");
        alert("Please enter a valid city");
        search.value = "";}
    else if (response.cod == "404") {
        const error = document.querySelector(".error");
        alert("Please enter a valid city");
        search.value = "";
    } else {
        showOutputFields()
        const city = document.querySelector(".city");
        city.innerText = `${response.name}, ${response.sys.country}`;

        const today = new Date();
        const date = document.querySelector(".date");
        date.innerText = dateFunction(today);

        const temp = document.querySelector(".temp");
        temp.innerHTML = `Temp: ${Math.round(response.main.temp)} <span>°C</span>`;
        
        const feelslike = document.querySelector(".feelslike");
        feelslike.innerHTML = `Temp Feelslike: ${Math.round(response.main.feels_like)} <span>°C</span>`;

        const weather = document.querySelector(".weather");
        weather.innerText = `Weather: ${response.weather[0].main}`;

        const hummus = document.querySelector(".hummus");
        hummus.innerText = `Humidity: ${response.main.humidity}%`;

        const tempRange = document.querySelector(".temp-range");
        tempRange.innerText = `Temp Range: ${Math.round(response.main.temp_min)}°C / ${Math.round(response.main.temp_max)}°C`;

        const weatherIcon = document.querySelector(".weather-icon");
        const iconURL = "http://openweathermap.org/img/w/";
        weatherIcon.src = iconURL + response.weather[0].icon + ".png";

        search.value = "";
        forecast(response.id);
        UVIndex(response.coord.lon,response.coord.lat);
    }
}

function dateFunction (d) {
    let months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    let day = days[d.getDay()];
    let date = d.getDate();
    let month = months[d.getMonth()];
    let year = d.getFullYear();

    return `${day}, ${date} ${month} ${year}`;
}

function forecast(cityid){
    var dayover= false;
    var queryforcastURL="https://api.openweathermap.org/data/2.5/forecast?id="+cityid+"&appid="+APIKey;
    $.ajax({
        url:queryforcastURL,
        method:"GET"
    }).then(function(response){
        
        for (i=0;i<5;i++){
            var date= new Date((response.list[((i+1)*8)-1].dt)*1000).toDateString();
            var iconcode= response.list[((i+1)*8)-1].weather[0].icon;
            var iconurl="https://openweathermap.org/img/wn/"+iconcode+".png";
            var tempK= response.list[((i+1)*8)-1].main.temp;
            var tempF=(((tempK-273.5)*1.80)+32).toFixed(2);
            var tempC= (tempK-273).toFixed(0);
            var humidity= response.list[((i+1)*8)-1].main.humidity;
            
            $("#fDate"+i).html(date);
            $("#fImg"+i).html("<img src="+iconurl+">");
            $("#fTemp"+i).html(tempC+"&#8451");
            $("#fHumidity"+i).html(humidity+"%");
        }
        
    });
}

function UVIndex(ln,lt){
    var uvqURL="https://api.openweathermap.org/data/2.5/uvi?appid="+ APIKey+"&lat="+lt+"&lon="+ln;
    $.ajax({
            url:uvqURL,
            method:"GET"
            }).then(function(response){
                // $("#currentUvindex").html(response.value);
                const uvindex = document.querySelector(".currentUvindex");
                uvindex.innerText = `CurrentUvindex: ${response.value}`;
            });
}