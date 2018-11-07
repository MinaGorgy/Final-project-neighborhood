import React, { Component } from 'react';
import { Map, InfoWindow, Marker, GoogleApiWrapper } from 'google-maps-react';


export class MapComponent extends Component {


    render() {

        const { google, onMapClicked, cafes, onMarkerClick, activeMarker, showingInfoWindow, selectedCafes, grabMarkersinfo } = this.props;


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

                    {cafes.map(cafe =>
                        <Marker
                            key={cafe.id}
                            id={cafe.id}
                            ref={grabMarkersinfo}
                            name={cafe.name}
                            position={{
                                lat: cafe.location.lat,
                                lng: cafe.location.lng
                            }}
                            animation={(selectedCafes.name === cafe.name) ? google.maps.Animation.BOUNCE : google.maps.Animation.none}
                            onClick={onMarkerClick}
                        />
                    )}

                    <InfoWindow
                        marker={activeMarker}
                        visible={showingInfoWindow}
                    >
                        
                            <div>
                                <h3>{selectedCafes.name}</h3>
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