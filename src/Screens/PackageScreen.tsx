import {
  Alert,
  FlatList,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {Height, width} from '../Constants/size';
import React, {FunctionComponent, useEffect, useState} from 'react';

import AuthHeader from '../Components/common/AuthHeader';
import PackageOverView from '../Components/common/PackageOverView';
import {SafeAreaView} from 'react-native-safe-area-context';
import theme from '../Constants/theme';
import useAuthState from '../State/AuthState';

type props = {
  navigation?: any;
  scene?: any;
};
const PackageScreen: FunctionComponent<props> = ({navigation, scene}) => {
  const {packages, getPackages, load, Buy, trial} = useAuthState();
  useEffect(() => {
    getPackages();
  }, []);

  return (
    <SafeAreaView style={{backgroundColor: theme.COLORS.WHITE, flex: 1}}>
      <ImageBackground
        source={require('../../assets/images/bg.png')}
        style={styles.parent}
        resizeMode="cover"
        imageStyle={{opacity: 0.03}}>
        <AuthHeader pageTitle={'Packages'} back={false} />
        <Image
          style={styles.image}
          source={require('../Assets/images/packages.png')}
        />
        <View style={styles.child}>
          {packages.map((item: any, index: number) => (
            <PackageOverView
              load={load}
              title={item.type}
              index={index}
              key={index}
              packs={item}
              buy={() => Buy(navigation, item)}
              trial={() => trial(item._id, navigation)}
            />
          ))}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default PackageScreen;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
  },
  image: {
    resizeMode: 'contain',
    height: Height * 0.4,
    aspectRatio: width > 400 ? 3 : 1.2,
    alignSelf: 'center',
  },
  child: {
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.SIZES.large,
    paddingHorizontal: theme.SIZES.small / 2,
    height: Height * 0.38,
    justifyContent: 'center',
  },
});
