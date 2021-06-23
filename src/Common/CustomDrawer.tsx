import {
  Alert,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
/**TODO:
 *  Create User Card - User Logo - Salutation/first_name/last_name - DisplayName
 *  Drawer Item - Home - My Works - Logout
 *  Links - Terms and conditions - Policies
 */
import {
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
} from '@react-navigation/drawer';
import React, {FunctionComponent, useEffect, useState} from 'react';

import AgreementModal from './AgreementModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView} from 'react-native-safe-area-context';
import Services from '../Services/services';
import Subscription from '../Components/modals/Subscription';
import {TouchableOpacity} from 'react-native-gesture-handler';
import theme from '../Constants/theme';
import useAuthState from '../State/AuthState';
import {useGlobalState} from '../State/GlobalState';
import {width} from '../Constants/size';

type props = {
  navigation?: any;
  subStatus: string;
};
const service = new Services();
const CustomDrawer: FunctionComponent<props> = (props: any) => {
  const {policies} = useAuthState();
  const globalState: any = useGlobalState();
  const [showSubscription, setShowSubscription] = useState(false);
  const onPress = (route: any) => {
    if (props.subStatus === 'TRIAL') {
      if (route.name === 'Center' || route.name === 'Datesheet') {
        setShowSubscription(true);
      } else {
        props.navigation.navigate(route.name);
      }
    } else {
      props.navigation.navigate(route.name);
    }
  };

  const openLink = (url: string) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Open url error');
      }
    });
  };
  const render_card = (
    name: string,
    displayName: string,
    onPress: () => {},
  ) => {
    return (
      <View style={[styles.card_parent, styles.shadow]}>
        <Image
          style={styles.image}
          source={require('../Assets/images/journalist.png')}
        />
        <View style={styles.text_container}>
          <Text style={styles.text}>{name}</Text>
          <TouchableOpacity activeOpacity={0.2} onPress={() => onPress()}>
            <Text style={styles.link}>{displayName}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };
  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.parent}>
      <Subscription
        show={showSubscription}
        type={'ABOUTTIME'}
        navigation={props.navigation}
        message={'Please Update Subscription to Access Content'}
        hide={() => setShowSubscription(false)}
      />
      {render_card(
        ` ${globalState.user && globalState.user.first_name} ${
          globalState.user && globalState.user.last_name
        }`,
        `${globalState.user && globalState.user.user_name}`,
        () => props.navigation.navigate('Profile'),
      )}
      {props.state.routes.map((route: any) => {
        return (
          <TouchableHighlight
            underlayColor={theme.COLORS.HEADER}
            activeOpacity={0.2}
            key={`KEY-${route.name}`}
            style={[styles.drawer_item]}
            onPress={() => onPress(route)}>
            <Text style={styles.text}>
              {route.name === 'Work' ? 'My Work' : route.name}
            </Text>
          </TouchableHighlight>
        );
      })}
      <TouchableHighlight
        style={[styles.drawer_item]}
        onPress={async () => {
          const response = await service.set_logout();
          await AsyncStorage.clear();
          props.navigation.replace('Auth');
        }}>
        <Text style={styles.text}>Sign out</Text>
      </TouchableHighlight>
      <View style={styles.terms_parent}>
        {policies.map((item: any, index: number) => (
          <TouchableOpacity
            key={`${item.name}`}
            activeOpacity={0.2}
            onPress={() => openLink(item.link)}>
            <Text style={[styles.link, styles.link_bottom]}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </DrawerContentScrollView>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({
  parent: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  link_bottom: {
    color: theme.COLORS.HEADER,
  },
  terms_parent: {
    flex: 3,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: theme.SIZES.large,
  },
  drawer_item: {
    marginBottom: theme.SIZES.small - 1,
    marginHorizontal: theme.SIZES.small,
    borderRadius: 5,
    height: theme.SIZES.large * 2,
    justifyContent: 'center',
    paddingHorizontal: theme.SIZES.small,
    backgroundColor: `${theme.COLORS.PRIMARY}99`,
    // elevation: 1,
    shadowRadius: 3,
    shadowOpacity: 0.2,
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 3,
    shadowOpacity: 0.2,
    // elevation: 2,
  },
  card_parent: {
    flexDirection: 'row',
    paddingHorizontal: theme.SIZES.normal + 2,
    paddingVertical: theme.SIZES.normal,
    marginVertical: theme.SIZES.large,
    backgroundColor: `${theme.COLORS.PRIMARY}90`,
    marginHorizontal: theme.SIZES.small / 1.5,
    borderRadius: 5,
  },
  image: {
    marginRight: theme.SIZES.small - 2,
    width: theme.SIZES.large * 2.5,
    resizeMode: 'contain',
    height: theme.SIZES.large * 2.5,
  },
  text_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    // width: '89%',
    fontSize: theme.SIZES.small + 4,
    fontFamily: 'Signika-SemiBold',
    color: theme.COLORS.DEFAULT,
    lineHeight: 25,
  },
  link: {
    fontSize: theme.SIZES.normal,
    textDecorationStyle: 'solid',
    textDecorationLine: 'underline',
    lineHeight: 24,
    fontFamily: 'Signika-SemiBold',
    color: theme.COLORS.DEFAULT,
  },
});
