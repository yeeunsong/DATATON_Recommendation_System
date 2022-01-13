import React from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions
} from "react-native";

import { Icon, Input } from "../components";
import { Block, Text, theme, Button } from "galio-framework";
const { height, width } = Dimensions.get("screen");
import argonTheme from "../constants/Theme";
import Images from "../constants/Images";
const serverUrl = 'http://172.30.1.17:5000';
const http = axios.create({
  baseURL : serverUrl,
});

class Onboarding extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      id : null,
      password : null,
    };
  }
  render() {
    const { navigation } = this.props;

    return (

      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
              source={Images.Onboarding}
              style={{ height, width, zIndex: 1 }}>

          <Block flex middle>
            <Block style={styles.registerContainer}>

              <Block flex>
                <Block flex={0.17} middle marginBottom={10} marginTop={5}>
                <Text color="#808080" size={40} fontWeight={'bold'}>
                    환영합니다!
                  </Text>
                  </Block>
                  <Block flex={0.17} middle >
                  <Text color="#000000" size={20}>
                    로그인
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >

                    <Block width={width * 0.8} style={{ marginBottom: 10}}>
                      <Input
                        borderless
                        placeholder="ID"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="ic_mail_24px"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({id: val})}
                      />
                    </Block>
                    <Block width={width * 0.8}>
                      <Input
                        password
                        borderless
                        placeholder="Password"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="padlock-unlocked"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({password: val})}
                      />

                    </Block>
                    <Block row marginTop={10} marginLeft={10} justifyContent={'center'}>
                      <Text height={20} size={15}>회원가입이 안되어있다면?  </Text>
                      <Button style={styles.socialButtons}
                              textStyle={{ color: argonTheme.COLORS.BLACK }}
                              onPress={() => navigation.navigate("Register")}>회원가입하기</Button>
                    </Block>
                  </KeyboardAvoidingView>
                  <Block center>
                  <Button
                  width= {width - theme.SIZES.BASE * 5}
                  marginBottom = {30}
                  height= {theme.SIZES.BASE * 4}
                  shadowRadius= {0}
                  shadowOpacity= {0}
                  onPress={() => this.onLogin()}
                  textStyle={{ color: argonTheme.COLORS.WHITE }}
                >
                  Get Started
                </Button>
              </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>

    );
  }

  onLogin(){
    const { username, password } = this.state;
      // POST to Flask Server
      http.post('/login', {username, password})
      .then(() => this.onLoginSuccess())
      .catch((err) => console.log(err));
  }

  onLoginSuccess(){
    console.log('success!');
    this.getMessages();
  }

}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#EDE4F5",
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden"
  },
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA"
  },
  socialButtons: {
    width: 100,
    height: 25,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    borderColor:"#8898AA"

  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14
  },
  inputIcons: {
    marginRight: 12
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 20
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25
  },
  container: {
    flex: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    flex: 1,
    borderWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    height: 500,
    paddingVertical: 100,
    paddingLeft: 20,
  },
  textButton: {
    color: 'deepskyblue',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: 'deepskyblue',
    margin: 2,
  },



  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    position: "relative",
    bottom: theme.SIZES.BASE,
    zIndex: 2,
  },
  button: {
    width: width - theme.SIZES.BASE * 5,
    marginBottom : 40,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0

  },
  logo: {
    width: 200,
    height: 60,
    zIndex: 2,
    position: 'relative',
    marginTop: '-50%'
  },
  title: {
    marginTop:'-5%'
  },
  subTitle: {
    marginTop: 20
  }
});

export default Onboarding;