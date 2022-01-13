import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";
import ModalDropdown from 'react-native-modal-dropdown';
import axios from 'axios';

const serverUrl = 'http://172.30.1.17:5000';
const http = axios.create({
  baseURL : serverUrl,
});

const { width, height } = Dimensions.get("screen");
const grade = [1,2,3,4];
const sex = ['F','M']
const college = ['정보대학', '정보보호학부', '공과대학', '이과대학', '정경대학', '경영대학', '간호대학', '보건과학대학', '국제학부', '디자인조형학부', '미디어학부', '문과대학', '사범대학', '생명과학대학', '의과대학'];

class Register extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      username : null,
      id : null,
      password : null,
      grade: null,
      sex : null,
      college : null
    };
  }

  render() {
    return (
      <Block flex middle>
        <StatusBar hidden />
        <ImageBackground
          source={Images.RegisterBackground}
          style={{ width, height, zIndex: 1 }}
        >
          <Block flex={0.06} marginTop={40} middle>
        <Image styles={styles.logo} source={Images.Logo} />
        </Block>
          
          <Block flex middle>
            <Block style={styles.registerContainer}>
             
              <Block flex>
              
                <Block flex={0.17} middle>
                
                  <Text color="#8898AA" size={25}>
                    회원가입
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                      <Input
                        borderless
                        placeholder="이름"
                        iconContent={
                          <Icon
                            size={16}
                            color={argonTheme.COLORS.ICON}
                            name="hat-3"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({username: val})}
                      />
                    </Block>
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

                    <Block width={width * 0.8} middle>
                      
                      <ModalDropdown style={styles.dropdown_4_1}
                                     defaultValue= '학년을 선택하세요'
                                      options={grade}
                                      defaultIndex={-1}
                                      onSelect={(idx, value) => this.grade_onselect(idx, value)}/>
                      <ModalDropdown style={styles.dropdown_4} 
                                      options={sex} 
                                      defaultValue= '성별을 선택하세요'
                                      defaultIndex={-1}
                                      onSelect={(idx, value) => this.sex_onselect(idx, value)}/>
                      <ModalDropdown style={styles.dropdown_4} 
                                      options={college} 
                                      defaultValue= '단과대를 선택하세요'
                                      defaultIndex={-1}
                                      onSelect={(idx, value) => this.college_onselect(idx, value)}/>

                      </Block>

                    <Block middle>
                      <Button color="primary" 
                              style={styles.createButton}
                              onPress={() => this.onInfoSend()} >
                        <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                          CREATE ACCOUNT
                        </Text>
                      </Button>
                    </Block>
                  </KeyboardAvoidingView>
                </Block>
              </Block>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
  
  grade_onselect(idx, value) {
    this.setState({grade: value});
  }

  sex_onselect(idx, value) {
    this.setState({sex: value});
  }

  college_onselect(idx, value) {
    this.setState({college: value});
  }

  onRegisterSuccess(){
    console.log('success!');
    this.getMessages();
  } 

  onInfoSend(){
    const { id, username, password, grade, sex, college } = this.state;
    console.log(this.state);
    // POST to Flask Server
    http.post('/register', {
      id,
      username,
      password,
      grade,
      sex,
      college
    }).then(() => this.onRegisterSuccess())
    .catch((err) => console.log(err));
  }


}


const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.78,
    backgroundColor: "#F4F5F7",
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
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1
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

  dropdown_1: {
    flex: 1,
    top: 32,
    left: 8,
  },
  dropdown_2: {
    alignSelf: 'flex-end',
    width: 150,
    marginTop: 32,
    right: 8,
    borderWidth: 0,
    borderRadius: 3,
    backgroundColor: 'cornflowerblue',
  },
  dropdown_2_text: {
    marginVertical: 10,
    marginHorizontal: 6,
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  dropdown_2_dropdown: {
    width: 150,
    height: 300,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    borderRadius: 3,
  },
  dropdown_2_row: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
  },
  dropdown_2_image: {
    marginLeft: 4,
    width: 30,
    height: 30,
  },
  dropdown_2_row_text: {
    marginHorizontal: 4,
    fontSize: 16,
    color: 'navy',
    textAlignVertical: 'center',
  },
  dropdown_2_separator: {
    height: 1,
    backgroundColor: 'cornflowerblue',
  },
  dropdown_3: {
    width: 150,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_3_dropdownTextStyle: {
    backgroundColor: '#000',
    color: '#fff'
  },
  dropdown_3_dropdownTextHighlightStyle: {
    backgroundColor: '#fff',
    color: '#000'
  },
  dropdown_4_1: {
    marginTop : 10,
    margin: 4,
    height : 30,
    width : 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_4: {
    margin: 4,
    height : 30,
    width : 200,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_4_dropdown: {
    width: 100,
  },
  dropdown_5: {
    margin: 8,
    borderColor: 'lightgray',
    borderWidth: 1,
    borderRadius: 1,
  },
  dropdown_6: {
    flex: 1,
    left: 8,
  },
  dropdown_6_image: {
    width: 40,
    height: 40,
  },
});

export default Register;
