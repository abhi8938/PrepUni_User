import {Height, width} from '../Constants/size';
import {
  Image,
  ImageBackground,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FunctionComponent, useEffect, useState} from 'react';

import CustomHeader from '../Common/CustomHeader';
import DatesheetExpandView from '../Components/DatesheetExpandView';
import EmptyScreen from './EmptyScreen';
import IonicIcons from 'react-native-vector-icons/Ionicons';
import ResourceHeader from '../Common/ResourceHeader';
import {SafeAreaView} from 'react-native-safe-area-context';
import TopNavResorces from '../Components/common/TopNavResources';
import bg from '../../assets/images/bg.png';
import resourcesStore from '../State/resourcesStore';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';

type props = {
  navigation?: any;
  scene?: any;
};

const DatesheetScreen: FunctionComponent<props> = ({navigation, scene}) => {
  const {course, datesheet} = resourcesStore();
  const globalState: any = useGlobalState();
  return (
    <SafeAreaView style={styles.parent}>
      <ImageBackground
        source={bg}
        style={styles.parent}
        resizeMode="cover"
        imageStyle={{opacity: 0.04}}>
        <CustomHeader
          navigation={navigation}
          scene={scene}
          title={'Datesheet'}
          nav
          logo
        />

        <View style={{paddingHorizontal: theme.SIZES.small}}>
          <ResourceHeader title={'Datesheet'} />
          {globalState.resources.datesheet === undefined ? (
            <EmptyScreen message={'Not out yet!'} />
          ) : (
            <View style={{flex: 1}}>
              <View style={styles.child}>
                <Text
                  style={{
                    fontSize: theme.SIZES.large,
                    fontWeight: 'bold',
                    color: '#00000090',
                    fontFamily: 'ComicNeue-Bold',
                  }}>
                  {`Semester ${datesheet.sem}`}
                </Text>
              </View>
              <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{paddingBottom: Height * 0.2}}>
                {globalState.resources.datesheet.map(
                  (item: any, index: number) => (
                    <DatesheetExpandView
                      key={index}
                      datesheet={datesheet}
                      index={index}
                    />
                  ),
                )}
              </ScrollView>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: theme.COLORS.WHITE,
    // paddingTop: Platform.OS === 'ios' ? theme.SIZES.large * 1.42 : 0,
  },
  textInput: {
    width: '90%',
    paddingHorizontal: theme.SIZES.small,
  },
  child: {
    marginVertical: theme.SIZES.small,
    alignItems: 'center',
    width: '100%',
  },
  scroll: {
    borderWidth: 4,
    borderColor: theme.COLORS.PRIMARY,
    borderRadius: 10,
    height: Height * 0.6,
    paddingBottom: theme.SIZES.small,
  },
});
export default DatesheetScreen;
