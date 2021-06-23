import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import React, {
  FunctionComponent,
  ReactComponentElement,
  useEffect,
  useState,
} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import baseStyles from './styles';

type props = {
  ExpandComp: (handleToggle: () => void, toggle: boolean) => JSX.Element;
  ContractComp: (handleToggle: () => void, toggle: boolean) => JSX.Element;
  dimen: {
    width: {min: number; max: number};
    height: {min: number; max: number};
  };
  style?: any;
};

const Expandable: FunctionComponent<props> = ({
  ExpandComp,
  ContractComp,
  dimen,
  style,
}) => {
  const [toggle, setToggle] = useState(false);
  const size = useSharedValue({
    // width: dimen.width.min,
    height: dimen.height.min,
  });
  const opac = useSharedValue(0);
  const handleToggle = () => {
    setToggle(!toggle);
  };

  const animationStyle = () =>
    useAnimatedStyle(() => {
      return {
        // width: withSpring(size.value.width, {
        //   damping: 20,
        //   stiffness: 50,
        // }),
        height: withTiming(size.value.height, {
          duration: 300,
        }),
      };
    });

  const expandStyle = () =>
    useAnimatedStyle(() => {
      return {
        opacity: withTiming(opac.value, {
          duration: 100,
        }),
      };
    });

  useEffect(() => {
    opac.value = toggle === true ? 1 : 0;
    size.value = {
      // width: toggle === true ? dimen.width.max : dimen.width.min,
      height: toggle === true ? dimen.height.max : dimen.height.min,
    };
  }, [toggle]);
  return (
    <Animated.View style={[baseStyles.parent, animationStyle(), style]}>
      <View style={styles.contract}>{ContractComp(handleToggle, toggle)}</View>
      <Animated.View style={[styles.expand, expandStyle()]}>
        {toggle === true ? ExpandComp(handleToggle, toggle) : null}
      </Animated.View>
    </Animated.View>
  );
};

export default Expandable;

const styles = StyleSheet.create({
  contract: {},
  expand: {},
});
