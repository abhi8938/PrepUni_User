import {Height, width} from '../Constants/size';
import {
  Image,
  ImageBackground,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {FunctionComponent, useState} from 'react';

import CustomHeader from '../Common/CustomHeader';
import EmptyScreen from './EmptyScreen';
import Icon from 'react-native-vector-icons/Ionicons';
import ResourceHeader from '../Common/ResourceHeader';
import bg from '../../assets/images/bg.png';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';
import useResourceStore from '../State/resourcesStore';

type props = {
  navigation?: any;
  scene?: any;
};

const ExaminationCenter: FunctionComponent<props> = ({navigation, scene}) => {
  const globalState: any = useGlobalState();
  return (
    <ImageBackground
      source={bg}
      style={styles.parent}
      resizeMode="cover"
      imageStyle={{opacity: 0.04}}>
      <CustomHeader
        navigation={navigation}
        scene={scene}
        title={'Center'}
        nav
        logo
      />
      {globalState.resources.center === undefined ? (
        <EmptyScreen message={'Not Declared Yet'} />
      ) : (
        <View style={{flex: 1}}>
          <View
            style={{
              paddingHorizontal: theme.SIZES.small,
            }}>
            <ResourceHeader title={'Examination Center'} />
            <View style={styles.collegeView}>
              <Text style={{fontSize: theme.SIZES.normal, fontWeight: 'bold'}}>
                Collage Name
              </Text>
              <Text style={{fontSize: theme.SIZES.normal, marginLeft: 'auto'}}>
                {globalState.resources.center
                  ? globalState.resources.center.college
                  : 'No Name'}
              </Text>
            </View>
            <View style={styles.addressView}>
              <Text style={{fontSize: theme.SIZES.normal, fontWeight: 'bold'}}>
                Address
              </Text>
              <Text style={{fontSize: theme.SIZES.normal, marginLeft: 'auto'}}>
                {globalState.resources.center !== null
                  ? globalState.resources.center.address.address
                  : 'No Address'}
              </Text>
            </View>
          </View>
          <TouchableOpacity style={styles.navigateButton}>
            <Text style={styles.navigateText}>Navigate</Text>
            <Icon name={'location-outline'} size={18} color={'#fff'} />
          </TouchableOpacity>
        </View>
      )}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  collegeView: {
    flexDirection: 'row',
    marginTop: theme.SIZES.large * 2,
    marginBottom: theme.SIZES.large * 2,
  },
  addressView: {
    flexDirection: 'row',
  },
  navigateButton: {
    flexDirection: 'row',
    alignContent: 'center',
    backgroundColor: theme.COLORS.PRIMARY,
    borderRadius: 100,
    paddingHorizontal: theme.SIZES.small * 1.3,
    paddingVertical: theme.SIZES.small * 0.8,
    alignSelf: 'center',
    marginTop: 'auto',
    marginBottom: theme.SIZES.large * 5,
  },
  navigateText: {
    fontWeight: 'bold',
    fontSize: theme.SIZES.small,
    color: '#fff',
  },
});
export default ExaminationCenter;
