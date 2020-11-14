# DATATON_Recommendation_System

## 프로젝트 설명
학생 강의 데이터를 활용하여 교내 스마트 배너 설치 최적 입지를 선정하고 추천시스템이 탑재된 홍보물 자동화 관리 시스템을 구축한다.      


------------------------------------------------------------------


## 프로젝트 시스템 개요   
![시스템 흐름도](https://user-images.githubusercontent.com/49232148/99149091-5620ad80-26cf-11eb-88ef-0551cfd0d559.png)   


------------------------------------------------------------

## 교내 스마트 배너 최적 입지 선정 
강의실별/강의시간별 학생 데이터를 활용해 장소 별 학생 유동인구를 파악하고, folium을 통해 시각화하였다.   
![folium](https://user-images.githubusercontent.com/49232148/99149298-69804880-26d0-11eb-8392-15d845859527.png)   
![folium2](https://user-images.githubusercontent.com/49232148/99149374-f6c39d00-26d0-11eb-89e1-65d41e8d20bd.png)   


------------------------------------------------

## 홍보물 자동화 관리 어플리케이션 구축   
- 추천시스템을 구현하기 위해 simple recommendation, content-based filtering recommendation, collaborative filtering recommendation을 모두 종합한 hybrid recommendation system을 활용했다.
- 사용자가 등록한 홍보물의 카테고리를 제안하는 Tag Predictor 모델을 LSTM을 활용하여 구축하였다.

![추천 알고리즘](https://user-images.githubusercontent.com/49232148/99149097-57ea7100-26cf-11eb-8b17-566ed518e489.png)   
![hybrid algorithm](https://user-images.githubusercontent.com/49232148/99149090-54ef8080-26cf-11eb-9265-6fd858e08032.png)   

---------------------------------------------


## 앱 구축 
![앱 구현](https://user-images.githubusercontent.com/49232148/99149096-57ea7100-26cf-11eb-80d8-cf9ccf4f7682.png)   
![앱 구현 스크린1](https://user-images.githubusercontent.com/49232148/99149092-56b94400-26cf-11eb-91c9-79ee3cabccea.png)   
![앱 구현 스크린2](https://user-images.githubusercontent.com/49232148/99149093-56b94400-26cf-11eb-9a80-70621649d8c6.png)   
