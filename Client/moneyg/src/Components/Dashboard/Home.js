import React,{useState} from 'react';
import {Button,Card,Divider, Progress, Row, Col, Popconfirm, Drawer} from 'antd';
import {DeleteFilled, PlusCircleFilled} from '@ant-design/icons';
import NewGoalForm from './NewGoalForm';
import AddMoneyForm from './AddMoneyForm';

function Home() {
    let [btnloading,setBtnloading] = useState(false);
    let [drawer,setdrawer] = useState(false);
    let [drawerTitle,setdrawerTitle] = useState('');
    let [whichdrawer,setwhichdrawer] = useState('')

  return (
    <>  
        <div align="right" style={{margin:"10px 0"}}>
            <Button type="primary" icon={<PlusCircleFilled/>} loading={btnloading} onClick={()=>{setBtnloading(true);setdrawer(true);setdrawerTitle("Add New Goal");setwhichdrawer("SETGOAL")}}>Add New Goal</Button>
        </div>

        <Divider>Goals To Compelete</Divider>

        <Row gutter={30}>
            <Col span={8}>
                    <Card bordered={true} title="Buy a Laptop" size="small" width="400" extra={
                        <>  
                            <Popconfirm title="Are You Sure You Want To Delet This?" onConfirm={()=>{setBtnloading(false)}} okText="Yes" cancelText="No">
                                <Button type="dashed" danger prefix={<DeleteFilled/>}>Delete</Button>
                            </Popconfirm>
                            <Button type="dashed" primary onClick={()=>{setdrawer(true);setdrawerTitle("Add Money");setwhichdrawer("ADDMONEY")}}>Add Money</Button>
                        </>
                        }>
                        <div align="center">
                            <h4 align="center">Goal Amount: $1,000</h4>
                            <Progress percent={50}  status="active" type="dashboard" />
                            <p align="center">1000/500</p>
                        </div>
                    </Card>
            </Col>

            <Col span={8}>
                    <Card bordered={true} title="Buy a Car" size="small" width="400" extra={
                        <>
                            <Button type="dashed" danger prefix={<DeleteFilled/>}>Delete</Button>
                            <Button type="dashed" primary >Add Money</Button>
                        </>
                        }>
                        <div align="center">
                            <h4 align="center">Goal Amount: $1,0300</h4>
                            <Progress percent={50}  status="active" type="dashboard" />
                            <p align="center">121312000/500</p>
                        </div>
                    </Card>
            </Col>

            <Col span={8}>
                    <Card bordered={true} title="Buy a Laptop" size="small" width="400" extra={
                        <>
                            <Button type="dashed" danger prefix={<DeleteFilled/>}>Delete</Button>
                            <Button type="dashed" primary >Add Money</Button>
                        </>
                        }>
                        <div align="center">
                            <h4 align="center">Goal Amount: $1,000</h4>
                            <Progress percent={100} type="dashboard" />
                            <p align="center">Completed</p>
                        </div>
                    </Card>
            </Col>
        </Row>
        <Drawer title={drawerTitle} width={500} onClose={()=>{setBtnloading(false);setdrawer(false)}} visible={drawer}  size="medium">
            {whichdrawer==="SETGOAL" && <NewGoalForm/>}
            {whichdrawer==="ADDMONEY" && <AddMoneyForm/>}
        </Drawer>
    </>
  );
}

export default Home;