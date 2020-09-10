import React, { useEffect, useRef, Component }  from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, View, Dimensions, Platform, Linking, BackHandler } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { WebView } from 'react-native-webview'

const { height, width } = Dimensions.get('screen');
import { Images, argonTheme } from '../constants/';
import { HeaderHeight } from "../constants/utils";


export default class ShowPosts extends React.Component {
  constructor(props) {
    super(props);
  }
  webView = {
    canGoBack: false,
    ref: null,
  }

  onAndroidBackPress = () => {
    if (this.webView.canGoBack && this.webView.ref) {
      this.webView.ref.goBack();
      return true;
    }
    return false;
  }

  componentWillMount() {
    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', this.onAndroidBackPress);
    }
  }

  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress');
    }
  }

 render() {
    const { navigation } = this.props;

    return (
       <View style={{flex:1}}>
         <WebView
           ref={(webView) => { this.webView.ref = webView; }}
           onNavigationStateChange={(navState) => { this.webView.canGoBack = navState.canGoBack; }}
           automaticallyAdjustContentInsets={false}
           source={{uri: 'http://cs.korea.ac.kr/cs/board/news.do?mode=view&articleNo=170607'}}
           javaScriptEnabled={true}
           domStorageEnabled={true}
           startInLoadingState={true}
           style={{marginTop: 25}}
         />
     </View>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
});
