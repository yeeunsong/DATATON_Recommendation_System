import React from 'react';

import { StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Block, theme } from 'galio-framework';

import { Card } from '../components';
import articles from '../constants/articles';
const { width } = Dimensions.get('screen');

import axios from 'axios';

const serverUrl = 'http://172.30.1.17:5000';
const http = axios.create({
  baseURL : serverUrl,
});


class Home extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      articles: [],
    };
  }

  addArticleList(list){
    this.setState({
      articles : [...list]
    })
  }

  getArticles(){
    const { userid } = this.state;
    http.get('/getitems/$userid')
    .then((response) => this.addArticleList(response.data))
    .catch((err) => console.log(err));
  }

  getArticles();

  renderArticles = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}>
        <Block flex>
          <Card item={articles[0]} horizontal  />
          <Block flex row>
            <Card item={articles[1]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[2]} />
          </Block>
          <Card item={articles[3]} horizontal />
          <Card item={articles[4]} full />
        </Block>
        <Block flex>
          <Card item={articles[5]} horizontal  />
          <Block flex row>
            <Card item={articles[6]} style={{ marginRight: theme.SIZES.BASE }} />
            <Card item={articles[7]} />
          </Block>
          <Card item={articles[8]} horizontal />
          <Card item={articles[9]} full />
        </Block>
      </ScrollView>
    )
  }

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderArticles()}
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,    
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
});

export default Home;
