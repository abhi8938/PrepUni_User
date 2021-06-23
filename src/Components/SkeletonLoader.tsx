import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import React, {FunctionComponent, useEffect} from 'react';

import theme from '../Constants/theme';

const widthScreen = Dimensions.get('screen').width;

const SkeletonLoader = (props: {
  height: number | string;
  borderRadius: number;
  width: number | string;
  bgColor?: any;
  overlayColor?: any;
}) => {
  const opac = useSharedValue(0.05);
  const translate = useSharedValue(1);
  useEffect(() => {
    setInterval(() => {
      opac.value = opac.value === 0.05 ? 0.2 : 0.05;
      translate.value = translate.value === 1 ? 1.03 : 1;
    }, 700);
  }, []);
  const overlayStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opac.value, {
        duration: 700,
      }),
    };
  });
  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(translate.value, {
            duration: 700,
          }),
        },
      ],
    };
  });
  return (
    <Animated.View
      style={[
        styles.parent,
        {
          height: props.height,
          width: props.width,
          borderRadius: props.borderRadius,
          backgroundColor: props.bgColor,
        },
        translateStyle,
      ]}>
      <Animated.View
        style={[
          styles.overlay,
          overlayStyle,
          {
            borderRadius: props.borderRadius,
            backgroundColor: props.overlayColor,
          },
        ]}
      />
    </Animated.View>
  );
};

export default SkeletonLoader;

const styles = StyleSheet.create({
  parent: {
    shadowColor: 'black',
    elevation: 2,
    shadowOffset: {width: 1, height: 1},
    shadowRadius: 2,
    shadowOpacity: 0.4,
    backgroundColor: theme.COLORS.HEADER,
    marginVertical: theme.SIZES.small / 1.3,
    marginHorizontal: theme.SIZES.small / 2.2,
  },
  overlay: {
    height: '100%',
    width: '100%',
    backgroundColor: '#fff',
  },
});
