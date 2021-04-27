import React from 'react'
import AppContext from './context'
import App from '../main/App'
import { Auth, Hub } from 'aws-amplify';
import { listDepartments } from '../graphql/queries';
import { API } from 'aws-amplify'



/** The context provider for our app */
export default class AppProvider extends React.Component {
    state = { user: null, customState: null };

    componentDidMount() {
      Hub.listen("auth", ({ payload: { event, data } }) => {
        switch (event) {
          case "signIn":
            this.setState({ user: data });
            break;
          case "signOut":
            this.setState({ user: null });
            break;
          case "customOAuthState":
            this.setState({ customState: data });
        }
      });
  
      Auth.currentAuthenticatedUser()
        .then(user => this.setState({ user }))
        .catch(() => console.log("Not signed in"));
    }

    render() {
        return (
            <AppContext.Provider value={{...this.state}}>
                <App />
            </AppContext.Provider>
        )
    }

    // async componentDidMount() {
    //     Auth.currentAuthenticatedUser({
    //         bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    //     }).then (user => {
    //         this.setState({
    //             userid: user.attributes.sub,
    //             useremail: user.attributes.email
    //         })
    //     }).catch(err => console.log(err));
    // }

}
