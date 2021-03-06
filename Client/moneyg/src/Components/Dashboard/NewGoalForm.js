import React,{useState} from 'react';
import { Form, Input, Button, DatePicker, message, InputNumber } from 'antd';
import Apis from '../Apis';


function NewGoalForm(){
    let [btnloading, setBtnloading] = useState(false);
    window.onload = function(){
        message.error('Error');
    }
    let addNewGoal = (data)=>{
        setBtnloading(true);
        let request = new Apis("goals","POST",data)

        request.send().then((data)=>{
            setBtnloading(false);
        })

    }
    return(
    <Form 
        labelCol={{span:8}} 
        onFinish={addNewGoal}
        initialValues={{remember:true}}
        autoComplete="off"
        >
        <Form.Item label="Goal Name" name="goalname" rules={[{required:true,message:"Please Enter Goal Name"}]}>
            <Input placeholder="Enter Goal Name" />
        </Form.Item>

        <Form.Item label="Goal Amount" name="goalamount" rules={[{required:true,message:"Please Enter Goal Amount"}]}>
            <Input placeholder="Enter Goal Amount" />
        </Form.Item>

        <Form.Item label="Date Range" name="goaldate" rules={[{required:true,message:"Please Enter Date Range"}]}>
            <DatePicker.RangePicker/>
        </Form.Item>
        
        <Form.Item label="Goal Initial Amount" name="inamount">
            <InputNumber placeholder="Enter Goal Initial Amount" />
        </Form.Item>
        
        <Form.Item wrapperCol={{span:16,offset:19}}>
            <Button type="primary" htmlType="submit" loading={btnloading} >Add Goal</Button>
        </Form.Item>
    </Form>
    )
}

export default NewGoalForm;