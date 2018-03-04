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

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const db = new PouchDB('games');
const api = new Api();

export default class App extends Component<> {

    constructor(){
        super();
        this.getData = this.getData.bind(this);
        this.setDatabase = this.setDatabase.bind(this);
        this.saveGames = this.saveGames.bind(this);

        PouchDB.debug.enable('*');

        this.state = {
            games: {},
            suchText: '',
            gamesList: {}
        }


        this.getNumberOfRows().then( (result) => {
            console.log(result);
               if (result.rows.length < 1){
                   console.log('Hols aus der Internet');
                   this.getData();
               } else {
                   this.prepareGames(result);
                   console.log('Hols aus der Datenbank');
               }
            }).catch( (error) => {
                console.log(error);
            });
    }

    saveGames(){
        console.log('saveGames');
        this.state.games.map((game) => {
            db.put({
                _id: game.MatchID.toString(),
                game: game
            }).then( (response) => {
                console.log(response);
            }).catch( (error) => {
                console.log(error);
            });
        });
    }

    setDatabase(){
        // db.remove(games[0], (response) => {
        //     console.log(response)
        // })
    }

    prepareGames = (result) => {
        console.log(result);
        let games = [];
        result.rows.map( (row) => {
            games.push(row.doc.game);
        })
        this.setState({
            games: games,
            gamesList: games
        })
    };

    getNumberOfRows = () => {
        console.log('getNumberOfRows');
        return db.allDocs({include_docs: true, descending: false});
    };

    deleteGames = () => {
        console.log('destroy Database');
        db.destroy().then(function (response) {
            console.log(response);
        }).catch(function (err) {
            console.log(err);
        });
    };

    getData(){
        api.httpRequest().then(response => {
            console.log('Verarbeite Daten');
            this.setState({
                games: JSON.parse(response),
                gamesList: JSON.parse(response)

            });

            this.saveGames();
        })
    }

    measureView(event) {
        this.cardHeight = event.nativeEvent.layout.height;
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
        this.state.games.map((game) => {
            if(game.MatchResults[1] === undefined){
                gamesList.push(game);
            }
        })
        this.setState({
            gamesList: gamesList
        })
    }
    getItemLayout = (data, index) => (
        { length: this.cardHeight, offset: this.cardHeight * index, index }
    )

  render() {

      return (
              <View style={{display: 'flex'}} >
                  <Header
                      leftComponent={{ icon: 'menu', color: '#fff', }}
                      centerComponent={{ text: 'BundesligaProphet', style: { color: '#fff' } }}
                      rightComponent={{ icon: 'home', color: '#fff', onPress: () => this.handleButtonPress()}}
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
        this.deleteGames();
        this.setState({
            gamesList: null
        })
        this.getData();
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
            return this.state.games;
        }
        let gamesList = [];
        this.state.games.map((game, i ) => {
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
