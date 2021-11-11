import {message} from 'antd';

class Auth {
    constructor () {
        this.isAuthorized = window.localStorage.getItem('isAuthorized')?true: false;
        this.token = window.localStorage.getItem('token') || '';
        this.apiurl = 'http://localhost:3001/';
    }

    async login (data,issuccess,cb) {
        // fetch user from server and set isAuthorized to true
        let key = "updateable"
        message.loading({content:'Authorizing..',key});
        fetch(this.apiurl+'auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email: data.username,
                password:data.password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                res.json().then(res => {
                    if(res.status){
                        window.localStorage.setItem('isAuthorized', true);
                        window.localStorage.setItem('token', res.data.token);
                        message.success({content:'Login Successful',key});
                        issuccess()
                        return true
                    }else{
                        message.error({content:'User Not Founds',key});
                    }
                });
            } else {
                message.error('Something Went Wrong');
            }

            // callback
            cb()
        }).catch(err => {
            message.error(err.message);

            // callback
            cb()
        });
    }    

async signup (data,issuccess,cb) {
        // fetch user from server and set isAuthorized to true
        let key = "updateable"
        message.loading({content:'Sending Data to the Server...',key});
        fetch(this.apiurl+'auth/register', {
            method: 'POST',
            body: JSON.stringify({
                username: data.username,
                email: data.email,
                password:data.password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => {
            if (res.status === 200) {
                res.json().then(res => {
                    if(res.status){
                        message.success({content:'Registeration Complete',key});

                        // callback if success
                        issuccess()
                    }else{
                        message.error({content:'This User With Same Email Is Already Exist. Please Try Another one.',key});
                    }
                });
            } else {
                message.error('Something Went Wrong');
            }

            // callback
            cb()
        }).catch(err => {
            message.error(err.message);
            
            // callback
            cb()
        });
    }

    isAuthed() {
        return this.isAuthorized;
    }
}

export default new Auth();