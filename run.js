apiKey = "192892f8a1d0e10e5b2c365bebb9098d";
key = "3c263df4cf34e07725e2d1109014a78199ca5862";
//# Meta Data
//https://api.tiingo.com/tiingo/daily/<ticker>

//# Latest Price
//https://api.tiingo.com/tiingo/daily/<ticker>/prices

//# Historical Prices
//https://api.tiingo.com/tiingo/daily/<ticker>/prices?startDate=2012-1-1&endDate=2016-1-1
//INPUTS
let cash = 100; // $100.00
// lowB = -0.000068;
// highB = 0.000864;
lowB = 0;
highB = 0;
freq = "15min"; //1min,5min,15min,1hour,4hour

// Data Inputs
freqBounds = "1hour";
bp = 0; //bought price
sp = 0; //sold price
cp = 0; //current price

dates = [];
highs = [];
lows = [];
opens = [];
closes = [];
ticker = "";

//SIm Variables
let op = 0; //open price
let bought = 0;
let stocks = 0;
let buyTarget = 0;
let sellTarget = 0;
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

const runSim = () => {
  simURL = `https://financialmodelingprep.com/api/v3/quote-short/${ticker}?apikey=${apiKey}`;
  fetch(simURL)
    .then((response) => response.json())
    .then((data) => {
      let cp = parseFloat(data[0].price);
      // console.log("Current Price: $" + cp);
      // console.log("Buy PRice: $" + buyTarget);
      // console.log("Open PRice: $" + op);

      if (op == 0) {
        //Init sim
        console.log(cash);
        op = cp;
        bought = 0;
        stocks = 0;
        buyTarget = op * lowB + op;
        sellTarget = op * highB + op;
      } else if (bought == 0 && cp < buyTarget) {
        bought = 1;
        stocks = cash / cp;
        console.log("BOUGHT");
      } else if (bought == 1 && cp > sellTarget) {
        bought = 0;
        cash = stocks * cp;
        stocks = 0;
        op = 0;
        console.log("SOLD" + Math.round(cash * 100) / 100);
      } else {
        console.log("HOLD");
      }
    });
};

const init = async () => {
  ticker = document.getElementById("ticker").value;
  console.log(ticker);
  await getBounds();

  setInterval(() => {
    runSim();
  }, 60000);
};

document.getElementById("go").addEventListener("click", init);
// init();
