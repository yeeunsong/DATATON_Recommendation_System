import React, { useEffect, useRef, Component }  from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, View, Dimensions, Platform, Linking, BackHandler, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { WebView } from 'react-native-webview'

const { height, width } = Dimensions.get('screen');
import { Images, argonTheme } from '../constants/';
import { HeaderHeight } from "../constants/utils";
import { Icon, Input } from "../components";
import ModalDropdown from 'react-native-modal-dropdown';
import articles from '../constants/articles';

export default class ShowPosts extends React.Component {

 render() {
    const { navigation } = this.props;

    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];

    return (
      <ScrollView
        showsVerticalScrollIndicator={true}
        contentContainerStyle={styles.articles}>
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.UploadBackground}
          style={{ width, height, zIndex: 1 }}
         >
          <Block flex middle>
            {/* <Block style={styles.registerContainer}> */}
              <Block flex>
                <Block flex={0.08}
                style = {styles.title}>
                  <Text color="black" size={20} middle >
                    [KU_BIG] 고려대학교 빅데이터 연구회 KU-BIG에서 12기 신입부원을 모집합니다!
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                  <Image
                   source={{articles[0].image}}
                   style = {imageStyles} />
                    <Block width={width * 0.9} row middle>
                      <Block width = {width * 0.48} marginRight={10}>
                      <Input
                        borderless
                        placeholder="주최명"
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            name="nav-right"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({host: val})}
                      />
                   </Block>
                    <Block width = {width * 0.38}>
                      <Input
                        borderless
                        placeholder="게시기한"
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            name="nav-right"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({duedate: val})}
                      />
                    </Block>
                    </Block>
                    <Block width={width * 0.9} >
                      <Text>내용:</Text>
                    <TextInput
                        style={{height: 250,backgroundColor: 'white', fontSize: 20}}
                        placeholder="내용을 입력하세요"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="nav-right"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({description: val})}
                      />
                    </Block>
                    <Block width={width * 0.9} middle marginTop={5}>
                    <Button
                        style={styles.socialButtons_img}
                        onPress={() => this.onImage()}
                        >
                        </Button>
                      <Block middle>
                      <Button color="primary"
                              style={styles.createButton}
                              onPress={() => this.onInfoSend()} >
                        <Text bold size={20} color={argonTheme.COLORS.WHITE}>
                          UPLOAD
                        </Text>
                      </Button>
                    </Block>
                      </Block>


                  </KeyboardAvoidingView>
                </Block>
              </Block>
            {/* </Block> */}
          </Block>
        </ImageBackground>
      </Block>
      </ScrollView>
    );
  }
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    marginTop: Platform.OS === 'android' ? -HeaderHeight : 0,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  gradient: {
    zIndex: 1,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 66,
  },
  title: {
      paddingTop: 40,
      paddingRight: 30,
      paddingBottom: 30,
      paddingLeft: 40,
  }
});
