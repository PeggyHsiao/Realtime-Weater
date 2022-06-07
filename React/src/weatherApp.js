import React, { useState } from 'react';

import styled from '@emotion/styled';
import { css } from '@emotion/react';

import { ReactComponent as AirFlowIcon } from './images/air-flow-icon.svg';
import { ReactComponent as RainIcon } from './images/rain-icon.svg';
import { ReactComponent as RedoIcon } from './images/redo-icon.svg';

// import { ReactComponent as SunnyDay } from './images/sunny.svg';
import { ReactComponent as Sun } from './images/sun.svg';
// import { ReactComponent as CloudyDay } from './images/cloudy.svg';
// import { ReactComponent as RainDay } from './images/rain.svg';

// import SunDay from './images/sun.svg';

const Container = styled.div`
    background: #F5F5F5;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const WeatherCard = styled.div`
    position: relative;
    box-shadow: 0 0 10px rgba(0, 0, 0, .1);
    padding: 50px;
    min-width: 480px;
    background: white;
    box-sizing: border-box;
`;

const Location = styled.div`
    font-size: 1.75rem;
    font-weight: 500;
    color: #212121;
    margin-bottom: 20px;
`;

const Description = styled.div`
    color: #828282;
    margin-bottom: 30px;
`;

const CurrentWeather = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`;

const Temperature = styled.div`
    color: #757575;
    font-size: 6rem;
    font-weight: 300;
    display: flex;
`;

const Celsius = styled.span`
    font-size: 2.65rem;
`;

const iconDefault = () => css`
    display: flex;
    align-items: center;
    font-weight: 300;
    color: #828282;

    svg {
        width: 25px;
        height: auto;
        margin-right: 30px;
    }
`;

const AirFlow = styled.div`
    ${iconDefault}
    margin-bottom: 20px;   
`;

const Rain = styled.div`
    ${iconDefault}
`;

const SunDay = styled(Sun)`
    flex-basis: 30%;
`;

const RedoDiv = styled.div`
    color: #787878;
    display: flex;
    justify-content: flex-end;
    position: absolute;
    right: 15px;
    bottom: 15px;
`;

const Redo = styled(RedoIcon)`
    width: 20px;
    height: 20px;
    cursor: pointer;
    color: #787878;
    margin-left: 10px;
`;

const Weather = () => {
    const [weatherInfo, SetWeatherInfo] = useState ({
        observationTime: '2019-10-02 22:10:00',
        locationName: '臺北市',
        description: '多雲時晴',
        temperature: 27.5,
        windSpeed: 0.3,
        humid: 0.88,
    });

    const handleClick = () => {
        fetch("https://opendata.cwb.gov.tw/api/v1/rest/datastore/O-A0003-001?Authorization=CWB-46404969-9772-4056-A95B-38D3ADA61C48&stationId=466920")
        .then(res => res.json())
        .then(data => {
            const info = data.records.location[0];

            const weatherElements = info.weatherElement.reduce((neededElements, item) => {
                if(['WDSD', 'TEMP', 'HUMD'].includes(item.elementName)) {
                    neededElements[item.elementName] = item.elementValue;
                }
                return neededElements
            }, {})
            

            SetWeatherInfo({
                observationTime: info.time.obsTime,
                locationName: info.locationName,
                description: '多雲時晴',
                temperature: weatherElements.TEMP,
                windSpeed: weatherElements.WDSD,
                humid: weatherElements.HUMD,
            })
        })
    };

    return (
        <Container>
            <WeatherCard>
                <Location>{ weatherInfo.locationName }</Location>
                <Description>{ weatherInfo.description }</Description>
                <CurrentWeather>
                    <Temperature>
                        { Math.round(weatherInfo.temperature) }
                        <Celsius>°C</Celsius>
                    </Temperature>
                    <SunDay />
                </CurrentWeather>
                <AirFlow>
                    <AirFlowIcon />
                    { weatherInfo.windSpeed } m/h
                </AirFlow>
                <Rain>
                    <RainIcon />
                    { Math.round(weatherInfo.humid*100) } %
                </Rain>
                <RedoDiv>
                    最後觀測時間: {new Intl.DateTimeFormat('zh-TW', {
                        hour: 'numeric',
                        minute: 'numeric',
                    }).format(new Date(weatherInfo.observationTime))} { ' ' }
                    <Redo onClick={handleClick} />
                </RedoDiv>
            </WeatherCard>
        </Container>
    )
};

export default Weather
