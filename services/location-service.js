"use strict"

export default class LocationService {

  constructor() {
    
    if (LocationService._instance) {
      return LocationService._instance;
    }
    LocationService._instance = this;

  }

  static instance() {
    return LocationService._instance || new LocationService();
  }


  startMonitoring(callback) {

    const options = {
      enableHighAccuracy: true,
    };
    
    navigator.geolocation.watchPosition((position) => this.success(position, callback), (error) => console.log(error), options);
  }


  success(position, callback) {
    this.position = position;
    callback(position);
  }


}