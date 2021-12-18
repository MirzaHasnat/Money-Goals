import {message} from 'antd';
class API{

    constructor(api_path,method,data){
        this.API_URL = "http://localhost:3001/"+api_path;
        this.method = method;
        this.data = data;

    }

    // send request to api according to variables uisng async and await
    async send(){
        const response = await fetch(this.API_URL,{
            method:this.method,
            headers:{"token":localStorage.getItem("token"),"Content-Type":"application/json"},
            body: this.method !== "GET" ? JSON.stringify(this.data) : null,
        });
        const data = await response.json();
        this.generateNotification(data);
        return data;
    }


    // create a function with 1 parameter data to generate notification using message antd
    // data is an object with 2 properties
    // 1. status: true or false
    // 2. message: string
    generateNotification(data){
        if((data.message).length>0){

            if(data.status){
                message.success(data.message);
            }else{
                message.error(data.message);
            }

        }
    } 


}

export default API;