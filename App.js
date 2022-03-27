import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Animated, TouchableOpacity } from 'react-native';
import { API_KEY } from './components/weatherAPIKey'
import Weather from './components/Weather';
import * as Location from 'expo-location';
const App = () => {
  const [isLoading, setLoading] = useState(true)
  const [temperature, setTempreture] = useState(0)
  const [weatherCondition, setWeather] = useState('Clear')
  const [error, setError] = useState(null)
  const [name, setName] = useState('')
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState('loading');
  const [allData, setAllData] = useState({})

  //API į oru progrnoze
  const fetchWeather = (API_KEY = API_KEY, lat = 25, lon = 25) => {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&APPID=${API_KEY}&units=metric`)
      .then(res => res.json())
      .then(json => {
        console.log(json);
        setWeather(json.weather[0].main)
        setTempreture(json.main.temp)
        setName(json.name)
        setLoading(false)
        setAllData(json)
      }).catch(e => console.log(e));
  }

  //paleisti fetchWeather paprastai
  useEffect(() => { fetchWeather(API_KEY, 50.450001, 30.5233) }, [])

  // gauti aparato tikslias kordinates ir paleisti fetchWeather
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      console.log(location)
      // fetchWeather(API_KEY, location.coords.latitude, location.coords.longitude)
    })();
  }, []);

  //renderis
  return (
    <View style={styles.container}>
      {isLoading ? <Text>{errorMsg}</Text> :
        <Weather weather={weatherCondition} temperature={temperature} name={name} data={allData} />}
      <TouchableOpacity><Text>Vilnius</Text></TouchableOpacity>
      <TouchableOpacity><Text>London</Text></TouchableOpacity>
      <TouchableOpacity><Text>Honkong</Text></TouchableOpacity>
    </View>
  );
}
export default App
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  }
});

