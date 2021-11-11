import React from 'react';
import { Form, Input, Button } from 'antd';


function AddMoneyForm(){
    return(
    <Form labelCol={{span:5}}>
        <Form.Item label="Amount" id="goalname" rules={{required:true,message:"Please Enter The Amount"}}>
            <Input placeholder="Enter The Amount" />
        </Form.Item>

        <Form.Item label="Narration" id="goalamount">
            <Input placeholder="Any Description For Amount" />
        </Form.Item>
        
        <Form.Item wrapperCol={{span:16,offset:18}}>
            <Button type="primary" htmlType="submit" >Add Amount</Button>
        </Form.Item>
    </Form>
    )
}

export default AddMoneyForm;