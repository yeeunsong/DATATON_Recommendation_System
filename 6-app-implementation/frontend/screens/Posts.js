import React from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TextInput,
  ScrollView
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
const tags = ['봉사', '예술', '사회', 'IT', '공모전', '경영', '과학', '미술', '대외활동', '기타', '운동', '취업', '동아리', '언어', '친목', '종교', '스터디', '연합', '학회', '음악'];

class Posts extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      title : null,
      host : null,
      duedate : null,
      description : null,
      image : null,
      tags : [],
    };
  }

  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
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
                <Block flex={0.08} middle>
                  <Text color="#8898AA" size={25} >
                    Upload Post
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                    <Block middle width={width * 0.9}>
                      <Input
                        borderless
                        placeholder="제목을 입력하세요"
                        iconContent={
                          <Icon
                            size={10}
                            color={argonTheme.COLORS.ICON}
                            name="nav-right"
                            family="ArgonExtra"
                            style={styles.inputIcons}
                          />
                        }
                        onChangeText={(val) => this.setState({title: val})}
                      />
                    </Block>
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
                          <Text bold size={14} color={"gray"}>
                          upload image
                        </Text>
                        </Button>                
                      <Block row marginTop={5}>
                        <ModalDropdown style={styles.dropdown_4} 
                                        marginRight={10}
                                        options={tags} 
                                        defaultValue= '태그를 선택하세요'
                                        defaultIndex={-1}
                                        onSelect={(idx, value) => this.tag_onselect(idx, value)}/>
                        <Button 
                        style={styles.socialButtons}
                        onPress={() => this.onTagPredict()}
                        >
                          <Text bold size={14} color={argonTheme.COLORS.BLACK}>
                          태그 추천받기
                        </Text>
                        </Button>
                      </Block>


                      <Block row width={width * 0.75}>
                      <Checkbox
                        checkboxStyle={{
                          borderWidth: 3
                        }}
                        color={argonTheme.COLORS.PRIMARY}
                        label="학교 게시판에 전송하기"
                      />
                    </Block>
                      
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

  tag_onselect(idx, value) {
    this.setState({tags: value});
  }

  onInfoSend(){
    const { title, host, duedate, description, image, tag } = this.state;
    console.log(this.state);
    // POST to Flask Server
    http.post('/upload', {
      title: title,
      host: host,
      duedate: duedate,
      description: description,
      image: image,
      tag: tag
    })
    .then(() => this.onUploadSuccess());
  }
  onUploadSuccess(){
    console.log('upload success!');
  }

  onImage(){
    http.get('/uploadimage', {})
    .then(() => this.onImageSuccess());
  }
  onUploadSuccess(){
    console.log('upload success!');
  }

  onTagPredict(){
    http.get('/gethashtags/$userid', {})
    .then((response) => this.setState({tags: response.data}))
    .catch((err) => console.log(err));
  }

}


const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.95,
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
    height: 35,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
    shadowOpacity: 0.1,
    elevation: 1
  },
  socialButtons_img: {
    width: 120,
    height: 35,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.GRAY,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 2,
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
    marginTop: 7
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

export default Posts;
