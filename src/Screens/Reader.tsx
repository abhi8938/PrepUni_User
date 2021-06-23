import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect, useRef, useState} from 'react';

import GIFLoader from '../Components/GIFLoader';
import WebView from 'react-native-webview';
import theme from '../Constants/theme';
import {width} from '../Constants/size';

type props = {
  navigation: any;
  route: any;
};
const Reader: FunctionComponent<props> = ({navigation, route}) => {
  const {uri, token, paper} = route.params;
  const webRef: any = useRef(null);
  const [load, setLoad] = useState(true);
  const [bg, setBg] = useState('#fff');
  const myScript = `
      window.URI = '${uri}';
      window.token = '${token}';
      window.paper = '${paper}';
      true; // note: this is required, or you'll sometimes get silent failures
    `;

  useEffect(() => {
    setTimeout(() => setLoad(false), 3000);
  }, []);
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: bg}]}>
      <StatusBar backgroundColor={bg} />

      {load === true && (
        <View
          style={{
            height: '100%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <GIFLoader
            style={{
              width: theme.SIZES.large * 3,
              height: theme.SIZES.large * 3,
              aspectRatio: 1,
            }}
          />
        </View>
      )}
      {/* https://digitalluxe.in/reader/ */}
      {/* http://192.168.1.6:3000/reader */}
      <WebView
        ref={webRef}
        source={{uri: 'https://digitalluxe.in/reader'}}
        style={{
          flex: 1,
        }}
        originWhitelist={['*']}
        injectedJavaScript={myScript}
        onMessage={(e) => {
          let data: any = JSON.parse(e.nativeEvent.data);
          if (data.type === 'GO_BACK') {
            navigation.goBack();
          }
          if (data.type === 'LOAD_FALSE') {
            setLoad(false);
          }
          if (data.type === 'BACKGROUND') {
            setBg(data.value);
          }
        }}
        onNavigationStateChange={(event) => {
          console.log('event_navigation', event.url);
          // setLoad(false);
        }}
      />
    </SafeAreaView>
  );
};

export default Reader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  back: {
    position: 'absolute',
    top: 6,
    left: width / 3.9,
    zIndex: 1,
    marginRight: theme.SIZES.small,
    marginLeft: theme.SIZES.small / 1.5,
    padding: theme.SIZES.small / 1.5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});
