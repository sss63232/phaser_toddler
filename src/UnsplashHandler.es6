import Unsplash, { toJson } from "unsplash-js";

export default class UnsplashHandler {


    constructor() {
        this.location = "https://api.unsplash.com";
        this.urlId = "?client_id=de67f1ba6f631670eedefff4c31bc09c840310d39a12d6785c1eb0f06fb7146f";

        this.id = "de67f1ba6f631670eedefff4c31bc09c840310d39a12d6785c1eb0f06fb7146f";
        this.secret = "6e563cd7a8569dca86a605c7266e668d12c820a4568ca9eea254ff379df3004b";
        this.callbackURLs = "urn:ietf:wg:oauth:2.0:oob";
        this.unsplashInstance;

        this.createInstance();
    }

    createInstance() {
        this.unsplashInstance = new Unsplash({
            applicationId: this.id,
            secret: this.secret,
            callbackURL: this.callbackURLs
        });
    }

    // authorize() {
    //     const authenticationUrl = this.unsplashInstance.auth.getAuthenticationUrl([
    //         "public",
    //         "read_user",
    //         "write_user",
    //         "read_photos",
    //         "write_photos"
    //     ]);

    //     location.assign(authenticationUrl);
    // }

    getRandomPhoto() {
        //     var url = this.location + "/photos/random" + this.urlId;
        //     var xhr = new XMLHttpRequest();
        //     xhr.onload = function() {
        //         let res = JSON.parse(this.response);
        //         return res.urls.small;
        //     }
        //     xhr.open("GET", url, true);
        //     xhr.send();
        // }

        var sleep = function(para) {
            return new Promise(function(resolve, reject) {
                setTimeout(function() {
                    resolve(para * para)
                }, 1000)
            })
        }
        var result = await sleep(2)
    }


}