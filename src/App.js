import React, { Component } from 'react';
import escapeRegExp from 'escape-string-regexp';
import sortBy from 'sort-by';

import './App.css';
import MapComponent from './components/MapComponent';
import Header from './components/Header';
import Menu from './components/Menu';

import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

library.add(faBars)
//the hard coded places
//import * as places  from './places';

class App extends Component {

  state = {
    //store locations from four aquare api
    places: [],
    // markers and info window handeler
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    // search input query
    query: '',
    // error handlers
    gMapError: false,
    fourSqrError: false
  }

  componentDidMount() {
    //this.setState({ places })
    //updatethe places state 
    this.fetch4sqr();
    // Google maps api error handler
    window.gm_authFailure = () => {
      //alert('Google maps loading failed');
      this.setState({ gMapError: true })
    };
  }
  /*fetching places data from Foursquare API and convert to
   json fromat to update places state if there isn't any errors
  */
  fetch4sqr = () => {
    let longURL = 'https://api.foursquare.com/v2/venues/search?ll=30.102737,31.386386&query=cafe&limit=8&client_id=EZJTGK5PUBSHU4IE5D35DJC0VVPQLLWYK13DWYH2WUFCV2WG&client_secret=5CGW1M3HKQ0WYHACNLOZZYMXP5VKR3UDKU2BT2LSEK2UZHTJ&v=20180803';

    fetch(longURL)
      .then(response => {
        if (!response.ok) {
          throw Error(response.status)
        } else {
          return response.json();
        }
      }).then(places => {
        this.setState({ places: places.response.venues });
      }).catch(error => {
        this.setState({ fourSqrError: true })
        console.log(`four square error ${error}`)
        alert("Faiiled to get locations data, please try again")
      })
    }
  // to open the info window when the marker is clicked
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  /*
  create markers array to collect markers data to be used by
  list items of the sidemenu to trigger the infoWindow
  click event of the corresponding marker on the map.
  
  Inspired from: https://stackoverflow.com/questions/35610873/google-maps-with-responsive-sidebar
  */

  markers = [];
  //function to add the markers data to the array
  grabMarkersinfo = (marker) => {

    if (marker !== null) {
      this.markers.push(marker)
    }
    console.log(this.markers);
  }
  //function to open the corresponding info window
  connectLiToMarker = (place) => {
    this.markers.filter(m => {
      if (m.props.id === place.id) {
        return new m.props.google.maps.event.trigger(m.marker, 'click')
      }
    })
  }
  //to close the infowindow if the user clicked on the map
  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  // to update query stat depending on search input value
  updateQuery = (query) => {
    this.setState({ query })
  }

  render() {

    const { places, activeMarker, showingInfoWindow, selectedPlace, query, fourSqrError, gMapError } = this.state;

    //To filter the places list as i learned from the course
    let showingPlaces;
    if (query.trim() !== '') {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingPlaces = places.filter((place) => match.test(place.name));
      // if the their is no matching place empty the list
      if (match.length === 0) {
        showingPlaces = [];
      }
      // if the query is empty show the full list
    } else {
      showingPlaces = places;
    }
    // sort the places by name
    showingPlaces.sort(sortBy('name'))

    console.log(places);

    return (
      <div className="App">

        <Header />
        <Menu
          places={showingPlaces}
          onMarkerClick={this.onMarkerClick}
          activeMarker={activeMarker}
          showingInfoWindow={showingInfoWindow}
          connectLiToMarker={this.connectLiToMarker}
          query={query}
          updateQuery={this.updateQuery}
          fetchError={fourSqrError}
        />
        {!gMapError ?
          <MapComponent

            places={showingPlaces}
            onMapClicked={this.onMapClicked}
            onMarkerClick={this.onMarkerClick}
            activeMarker={activeMarker}
            showingInfoWindow={showingInfoWindow}
            selectedPlaces={selectedPlace}
            grabMarkersinfo={this.grabMarkersinfo}
            fetchError={fourSqrError}
          />
          : <h1 className="gmerror">Google maps loading failed</h1>
        }
      </div>
    );
  }
}

export default App;
