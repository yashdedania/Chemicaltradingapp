import {createStackNavigator} from 'react-navigation';
import UserAuthorization from './UserAuthorization';


const routes = {
	UserAuthorization:UserAuthorization
};
const routeconfig = {
	initialRouteName:"UserAuthorization",
	resetOnBlur: true,
	navigationOptions: ({ navigation }) => ({
		headerMode : 'none',
		header:null	
	})
}

export default createStackNavigator(routes,routeconfig);