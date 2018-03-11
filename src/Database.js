import PouchDB from 'pouchdb-react-native';

let db;

export default class Database {

    constructor(name) {
        db = new PouchDB(name);
    }

    getData() {
        return db.allDocs({include_docs: true, descending: false});
    }

    saveYear(data, year) {
        let games = [];
        data.map(game => {
            games.push(game)
        })
        return new Promise ((resolve, reject) => {
            db.put({
                _id: year.toString(),
                [year.toString()]: games
            }).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            })
        })
    }

    deleteDoc(doc) {
        return db.remove(doc);
    }
}