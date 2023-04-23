import React from 'react'
import { useLocation } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button
} from "@material-tailwind/react";

import ClientList from '@/components/ClientList';
export default function Detail() {
  const [clientList, setClientList] = React.useState([])
  const location = useLocation()

  React.useEffect(() => {
    console.log('client list changed: ', clientList)
  }, [clientList])

  React.useEffect(() => {
    const processId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)
    const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com'
    console.log(serverUri)
    getDetail(serverUri, processId)
  }, [])

  const getDetail = async (serverUri, processId) => {
    try {
      const fetchRes = await fetch(`${serverUri}/api/process/${processId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      console.log('fetch res: ', fetchRes.body.data)
      if (fetchRes && fetchRes.code === 200) {
        // setClientList(fetchRes.data.clients.clients)
        console.log(fetchRes.code)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <Card className="mt-10">
      <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
        <Typography variant="h6" color="white">
          작업 진행 상세
        </Typography>
        <Button
          color="red"
          // buttonType="link"
          size="sm"


          onClick={() => { }} // 추가
        >
          작업 생성
        </Button>
      </CardHeader>
      <CardBody className="">
        <div className="flex flex-row flex-wrap">

          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              검색 키워드
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              text
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              찾는 문자열
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              NAni
            </Typography>
          </div>

          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              시작시간
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              text
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              종료시간
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              NAni
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              클라이언트 수
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              NAni
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              프리페이지 다운
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              NAni
            </Typography>
          </div>
        </div>
        <div className="w-full border p-4 rounded-md">
          <ClientList
            clientList={clientList}
          />
        </div>
      </CardBody>
    </Card>
  )
}