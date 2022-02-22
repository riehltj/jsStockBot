apiKey = "192892f8a1d0e10e5b2c365bebb9098d";

numberOfDays = 90;
dates = [];
prices = [];
boughtPrice = document.getElementById("bought").value;
const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const updateDom = (dates, prices, currPrice) => {
  avg30 = arrAvg(prices.slice(0, 29));
  avg60 = arrAvg(prices.slice(0, 59));
  avg90 = arrAvg(prices.slice(0, 89));
  avg180 = arrAvg(prices.slice(0, 179));
  avg251 = arrAvg(prices.slice(0, 250));
  TESTER = document.getElementById("tester");

  Plotly.newPlot(
    TESTER,
    [
      {
        x: dates,
        y: prices,
        name: "Data",
      },

      {
        x: [dates[0], dates[90 - 1]],
        y: [currPrice, currPrice],
        name: "Current Price",
      },
      {
        // x: [dates[0], dates[90 - 1]],
        // y: [boughtPrice, boughtPrice],
        // name: "Bought Price",
      },
      {
        x: [dates[0], dates[30 - 1]],
        y: [avg30, avg30],
        name: "30 Day Avg Price",
      },
      {
        x: [dates[0], dates[60 - 1]],
        y: [avg60, avg60],
        name: "60 Day Avg Price",
      },
      {
        x: [dates[0], dates[90 - 1]],
        y: [avg90, avg90],
        name: "90 Day Avg Price",
      },
    ],

    {
      margin: { t: 0 },
    }
  );

  pen30 = Math.round(((currPrice - avg30) / avg30) * 10000) / 100;
  pen60 = Math.round(((currPrice - avg60) / avg60) * 10000) / 100;
  pen90 = Math.round(((currPrice - avg90) / avg90) * 10000) / 100;
  pen180 = Math.round(((currPrice - avg180) / avg180) * 10000) / 100;
  pen251 = Math.round(((currPrice - avg251) / avg251) * 10000) / 100;

  document.getElementById("pen30").innerHTML = `30 Day Avg: ${pen30}% : $ ${
    Math.round(avg30 * 100) / 100
  }`;
  document.getElementById("pen60").innerHTML = `60 Day Avg: ${pen60}% : $ ${
    Math.round(avg60 * 100) / 100
  }`;
  document.getElementById("pen90").innerHTML = `90 Day Avg: ${pen90}% : $ ${
    Math.round(avg90 * 100) / 100
  }`;
  document.getElementById("pen180").innerHTML = `180 Day Avg: ${pen180}% : $ ${
    Math.round(avg180 * 100) / 100
  }`;
  document.getElementById("pen251").innerHTML = `251 Day Avg: ${pen251}% : $ ${
    Math.round(avg251 * 100) / 100
  }`;
  document.getElementById("cp").innerHTML = `$ ${currPrice}`;
};

const currentPrice = (dates, prices) => {
  fetch(currUrl)
    .then((response) => response.json())
    .then((data) => {
      currPrice = data[0].price;
      updateDom(dates, prices, currPrice);
    });
};

const historic = (data) => {
  for (let i = 0; i < numberOfDays; i++) {
    dates[i] = data.historical[i].date;
    prices[i] = data.historical[i].close;
  }
  currentPrice(dates, prices);
};
const updateChart = () => {
  ticker = document.getElementById("ticker").value;
  document.getElementById("pen30").innerHTML = `--%`;
  document.getElementById("pen60").innerHTML = `--%`;
  document.getElementById("pen90").innerHTML = `--%`;
  document.getElementById("tester").innerHTML = "";
  console.log(ticker);
  currUrl = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;
  histUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&apikey=${apiKey}`;

  fetch(histUrl)
    .then((response) => response.json())
    .then((data) => historic(data));
};

document.getElementById("go").addEventListener("click", updateChart);

setInterval(updateChart, 60000);
