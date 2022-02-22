apiKey = "192892f8a1d0e10e5b2c365bebb9098d";

//INPUTS
let cash = 100; // $100.00
// lowB = -0.000068;
// highB = 0.000864;
lowB = 0;
highB = 0;
let freq = "15min"; //1min,5min,15min,1hour,4hour

// Data Inputs
let freqBounds = "1hour";

dates = [];
highs = [];
lows = [];
opens = [];
closes = [];
ticker = "";
const resetCash = () => {
  cash = 100;
};
const getBounds = async () => {
  highArray = [];
  lowArray = [];
  openArray = [];
  L = [];
  H = [];
  url = `https://financialmodelingprep.com/api/v3/historical-chart/${freqBounds}/${ticker}?&apikey=${apiKey}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      for (let i = 0; i < data.length; i++) {
        highArray[i] = data[i].high;
        lowArray[i] = data[i].low;
        openArray[i] = data[i].open;
      }
      for (let j = 0; j < openArray.length; j++) {
        L[j] = (lowArray[j] - openArray[j]) / openArray[j];
        H[j] = (highArray[j] - openArray[j]) / openArray[j];
      }

      L.sort();
      lowB = L[10];
      H.sort();
      highB = H[10];
      console.log("Getting Bounds...", lowB, highB);
      return;
    });
};

const simulate = async (dates, highs, lows, opens, closes) => {
  //build local arrays
  lowPer = [];
  highPer = [];
  console.log(highB, lowB);
  //parse line by line
  for (let j = 0; j < opens.length; j++) {
    lowPer[j] = (lows[j] - opens[j]) / opens[j];
    highPer[j] = (highs[j] - opens[j]) / opens[j];

    if (lowPer[j] < lowB && highPer[j] > highB) {
      cash = cash * (highB - lowB) + cash;
    } else if (lowPer[j] < lowB && highPer[j] < highB) {
      cash = (cash * (closes[j] - opens[j])) / opens[j] + cash;
    } else if (lowPer[j] > lowB) {
    } else {
      console.log(dates[j]);
    }
  }
  document.getElementById("return").innerHTML = `$${
    Math.round(cash * 100) / 100
  }`;
  console.log("$", Math.round(cash * 100) / 100);
  console.log("start:", dates[0]);
  console.log("End:", dates[dates.length - 1]);
};

const historic = async (data) => {
  for (let i = 0; i < data.length; i++) {
    dates[i] = data[i].date;
    highs[i] = data[i].high;
    lows[i] = data[i].low;
    opens[i] = data[i].open;
    closes[i] = data[i].close;
  }

  dates.reverse();
  highs.reverse();
  lows.reverse();
  opens.reverse();
  closes.reverse();
  await simulate(dates, highs, lows, opens, closes);
};

const init = async () => {
  ticker = document.getElementById("ticker").value;
  freq = document.getElementById("freq").value;
  freqBounds = document.getElementById("freqBounds").value;

  console.log(freqBounds);
  await getBounds();
  histUrl = `https://financialmodelingprep.com/api/v3/historical-chart/${freq}/${ticker}?&apikey=${apiKey}`;
  fetch(histUrl)
    .then((response) => response.json())
    .then((data) => historic(data));
};

document.getElementById("go").addEventListener("click", init);
document.getElementById("reset").addEventListener("click", resetCash);

// init();
