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
  const [detail, setDetail] = React.useState({
    keyword: '',
    title: '',
    createdAt: '',
    endDate: '',
    clienstCount: 0,

  })

  const location = useLocation()
  const processId = location.pathname.slice(location.pathname.lastIndexOf('/') + 1)

  React.useEffect(() => {
    console.log('client list changed: ', clientList)
  }, [clientList])

  React.useEffect(() => {
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
      const responseData = await fetchRes.json()
      console.log('fetch res: ', responseData)
      if (responseData && responseData.code === 200) {
        const data = responseData.data
        setClientList(data.clients)
        setDetail({
          keyword: data.clients?.child?.keyworkd,
          title: data.clients?.child?.title,
          createdAt: data.clients?.child?.createdAt,
          endDate: data.clients?.child?.endDate,
          clientsCount: data.clients?.child?.clients.clientsCount,
        })
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
          color="gray"
          // buttonType="link"
          size="sm"
          onClick={() => { }} // 추가
        >
          작업 중지
        </Button>
      </CardHeader>
      <CardBody className="">
        <div className="flex flex-row flex-wrap">

          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              검색 키워드
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.keyword ?? ''}
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              찾는 문자열
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.title ?? ''}
            </Typography>
          </div>

          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              시작시간
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.createdAt ?? ''}
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              종료시간
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.endDate ?? ''}
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              클라이언트 수
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.clienstCount ?? 0}
            </Typography>
          </div>
          <div className="basis-1/2 mb-4">
            <Typography variant="small" className="font-normal text-blue-gray-500">
              프리페이지 다운
            </Typography>
            <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
              {detail.prePagedown ?? 0}
            </Typography>
          </div>
        </div>
        <div className="w-full">
          <ClientList
            clientList={clientList}
            setClientList={setClientList}
            processId={processId}
          />
        </div>
      </CardBody>
    </Card>
  )
}