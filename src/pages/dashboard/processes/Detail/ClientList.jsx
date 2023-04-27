import React, { useCallback, useState, useEffect } from 'react'
import { Chip, Button, Tooltip, Typography } from '@material-tailwind/react'
import {
  ArrowPathIcon
} from "@heroicons/react/24/solid";

// const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com';
const serverUri = 'http://141.164.51.175:225'


export default function ClientList({ process, setProcess, processId, getDetail }) {
  const [refreshCount, setRefreshCount] = useState(10)
  const [toggleFilter, setToggleFilter] = useState({
    IDLE: true,
    RUNNING: true,
    WATCHING: true,
    TIMEOUT: true,
    FAIL: true,
    ERROR: true
  })

  const handleClientIdClick = (status) => {

    setToggleFilter(prev => ({
      ...prev,
      [status]: !prev[status]
    }))
    // if (status === currentStatus) {
    //   setIsShowClientList(false);
    //   setCurrentStatus(null);
    //   return
    // }
    // setCurrentStatus(status);
    // setIsShowClientList(true);
  };

  const getStatusCount = (status) => {
    const count = process?.clients?.child?.filter((child) => child.status === status).length;
    return count || 0;
  };

  const handleRefreshClick = useCallback(() => {
    getDetail(processId);
    setRefreshCount(10);
  }, []);

  const handleFailRestart = async () => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hour = String(currentDate.getHours()).padStart(2, '0');
    const minute = String(currentDate.getMinutes()).padStart(2, '0');
    const second = String(currentDate.getSeconds()).padStart(2, '0');

    const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    let failClients = process?.clients?.child?.filter(client => client.status === 'FAIL').map(client => client);

    failClients.forEach(async (client) => {
      const body = {
        clientId: client.clientId,
        title: process?.clients.title,
        keyword: process?.clients.keyword,
        target: "FAIL",
        method: "findKeyword",
        prePageDown: 0,
        execurationAt: formattedDate,
        endDate: formattedDate
      };

      try {
        const fetchRes = await fetch(`${serverUri}/api/client/${client.clientId}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(body)
        });

        const responseData = await fetchRes.json();

        if (responseData && responseData.code === 200) {
          console.log('성공');
        }
      } catch (e) {
        console.error(e);
      }
    });
  };

  useEffect(() => {
    const reduceCount = setInterval(() => {
      setRefreshCount((prev) => prev - 1 >= 0 ? prev - 1 : 0);
    }, 1000)

    return () => {
      clearInterval(reduceCount)
    }
  }, [])


  useEffect(() => {
    console.log(process.clients?.child)
  }, [process])
  useEffect(() => {
    if (refreshCount === 0) {
      getDetail(processId);
      setRefreshCount(10)
    }
  }, [refreshCount, getDetail, processId])

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
        return 'error'
    }
  }

  return (
    <div>
      <div className='border p-2 rounded-lg'>
        <div className="flex gap-3 p-4">
          <div className="flex-1">
            <Typography variant="small" className="font-normal text-blue-gray-500 mb-4">
              클라이언트 상태
            </Typography>

          </div>
          <div className="flex-1 flex">
            <div className='flex flex-1 gap-2 justify-end items-center'>
              <Tooltip content="클릭 시 클라이언트들의 상태를 즉시 새로고침 합니다.">
                <Button color='indigo' onClick={handleRefreshClick} className="flex items-center whitespace-nowrap">
                  <ArrowPathIcon className="w-5 h-5 text-inherit" />
                  <span>{`${refreshCount} 초 전`}</span>
                </Button>
              </Tooltip>
              <Tooltip content="문자열 찾기에 실패한 모든 클라이언트에게 수동 재실행 명령을 보내줍니다.">
                <Button color='teal' onClick={handleFailRestart} className="whitespace-nowrap" disabled>수동 재실행 </Button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div className="flex gap-4 items-center flex-wrap">
          <Chip
            className={`${toggleFilter.IDLE ? 'border-2 border-indigo-500/100' : ''}`}
            color={'cyan'}
            value={`대기중 ${getStatusCount('IDLE')}`}
            onClick={() => handleClientIdClick('IDLE')}
          />
          <Chip
            className={`${toggleFilter.RUNNING ? 'border-2 border-indigo-500/100' : ''}`}
            color={'blue'}
            value={`동작중 ${getStatusCount('RUNNING')}`}
            onClick={() => handleClientIdClick('RUNNING')}
          />
          <Chip
            className={`${toggleFilter.WATCHING ? 'border-2 border-indigo-500/100' : ''}`}
            color={'green'}
            value={`시청중 ${getStatusCount('WATCHING')}`}
            onClick={() => handleClientIdClick('WATCHING')}
          />
          <Chip
            className={`${toggleFilter.ERROR ? 'border-2 border-indigo-500/100' : ''}`}
            color={'red'}
            value={`연결에러 ${getStatusCount('ERROR')}`}
            onClick={() => handleClientIdClick('ERROR')}
          />
          <Chip
            className={`${toggleFilter.TIMEOUT ? 'border-2 border-indigo-500/100' : ''}`}
            color={'gray'}
            value={`재실행대기 ${getStatusCount('TIMEOUT')}`}
            onClick={() => handleClientIdClick('TIMEOUT')}
          />
          <Chip
            className={`${toggleFilter.FAIL ? 'border-2 border-indigo-500/100' : ''}`}
            color={'yellow'}
            value={`찾기실패 ${getStatusCount('FAIL')}`}
            onClick={() => handleClientIdClick('FAIL')}
          />
        </div>
      </div>
      <div className='flex flex-wrap'>
        <div className="flex flex-1 flex-wrap gap-2">

          {process?.clients?.child?.map(client => {
            // console.log(toggleFilter[client.status])
            if (toggleFilter[client.status]) return (
              <Chip
                key={client.clientId}
                color={getChipColor(client.status)}
                value={client.clientId}
              />
            )
          })}
          {/* {process?.clients?.child?.filter(client => client.status === currentStatus).map(client => (
              <Chip
                key={client.clientId}
                color="cyan"
                value={client.clientId}
              />
            ))} */}
        </div>
      </div>
    </div>
  )
}