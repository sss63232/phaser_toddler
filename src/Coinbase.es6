export default class Coinbase {
    currency;
    base_url;

    constructor(currency) {
        this.currency = currency;
        this.base_url = "https://api.coinbase.com/v2/exchange-rates?currency=" + this.currency;
    }

    getDataByCurrency() {
        fetch(this.base_url, {
                method: 'GET',
                headers: {
                    'CB-VERSION': '2018-01-01'
                }
            })
            .then(res => res.json())
            .then(json => {
                console.log('------------------------------------');
                console.log(json);
                console.log('------------------------------------');
                debugger
            })
    }


}