"use strict"

export default class ParseService {

    static parseEmotion(emotionData) {
        const emotion = {
            emoji: emotionData.emoji,
            timestamp: emotionData.timestamp.seconds * 1000,
            message: emotionData.message,
            userID: emotionData.userID,
            coordinates: [emotionData.latLon.latitude, emotionData.latLon.longitude]
        }

        return emotion;
    }

    static createGeoJSON(emotionsData) {
        const geoJSON = {
            type: "FeatureCollection",
            features: []
        }

        emotionsData.forEach(e => {
            const emotion = ParseService.parseEmotion(e);

            const feature = {
                type: "Feature",
                properties: {
                    emoji: emotion.emoji,
                    timestamp: emotion.timestamp,
                    message: emotion.message,
                    userID: emotion.userID
                },
                geometry: {
                    coordinates: emotion.coordinates,
                    type: "Point"
                }
            }
            geoJSON.features.push(feature);
        });

        return geoJSON;
    }
}