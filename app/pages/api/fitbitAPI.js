const axios = require('axios');
import { setCookie, getCookie } from 'cookies-next';
import { stringify } from 'querystring';
const { Api, ApiScope } = require('fitbit-api-handler');

const api = new Api(process.env.NEXT_PUBLIC_FITBIT_CLIENT_ID, process.env.FITBIT_CLIENT_SECRET);
const returnURL = "http://localhost:3001/api/fitbitAPI";
const today = new Date();
const date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

export default async function fitbitAPI(req, res) {

//Request for getting current day steps data

if(getCookie('access_token', { req, res })){

    const result = await axios(
        {
          method:"GET",
          url: "https://api.fitbit.com/1/user/-/activities/date/"+ date +".json", 
          headers: {
            Authorization: "Bearer " + getCookie('access_token', { req, res }),
            accept: "application/json"
          },
           
        })
        .then((response) => {
    
          // console.log(response.data);
          // console.log(response.status);
          // setCookie('lastsync', String(date), { req, res, maxAge: 60 * 60 * 24 * 30 });
    
          return response.data;
        });
        
        // console.log("Steps: ",stringify(result.summary.steps));
        
        //Redirect to homepage with url data which has daily step count in it

        res.redirect("/?steps=" + stringify(result.summary.steps));
        
    }else if(!getCookie('access_token', { req, res }) && getCookie('refresh_token', { req, res })){
    
        //Code for refreshing the access token

        const token = await api.extendAccessToken(getCookie('refresh_token', { req, res }));

        setCookie('access_token', String(token.access_token), { req, res, maxAge: 60 * 1 }); //max age 1 minute
        setCookie('refresh_token', String(token.refresh_token), { req, res, maxAge: 60 * 60 * 24 * 7}); //max age 7 days or 1 week
    
        //Refresh the same page to rerun the logic
        res.redirect("./fitbitAPI");
    } else {
        //Getting the auth code from url

        const { code } = req.query;
        // console.log("Code from url:", code);

        //Getting access token
  
        console.log(api.getLoginUrl(returnURL, [ApiScope.ACTIVITY]));
        const token = await api.requestAccessToken(code, returnURL);
        api.setAccessToken(token.access_token);

        //Setting access token to cookies

        setCookie('access_token', String(token.access_token), { req, res, maxAge: 60 * 60 * 24 });
        setCookie('refresh_token', String(token.refresh_token), { req, res, maxAge: 60 * 60 * 24 * 7});

        // console.log(String(token.access_token));
        // console.log(String(token.refresh_token));

        //Refresh the same page to rerun the logic
        res.redirect("./fitbitAPI?");    
        }
}