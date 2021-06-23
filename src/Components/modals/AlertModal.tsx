import {Height, width} from '../../Constants/size';
import React, {FunctionComponent, useEffect} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {useDispatcher, useGlobalState} from '../../State/GlobalState';

import BaseModal from '../common/BaseModal';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Touchable from '../common/Touchable';
import baseStyles from '../common/styles';
import theme from '../../Constants/theme';

const AlertModal: FunctionComponent = () => {
  const dispatcher = useDispatcher();
  //@ts-ignore
  const globalState: any = useGlobalState();
  const {type, message, show} = globalState.alert;
  const toggle = () => {
    dispatcher({
      type: 'SET-ALERT',
      payload: {type, message, show: false},
    });
  };

  const controls = {show, toggle};
  return (
    <BaseModal {...controls}>
      <View style={styles.parent}>
        <View
          style={
            type === 'ERROR'
              ? [styles.head, {backgroundColor: theme.COLORS.DEFAULT}]
              : [styles.head, {backgroundColor: theme.COLORS.DEFAULT}]
          }>
          <Icon
            size={theme.SIZES.large * 2}
            name={type === 'ERROR' ? 'times-circle' : 'check-circle'}
            color={theme.COLORS.ERROR}
          />
        </View>
        <View style={styles.innerChild}>
          <Text style={styles.message}>{message}</Text>
          <TouchableOpacity
            onPress={controls.toggle}
            style={
              type === 'ERROR'
                ? [styles.buttonErrorStyle, styles.buttonStyle]
                : [styles.buttonSuccessStyle, styles.buttonStyle]
            }>
            <Text
              style={
                type === 'ERROR'
                  ? styles.buttonErrorText
                  : styles.buttonSuccessText
              }>
              {'Okay'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </BaseModal>
  );
};

export default AlertModal;

const styles = StyleSheet.create({
  parent: {
    width: width * 0.8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  head: {
    paddingTop: theme.SIZES.large,
    paddingBottom: theme.SIZES.normal,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerChild: {
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.SIZES.small,
  },
  textHead: {
    fontSize: theme.SIZES.large + 8,
    fontFamily: 'ComicNeue-Bold',
    color: theme.COLORS.PRICE_COLOR,
  },
  message: {
    fontSize: theme.SIZES.normal + 2,
    fontFamily: 'Signika-Regular',
    width: '95%',
    textAlign: 'center',
    color: theme.COLORS.PRICE_COLOR,
    marginBottom: theme.SIZES.normal,
  },
  buttonStyle: {
    marginTop: theme.SIZES.small,
    borderRadius: theme.SIZES.large,
    paddingVertical: theme.SIZES.small * 0.4,
    paddingHorizontal: theme.SIZES.large,
    borderWidth: 0.5,
    backgroundColor: `${theme.COLORS.PRIMARY}10`,
  },
  buttonErrorStyle: {
    borderColor: theme.COLORS.PRIMARY,
  },
  buttonSuccessStyle: {
    borderColor: theme.COLORS.GREEN,
  },
  buttonErrorText: {
    fontSize: theme.SIZES.small + 4,
    color: theme.COLORS.PRIMARY,
  },
  buttonSuccessText: {
    fontSize: theme.SIZES.small,
    color: theme.COLORS.GREEN,
  },
});
