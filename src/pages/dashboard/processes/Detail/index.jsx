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

import ClientList from '@/pages/dashboard/processes/detail/ClientList';

// const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com';
const serverUri = 'http://141.164.51.175:225'

export default function Detail() {
  const [process, setProcess] = useState([]);
  const [updateProcessDetail, setUpdateProcessDetail] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation()
  const processId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)



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
        const processedData = {
          ...data,
          clients: {
            ...data?.clients,
            child: data?.clients.child.sort((a, b) => {
              const keyA = Number(a.clientId);
              const keyB = Number(b.clientId);

              if (keyA < keyB) return -1;
              if (keyA > keyB) return 1;
              return 0;
            }).sort((a, b) => {
              const keyA = a.status;
              const keyB = b.status;

              if (keyA < keyB) return 1;
              if (keyA > keyB) return -1;
              return 0;
            })
          }
        }
        return processedData;
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleProcessStop = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const body = {
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

  const handleProcessEdit = async () => {
    const body = {
      "keyword": updateProcessDetail.keyword,
      // "interval": updateProcessDetail.keyword,
      "prePageDown": updateProcessDetail.prePageDown,
      "title": updateProcessDetail.title,
      "endDate": updateProcessDetail.endDate,
      "url": updateProcessDetail.url
    }
    console.log(body);
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
        console.log('수정 요청 성공')
      }
      setIsEditing(false)
    } catch (e) {
      console.error(e)
    }

  }

  const fetchDetail = async () => {
    const detail = await getDetail(processId);
    setProcess(detail);
    setUpdateProcessDetail(detail);
  };
  useEffect(() => {
    fetchDetail();
  }, [])

  useEffect(() => {
    console.log(updateProcessDetail)
  }, [updateProcessDetail])

  const sendToWorkerChildClient = async (method) => {
    try {
      process.clients.child.map(async (client) => {
        await fetch(`http://141.164.51.175:225/api/client/${client.clientId}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            method,
            workerId: client.workerId,
            groupId: Math.floor((client.workerId - 1) / 10) + 1
          })
        })
      })
    } catch (e) {
      console.error('error occured while sending request', e)
    }
  }

  return (
    <Card className="mt-10">
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
        <Typography variant="h6" color="white">
          작업 진행 상세
        </Typography>

        <div className="flex items-center">
          <Button color="cyan" size="sm" onClick={() => setIsEditing(!isEditing)} className={`px-4 py-2 rounded-md mr-4 ${isEditing ? 'bg-red-500' : ''}`}>
            {isEditing ? "취소" : "수정"}
          </Button>
          {!isEditing &&
            <Button
              color="red"
              // buttonType="link"
              size="sm"
              onClick={handleProcessStop} // 추가
              className="mr-2"
            >
              작업 종료
            </Button>
          }
        </div>
      </CardHeader>
      <CardBody className=" pt-0">
        <div className='p-4 border border-gray-200 rounded'>
          <Typography variant="h5 mb-1">
            [주의] 이 프로세스({processId})에 할당된 vm을 대상으로 동작합니다
          </Typography>
          <div className="flex gap-4 mt-1">
            <Button className="flex-1 bg-gray-500"
              onClick={() => sendToWorkerChildClient('clearCache')}
            >
              캐시 지우기
            </Button>
            <Button className="flex-1 bg-gray-500"
              onClick={() => sendToWorkerChildClient('moveToMain')}
            >
              메인으로 이동
            </Button>
            <Button className="flex-1 bg-gray-500"
              onClick={() => sendToWorkerChildClient('refresh')}
            >
              렌더러 새로고침
            </Button>
            <Button className="flex-1 bg-gray-500"
              onClick={() => sendToWorkerChildClient('reboot')}
            >
              vm 재기동
            </Button>
          </div>
        </div>
        <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-2">
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              검색 키워드
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.keyword}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, keyword: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              찾는 문자열
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.title}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, title: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              시작시간
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.createdAt}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, createdAt: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              종료시간
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.endDate}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, endDate: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              클라이언트 수
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.clients?.clientsCount}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail?.clients, clientsCount: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              프리페이지 다운
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.prePageDown}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, prePageDown: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
          <div className="mb-4 flex flex-row items-center">
            <Typography variant="small" className="whitespace-nowrap font-normal text-blue-gray-500" style={{ width: '9em' }}>
              URL
            </Typography>
            <Input
              type="text"
              value={updateProcessDetail?.url}
              onChange={(e) => setUpdateProcessDetail({ ...updateProcessDetail, url: e.target.value })}
              className="w-full mt-1 px-2 py-1 text-sm"
              disabled={!isEditing}
              style={{ gridColumn: "2/3" }}
            />
          </div>
        </div>
        {isEditing &&
          <div className='flex gap-2 justify-end'>
            <Button color="blue" size="sm" onClick={handleProcessEdit}>수정완료</Button>
            <Button color="red" size="sm" onClick={() => setIsEditing(false)}>수정취소</Button>
          </div>
        }
        <div className="w-full">
          <ClientList
            process={process}
            processId={processId}
            fetchDetail={fetchDetail}
          />
        </div>
      </CardBody>
    </Card>
  )
}