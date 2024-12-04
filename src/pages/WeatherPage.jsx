import React, { Component } from 'react';
import axios from 'axios';

class Weather extends Component {
  constructor(props) {
    super(props);
    this.state = {
      city: '용인',
      temp: 0,
      temp_max: 0,
      temp_min: 0,
      humidity: 0,
      desc: '',
      icon: '',
      loading: true,
    };
  }

  // 날씨 정보 조회
  componentDidMount() {
    const cityName = 'YongIn';
    const apiKey = process.env.REACT_APP_WEATHER_KEY;
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}`;

    axios
      .get(url)
      .then((responseData) => {
        const data = responseData.data;
        this.setState({
          temp: data.main.temp,
          temp_max: data.main.temp_max,
          temp_min: data.main.temp_min,
          humidity: data.main.humidity,
          desc: data.weather[0].description,
          icon: data.weather[0].icon,
          loading: false,
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    const imgSrc = `https://openweathermap.com/img/w/${this.state.icon}.png`;

    if (this.state.loading) {
      return <p>Loading...</p>;
    } else {
      return (
        <div style={styles.weatherContainer}>
          <div style={styles.temp}>
            <span>{this.state.city} {(this.state.temp - 273.15).toFixed(0)}°</span>
          </div>
          
            <img src={imgSrc} alt="날씨" style={styles.icon} />
            <span>{this.state.desc}</span>

          <div style={styles.additionalInfo}>
            <span>최고: {(this.state.temp_max - 273.15).toFixed(0)}°</span>
            <span>최저: {(this.state.temp_min - 273.15).toFixed(0)}°</span>
            <span>습도: {this.state.humidity}%</span>
          </div>
        </div>
      );
    }
  }
}

const styles = {
  weatherContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '15px',
    fontSize: '16px',
    backgroundColor: '#f8f8f8',
    width: '280px',
    color: 'black', 
  },
  temp: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'black',  
  },
  icon: {
    width: '20px',
    height: '20px',
  },
  additionalInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    fontSize: '12px',
    textAlign: 'right',
    color: 'black',
  },
};

export default Weather;
