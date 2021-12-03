/**
 * @format
 */

import { AppRegistry } from 'react-native'
import App from './App'
import { name as appName } from './app.json'
import Amplify from 'aws-amplify'
import config from './src/config/aws-exports'

Amplify.configure(config)

AppRegistry.registerComponent(appName, () => App)
