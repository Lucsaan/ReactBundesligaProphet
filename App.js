/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
    Platform,
    StyleSheet,
    Text,
    View,
    Image,
    TouchableHighlight, FlatList, ScrollView, TextInput
} from 'react-native';
import { Header, Card, SearchBar } from 'react-native-elements';
import PouchDB from 'pouchdb-react-native';
import Api from './src/Api';
import Database from './src/Database';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const api = new Api();
const gamesDb = new Database('games');
const configDb = new Database('config');

export default class App extends Component<> {

    constructor(){
        super();

        this.saveGames = this.saveGames.bind(this);

        PouchDB.debug.enable('*');

        this.state = {
            games: {},
            suchText: '',
            gamesList: {},
            cardHeight: 0,
        }
    }

    componentDidMount(){
        this.init();
    }

    init(){
        gamesDb.getData().then(result => {
            console.log(result);
            if (result.rows.length < 1){
                console.log('Hols aus der Internet');
                api.httpRequest('2017').then(result => {
                    gamesDb.saveYear(JSON.parse(result), '2017').then((result) => {
                        if(result.ok) {
                            gamesDb.getData().then(result => {
                                this.prepareGames(result);
                            }).catch(error => {
                                console.log(error);
                            })
                        }
                    }).catch(error => {
                        console.log(error);
                    });
                }).catch(error => {
                    console.log(error);
                })
            } else {
                this.prepareGames(result);
                console.log('Hols aus der Datenbank');
            }

        })
    }

    saveGames(){
        console.log('saveGames');
        if(this.state.games !== null){
        this.state.games = gamesDb.saveYear(this.state.games, '2017');
        }
        console.log(this.state.games);
    }

    prepareGames = (result) => {
        this.setState({
            games: result,
            gamesList: result.rows[0].doc[2017]
        });

        let games = [];
        // result.rows.map( (row) => {
        //     games.push(row.doc.year);
        // })
        // this.setState({
        //     games: games,
        //     gamesList: games
        // })
    };

    getNumberOfRows = () => {
        return gamesDb.allDocs({include_docs: true, descending: false});
    };

    deleteAllGames = () => {
        console.log('Lösche Daten');
        let count = 0;
        let rowLength = this.state.games.rows.length;
        console.log(this.state.games.rows.length);
        return new Promise((resolve, reject) => {
            this.state.games.rows.map(row => {
                console.log(row);
                gamesDb.deleteDoc(row.doc).then(result => {
                    console.log(result);
                    if(result.ok){
                        count++;
                        if(count === rowLength) {
                            console.log('Datenbank gelöscht');
                            resolve(true);
                        }
                    }
                }).catch(error => {
                    console.log(error);
                })
            })
        })
    };

    getFromApi(){
        api.httpRequest().then(response => {
            console.log('Verarbeite Daten');
            // this.setState({
            //     games: JSON.parse(response),
            //     gamesList: JSON.parse(response)
            // });
            this.saveGames();
        })
    }

    measureView(event) {
        if(this.state.cardHeight < 1) {
            this.setState({
                cardHeight: event.nativeEvent.layout.height
            });
        }
    }

    scrollToItem = () => {
        let done = false;
        this.state.gamesList.map((game, i) => {
            if (game.MatchResults[1] === undefined && done === false){
                this.flatListRef.scrollToIndex({animated: true, index: i});
                done = true;
            }
        })
    }

    prepareGamesList = () => {
        let gamesList = [];
        this.state.map((game) => {
            if(game.MatchResults[1] === undefined){
                gamesList.push(game);
            }
        })
        this.setState({
            gamesList: gamesList
        })
    }
    getItemLayout = (data, index) => {
            return { length: this.state.cardHeight, offset: this.state.cardHeight * index, index };
    }


  render() {

      return (
              <View style={{display: 'flex'}} >
                  <Header
                      leftComponent={{ icon: 'menu', color: '#fff', }}
                      centerComponent={{ text: 'BundesligaProphet', style: { color: '#fff' } }}
                      rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.handleButtonPress(this.state.games)}}
                      backgroundColor={'#000'}
                  />
                  <View
                    style={{flexDirection: 'row', alignItems: 'center', backgroundColor:'white'}}
                  >
                      <SearchBar
                          round
                          clearIcon
                          lightTheme
                          containerStyle={{backgroundColor: 'white', width: '85%'}}
                          placeholder="Suche Verein"
                          onChangeText={(text) => {
                              this.setState({
                                  suchText: text,
                                  gamesList: this.renderGamesList(text)
                              })
                          }}
                          onClearText={() => {
                              this.setState({suchText: ''});
                          }}
                      />
                      <TouchableHighlight onPress={this.scrollToItem} underlayColor='#b5bec8' style={{backgroundColor: 'white'}}>
                          <View >
                              <Text>Aktuell</Text>
                          </View>
                      </TouchableHighlight>
                  </View>
                  <FlatList
                      style={{marginBottom: 130}}
                      data={this.state.gamesList}
                      ref={(ref) => { this.flatListRef = ref; }}
                      getItemLayout={this.getItemLayout}
                      keyExtractor={item => item.MatchID}
                      renderItem={ ({item}) => {
                          return(
                              <View onLayout={(event) => this.measureView(event)}>
                                  <Card
                                      containerStyle={{margin: 0, paddingBottom: 2, paddingTop: 2}}
                                  >
                                      {this.formatDate(new Date(item.MatchDateTime))}
                                      <View style={styles.resultContainer}>
                                          <Image source={{uri: item.Team1.TeamIconUrl}} style={styles.icon}/>
                                          <Text style={styles.teamName}>{item.Team1.TeamName}</Text>
                                          <Text style={styles.result}>{item.MatchResults[1] !== undefined ? item.MatchResults[1].PointsTeam1 : '-'}</Text>
                                      </View>
                                      <View style={styles.resultContainer}>
                                          <Image source={{uri: item.Team2.TeamIconUrl}} style={styles.icon}/>
                                          <Text style={styles.teamName}>{item.Team2.TeamName}</Text>
                                          <Text style={styles.result}>{item.MatchResults[1] !== undefined ? item.MatchResults[1].PointsTeam2 : '-'}</Text>
                                      </View>
                                  </Card>
                              </View>
                          )
                      }
                      }
                  />
              </View>
      );

  }
    handleButtonPress(){
        console.log('Lösche Spiele');
        console.log(this.state.games);
        this.setState({gamesList: {}});
        this.deleteAllGames().then(result => {
            if(result) {
                console.log('Hole neue Daten');
                this.init();
            }
        })
    }

    formatDate(date){
            return(
                <Text>
                    {date.getDate() + '.' + (date.getMonth() + 1) + '.'  + date.getFullYear()}
                </Text>
            );
    }

    renderGamesList(text) {
        if(text.length < 1){
            return this.state.gamesList;
        }
        let gamesList = [];
        this.state.gamesList.map((game, i ) => {
                if(
                    game.Team1.TeamName.toLowerCase().indexOf(text.toLowerCase()) !== -1  ||
                    game.Team2.TeamName.toLowerCase().indexOf(text.toLowerCase()) !== -1
                ){
                    gamesList.push(game);
            }
        });
        return gamesList;
    }
}

const styles = StyleSheet.create({
  alles: {
    width: '100%',
  },
  border: {
    borderBottomWidth: 100,
      borderBottomColor: 'black'
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
    button: {
        width: '100%',
        backgroundColor: 'black',
        height: 40
    },
    buttonText: {
        padding: 20,
        color: 'white'
    },
    icon: {
      width: 25,
        height: 25,
    },
    teamName: {
        fontSize: 20,
    },
    result: {
      fontSize: 25,
        color: 'black',
        textAlign: 'right'
    },
    resultContainer: {
      width: '100%',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'stretch',
        justifyContent: 'space-between'
    }

});
