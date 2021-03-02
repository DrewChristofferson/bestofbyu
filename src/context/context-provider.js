import React from 'react'
import AppContext from './context'
import App from '../main/App'
import { Auth } from 'aws-amplify';

/** The context provider for our app */
export default class AppProvider extends React.Component {

    constructor(props) {
        super(props)
        this.actions = {
        }
        this.state = {
            userid: '',
            useremail: ''
        }

    }

    render() {
        return (
            <AppContext.Provider value={{...this.state, ...this.actions}}>
                <App />
            </AppContext.Provider>
        )
    }

    async componentDidMount() {
        Auth.currentAuthenticatedUser({
            bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
        }).then (user => {
            this.setState({
                userid: user.attributes.sub,
                useremail: user.attributes.email
            })
        }).catch(err => console.log(err));
    }

}
