import React, { Component } from 'react';
import * as cafes  from './cafes';
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
//the hard coded cafes


class App extends Component {

  state = {
    //store locations from four aquare api
    cafes: [],
    // markers and info window handeler
    showingInfoWindow: false,
    activeMarker: {},
    selectedCafe: {},
    // search input query
    query: '',
    // error handlers
    gMapError: false,
    fourSqrError: false
  }

  componentDidMount() {
    //this.setState({ cafes })
    //updatethe cafes state 
    this.fetch4sqr();
    // Google maps api error handler
    window.gm_authFailure = () => {
      //alert('Google maps loading failed');
      this.setState({ gMapError: true })
    };
  }
  /*fetching cafes data from Foursquare API and convert to
   json fromat to update cafes state if there isn't any errors
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
      }).then(cafes => {
        this.setState({ cafes: cafes.response.venues });
      }).catch(error => {
        this.setState({ fourSqrError: true })
        alert("failed to get locations data, please try again")
      })
    }
  // to open the info window when the marker is clicked
  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedCafe: props,
      activeMarker: marker,
      showingInfoWindow: true
    });

  /*
  creating markers array 
  
  Inspired from: https://stackoverflow.com/questions/35610873/google-maps-with-responsive-sidebar
  */

  markers = [];
  //function to add the markers data to the array
  grabMarkersinfo = (marker) => {

    if (marker !== null) {
      this.markers.push(marker)
    }
  }
  //function to open the corresponding info window
  connectLiToMarker = (cafe) => {
    this.markers.filter(m => {
      if (m.props.id === cafe.id) {
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

    const { cafes, activeMarker, showingInfoWindow, selectedCafe, query, fourSqrError, gMapError } = this.state;

    //To filter the cafes list as i learned from the course
    let showingCafes;
    if (query.trim() !== '') {
      const match = new RegExp(escapeRegExp(query), 'i');
      showingCafes = cafes.filter((cafe) => match.test(cafe.name));
      // if the their is no matching cafe empty the list
      if (match.length === 0) {
        showingCafes = [];
      }
      // if the query is empty show the full list
    } else {
      showingCafes = cafes;
    }
    // sort the cafes by name
    showingCafes.sort(sortBy('name'))

    
    return (
      <div className="App">

        <Header />
        <Menu
          cafes={showingCafes}
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

            cafes={showingCafes}
            onMapClicked={this.onMapClicked}
            onMarkerClick={this.onMarkerClick}
            activeMarker={activeMarker}
            showingInfoWindow={showingInfoWindow}
            selectedCafes={selectedCafe}
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
