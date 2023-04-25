import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Input
} from "@material-tailwind/react";

import ClientList from '@/pages/dashboard/processes/Detail/ClientList';

const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com';

export default function Detail() {
  const [process, setProcess] = useState([])
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation()
  const processId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
  const [processDetail, setProcessDetail] = useState({
    keyword: '',
    title: '',
    createdAt: '',
    endDate: '',
    clienstCount: 0,

  })
  const [updateProcessDetail, setUpdateProcessDetail] = useState({
    keyword: '',
    title: '',
    createdAt: '',
    endDate: '',
    clienstCount: 0,

  })



  const getDetail = async (processId) => {
    try {
      const fetchRes = await fetch(`${serverUri}/api/process/${processId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      const responseData = await fetchRes.json()
      if (responseData && responseData.code === 200) {
        const data = responseData.data
        setProcess(data);
        setProcessDetail({
          keyword: data.clients?.child?.keyworkd,
          title: data.clients?.child?.title,
          createdAt: data.clients?.child?.createdAt,
          endDate: data.clients?.child?.endDate,
          clientsCount: data.clients?.clientsCount,
        })
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleJobStop = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');
    
    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const body = {
      "keyword": process.keyword,
      "prePageDown": process.prePageDown,
      "title": process.title,
      "method": "findKeyword",
      "endDate": formattedDate,
      
    }
    
    try {
      const fetchRes = await fetch(`${serverUri}/api/process/${processId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const responseData = await fetchRes.json()
      if (responseData && responseData.code === 200) {
        console.log('성공')
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleEdit = () => {
    setIsEditing(!isEditing);
  };

  useEffect(() => {
    console.log('client list changed: ', process)
  }, [process])

  useEffect(() => {
    getDetail(processId);
  }, [])

  return (
    <Card className="mt-10">
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
        <Typography variant="h6" color="white">
          작업 진행 상세
        </Typography>
        <div className="flex items-center">
          <Button color="cyan" size="sm" onClick={handleEdit} className="px-4 py-2 rounded-md mr-4">
            {isEditing ? "수정 완료" : "수정"}
          </Button>
          <Button
            color="red"
            // buttonType="link"
            size="sm"
            onClick={handleJobStop} // 추가
            className="mr-2"
          >
            작업 종료
          </Button>
        </div>
      </CardHeader>
      <CardBody className="">
        <div className="grid grid-cols-2 gap-2">
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              검색 키워드
            </Typography>
            <Input
              type="text"
              value={process?.keyword}
              onChange={(e) => setProcess({ ...process, keyword: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              찾는 문자열
            </Typography>
            <Input
              type="text"
              value={process?.title}
              onChange={(e) => setProcess({ ...process, title: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              시작시간
            </Typography>
            <Input
              type="text"
              value={process?.createdAt}
              onChange={(e) => setProcess({ ...process, createdAt: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              종료시간
            </Typography>
            <Input
              type="text"
              value={process?.createndDateedAt}
              onChange={(e) => setProcess({ ...process, createndDateedAt: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              클라이언트 수
            </Typography>
            <Input
              type="text"
              value={process?.clients?.clientsCount}
              onChange={(e) => setProcess({ ...process?.clients, clientsCount: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="font-normal text-blue-gray-500" style={{ width: '9em' }}>
              프리페이지 다운
            </Typography>
            <Input
              type="text"
              value={process?.prePagedown}
              onChange={(e) => setProcess({ ...process, prePagedown: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }} // 자식 요소가 첫 번째 열에 위치하도록 함
            />
          </div>
        </div>
        <div className="w-full">
          <ClientList
            process={process}
            setProcess={setProcess}
            processId={processId}
            getDetail={getDetail}
            processDetail={processDetail}
          />
        </div>
      </CardBody>
    </Card>
  )
}