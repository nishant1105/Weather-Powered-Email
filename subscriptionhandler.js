const MongoDBClient = require('mongodb').MongoClient;
const nodemailer = require('nodemailer');

const WeatherService = require('./weatherservice');
const EmailHandler = require('./emailhandler');
class SubscriptionHandler {
	constructor () {
		this.weatherservice = new WeatherService();
		this.localDBURL = 'mongodb://localhost:27017/weatherAppDB';
	}

	addUserAccount (data) {
		return MongoDBClient
		.connect(this.localDBURL)
		.then(db => {
			var collection = db.collection('users');
			return collection
			.findOne({"emailID": data.emailID})
			.then(account => {
				if (account) throw new Error('Account already exists!');
			})
			.then(() => {
				return collection.insertOne(data);
			});		
		})
	}

	getUserAccountByEmail (email) {
		return MongoDBClient
		.connect(this.localDBURL)
		.then(db => {
			var collection =  db.collection('users');
			return collection.findOne({"emailID": email})
			.then(account => {
				if (account) {
					this.composeEmail(account);
				}
			});
		});
	}

	composeEmail (account) {
		var userLocation = account.locationID;
		this.weatherservice.getTempByLocation(userLocation, localWeather => {
			this._sendEmail(account, localWeather);
		});
	}

	_sendEmail (userData, localWeather) {
		var isNice = false;
		var isNotSoNice = false;
		if (localWeather[0].currCondition.toLowerCase() === 'sunny' ||
			localWeather[0].currTemp >= localWeather[1].avgHighTemp + 5) {
			isNice = true;
		}
		if (localWeather[0].currCondition.toLowerCase() === 'overcast' ||
			localWeather[0].currTemp <= localWeather[1].avgLowTemp - 5) {
			isNotSoNice = true;
		}
		var emailSub = "Enjoy a discount on us."
		if (isNice) {
			emailSub = "It's nice out! Enjoy a discount on us.";
		}
		if (isNotSoNice) {
			emailSub = "Not so nice out? That's okay, enjoy a discount on us." 
		}

		var emailText = "Current temperature in " + 
						userData.locationID + ": " + localWeather[0].currTemp + "F, " + 
						localWeather[0].currCondition;
		var emailHandler = new EmailHandler();
		emailHandler.setEmailOpts(userData.emailID, emailSub, emailText);
		emailHandler.sendEmail();
	}
}

module.exports = SubscriptionHandler;