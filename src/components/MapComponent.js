import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';


export class MapComponent extends Component {


    render() {

        const { google, onMapClicked, places, onMarkerClick, activeMarker, showingInfoWindow, selectedPlaces, grabMarkersinfo } = this.props;

        console.log(places)

        const style = {
            width: '100%',
            height: '100%',
        }
        return (

            <div role="application">
                <Map
                    style={style}
                    className="map"
                    google={google}
                    onMapClicked={onMapClicked}
                    initialCenter={{
                        lat: 30.102737,
                        lng: 31.386386
                    }}
                    zoom={13}

                >

                    {places.map(place =>
                        <Marker
                            key={place.id}
                            id={place.id}
                            ref={grabMarkersinfo}
                            name={place.name}
                            position={{
                                lat: place.location.lat,
                                lng: place.location.lng
                            }}
                            animation={(selectedPlaces.name === place.name) ? google.maps.Animation.BOUNCE : google.maps.Animation.none}
                            onClick={onMarkerClick}
                        />
                    )}

                    <InfoWindow
                        marker={activeMarker}
                        visible={showingInfoWindow}
                    >
                        
                            <div>
                                <h3>{selectedPlaces.name}</h3>
                                <p>Powered by FOUR SQUARE API</p>
                            </div> 
                        
                    </InfoWindow>

                </Map>

            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: ('AIzaSyCU1RNFpYAbRetPqgZQIiz3lSkFJR2LOPU'),
    //LoadingContainer: MapComponent
})(MapComponent)