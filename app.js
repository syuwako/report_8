
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cron = require('node-cron');

const app = express();
const port = 3000;
const apiKey = process.env.API_KEY;
const cityId = process.env.CITY_ID;

// 現在の時間を取得する関数
const getCurrentTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}/${month}/${day}//${hours}/${minutes}/${seconds}`;
};

// 天気情報を取得して出力する関数
const getWeather = async () => {
  try {
    const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric&lang=ja`);
    const data = response.data;
    const weatherDescription = data.weather[0].description;
    const temperature = data.main.temp;

    const currentTime = getCurrentTime();
    console.log(`${currentTime} 午前１２時です。今日の天気は${weatherDescription}、気温は${temperature}度でづ`);
  } catch (error) {
    console.error('天気情報の取得に失敗しました:', error);
  }
};

// 毎時間の0分に天気情報を取得
cron.schedule('0 * * * *', getWeather);

// サーバ起動
app.listen(port, () => {
  console.log(`サーバがポート${port}で起動しました`);
});
