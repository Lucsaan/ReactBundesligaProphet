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
    TouchableHighlight
} from 'react-native';
import { Header } from 'react-native-elements';

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
    }

    openDrawer() {
        console.log('Geht was');
        this.drawer.openDrawer();
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
});
