import React, { useCallback, useState, useEffect } from 'react'
import {
  Chip, Button, Tooltip, Typography, Switch, Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter, Select, Option
} from '@material-tailwind/react'
import {
  ArrowPathIcon, UserCircleIcon
} from "@heroicons/react/24/solid";






// const serverUri = process.env.NODE_ENV === 'development' ? 'http://141.164.51.175:225' : 'https://macro-server.com';
const serverUri = 'http://141.164.51.175:225'


export default function ClientList({ process, processId, fetchDetail }) {
  const [showWorkerId, setShowWorkerId] = useState(true);
  const [refreshCount, setRefreshCount] = useState(10)
  const [clientOpen, setClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState('');
  const [toggleFilter, setToggleFilter] = useState({
    IDLE: true,
    RUNNING: true,
    WATCHING: true,
    TIMEOUT: true,
    FAIL: true,
    ERROR: true
  })


  const handleOpen = (client) => {
    setClientOpen(!clientOpen);
    setSelectedClient(client);
  }

  const handleClientIdClick = (status) => {
    setToggleFilter(prev => ({
      ...prev,
      [status]: !prev[status]
    }))
  };

  const getStatusCount = (status) => {
    const count = process?.clients?.child?.filter((child) => child.status === status).length;
    return count || 0;
  };

  const handleRefreshClick = useCallback(() => {
    fetchDetail();
    setRefreshCount(10);
  }, []);

  const handleFailRestart = async () => {
    // console.log('Failed to restart')
    // const currentDate = new Date();
    // const year = currentDate.getFullYear();
    // const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    // const day = String(currentDate.getDate()).padStart(2, '0');
    // const hour = String(currentDate.getHours()).padStart(2, '0');
    // const minute = String(currentDate.getMinutes()).padStart(2, '0');
    // const second = String(currentDate.getSeconds()).padStart(2, '0');

    // const formattedDate = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    // console.log(process.clients)
    const failedClients = process?.clients?.child?.filter(client => client.status === 'ERROR')
    console.log(failedClients)
    failedClients.map(async (client) => {
      const body = {
        // clientId: client.clientId,
        title: process?.title,
        keyword: process?.keyword,
        method: "findKeyword",
        prePageDown: 0,
        endDate: client.expirationDate,
        interval: process?.interval
        // commandId: client.commands[0].commandId ?? 0,
        // target: client.commands[0].target ?? 'both'
      };

      try {
        const fetchRes = await fetch(`${serverUri}/api/client/${client.clientId}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            status: "IDLE",
            commandId: client.commands[0].commandId ?? 0,
            target: client.commands[0].target ?? 'both'
          })
        });

        const responseData = await fetchRes.json();

        // if (responseData && responseData.code === 200) {
        //   fetchDetail()
        // }
      } catch (e) {
        console.error(e);
      }
    });

  };

  const handleStatusChange = async (status) => {
    const body = {
      "status": status,
      "commandId": 0
    }

    try {
      const fetchRes = await fetch(`${serverUri}/api/client/${selectedClient.clientId}`, {
        method: 'PATCH',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const responseData = await fetchRes.json()
      if (responseData && responseData.code === 200) {
        fetchDetail()
        setClientOpen(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

  const handleSubmitCommand = async (command) => {

    const body = {
      "method": command,
      "commandId": 0,
      "workerId": selectedClient.workerId,
    }

    console.log(body);
    console.log(command)

    try {
      const fetchRes = await fetch(`${serverUri}/api/client/${selectedClient.clientId}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      })
      const responseData = await fetchRes.json()
      if (responseData && responseData.code === 200) {
        fetchDetail()
        setClientOpen(false)
      }
    } catch (e) {
      console.error(e)
    }
  }

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
      fetchDetail()
      setRefreshCount(10)
    }
  }, [refreshCount, processId])

  const getChipColor = (status) => {
    switch (status) {
      case 'IDLE':
        return 'cyan'
      case 'RUNNING':
        return 'blue'
      case 'WATCHING':
        return 'green'
      case 'TIMEOUT':
        return 'red'
      case 'FAIL':
        return 'gray'
      case 'ERROR':
        return 'yellow'
      default:
        return 'error'
    }
  }

  const getStatus = (status) => {
    switch (status) {
      case 'IDLE':
        return '대기중'
      case 'RUNNING':
        return '동작중'
      case 'WATCHING':
        return '시청중'
      case 'TIMEOUT':
        return '연결에러'
      case 'FAIL':
        return '재실행대기'
      case 'ERROR':
        return '찾기 실패'
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
              <Tooltip content="문자열 찾기에 실패한 모든 클라이언트에게 대기중 전환 명령을 보내줍니다.">
                <Button color='teal' onClick={handleFailRestart} className="whitespace-nowrap">실패클라 대기중 전환</Button>
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
            className={`${toggleFilter.TIMEOUT ? 'border-2 border-indigo-500/100' : ''}`}
            color={'red'}
            value={`연결에러 ${getStatusCount('TIMEOUT')}`}
            onClick={() => handleClientIdClick('TIMEOUT')}
          />
          <Chip
            className={`${toggleFilter.FAIL ? 'border-2 border-indigo-500/100' : ''}`}
            color={'gray'}
            value={`재실행대기 ${getStatusCount('FAIL')}`}
            onClick={() => handleClientIdClick('FAIL')}
          />
          <Chip
            className={`${toggleFilter.ERROR ? 'border-2 border-indigo-500/100' : ''}`}
            color={'yellow'}
            value={`찾기실패 ${getStatusCount('ERROR')}`}
            onClick={() => handleClientIdClick('ERROR')}
          />
          <Switch
            label={`작업 PC 번호 출력`}
            onClick={() => setShowWorkerId(!showWorkerId)}
            ripple={showWorkerId}
            defaultChecked
          />
        </div>
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-1 flex-wrap gap-2">
          {process?.clients?.child?.map(client => {
            if (toggleFilter[client.status]) return (
              <div key={client.clientId} className="relative inline-block cursor-pointer">
                <Chip
                  className='min-w-[50px] text-center'
                  key={client.clientId}
                  color={getChipColor(client.status)}
                  value={client.clientId}
                  onClick={() => handleOpen(client)}
                />
                {showWorkerId && (
                  <div
                    className="border border-gray-700 bg-white text-black text-xs rounded-full font-bold w-4 h-4 absolute top-0 right-0 -mt-1 -mr-1 flex justify-center items-center"
                  >
                    {client.workerId}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
      <Dialog open={clientOpen} handler={handleOpen}>
        <DialogHeader className="text-sm font-bold text-left">
          워커 : {selectedClient?.workerId}
          <br />
          클라이언트 : {selectedClient?.clientId}
        </DialogHeader>
        <DialogBody divider>
          <div className="mt-5 p-4 border border-gray-300 rounded-md">
            <h3 className="mb-4 font-bold text-xs">
              현재 상태 : {getStatus(selectedClient?.status)}
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <Button
                color="cyan"
                onClick={() => handleStatusChange("IDLE")}
              >
                대기중
              </Button>
              <Button
                color="blue"
                onClick={() => handleStatusChange("RUNNING")}
              >
                동작중
              </Button>
              <Button
                color="green"
                onClick={() => handleStatusChange("WATCHING")}
              >
                시청중
              </Button>
            </div>
          </div>
          <div className="mt-5 p-4 border border-gray-300 rounded-md">
            <h3 className="mb-4 font-bold text-xs">명령 내리기</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 " >
                <Button
                  color="gray"
                  onClick={() => handleSubmitCommand("clearCache")}
                >
                  캐시 지우기
                </Button>
                <Button
                  color="gray"
                  onClick={() => handleSubmitCommand("reboot")}
                >
                  VM 재가동
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button
                  color="gray"
                  onClick={() => handleSubmitCommand("moveToMain")}
                >
                  메인으로 가기
                </Button>
                <Button
                  color="gray"
                  onClick={() => handleSubmitCommand("refresh")}
                >
                  새로 고침
                </Button>
              </div>
            </div>
          </div>
        </DialogBody>
        <DialogFooter>
          <Button color='red' onClick={() => setClientOpen(false)}> 닫기 </Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}