import React , { Component }from 'react';
import Root from './src';
import store from './store';
import {Provider} from "react-redux";
import { Asset, AppLoading, SplashScreen,Font } from 'expo';
import {View,Image,ImageBackground} from 'react-native';
class App extends Component {
		constructor() {
		    super();
		    this.state = {
					isReady: false,
					isSplashReady: false,
		    };
			}
			
	  componentDidMount() {
	    
		}
		_cacheSplashResourcesAsync = async () => {
			const gif = [
				require('./assets/Splash.gif'),
				require('./assets/bg.png'),
			];
			return Asset.fromModule(gif).downloadAsync();
			
		}
	  async loadFonts() {
			console.log("Preventing Splash Screen");
			this.setState({ isSplashReady: true })
			SplashScreen.preventAutoHide();
	    await Font.loadAsync({
	      Roboto: require("native-base/Fonts/Roboto.ttf"),
	      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
				Ionicons: require('@expo/vector-icons/fonts/Ionicons.ttf'),
				Raleway_bold: require('./assets/fonts/Raleway-Bold.ttf'),
				Raleway_medium: require('./assets/fonts/Raleway-Medium.ttf'),
				Raleway_semibold: require('./assets/fonts/Raleway-Medium.ttf'),
				Raleway_regular: require('./assets/fonts/Raleway-Regular.ttf'),
				Raleway_SemiBold: require('./assets/fonts/Raleway-SemiBold.ttf'),
			});
			console.log("before timer");
			setTimeout(() => {
				console.log("In timer");
				this.setState({ isReady: true });	
				SplashScreen.hide();
			}, 30)
			//3000
			console.log("Font State changed");
	  }

	  

	
	render() {
		if(!this.state.isSplashReady){
			return(
				<AppLoading
          startAsync={this._cacheSplashResourcesAsync}
          onFinish={() => this.loadFonts()}
          onError={console.warn}
          autoHideSplash={false}
        />
			)
		}
		if (!this.state.isReady) {
      		return (
						<ImageBackground source={require('./assets/bg.png')} style={{flex:1,justifyContent:'center',alignItems:'center'}}>
							<Image source={require('./assets/Splash.gif')} style={{width:'100%',height:'50%'}} />
						</ImageBackground>
					);
    	}
    else{ 
    		return (
    			<Provider store={store}>
    				<Root />
    			</Provider>
    		);
    }
   
  }
}

export default App;