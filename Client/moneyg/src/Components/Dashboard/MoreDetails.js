import React, { useState, useEffect } from 'react';
import {Table} from 'antd';
import Apis from '../Apis';


function MoreDetails(props){
    let goalid = props.goalid;
    let [data,setdata] = useState([]);
    let columns = [{
        title: 'Entry Description',
        dataIndex: 'ed',
        key: 'ed',
      },
      {
        title: 'Entry Amount',
        dataIndex: 'ea',
        key: 'ea',
      },
      {
        title: 'Money Type',
        dataIndex: 'mt',
        key: 'mt',
      },];

    useEffect(()=>{
        let request = new Apis("goals/"+goalid+"/entries","GET");
        request.send().then((data)=>{
            setdata(data.data)
        })
    },[])
    
    return(
        <>
            {data.length>0?
                <Table columns={columns} dataSource={data} />
            :
                <p align="center">No Record Found</p>
            }
            
        </>
    )
}

export default MoreDetails;