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
    ToolbarAndroid,
    DrawerLayoutAndroid,
    TouchableHighlight, FlatList, ScrollView, TextInput
} from 'react-native';
import { Header, Card } from 'react-native-elements';
import Button from "react-native-elements/src/buttons/Button";


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


export default class App extends Component<{}> {

    constructor(){
        super();
        this.openDrawer = this.openDrawer.bind(this);
        this.httpRequest = this.httpRequest.bind(this);

        this.state = {
            games: 'Moin',
            suchText: '',
            gamesList: <Text>Noch keine Daten</Text>
        }

    }

    openDrawer() {
        console.log('Geht was');
        this.drawer.openDrawer();
    }

    httpRequest(){
        console.log('Hole Daten');
        let url = "https://www.openligadb.de/api/getmatchdata/bl1/2017";
        let http = new XMLHttpRequest();

        http.onreadystatechange = function () {
            if(http.readyState === 4){
                if(http.status !== 200){
                    console.log(http.response);
                    return;
                }
                console.log('Verarbeite Daten');
                this.setState({
                    games: JSON.parse(http.response)
                });

                this.setState({
                    gamesList: this.renderGamesList()
                })

            }
        }.bind(this);

        http.open("GET", url, true);
        http.send();
    }

    renderGamesList() {
        let gamesList = this.state.games.map((game, i ) => {
            if (game.Location !== null) {
                if(game.Team1.TeamName.toLowerCase().includes(this.state.suchText.toLowerCase())){
                    return <View key={game.MatchID} style={styles.Ergebnisse}>
                        <Text><Image source={{uri: game.Team1.TeamIconUrl}} style={styles.icon}/><Text style={styles.Mannschaft}>{game.Team1.TeamName}</Text><Text style={styles.Ergebnis}>{game.MatchResults[1].PointsTeam1}</Text></Text>
                        <Text><Image source={{uri: game.Team2.TeamIconUrl}} style={styles.icon}/><Text style={styles.Mannschaft}>{game.Team2.TeamName}</Text><Text style={styles.Ergebnis}>{game.MatchResults[1].PointsTeam2}</Text></Text>
                    </View>

                }
            }

        });

        return gamesList;
    }

  render() {

      const navigationView = (
          <View style={{flexDirection:'row', flexWrap:'wrap', backgroundColor: '#fff'}}>
              <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text>
          </View>
      );


      return (
          <DrawerLayoutAndroid
              drawerWidth={300}
              ref={(_drawer) => this.drawer = _drawer}
              drawerPosition={DrawerLayoutAndroid.positions.Left}
              renderNavigationView={() => navigationView}>
              <View>
                  <Header
                      leftComponent={{ icon: 'menu', color: '#fff', onPress: () => this.openDrawer(), }}
                      centerComponent={{ text: 'BundesligaProphet', style: { color: '#fff' } }}
                      rightComponent={{ icon: 'home', color: '#fff' }}
                      backgroundColor={'#000'}
                  />
                  <TextInput
                      placeholder="Suche Verein"
                      style={styles.welcome}
                      onChangeText={(text) => {
                          this.setState({suchText: text});
                          this.setState({
                              gamesList: this.renderGamesList()
                          })
                      }}
                  />
                  <Text>{this.state.suchText}</Text>
                  <TouchableHighlight onPress={() => this.httpRequest()} underlayColor="white">
                      <View style={styles.button}>
                          <Text style={styles.buttonText}>TouchableHighlight</Text>
                      </View>
                  </TouchableHighlight>
                 <ScrollView>
                     <Card title={"Hallo Bundesliga"} >
                        {this.state.gamesList}
                     </Card>
                 </ScrollView>

              </View>
          </DrawerLayoutAndroid>
      );

  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
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
        marginBottom: 30,
        width: '100%',
        alignItems: 'center',
        backgroundColor: '#2196F3'
    },
    buttonText: {
        padding: 20,
        color: 'white'
    },
    icon: {
        width: 40,
        height: 40,
        paddingRight: 20,
    },
    Mannschaft: {
        width: '100%',
        letterSpacing:2,
    },
    Ergebnis: {
      fontSize: 20,
    },
    Ergebnisse: {
      paddingBottom: 20,
    }

});
