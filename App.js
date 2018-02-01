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
    ToolbarAndroid,
    DrawerLayoutAndroid,
    TouchableHighlight, FlatList, ScrollView
} from 'react-native';
import { Header } from 'react-native-elements';
import Button from "react-native-elements/src/buttons/Button";

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

let gamesList: any;

export default class App extends Component<{}> {

    constructor(){
        super();
        this.openDrawer = this.openDrawer.bind(this);
        this.httpRequest = this.httpRequest.bind(this);

        this.state = {
            games: 'Moin',
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

                this.gamesList = this.state.games.map((game) => {
                    if (game.Location !== null) {
                        return <Text key={game.MatchID}>{game.Location.LocationCity}</Text>
                    }
                });

                console.log(this.state.games);
                console.log(this.state.games.length + " Daten erhalten");
                for(let game of this.state.games){
                    if(game.Location !== null){
                        if(game.Location.LocationCity === 'Freiburg'){
                            console.log(game);
                        }
                    }
                }
            }
        }.bind(this);

        http.open("GET", url, true);
        http.send();
    }

  render() {

      const navigationView = (
          <View style={{flex: 1, backgroundColor: '#fff'}}>
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
                  <Text style={styles.welcome}>
                      Hier kommt die View hin
                  </Text>
                  <TouchableHighlight onPress={() => this.httpRequest()} underlayColor="white">
                      <View style={styles.button}>
                          <Text style={styles.buttonText}>TouchableHighlight</Text>
                      </View>
                  </TouchableHighlight>
                 <ScrollView>
                     {this.gamesList}
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
    }
});
