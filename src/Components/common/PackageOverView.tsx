import React, {FunctionComponent} from 'react';
import {StyleSheet, Text, View} from 'react-native';

import GIFLoader from '../GIFLoader';
import {Height} from '../../Constants/size';
import Icon from '../../Components/common/Icon';
import Touchable from '../../Components/common/Touchable';
import theme from '../../Constants/theme';

const PackageLoader = () => {
  return (
    <View style={styles.trial}>
      <GIFLoader style={{alignSelf: 'center'}} />
    </View>
  );
};

type prop = {
  data: any;
};

const FeatureView: FunctionComponent<prop> = ({data}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        marginTop: theme.SIZES.normal,
        paddingHorizontal: theme.SIZES.small / 2,
        alignItems: 'center',
      }}>
      <Icon type={data.active ? 'TICK_GREEN' : 'CROSS_RED'} size={0.7} />

      <Text
        style={{
          marginLeft: theme.SIZES.small,
          fontSize: theme.SIZES.small + 4,
          color: theme.COLORS.PRICE_COLOR,
        }}>
        {data.feature}
      </Text>
    </View>
  );
};

type props = {
  load: boolean;
  packs: any;
  index: number;
  title: string;
  buy: () => void;
  trial: () => void;
};

const PackageOverView: FunctionComponent<props> = ({
  index,
  title,
  buy,
  packs,
  load,
  trial,
}) => {
  return (
    <>
      {load === true && <PackageLoader />}
      {load === false && (
        <View style={styles.trial}>
          <Text
            style={{
              fontSize: theme.SIZES.large * 1.2,
              color: theme.COLORS.PRIMARY,
              alignSelf: 'center',
            }}>
            {title}
          </Text>
          <Text
            style={{
              alignSelf: 'center',
              fontWeight: 'bold',
              marginTop: 8,
              fontSize: theme.SIZES.normal,
            }}>
            ₹ {parseInt(packs.price) - parseInt(packs.discount)}
          </Text>
          {packs.features &&
            packs.features.map((item: any, index: number) => (
              <FeatureView data={item} key={index} />
            ))}
          {index == 0 && (
            <Text
              style={{
                fontSize: theme.SIZES.small - 2,
                alignSelf: 'center',
                marginTop: theme.SIZES.small / 4,
                marginRight: theme.SIZES.small,
                color: theme.COLORS.BLACK,
              }}>
              (Limited Access)
            </Text>
          )}
          <Touchable
            touchableProps={{
              onPress: title === 'PAID' ? buy : trial,
              disabled: false,
            }}
            style={{alignSelf: 'center', marginTop: theme.SIZES.large}}
            loading={false}
            title={'Subscribe'}
            size={'SMALL'}
            filled
          />
        </View>
      )}
    </>
  );
};

export default PackageOverView;

const styles = StyleSheet.create({
  parent: {
    flex: 1,
    backgroundColor: theme.COLORS.DEFAULT,
    // paddingHorizontal: theme.SIZES.small / 2,
  },
  child: {
    flexDirection: 'row',
    width: '100%',
    marginTop: theme.SIZES.large * 2,
    paddingHorizontal: theme.SIZES.small / 2,
    height: Height * 0.38,
  },
  trial: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    borderColor: theme.COLORS.PRIMARY,
    width: '49%',
    maxWidth: 260,
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: theme.SIZES.small,
    marginHorizontal: theme.SIZES.small / 2,
  },
});
