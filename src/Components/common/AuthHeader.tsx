import {Platform, StyleSheet, Text, View} from 'react-native';
import React, {FunctionComponent} from 'react';

import BrandName from './BrandName';
import Icon from './Icon';
import Icons from './Icon';
import baseStyles from './styles';
import theme from '../../Constants/theme';

type props = {
  pageTitle: string;
  back: boolean;
  navigation?: any;
};

const AuthHeader: FunctionComponent<props> = ({
  pageTitle,
  back,
  navigation,
}) => {
  return (
    <View style={styles.parent}>
      <View style={styles.titleContainer}>
        {back && (
          <Icon
            style={{marginLeft: theme.SIZES.small}}
            type={'ARROW_LEFT'}
            size={0.95}
            onPress={() => navigation.goBack()}
          />
        )}
        <Text style={[baseStyles.heading, styles.title]}>{pageTitle}</Text>
      </View>
      <BrandName />
    </View>
  );
};

export default AuthHeader;

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'row',
    paddingVertical: theme.SIZES.small * 0.3,
    // backgroundColor: theme.COLORS.DEFAULT,
    zIndex: 3,
  },
  titleContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  title: {
    fontSize: theme.SIZES.large * 1.3,
    color: theme.COLORS.BLACK,
    lineHeight: theme.SIZES.large * 1.58,
  },
});
