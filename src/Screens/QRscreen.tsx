import React, {FunctionComponent, useEffect, useState} from 'react';
import {Share, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomHeader from '../Common/CustomHeader';
import Icon from 'react-native-vector-icons/Ionicons';
import QRCode from 'react-native-qrcode-svg';
import {SafeAreaView} from 'react-native-safe-area-context';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import theme from '../Constants/theme';
import {useGlobalState} from '../State/GlobalState';

type props = {
  navigation: any;
  route: any;
};
const QRscreen: FunctionComponent<props> = ({navigation, route}) => {
  const globalState: any = useGlobalState();
  const [link, setLink] = useState('');
  useEffect(() => {
    AsyncStorage.getItem('shareLink').then((link) => {
      if (link) {
        setLink(link);
      } else {
        dynamicLinks()
          .buildLink({
            link: 'https://prepuni.in/' + globalState.user._id,
            // domainUriPrefix is created in your Firebase console
            domainUriPrefix: 'https://prepuni.page.link',
          })
          .then((link) => {
            AsyncStorage.setItem('shareLink', link);
            setLink(link);
          })
          .catch((error) => console.log('dynamic link error', error));
      }
    });
  }, []);

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `PrepUni Refer Link ${link}. Use this link to avail 10% discount on PrepUni subscription`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: theme.COLORS.WHITE}}>
      <View style={styles.parent}>
        <CustomHeader
          navigation={navigation}
          scene={route}
          title={'Refer'}
          nav
          logo
        />
        <View style={{marginTop: '9%'}}>
          {link.length !== 0 && (
            <QRCode
              value={link}
              logo={require('../Assets/images/prepuni_logo.jpg')}
              logoSize={40}
              size={200}
            />
          )}
        </View>
        <View style={styles.shareParent}>
          <Text style={styles.scanQRText}>Scan this QR code to Refer</Text>
          <Text style={styles.shareText}>or share this link</Text>
          <TouchableOpacity style={styles.shareButton} onPress={onShare}>
            <Icon name={'share-social'} color={theme.COLORS.ACTIVE} size={20} />
            <Text style={styles.shareButtonText}>Share my referral code</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.discountParent}>
          <Text style={styles.dicountHead}>Disount Offer</Text>
          <Text style={styles.discountDesc}>
            10% discount to your friend who registers
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 60,
    backgroundColor: '#fff',
  },
  shareParent: {
    marginTop: 'auto',
    marginBottom: 'auto',
    alignItems: 'center',
  },
  scanQRText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  shareText: {
    fontSize: 15,
    marginTop: 10,
    color: '#00000080',
  },
  shareButton: {
    marginTop: 30,
    flexDirection: 'row',
    borderWidth: 2,
    borderColor: theme.COLORS.ACTIVE,
    paddingHorizontal: '6%',
    paddingVertical: '2.5%',
    borderRadius: 40,
  },
  shareButtonText: {
    marginLeft: 10,
    fontSize: 15,
    color: theme.COLORS.ACTIVE,
  },
  discountParent: {
    height: '15%',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    marginTop: 'auto',
    alignItems: 'center',
    backgroundColor: '#F3983E60',
    justifyContent: 'space-between',
    borderRadius: 10,
  },
  dicountHead: {
    fontWeight: 'bold',
    fontSize: 20,
    borderBottomWidth: 2,
  },
  discountDesc: {
    fontWeight: 'bold',
  },
});

export default QRscreen;
