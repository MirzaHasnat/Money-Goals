import React,{useEffect, useState} from 'react';
import {  Button, Form, Input,Row,Col, message } from 'antd';
import { UserOutlined, KeyOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import Auth from './Auth'


function Login(props) {
    let [btnloading,setbtnloadin] = useState(false)
    let history = useNavigate();
    async function login(data){
        setbtnloadin(true)
        const islogged =  await Auth.login(data,()=>{
                history("/")
            },()=>{
                setbtnloadin(false)
            })
        console.log(islogged)
    }

    // check if the user is already logged in
    useEffect(()=>{    
        if(window.localStorage.getItem("isAuthorized") && window.localStorage.getItem("token")){
            message.info("You are already logged in")
            history('/')
        }
    })

  return (
    <Row justify="center" align="middle" style={{height:"max-content"}}>
        <Col span={8}>
        <Form 
        labelCol={{span:8}}
        onFinish={login}
        initialValues={{remember:true}}>
            <h1 align="center">Login</h1>
            
            <Form.Item label="Username" name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input placeholder="Username" prefix={<UserOutlined/>}/>
            </Form.Item>

            <Form.Item label="Password" name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password placeholder="Password" prefix={<KeyOutlined/>} />
            </Form.Item>

            <Form.Item wrapperCol={{span:16,offset:20}}>
                <Button type="primary" htmlType="submit" loading={btnloading}>Login</Button>
            </Form.Item>
        </Form>
        </Col>
    </Row>
  );
}

export default Login;
