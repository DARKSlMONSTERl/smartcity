import { observeAuth,getCurrentUserProfile,logoutUser, updateCurrentUserProfile } from "./auth.js"
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

// Constantes para el perfil
const editProfileForm = document.getElementById('editProfileForm')
const editName = document.getElementById('editName')
const editEmail = document.getElementById('editEmail')
const editCity = document.getElementById('editCity')
const saveProfileBtn = document.getElementById('saveProfileBtn')

const editProfileModalElement = document.getElementById('editProfileModal')
const editProfileModal = editProfileModalElement ? bootstrap.Modal.get0rCreateInstance(editProfileModalElement) : null

//Funciones de Clima
let currentFavoriteCity=''
// Variables de usuario
let currentUser=null
let currentProfile = null
let userLogged

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

const renderProfile = (user, profile) => {
    const resolvedName = profile?.name || user.email?.split('@')[0] || 'Usuario'
    const resolvedEmail = profile?.email || '--'
    const resolvedCity = profile?.favoriteCity?.trim() || ''

    userName.textContent = resolvedName
    navUserName.textContent = resolvedName
    userEmail.textContent = resolvedEmail
    favoriteCity.textContent = resolvedCity || 'No Definida'

    editName.value = resolvedName
    editEmail.value = resolvedEmail
    editCity.value = resolvedCity

    currentFavoriteCity = resolvedCity
}

const reloadProfileAndWather = () => {
    if (!currentUser) {
        return
    }
    const profile = await getCurrentUserProfile(currentUser.uid)
    currentProfile = profile
    renderProfile(currentUser, profile)
    await loadWeather(currentFavoriteCity)
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
        currentUser = user
        const profile = await getCurrentUserProfile(user.uid)
        currentProfile = profile
        renderProfile(user, profile)
    }catch (error){
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

editProfileForm?.addEventListener('submit', async (e) => {
    event.preventDefault()

    hideAlert('ProfileAlert')
    hideAlert('ProfileSuccess')

    const name = editName.value.trim()
    const city = editCity.value.trim()

    if (!name) {
        showAlert('profileAlert', 'El nombre es obligatorio')
    }

    if (!city) {
        showAlert('profileAlert', 'La ciudad favorita es obligatoria')
    }

    try {
        setButtonLoading(
            saveProfileBtn,
            true,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios',
            'Guardando...'
        )

        await updateCurrentUserProfile(currentUser.uid, {
            name,
            favoriteCity: city
        })

        showAlert('ProfileSuccess', 'Perfil Actualizado')
        await reloadProfileAndWather()
        setTimeout(() => {
            editProfileModal?.hide()
            hideAlert('ProfileSuccess')
        }, 1500)
    }catch (error) {
        showAlert('ProfileAlert', error.message || 'No fue posible actualizar tu perfil')
    } finally {
        setButtonLoading(
            saveProfileBtn,
            false,
            '<i class="bi bi-check-circle m-2"></i> Guardar Cambios'
        )
    }
})