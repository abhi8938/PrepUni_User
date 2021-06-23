import {Height, width} from '../../Constants/size';
import {Image, Platform, StyleSheet, Text, View} from 'react-native';
import React, {FunctionComponent} from 'react';

import baseStyles from './styles';
import theme from '../../Constants/theme';

type props = {
  imageProps: {source: any; style: any};
  style: any;
};

const Cover: FunctionComponent<props> = ({imageProps, style}) => {
  return (
    <View style={[styles.parent, style]}>
      <Image {...imageProps} style={[styles.image, imageProps.style]} />
    </View>
  );
};

export default Cover;

const styles = StyleSheet.create({
  parent: {
    width: '30%',
    maxHeight: Height * 0.17,
  },
  image: {
    height: '100%',
    width: '100%',
    borderRadius: 9,
    backgroundColor: '#ccc',
    aspectRatio: 0.6,
  },
});
