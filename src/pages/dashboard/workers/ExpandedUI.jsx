import React from 'react';

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
  Typography,
  Button,
} from '@material-tailwind/react'
import moment from 'moment'
import ClientList from './ClientList';
export default function ExpandedUI({ number, clients, fetchWorkers, findKeywordProps }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    // console.log(findKeywordProps.endTime)
    // console.log(moment(findKeywordProps.endTime).format('YYYY-MM-DD hh:mm:ss'))
  }, [findKeywordProps])

  const countByStatus = (status) => {
    const count = clients.reduce((count, item) => {
      if (item.status === status) {
        return count + 1;
      }
      return count;
    }, 0);
    return count;
  }

  const sendFindKeywordToSpecificClient = () => {
    try {
      clients.map(async (client, index) => {
        const group = Math.floor((number - 1) / 10) + 1
        const term = 30 + (index * findKeywordProps.operationInterval)
        const startDateTime = new Date()
        startDateTime.setSeconds(startDateTime.getSeconds() + term)
        await fetch(`http://158.247.252.131:225/api/client/${client.clientId}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            commandId: 3000,
            workerId: number,
            groupId: group > 6 ? "6" : `${group}`,
            clientId: client.clientId,
            title: findKeywordProps.title,
            keyword: findKeywordProps.keyword,
            target: 'both',
            method: 'findKeyword',
            prePageDown: findKeywordProps.prePageDown,
            endDateTime: findKeywordProps.endTime,
            excuarationAt: startDateTime
          })
        })
      })
    } catch (e) {
      console.error('error occured while sending request', e)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      clients.map(async (client) => {
        await fetch(`http://158.247.252.131:225/api/client/${client.clientId}`, {
          method: 'PATCH',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            "status": status,
            "commandId": 0
          })
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  const sendToWorkerChildClient = async (method) => {
    try {
      clients.map(async (client) => {
        await fetch(`http://158.247.252.131:225/api/client/${client.clientId}`, {
          method: 'POST',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            method,
            workerId: number,
            groupId: Math.floor((number - 1) / 10) + 1
          })
        })
      })
    } catch (e) {
      console.error('error occured while sending request', e)
    }
  }
  return (
    // <div>asdf</div>
    <Accordion open={open} onClick={() => setOpen(!open)}>
      <AccordionHeader
        className='p-4'
      >
        <div className='flex sm:flex-col lg:flex-row  gap-4'>
          <div className='flex'>

            <span>
              {number <= 50 ? `${number}번 데스크탑` : `${number}번 워크스테이션`}
            </span>
            <Typography className="text-gray-600" variant="h6">({clients.length})</Typography>
          </div>
          <div className='flex flex-row gap-1'>
            {countByStatus('IDLE') !== 0 &&

              <Chip color='cyan' value={`대기: ${countByStatus('IDLE')}`} className='w-20' />
            }
            {countByStatus('RUNNING') !== 0 &&

              <Chip color='blue' value={`동작: ${countByStatus('RUNNING')}`} className='w-20' />
            }
            {countByStatus('WATCHING') !== 0 &&

              <Chip color='green' value={`시청: ${countByStatus('WATCHING')}`} className='w-20' />
            }
            {countByStatus('FAIL') !== 0 &&

              <Chip color='gray' value={`재실행: ${countByStatus('FAIL')}`} className='w-20' />
            }
            {countByStatus('ERROR') !== 0 &&

              <Chip color='yellow' value={`실패: ${countByStatus('ERROR')}`} className='w-20' />
            }
            {countByStatus('TIMEOUT') !== 0 &&

              <Chip color='red' value={`연결불량: ${countByStatus('TIMEOUT')}`} className='w-20' />
            }
          </div>
        </div>
      </AccordionHeader>
      <AccordionBody
        className='flex flex-col gap-4 p-4'
      >
        <div className='flex flex-col p-4 border rounded-lg'>
          <Typography variant="h6">
            [주의] {number}번 PC 하위의 모든 vm을 대상으로 동작합니다
          </Typography>
          <div className="flex gap-4 mt-1">
            <Button className="flex-1 bg-green-500"
              onClick={() => sendFindKeywordToSpecificClient()}
            >
              문자열 찾기
            </Button>
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
          <div className="mt-2 rounded-md">
            <h3 className="mb-4 font-bold text-xs">
              {/* 현재 상태 : {getStatus(selectedClient?.status)} */}
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
        </div>
        <ClientList
          fetchDetail={fetchWorkers}
          clients={clients.sort((a, b) => {
            const keyA = Number(a.clientId);
            const keyB = Number(b.clientId);

            if (keyA < keyB) return -1;
            if (keyA > keyB) return 1;
            return 0;
          })}
        />
        {/* {clients && clients.map(client =>
          <div className='flex-1'>
            {client.clientId}
          </div>
        )} */}
      </AccordionBody>
    </Accordion>
  )
}
