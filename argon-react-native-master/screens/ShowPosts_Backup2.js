import React, { useEffect, useRef, Component }  from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, View, Dimensions, Platform, Linking, BackHandler, ScrollView, KeyboardAvoidingView, TextInput } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { WebView } from 'react-native-webview'
import PropTypes from 'prop-types';

const { height, width } = Dimensions.get('screen');
import { Images, argonTheme } from '../constants/';
import { HeaderHeight } from "../constants/utils";
import { Icon, Input } from "../components";
import ModalDropdown from 'react-native-modal-dropdown';
import articles from '../constants/articles';

function padding(a, b, c, d) {
  return {
    paddingTop: a,
    paddingRight: b ? b : a,
    paddingBottom: c ? c : a,
    paddingLeft: d ? d : (b ? b : a)
  }
}


export default class ShowPosts extends React.Component {

 render() {
    const { navigation, item, horizontal, full, style, ctaColor, imageStyle } = this.props;

    const imageStyles = [
      full ? styles.fullImage : styles.horizontalImage,
      imageStyle
    ];
    const imgContainer = [styles.imageContainer,
      horizontal ? styles.horizontalStyles : styles.verticalStyles,
      styles.shadow
    ];

    return (
    <View>
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
              <Block flex>
                <Block flex={0.08}
                    style = {styles.title}>
                  <Text color="black" size={20} middle >
                    {articles[0].title}
                  </Text>
                </Block>
                <Block flex center>
                  <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior="padding"
                    enabled
                  >
                  <Block flex style={imgContainer} middle>
                      <Image
                       source={{uri: articles[0].image}}
                       style={{width: 250, height: 400}}
                      />
                  </Block>
                    <Block width={width * 0.9} >

                        <Text
                            style={{backgroundColor: 'white', fontSize: 15}}
                         >
                        [KU_BIG] 고려대학교 빅데이터 연구회 KU-BIG에서 12기 신입부원을 모집합니다!

                       고려대학교 통계학과 인증 유일 데이터 분석 학회,
                       고려대학교 빅데이터 연구회(KU-BIG)에서 20-2학기를 함께할 12기 신입 학회원을 모집합니다.

                       KU-BIG은 고려대 내 유일한 데이터 분석 학회로, 빅데이터 시대에 필요한 통계학/머신러닝/딥러닝 등에 대한 지식을 함께 공부하고 실제 데이터에 적용하는 프로젝트를 진행하는 학회입니다.

                       학회 활동 내용으로는
                       .
                       ▶전반부 (여름 방학 ~ 중간고사 이전)
                       -데이터분석/시각화/기계학습(개론, 지도, 비지도)/딥러닝 집중 교육
                       -코딩(R/Python) 능력 함양을 위한 컨텐츠, 과제
                       .
                       ▶후반부 (중간고사 이후)
                       -팀을 구성해 원하는 분야에 대한 세부 스터디
                       -실제 데이터에 적용하는 본 프로젝트를 진행
                       구성된 커리큘럼 외의 공부하고 싶은 분야가 있을 경우 자유롭게 스터디를 구성하거나 참여해 공부할 수 있고, 이번 겨울 방학 시즌에는
                       강화학습/딥러닝/Python코딩/Kaggle실전스터디를 각자 수요에 맞게 진행하였습니다.
                       활동에 대한 자세한 내용은 아래 페이스북 페이지 게시글을 참조해 주시기 바랍니다.

                       전공이 무엇이든 실력이 어떠하든 데이터에 관심과 열의가 뜨거운 분이라면 주저말고 지원해주세요!!
                       _
                       ▶지원자격
                       -1년 간 활동(방학 필수)가 가능한 고려대학교 학생 (전공 무관, 학부/대학원 무관)
                       -매주 목요일(세션)을 포함 최소 주 2회 이상 모임 가능한 분
                       _
                       ▶모집
                       지원서 접수: 7/22(수) 24시
                       아래 링크에서 구글 설문지 작성
                       https://docs.google.com/forms/d/e/1FAIpQLSenMqEMa1K0EMcjW5jOBGVi2-rlE96CBfGrU01URs0u4dpCWQ/viewform?usp=pp_url
                       _
                       ▶일정
                       -OT: 8월 6일(목) 19시
                       -첫 세션: 8월 13일(목) 19시
                       OT 불참시 합격 취소의 사유가 됩니다.
                       _
                       ▶회장단 문의
                       조규선 : 010-6289-6206
                       김근호 : 010-2811-1719
                       _
                       ▶페이스북 페이지
                       https://www.facebook.com/kubigdata
                       _
                       ▶Github 페이지
                       https://github.com/ku-big
                       _
                       ▶인스타그램 페이지
                       https://www.instagram.com/kubig.official

                       추가로 궁금하신 사항은 회장단에 문자 부탁드립니다.
                         </Text>
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
          </Block>
        </ImageBackground>
      </Block>
      </ScrollView>
      </View>
    );
  }
}


ShowPosts.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
}



const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.GRAY,
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
  },
  fullImage: {
      height: 215
  },
});
