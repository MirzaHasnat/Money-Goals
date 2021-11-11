import React,{useState} from 'react';
import { Button, Form, Input,Row,Col } from 'antd';
import { UserOutlined, KeyOutlined, MessageOutlined } from '@ant-design/icons';
import Auth from './Auth';


function Signup() {
    let [btnloading, setBtnloading] = useState(false);
    
    function signup(data) {
        setBtnloading(true);

        Auth.signup(data,()=>{},()=>{setBtnloading(false)})
    }

  return (
    <Row justify="center" align="middle" style={{height:"max-content"}}>
        <Col span={8}>
        <Form 
        labelCol={{span:8}}
        wrapperCol={{span:16}}
        initialValues={{remember:true}}
        autoComplete="off"
        onFinish={signup}
        >
            <h1 align="center">Sign Up</h1>
            <Form.Item
                label="Username"
                name="username"
                rules={[{ required: true, message: 'Please input your username!' }]}
            >
                <Input placeholder="Username" prefix={<UserOutlined/>}/>
            </Form.Item>

            <Form.Item
                label="Email"
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
            >
                <Input placeholder="Email" prefix={<MessageOutlined/>}/>
            </Form.Item>

            <Form.Item
                label="Password"
                name="password"
                rules={[{ required: true, message: 'Please input your password!' }]}
            >
                <Input.Password placeholder="Password" prefix={<KeyOutlined/>} />
            </Form.Item>

            <Form.Item wrapperCol={{span:5,offset:19}}>
                <Button type="primary" htmlType="submit" loading={btnloading}>Sign Up</Button>
            </Form.Item>

        </Form>
        </Col>
    </Row>
  );
}

export default Signup;
