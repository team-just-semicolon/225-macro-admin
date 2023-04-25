import React, {useCallback, useState, useEffect} from 'react'
import { Chip, Button, Tooltip, Typography } from '@material-tailwind/react'
import {
  ArrowPathIcon
} from "@heroicons/react/24/solid";
const CONST_CLIENTS = [
  {
    id: 1,
    status: 'RUNNING',
  },
  {
    id: 2,
    status: 'IDLE',
  },
  {
    id: 3,
    status: 'WATCHING',
  },
  {
    id: 4,
    status: 'TIMEOUT',
  },
  {
    id: 5,
    status: 'TIMEOUT',
  },
  {
    id: 6,
    status: 'ERROR',
  },
]

export default function ClientList({ clientList = CONST_CLIENTS, setClientList, processId }) {
  const [refreshCount, setRefreshCount] = useState(10)
  const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com'



  useEffect(() => {
    const reduceCount = setInterval(() => {
      setRefreshCount((prev) => prev - 1)
    }, 1000)
    if (refreshCount < 0) {
      refreshClientList(serverUri)
    }
    return () => {
      clearInterval(reduceCount)
    }
  }, [refreshCount])

  const refreshClientList = async (serverUri) => {
    console.log(' do refresh clients ')
    try {
      const fetchRes = await fetch(`${serverUri}/api/process/${processId}`, {
        method: 'GET',
        headers: {
          "Content-Type": "application/json"
        }
      })
      const responseData = await fetchRes.json()
      if (responseData && responseData.code === 200) {
        setClientList(responseData.data.clients)
      }
      setRefreshCount(10)

    } catch (e) {
      console.error(e)
    }
  }
  const handleChipClick = useCallback(() =>{
    refreshClientList(serverUri);
  },[serverUri])

  const getChipColor = (status) => {
    switch (status) {
      case 'IDLE':
        return 'cyan'
      case 'RUNNING':
        return 'blue'
      case 'WATCHING':
        return 'green'
      case 'TIMEOUT':
        return 'yellow'
      case 'FAIL':
        return 'gray'
      case 'ERROR':
        return 'red'
      default:
        console.error('unavailable status: ', status)
        return;
    }
  }

  return (
    <div>
      <div className="flex gap-3  border p-4 rounded-md">
        <div className="flex-1">
          <div className="flex gap-4 items-center ">
            <Typography variant="h6" className="flex gap-4 items-center">
              {`클라이언트 : ${clientList.length} 개`}
            </Typography>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-1 items-center">
            <Chip color="deep-purple" className="cursor-pointer" value={`갱신 ${refreshCount} 초 전`} onClick={handleChipClick}>
              <ArrowPathIcon className="w-5 h-5 text-inherit" />
            </Chip>
            <Chip color='cyan' value='대기중' />
            <Chip color='blue' value='동작중' />
            <Chip color='green' value='시청중' />
            <Chip color='yellow' value='연결에러' />
            <Chip color='gray' value='재실행대기' />
            <Chip color='red' value='찾기실패' />
          </div>
        </div>
        <div className="flex-1">
          <div className='flex flex-1 justify-end'>
            <Tooltip content="문자열 찾기에 실패한 모든 클라이언트에게 수동 재실행 명령을 보내줍니다.">
              <Button>수동 재실행</Button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className="flex gap-3  border p-4 rounded-md">
        <div className="flex-1">
          <div className="flex gap-4 items-center ">
            <Typography variant="h6" className="flex gap-4 items-center">
              {`커맨드 : ${clientList.length} 개`}
            </Typography>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex gap-1 items-center">
          </div>
        </div>
        <div className="flex-1">
          <div className='flex flex-1 justify-end'>
          </div>
        </div>
      </div>
    </div>
  )
}