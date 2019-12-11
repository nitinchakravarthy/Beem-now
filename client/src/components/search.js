// Imports
import React, { Component } from 'react';

// Import Search Bar Components
import SearchBar from 'material-ui-search-bar';
//import AutoComplete from '@material-ui/lab/AutoComplete';
//Import React Scrit Libraray to load Google object
import Script from 'react-load-script';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class Search extends Component {

  // Define Constructor
  constructor(props) {
    super(props);

    // Declare State
    this.state = {
      city: '',
      query: ''
    };

  }
  handleScriptLoad = () => {
      console.log("asdasd");
    // Declare Options For Autocomplete
    const options = { types: ['(cities)'] };

    // Initialize Google Autocomplete
    /*global google*/
    this.autocomplete = new google.maps.places.Autocomplete(
                          document.getElementById('autocomplete'),
                          options );
    // Avoid paying for data that you don't need by restricting the
    // set of place fields that are returned to just the address
    // components and formatted address
    this.autocomplete.setFields(['address_components',
                                 'formatted_address']);
    // Fire Event when a suggested name is selected
    this.autocomplete.addListener('place_changed',
                                  this.handlePlaceSelect);
  }
  handlePlaceSelect = () => {

    // Extract City From Address Object
    const addressObject = this.autocomplete.getPlace();
    const address = addressObject.address_components;

    // Check if address is valid
    if (address) {
      // Set State
      this.setState(
        {
          city: address[0].long_name,
          query: addressObject.formatted_address,
        }
      );
    }
  }

  render() {
    return (
      <div>
      <h1> asd </h1>
      <MuiThemeProvider>
      <Script url="https://maps.googleapis.com/maps/api/js?key=AIzaSyDiKUxbXwZefVUFx5tmBzRld0isGAhdInU
      &libraries=places"
      onLoad={this.handleScriptLoad}  />
        <SearchBar id="autocomplete" placeholder="" hintText="Search City" value={this.state.query}
          style={{
            margin: '0 auto',
            maxWidth: 800,
          }}
        />
         </MuiThemeProvider>
      </div>

    );
  }
}

export default Search;
