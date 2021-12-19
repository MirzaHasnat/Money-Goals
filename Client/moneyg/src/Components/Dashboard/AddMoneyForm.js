import React, {useState} from 'react';
import { Form, Input, Button, InputNumber } from 'antd';
import Apis from '../Apis';


function AddMoneyForm(props){
    let [btnloading, setBtnloading] = useState(false);

    let addEntry = (data)=>{
        setBtnloading(true);
        let goalid = props.goalid;
        
        let request = new Apis("goals/"+goalid+"/entries","POST",data)
        
        request.send().then((data)=>{
            setBtnloading(false);
        })
    }


    return(
        <Form 
        labelCol={{span:5}} 
        initialValues={{remember:true}} 
        onFinish={addEntry}
        autoComplete="off"
        >
            <Form.Item label="Amount" name="entryamount">
                <InputNumber placeholder="Enter The Amount" />
            </Form.Item>

            <Form.Item label="Narration" name="entrydes">
                <Input placeholder="Any Description For Amount" />
            </Form.Item>
            
            <Form.Item wrapperCol={{span:16,offset:18}}>
                <Button type="primary" htmlType="submit" loading={btnloading}>Add Amount</Button>
            </Form.Item>
        </Form>
    )
}

export default AddMoneyForm;