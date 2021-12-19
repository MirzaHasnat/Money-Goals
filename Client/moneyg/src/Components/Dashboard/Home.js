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
    let [goalmoneyid,setgoalmoneyid] = useState("");

     useEffect(()=>{
        setisgoalloading(true);
        let  request =  new Apis("goals","GET",{});
        let data = request.send();
        data.then((data)=>{
            if(data !== undefined || data !== null){
                window.localStorage.setItem("goals",JSON.stringify(data.data));
                setisgoalloading(false);
            }
        });
    },[drawer,drawerTitle,whichdrawer,btnloading]);

    let deleteGoal = (id)=>{
        setBtnloading(true);
        let request = new Apis("goals/"+id,"DELETE",{});
        request.send().then(data=>{
            setBtnloading(false);
        });
    }

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
        { window.localStorage.getItem("goals") !== null ?
            JSON.parse(window.localStorage.getItem("goals")).length>0 ?
            <Spin tip='Loading...' spinning={isgoalloading}>
                <Row gutter={30} loading={true}>
                    {
                        JSON.parse(window.localStorage.getItem("goals")).map((goal,index)=>{
                            return(
                                <Col span={8} key={goal.id}>
                                    <Card bordered={true} title={goal.goal_name} size="small" width="400" extra={
                                        <>  
                                            <Popconfirm title="Are You Sure You Want To Delet This?" onConfirm={()=>{setBtnloading(false);deleteGoal(goal.id)}} okText="Yes" cancelText="No">
                                                <Button type="dashed" danger prefix={<DeleteFilled/>}>Delete</Button>
                                            </Popconfirm>
                                            <Button type="dashed" primary onClick={()=>{setdrawer(true);setdrawerTitle("Add Money");setwhichdrawer("ADDMONEY");setgoalmoneyid(goal.id)}}>Add Money</Button>
                                            <Button type="outline" primary onClick={()=>{setdrawer(true);setdrawerTitle("More Details");setwhichdrawer("MOREDETAILS");setgoalmoneyid(goal.id)}}>More Details</Button>
                                        </>
                                        }>
                                        <div align="center">
                                            <h4 align="center">{goal.days_left} Days Left</h4>
                                            <Progress percent={parseFloat((100/goal.goal_amount)*goal.total_added).toFixed(2)}  status="active" type="dashboard" />
                                            <p align="center">{goal.goal_amount}/{goal.total_added}</p>
                                        </div>
                                    </Card>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Spin>
            :
            <p align="center">You haven't added any goal yet.</p>
        :
        <p align="center">Goals are not loaded properly</p>
        }
        <Drawer title={drawerTitle} width={whichdrawer==="MOREDETAILS"?1000:500} onClose={()=>{setBtnloading(false);setdrawer(false)}} visible={drawer}  size={whichdrawer==="MOREDETAILS"?"large":"medium"}>
            {whichdrawer==="SETGOAL" && <NewGoalForm/>}
            {whichdrawer==="ADDMONEY" && <AddMoneyForm goalid={goalmoneyid}/>}
        </Drawer>
    </>
  );
}

export default Home;