export default class Api {

    httpRequest(year){
        return new Promise ( (resolve, reject) => {
            console.log('Hole Daten');
            let url = "https://www.openligadb.de/api/getmatchdata/bl1/" + year;
            let http = new XMLHttpRequest();

            http.onreadystatechange = function () {
                if(http.readyState === 4){
                    if(http.status !== 200){
                        console.log(http.response);
                        reject(http.response);
                    }
                    resolve(http.response);
                }
            }
            http.open("GET", url, true);
            http.send();
        })
    }
}