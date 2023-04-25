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

const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com';

export default function ClientList({ process = CONST_CLIENTS, setProcess, processId, getDetail }) {
  const [refreshCount, setRefreshCount] = useState(10)



  useEffect(() => {
    const reduceCount = setInterval(() => {
      setRefreshCount((prev) => prev - 1)
    }, 1000)
    if (refreshCount < 0) {
      getDetail(processId);
    }
    return () => {
      clearInterval(reduceCount)
    }
  }, [refreshCount])

  const handleChipClick = useCallback(() =>{
    getDetail(processId);
    setRefreshCount(10);
  },[serverUri])

  return (
    <div>
      <div className="flex gap-3  border p-4 rounded-md">
        <div className="flex-1">
        <Typography variant="small" className="font-normal text-blue-gray-500 mb-4">
              클라이언트 상태
            </Typography>
          <div className="flex gap-4 items-center">
            <Chip color='cyan' value='대기중' />
            <Chip color='blue' value='동작중' />
            <Chip color='green' value='시청중' />
            <Chip color='yellow' value='연결에러' />
            <Chip color='gray' value='재실행대기' />
            <Chip color='red' value='찾기실패' />
          </div>
        </div>
        <div className="flex-1">
          <div className='flex flex-1 gap-2 justify-end'>
            <Tooltip content="클릭 시 클라이언트들의 상태를 즉시 새로고침 합니다.">
              <Button color ='indigo' onClick={handleChipClick} className="flex items-center">
                <ArrowPathIcon className="w-5 h-5 text-inherit" />
                <span>{`${refreshCount} 초 전`}</span>
              </Button>
            </Tooltip>
            <Tooltip content="문자열 찾기에 실패한 모든 클라이언트에게 수동 재실행 명령을 보내줍니다.">
              <Button color = 'teal'>수동 재실행</Button>
            </Tooltip>
          </div>
        </div>
      </div>
      {/* <div className="flex gap-3  border p-4 rounded-md">
        <div className="flex-1">
          <div className="flex gap-4 items-center ">
            <Typography variant="h6" className="flex gap-4 items-center">
              {`커맨드 : ${process.clients?.clientsCount} 개`}
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
      </div> */}
    </div>
  )
}