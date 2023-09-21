import React, { useState } from 'react';
import { Button, Alert } from 'react-native';
import { authorize } from 'react-native-app-auth';

const config = {
  clientId: '23RD74',
  clientSecret: '35dfb9bceab400061315f1168074db7e',
  redirectUrl: 'com.cross_platform_health_app://callback',
  issuer: 'https://www.fitbit.com',
  scopes: ['profile'], // You can request the scopes you need
  serviceConfiguration: {
    authorizationEndpoint: 'https://www.fitbit.com/oauth2/authorize',
    tokenEndpoint: 'https://api.fitbit.com/oauth2/token',
  },
};

const FitbitDataComponent = () => {
  const [accessToken, setAccessToken] = useState(null);

  const importFitbitData = async () => {
    try {
      const authState = await authorize(config);
      setAccessToken(authState.accessToken);
      // Fetch Fitbit data here
      const response = await fetch('https://api.fitbit.com/1/user/-/profile.json', {
        headers: {
          Authorization: `Bearer ${authState.accessToken}`
        }
      });
      const data = await response.json();
      console.log(data);

    } catch (error) {
      Alert.alert('Error', 'There was an error during authentication.');
    }
  };

  return (
    <Button
      title="Import Fitbit Data"
      onPress={importFitbitData}
    />
  );
};

export default FitbitDataComponent;



// import { Component } from 'react';
// import { Linking, TouchableOpacity, Text, StyleSheet } from 'react-native';

// const CLIENT_ID = "23RD74";
// const CLIENT_SECRET = "35dfb9bceab400061315f1168074db7e";
// const REDIRECT_URI = "cross_platform_app_demo://callback";
// const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=heartrate+activity+nutrition+profile+sleep`;

// class FitbitDataComponent extends Component {
//     state = {
//         accessToken: null,
//         refreshToken: null
//     };

//     handleOpenURL = (event) => {
//         let code = /code=([^&]*)/.exec(event.url);
//         if (code && code[1]) {
//             this.exchangeCodeForToken(code[1]);
//         } else {
//             console.error("Authorization code not found in the callback URL:", event.url);
//         }
//     };

//     exchangeCodeForToken = (code) => {
//         let auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//         fetch('https://api.fitbit.com/oauth2/token', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: `client_id=${CLIENT_ID}&grant_type=authorization_code&redirect_uri=${REDIRECT_URI}&code=${code}`
//         })
//         .then(response => response.json())
//         .then(data => {
//             if (data.access_token && data.refresh_token) {
//                 this.setState({
//                     accessToken: data.access_token,
//                     refreshToken: data.refresh_token
//                 });
//             } else {
//                 console.error("Failed to fetch access and refresh tokens:", data);
//             }
//         })
//         .catch(error => {
//             console.error('Error fetching Fitbit tokens:', error);
//         });
//     };

//     componentDidMount() {
//         Linking.addListener('url', this.handleOpenURL);
//     }

//     componentWillUnmount() {
//         Linking.removeListener('url', this.handleOpenURL);
//     }

//     startAuth = () => {
//         Linking.openURL(AUTH_URL);
//     };

//     fetchFitbitData = () => {
//         if (!this.state.accessToken) return;
//         fetch('https://api.fitbit.com/1/user/-/profile.json', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${this.state.accessToken}`
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => {
//             if (error.message.includes('401')) {
//                 // Handle token expiration
//                 this.refreshAccessToken();
//             } else {
//                 console.error('Error fetching Fitbit data:', error);
//             }
//         });
//     };

//     refreshAccessToken = () => {
//         let auth = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
//         fetch('https://api.fitbit.com/oauth2/token', {
//             method: 'POST',
//             headers: {
//                 'Authorization': `Basic ${auth}`,
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: `grant_type=refresh_token&refresh_token=${this.state.refreshToken}`
//         })
//         .then(response => response.json())
//         .then(data => {
//             this.setState({
//                 accessToken: data.access_token,
//                 refreshToken: data.refresh_token
//             });
//             this.fetchFitbitData();
//         })
//         .catch(error => {
//             console.error('Error refreshing Fitbit access token:', error);
//         });
//     };

//     render() {
//         return (
//             <TouchableOpacity style={styles.button} onPress={this.startAuth}>
//                 <Text style={styles.buttonText}>Import from Fitbit</Text>
//             </TouchableOpacity>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     button: {
//         backgroundColor: '#00B0B9', 
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontWeight: 'bold'
//     }
// });

// export default FitbitDataComponent;


// import {Component} from 'react';
// import {Linking, TouchableOpacity, Text, StyleSheet} from 'react-native';

// const CLIENT_ID = "23RD74";
// const CLIENT_SECRET = "35dfb9bceab400061315f1168074db7e";
// const REDIRECT_URI = "cross_platform_app_demo://callback";
// const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=heartrate+activity+nutrition+profile+sleep`;
// const TOKEN_URL = "https://api.fitbit.com/oauth2/token";

// class FitbitDataComponent extends Component {
//     state = {
//         accessToken: null,
//         refreshToken: null,
//         expiresIn: null
//     };

//     handleOpenURL = (event) => {
//         let code = /code=([^&]*)/.exec(event.url);
//         if (code && code[1]) {
//             this.exchangeCodeForToken(code[1]);
//         } else {
//             console.error("Code not found in the callback URL:", event.url);
//         }
//     };

//     componentDidMount() {
//         Linking.addListener('url', this.handleOpenURL)
//     }

//     componentWillUnmount() {
//         Linking.removeListener('url', this.handleOpenURL);
//     }

//     startAuth = () => {
//         Linking.openURL(AUTH_URL);
//     };

//     exchangeCodeForToken = (code) => {
//         const details = {
//             grant_type: "authorization_code",
//             client_id: CLIENT_ID,
//             redirect_uri: REDIRECT_URI,
//             code: code,
//             client_secret: CLIENT_SECRET
//         };

//         const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

//         fetch(TOKEN_URL, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/x-www-form-urlencoded'
//             },
//             body: formBody
//         })
//         .then(response => response.json())
//         .then(data => {
//             this.setState({
//                 accessToken: data.access_token,
//                 refreshToken: data.refresh_token,
//                 expiresIn: Date.now() + (data.expires_in * 1000000) // Date.now() gives time in ms, so we multiply the expiresIn value by 1000
//             });
//         })
//         .catch(error => {
//             console.error('Error exchanging code for token:', error);
//         });
//     };

//     refreshTokenIfNeeded = () => {
//         if (Date.now() > this.state.expiresIn) {
//             const details = {
//                 grant_type: "refresh_token",
//                 refresh_token: this.state.refreshToken,
//                 client_id: CLIENT_ID,
//                 client_secret: CLIENT_SECRET
//             };

//             const formBody = Object.keys(details).map(key => encodeURIComponent(key) + '=' + encodeURIComponent(details[key])).join('&');

//             fetch(TOKEN_URL, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded'
//                 },
//                 body: formBody
//             })
//             .then(response => response.json())
//             .then(data => {
//                 this.setState({
//                     accessToken: data.access_token,
//                     refreshToken: data.refresh_token,
//                     expiresIn: Date.now() + (data.expires_in * 1000)
//                 });
//             })
//             .catch(error => {
//                 console.error('Error refreshing the token:', error);
//             });
//         }
//     };

//     fetchFitbitData = () => {
//         this.refreshTokenIfNeeded();

//         if (!this.state.accessToken) return;

//         fetch('https://api.fitbit.com/1/user/-/profile.json', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${this.state.accessToken}`
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);
//         })
//         .catch(error => {
//             console.error('Error fetching Fitbit data:', error);
//         });
//     };

//     render() {
//         return (
//             <TouchableOpacity style={styles.button} onPress={this.startAuth}>
//                 <Text style={styles.buttonText}>Import from Fitbit</Text>
//             </TouchableOpacity>
//         );
//     }
// }

// const styles = StyleSheet.create({
//     button: {
//         backgroundColor: '#00B0B9', 
//         padding: 15,
//         borderRadius: 5,
//         alignItems: 'center',
//     },
//     buttonText: {
//         color: 'white',
//         fontWeight: 'bold'
//     }
// });

// export default FitbitDataComponent;


// const CLIENT_ID = "23RD74";
// const REDIRECT_URI = "cross_platform_app_demo://callback";
// const AUTH_URL = `https://www.fitbit.com/oauth2/authorize?response_type=token&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=heartrate+activity+nutrition+profile+sleep`;

// class FitbitDataComponent extends Component {
//     state = {
//         accessToken: null
//     };

//     handleOpenURL = (event) => {
//         // extract the access token from the callback URL
//         let token = /#access_token=([^&]*)/.exec(event.url);
//         if (token && token[1]) {
//             this.setState({accessToken: token[1]});
//             this.fetchFitbitData();
//         }else {
//             console.error("Token not found in the callback URL:", event.url);
//         }
//     };

//     componentDidMount() {
//         Linking.addListener('url', this.handleOpenURL)
//     }

//     componentWillUnmount() {
//         Linking.removeListener('url', this.handleOpenURL);
//     }

//     startAuth = () => {
//         Linking.openURL(AUTH_URL);
//     };

//     fetchFitbitData = () => {
//         if (!this.state.accessToken) return;
//         // Fetch user profile data using the access token
//         fetch('https://api.fitbit.com/1/user/-/profile.json', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Bearer ${this.state.accessToken}`
//             }
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log(data);  // You can store this data in your component state or process it as required.
//         })
//         .catch(error => {
//             console.error('Error fetching Fitbit data:', error);
//         });
//     };

//     render() {
//         // Render the Fitbit button/data here
//         return (
//             <TouchableOpacity onPress={this.startAuth}>
//                 <Text>Import from Fitbit</Text>
//             </TouchableOpacity>
//         );
//     }
// }

// export default FitbitDataComponent;