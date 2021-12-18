import React,{useEffect, useState} from 'react';
import {Button,Card,Divider, Progress, Row, Col, Popconfirm, Drawer, Spin} from 'antd';
import {DeleteFilled, PlusCircleFilled} from '@ant-design/icons';
import NewGoalForm from './NewGoalForm';
import AddMoneyForm from './AddMoneyForm';
import Apis from '../Apis';

function Home() {
    let [btnloading,setBtnloading] = useState(false);
    let [drawer,setdrawer] = useState(false);
    let [drawerTitle,setdrawerTitle] = useState('');
    let [whichdrawer,setwhichdrawer] = useState('')
    let [isgoalloading,setisgoalloading] = useState(true);

     useEffect(()=>{
        setisgoalloading(true);
        let  request =  new Apis("goals","GET",{});
        let data = request.send();
        data.then((data)=>{
            window.localStorage.setItem("goals",JSON.stringify(data.data));
            setisgoalloading(false);
        });
    },[drawer,drawerTitle,whichdrawer,btnloading]);

    window.onclose = ()=>{
         window.localStorage.removeItem("goals");
         window.localStorage.removeItem("isAuthorized");
         window.localStorage.removeItem("token");
    }

  return (
    <>  
        <div align="right" style={{margin:"10px 0"}}>
            <Button type="primary" icon={<PlusCircleFilled/>} loading={btnloading} onClick={()=>{setBtnloading(true);setdrawer(true);setdrawerTitle("Add New Goal");setwhichdrawer("SETGOAL")}}>Add New Goal</Button>
        </div>

        <Divider>Goals To Compelete</Divider>
        <Spin tip='Loading...' spinning={isgoalloading}>
            <Row gutter={30} loading={true}>
                {
                    window.localStorage.getItem("goals") ?JSON.parse(window.localStorage.getItem("goals")).map((goal,index)=>{
                        return(
                            <Col span={8} key={goal.id}>
                                <Card bordered={true} title={goal.goal_name} size="small" width="400" extra={
                                    <>  
                                        <Popconfirm title="Are You Sure You Want To Delet This?" id={goal.id} onConfirm={(e)=>{setBtnloading(false);console.log(e.target.id)}} okText="Yes" cancelText="No">
                                            <Button type="dashed" danger prefix={<DeleteFilled/>}>Delete</Button>
                                        </Popconfirm>
                                        <Button type="dashed" primary onClick={()=>{setdrawer(true);setdrawerTitle("Add Money");setwhichdrawer("ADDMONEY")}}>Add Money</Button>
                                    </>
                                    }>
                                    <div align="center">
                                        <h4 align="center">{goal.goal_name}</h4>
                                        <Progress percent={parseFloat((100/goal.goal_amount)*goal.total_added).toFixed(2)}  status="active" type="dashboard" />
                                        <p align="center">{goal.goal_amount}/{goal.total_added}</p>
                                    </div>
                                </Card>
                            </Col>
                        )
                    })
                    :
                    <p>No Data Found</p>
            }
            </Row>
        </Spin>
        <Drawer title={drawerTitle} width={500} onClose={()=>{setBtnloading(false);setdrawer(false)}} visible={drawer}  size="medium">
            {whichdrawer==="SETGOAL" && <NewGoalForm/>}
            {whichdrawer==="ADDMONEY" && <AddMoneyForm/>}
        </Drawer>
    </>
  );
}

export default Home;