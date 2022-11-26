"use strict"

export default class FirebaseService{



  getEmotions(){
    return {
      "type": "FeatureCollection",
      "features": [
        {
          "type": "Feature",
          "properties": {
            "emoji": 0,
            "timestamp": 1669474451000,
            "message": "lorem ipsum",
            "userId": "pippo"
          },
          "geometry": {
            "coordinates": [
              9.048290924733578,
              44.53692475822638
            ],
            "type": "Point"
          }
        },
        {
          "type": "Feature",
          "properties": {
            "emoji": 0,
            "timestamp": 1669474451000,
            "message": "lorem ipsum",
            "userId": "pippo"
          },
          "geometry": {
            "coordinates": [
              9.449291901295965,
              44.380093347450355
            ],
            "type": "Point"
          }
        },
        {
          "type": "Feature",
          "properties": {
            "emoji": 0,
            "timestamp": 1669474451000,
            "message": "lorem ipsum",
            "userId": "pippo"
          },
          "geometry": {
            "coordinates": [
              8.46601553410855,
              44.43895449091272
            ],
            "type": "Point"
          }
        },
        {
          "type": "Feature",
          "properties": {
            "emoji": 0,
            "timestamp": 1669474451000,
            "message": "lorem ipsum",
            "userId": "pippo"
          },
          "geometry": {
            "coordinates": [
              9.80085440129696,
              44.262193360416035
            ],
            "type": "Point"
          }
        }
      ]
    }
  }

  setEmotion(emotion){
    return true;
  }

}