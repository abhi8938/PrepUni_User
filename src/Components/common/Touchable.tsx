import {Pressable, StyleSheet, Text, View} from 'react-native';
import React, {FunctionComponent, useEffect} from 'react';

import ActionLoader from './ActionLoader';
import Icon from './Icon';
import Loader from './ActionLoader';
import {TouchableOpacity} from 'react-native-gesture-handler';
import theme from '../../Constants/theme';
import {width} from '../../Constants/size';

type props = {
  loading: boolean;
  touchableProps: {onPress: () => void; disabled: boolean};
  title: string;
  size: 'SMALL' | 'MEDIUM' | 'LARGE';
  filled?: boolean;
  toggle?: boolean;
  squared?: boolean;
  style?: any;
  loadingText?: string;
};

const Touchable: FunctionComponent<props> = ({
  loading,
  touchableProps,
  title,
  size,
  filled,
  toggle,
  squared,
  style,
  loadingText,
}) => {
  const custom_font_size =
    size === 'LARGE'
      ? theme.SIZES.normal + 4
      : size === 'MEDIUM'
      ? theme.SIZES.normal
      : theme.SIZES.small;

  return loading === false ? (
    <Pressable
      {...touchableProps}
      style={[
        styles.button,
        filled ? styles.filled : styles.outline,
        toggle && styles.toggle,
        squared && styles.square,
        style,
      ]}>
      <Text
        style={[
          {
            // width: width * 0.1,
            fontWeight: 'bold',
            fontSize: custom_font_size,
            color: filled ? theme.COLORS.WHITE : theme.COLORS.PRIMARY,
          },
        ]}>
        {title}
      </Text>
      {toggle && (
        <Icon
          type={'ARROW_TOP'}
          size={0.5}
          style={{marginTop: 2, marginLeft: 3}}
          onPress={touchableProps.onPress}
        />
      )}
    </Pressable>
  ) : (
    <ActionLoader
      title={loadingText ? loadingText : 'Loading...'}
      size={theme.SIZES.large * 2}
    />
  );
};

export default Touchable;

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.small,
    paddingVertical: theme.SIZES.small / 1.6,
    marginVertical: theme.SIZES.small,
    marginHorizontal: theme.SIZES.small,
    borderRadius: 9,
    elevation: 3,
    textAlign: 'center',
  },
  filled: {
    backgroundColor: theme.COLORS.PRIMARY,
  },
  square: {
    borderRadius: 9,
  },
  outline: {
    borderWidth: 1.2,
    borderColor: theme.COLORS.PRIMARY,
  },
  toggle: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});
