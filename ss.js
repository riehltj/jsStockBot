apiKey = "a18895e41bcac7f40775a3cbcfa80e29";
numberOfDays = 252;
tickers = [
  "REGI",
  "JETS",
  "NOVA",
  "RCL",
  "FUN",
  "NCLH",
  "BYND",
  "FB",
  "GE",
  "TSLA",
  "COIN",
];
let dates = [];
let prices = [];
let symbol = [];
let cp = [];
let avg30 = [];
let avg60 = [];
let avg90 = [];
let avg120 = [];
let avg180 = [];
let avg251 = [];

const arrAvg = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const updateDom = (symbol, cp, avg30, avg60, avg90, avg120, avg180, avg251) => {
  console.log(avg30);
  root = document.getElementById("root");
  sym = document.getElementById("sym");

  for (let i = 0; i < symbol.length; i++) {
    el = document.createElement("div");
    el.setAttribute("class", "ticker");
    el.innerHTML = `${symbol[i]}`;
    sym.appendChild(el);
  }
};

const getAvg = (prices, currPrice, ind) => {
  symbol[ind] = tickers[ind];
  cp[ind] = currPrice;
  // console.log(symbol);

  console.log(prices);
  avg30[ind] = Math.round(arrAvg(prices.slice(0, 29)) * 100) / 100;
  avg60[ind] = Math.round(arrAvg(prices.slice(0, 59)) * 100) / 100;
  avg90[ind] = Math.round(arrAvg(prices.slice(0, 89)) * 100) / 100;
  avg120[ind] = Math.round(arrAvg(prices.slice(0, 119)) * 100) / 100;
  avg180[ind] = Math.round(arrAvg(prices.slice(0, 179)) * 100) / 100;
  avg251[ind] = Math.round(arrAvg(prices.slice(0, 251)) * 100) / 100;
  console.log(ind, avg30);
  // completeArray = [avg30, avg60, avg90, avg120];

  if (
    (symbol.includes(undefined) === false) &
    (symbol.length == tickers.length)
  )
    updateDom(symbol, cp, avg30, avg60, avg90, avg120, avg180, avg251);
};

const currentPrice = (prices, currUrl, ind) => {
  fetch(currUrl)
    .then((response) => response.json())
    .then((data) => {
      currPrice = data[0].price;
      getAvg(prices, currPrice, ind);
    });
};

const historic = (data, ind, ticker) => {
  currUrl = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;
  for (i = 0; i < numberOfDays; i++) {
    dates[i] = data.historical[i].date;
    prices[i] = data.historical[i].close;
  }
  currentPrice(prices, currUrl, ind);
};

const getTicker = () => {
  for (let ind = 0; ind < tickers.length; ind++) {
    ticker = tickers[ind];
    histUrl = `https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?serietype=line&apikey=${apiKey}`;
    fetch(histUrl)
      .then((response) => response.json())
      .then((data) => historic(data, ind, tickers[ind]));
  }
};

getTicker();
