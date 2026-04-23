import { observeAuth,getCurrentUserProfile,logoutUser } from "./auth.js"
import { getCityWeather, formatWeatherUpdateTime } from "./weather.js"

const userName=document.getElementById('userName')
const navUserName=document.getElementById('navUserName')
const userEmail=document.getElementById('userEmail')
const favoriteCity=document.getElementById('favoriteCity')
const logoutBtn=document.getElementById('logoutBtn')

// constantes para el clima

const refreshWeatherBtn = document.getElementById('refreshWeatherBtn')
const weatherAlert = document.getElementById('weatherAlert')
const weatherLoading = document.getElementById('weatherLoading')
const weatherContent = document.getElementById('weatherContent')
const weatherCityName = document.getElementById('weatherCityName')
const weatherDescription = document.getElementById('weatherDescription')
const weatherTemperature = document.getElementById('weatherTemperature')
const weatherApparentTemp = document.getElementById('weatherApparentTemp')
const weatherHumidity= document.getElementById('weatherHumidity')
const weatherWind = document.getElementById('weatherWind')
const weatherCoords = document.getElementById('weatherCoords')
const weatherUpdateAt = document.getElementById('weatherUpdatedAt')
const weatherIcon = document.getElementById('weatherIcon')

//Funciones de Clima
let currentFavoriteCity=''

const showWeatherAlert = message => {
    weatherAlert.textContent = message
    weatherAlert.classList.remove('d-none')
}

const hideWeatherAlert = message => {
    weatherAlert.textContent = message
    weatherAlert.classList.add('d-none')
}

const setWeatherLoading = isLoading=>{
    weatherLoading.classList.toggle('d-none', !isLoading)
    refreshWeatherBtn.disabled=isLoading
}

const hideWeatherContent=()=>{
    weatherContent.classList.add('d-none')
}

const showWeathercontent=()=>{
    weatherContent.classList.remove('d-none')
}

const buildLocationLabel = location =>{
    const parts = [location.name]
    if(location.admin){
        parts.push(location.admin1)
    }
    if(location.country){
        parts.push(location.country)
    }
    return parts.join(", ")
}

const renderWeather = weatherData => {
    const { location, current, weatherInfo } = weatherData
    console.log('@@ render = weather => ', { location, current, weatherInfo })

    weatherCityName.textContent = buildLocationLabel(location)
    weatherDescription.textContent = weatherInfo.label
    weatherTemperature.textContent = `${Math.round(current.temperature_2m)}°C`
    weatherApparentTemp.textContent = `${Math.round(current.apparent_temperature)}°C`
    weatherHumidity.textContent = `${Math.round(current.relative_humidity_2m)}%`
    weatherWind.textContent = `${Math.round(current.wind_speed_10m)} km/h`
    weatherCoords.textContent = `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`
    weatherUpdateAt.textContent = `${formatWeatherUpdateTime(current.time)}`
    weatherIcon.className = `bi ${weatherInfo.icon} weather-main-icon`
    showWeathercontent()
}

const loadWeather= async (city) => {
    if (!city){
        hideWeatherContent()
        showWeatherAlert('no tienes una ciudad definida')
        return
    }

    hideWeatherAlert()
    hideWeatherContent()
    setWeatherLoading(true)

    try {
        const weatherData = await getCityWeather(city)
        console.log('@@@ weather => ', weatherData)
        renderWeather(weatherData)
    } catch (error) {
        hideWeatherContent()
        showWeatherAlert(error.message || 'No se encontro el clima')
    } finally {
        setWeatherLoading(false)
    }
}

//Terminan funciones de clima

observeAuth(async (user) => {
    if (!user) {
        window.location.href = '../../../login.html'
        return
    }
    
    try {
     const profile = await getCurrentUserProfile(user.uid)
     const resolvedName = profile?.name || user.email?.split('@')[0] || 'Usuario'
     const resolvedEmail = profile?.email || '--'
     const resolvedCity = profile?.favoriteCity?.trim() || user.email ||'No añadida'

    userName.textContent = resolvedName
    navUserName.textContent = resolvedName
    userEmail.textContent = resolvedEmail
    favoriteCity.textContent = resolvedCity

    currentFavoriteCity=resolvedCity

    await loadWeather(currentFavoriteCity)

    } catch (error) {
        showWeatherAlert('No fue posible cargar tu perfil')
    }
    
    
  
})

logoutBtn?.addEventListener('click',async()=>{
    await logoutUser()
    window.location.href = '../../../login.html'
})

refreshWeatherBtn?.addEventListener('click', async()=>{
    await loadWeather(currentFavoriteCity)
})