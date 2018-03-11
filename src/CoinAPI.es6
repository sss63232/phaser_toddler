import {
    debug
} from "util";

export default class CoinAPI {
    tickerURL;
    tickerData;

    constructor() {
        this.tickerURL = "https://api.coinmarketcap.com/v1/ticker/?convert=TWD&limit=5";
        this.getExchangeRates();
    }

    static getExchangeRates() {
        fetch("https://api.coinmarketcap.com/v1/ticker/?convert=TWD&limit=5")
            .then(res => res.json())
            .then(json => {
                this.tickerData = this.parseTickerData(json)
            })
            .catch(res => {
                console.log('------------------------------------');
                console.log(`error, ${res}`);
                console.log('------------------------------------');
            });
    }

    static parseTickerData(data_json_array) {
        let dataObj = {};
        data_json_array.forEach(elemObj => {
            let oneCoinObj = dataObj[elemObj.id] = {};
            oneCoinObj.name = elemObj.name;
            oneCoinObj.price_usd = elemObj.price_usd;
            oneCoinObj.price_twd = elemObj.price_twd;
        });
        return dataObj;
    }

    /**
     * 
     * @param fromKey bitcoin, ethereum...
     * @param toKey usd, twd
     */
    static getRate(fromKey, toKey) {
        return this.tickerData[fromKey][`price_${toKey}`];
    }

}