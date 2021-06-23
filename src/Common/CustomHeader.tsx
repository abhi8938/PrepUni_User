import {Platform, SafeAreaView, StyleSheet, Text, View} from 'react-native';
import React, {FunctionComponent, useRef} from 'react';

import Animated from 'react-native-reanimated';
import BrandName from '../Components/common/BrandName';
import Icon from '../Components/common/Icon';
import Icon1 from 'react-native-vector-icons/Ionicons';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';
import {width} from '../Constants/size';

const NavIcon = ({navigation}: {navigation: any}) => (
  <Icon
    type={'NAV'}
    size={2}
    onPress={() => navigation.toggleDrawer()}
    style={{
      marginRight: theme.SIZES.small / 2,
    }}
  />
);

const Bell = ({navigation}: {navigation: any}) => {
  const globalState: any = useGlobalState();
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: theme.SIZES.small,
      }}>
      <Icon
        size={1.3}
        type={'NOTIFICATION'}
        style={{}}
        // color={theme.COLORS.HEADER}
        onPress={() => navigation.navigate('Notification')}
      />
      {globalState.notifications.length !== 0 && <View style={styles.badge} />}
    </View>
  );
};
const back_icon = (navigation: any) => (
  <Icon
    size={0.8}
    type={'ARROW_LEFT'}
    style={{
      marginRight: theme.SIZES.small,
      marginLeft: theme.SIZES.small / 1.5,
      padding: theme.SIZES.small / 1.5,
      flexDirection: 'row',
      justifyContent: 'flex-end',
      backgroundColor: theme.COLORS.BORDER,
    }}
    onPress={() => navigation.goBack()}
  />
);
const Search = (navigation: any) => (
  <Icon1
    name={'md-search'}
    size={theme.SIZES.large * 1.4}
    color={theme.COLORS.HEADER}
    onPress={() => navigation.navigate('Search')}
  />
);

type props = {
  animations?: {
    header: any;
    textSize: any;
  };
  title: string;
  back?: boolean;
  navigation: any;
  scene?: any;
  bell?: boolean;
  search?: boolean;
  style?: any;
  nav?: boolean;
  logo?: boolean;
};

const CustomHeader: FunctionComponent<props> = ({
  scene,
  title,
  back,
  style,
  navigation,
  bell,
  search,
  nav,
  logo,
  animations,
}) => {
  return (
    <View style={[styles.header, style]}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}>
        {back ? back_icon(navigation) : null}
        {nav ? <NavIcon navigation={navigation} /> : null}
        {title == 'PrepUni' ? (
          <Animated.View
            style={[animations && animations.header, {width: width * 0.25}]}>
            <Animated.Text
              style={[
                styles.heading,
                styles.prep,
                animations && animations?.textSize,
              ]}>
              Prep<Text style={styles.uni}>Uni</Text>
            </Animated.Text>
          </Animated.View>
        ) : (
          <Text style={styles.heading}>{title}</Text>
        )}
      </View>
      <View style={styles.iconsection}>
        {/* {search ? Search(navigation) : null} */}
        {bell ? <Bell navigation={navigation} /> : null}
      </View>
      {logo && <BrandName />}
    </View>
  );
};

export default CustomHeader;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: theme.SIZES.small / 1.5,
    paddingRight: theme.SIZES.small / 3,
    paddingVertical: theme.SIZES.small / 2,
    width: width,
  },
  iconsection: {
    alignItems: 'center',
    width: '17%',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  heading: {
    fontSize: theme.SIZES.large * 1.1,
    // width: '99%',
    fontFamily: 'Signika-Medium',
    color: theme.COLORS.HEADER,
    textAlign: 'center',
  },
  prep: {
    color: theme.COLORS.PRIMARY,
  },
  uni: {
    color: theme.COLORS.SECONDARY,
  },
  prepText: {
    color: theme.COLORS.PRIMARY,
    fontSize: theme.SIZES.large * 1.3,
    fontFamily: 'Signika-Medium',
  },
  uniText: {
    color: theme.COLORS.SECONDARY,
    fontSize: theme.SIZES.large * 1.3,
    fontFamily: 'Signika-Medium',
  },
  badge: {
    position: 'absolute',
    backgroundColor: '#FF0000',
    height: 9,
    width: 9,
    borderRadius: 50,
    right: 16,
    top: 0,
  },
});
