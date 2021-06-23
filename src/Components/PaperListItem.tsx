import {Height, width} from '../Constants/size';
import React, {FunctionComponent, useEffect} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import Cover from './common/Cover';
import Expandable from './common/Expandable';
import Icon from './common/Icon';
import KeyValue from './common/KeyValue';
import RNFetchBlob from 'rn-fetch-blob';
import SkeletonLoader from './SkeletonLoader';
import Touchable from './common/Touchable';
import {URL} from '../Constants/urls';
import baseStyles from './common/styles';
import theme from '../Constants/theme';

type props = {
  subject: any;
  onRead: () => void;
  load: boolean;
};

const Loader = () => (
  <View style={styles.contractedParent}>
    <SkeletonLoader
      width={width > 450 ? '33%' : '28%'}
      height={Height * 0.14}
      borderRadius={8}
      bgColor={theme.COLORS.HEADER}
      overlayColor={'#fff'}
    />
    <View style={styles.innerContainer}>
      <SkeletonLoader
        width={'100%'}
        height={theme.SIZES.normal * 1.3}
        borderRadius={7}
        bgColor={theme.COLORS.HEADER}
        overlayColor={'#fff'}
      />
      <SkeletonLoader
        width={'100%'}
        height={theme.SIZES.normal * 1.3}
        borderRadius={7}
        bgColor={theme.COLORS.HEADER}
        overlayColor={'#fff'}
      />
      <View
        style={{
          flex: 1,
          width: '100%',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',
        }}>
        <SkeletonLoader
          width={width > 450 ? '40%' : '30%'}
          height={theme.SIZES.large * 1.3}
          borderRadius={7}
          bgColor={theme.COLORS.HEADER}
          overlayColor={'#fff'}
        />
        <SkeletonLoader
          width={width > 450 ? '40%' : '30%'}
          height={theme.SIZES.large * 1.3}
          borderRadius={7}
          bgColor={theme.COLORS.HEADER}
          overlayColor={'#fff'}
        />
      </View>
    </View>
  </View>
);

const PaperListItem: FunctionComponent<props> = ({subject, onRead, load}) => {
  useEffect(() => {
    console.log('height', Height);
    return () => {};
  }, [subject]);
  const Expanded = (handleToggle: () => void, toggle: boolean) => {
    return (
      <View style={styles.expandedParent}>
        <View style={styles.rowContainer}>
          <View style={styles.innerContainer}>
            <KeyValue
              itemKey={'Summary'}
              value={subject.description}
              style={{
                flexDirection: 'column',
                width: '90%',
                alignItems: 'flex-start',
              }}
              valueStyle={{
                maxWidth: '100%',
                textAlign: 'left',
                marginTop: theme.SIZES.small / 3,
                marginLeft: theme.SIZES.small / 3,
                width: '90%',
              }}
            />
            <Text style={styles.author}>{subject.by}</Text>
          </View>
        </View>
      </View>
    );
  };
  const Contracted = (handleToggle: () => void, toggle: boolean) => {
    return load === true ? (
      <Loader />
    ) : (
      <View style={styles.contractedParent}>
        <Cover
          imageProps={{
            source: {uri: `${URL}/paper/files/${subject.cover}`},
            style: {},
          }}
          style={{borderRadius: 8, padding: theme.SIZES.small / 4}}
        />
        <View style={styles.innerContainer}>
          <View>
            <Text
              style={{
                fontSize: theme.SIZES.large,
                fontWeight: 'bold',
                marginBottom: 5,
                letterSpacing: 1,
                marginLeft: 2,
              }}>
              {subject.name}
            </Text>
            <KeyValue itemKey={'Code'} value={subject.code} />
          </View>
          <View
            style={{
              flex: 1,
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
            }}>
            <Touchable
              filled
              title={'Read'}
              loading={false}
              size={'MEDIUM'}
              touchableProps={{
                onPress: onRead,
                disabled: false,
              }}
            />
            <Touchable
              filled
              title={toggle === true ? 'Less' : 'More'}
              loading={false}
              size={'MEDIUM'}
              touchableProps={{
                onPress: handleToggle,
                disabled: false,
              }}
              toggle={toggle}
            />
          </View>
        </View>
      </View>
    );
  };
  const getDimen = () => {
    let Dimen = {
      width: {min: width * 0.95, max: width * 0.95},
      height: {
        min: 0,
        max: 0,
      },
    };
    if (Height < 700) {
      Dimen.height.min = Height * 0.23;
      Dimen.height.max = Height * 0.41;
    }
    if (Height > 700 && Height < 900) {
      Dimen.height.min = Height * 0.2;
      Dimen.height.max = Height * 0.38;
    }
    if (Height > 900) {
      Dimen.height.min = Height * 0.2;
      Dimen.height.max = Height * 0.36;
    }
    return Dimen;
  };
  return (
    <Expandable
      style={[baseStyles.card, styles.parent]}
      ExpandComp={Expanded}
      ContractComp={Contracted}
      dimen={getDimen()}
    />
  );
};

export default PaperListItem;

const styles = StyleSheet.create({
  parent: {
    width: width < 450 ? '95%' : '65%',
    alignSelf: width < 400 ? 'flex-start' : 'center',
  },
  iconButton: {
    position: 'absolute',
    right: 8,
    top: -theme.SIZES.small * 0.8,
    borderRadius: 7,
    padding: theme.SIZES.small / 1.5,
    backgroundColor: theme.COLORS.BORDER_COLOR,
    height: theme.SIZES.large * 1.5,
  },
  innerContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'flex-start',
    paddingHorizontal: theme.SIZES.small,
    paddingTop: theme.SIZES.small / 2,
    // minHeight: '70%',
  },
  contractedParent: {
    flexDirection: 'row',
    paddingHorizontal: theme.SIZES.small,
    paddingVertical: theme.SIZES.small,
  },
  expandedParent: {
    flexDirection: 'column',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  author: {
    alignSelf: 'flex-end',
    fontSize: theme.SIZES.normal,
    fontWeight: 'bold',
    color: theme.COLORS.HEADER,
    fontStyle: 'italic',
  },
});
