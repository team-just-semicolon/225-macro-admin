import React from 'react';

import {
  Accordion,
  AccordionHeader,
  AccordionBody,
  Chip,
  Typography,
  Button,
} from '@material-tailwind/react'

import ClientList from './ClientList';
export default function ExpandedUI({ number, clients, fetchWorkers }) {
  const [open, setOpen] = React.useState(false)

  React.useEffect(() => {
    // console.log(workers)

  }, [])

  const countByStatus = (status) => {
    const count = clients.reduce((count, item) => {
      if (item.status === status) {
        return count + 1;
      }
      return count;
    }, 0);
    return count;
  }
  const sendToWorkerChildClient = async (method) => {
    try {
      clients.map(async (client) => {
        await fetch(`http://141.164.51.175:225/api/client/${client.clientId}`, {
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
        <div className='flex flex-row gap-4'>
          <div className='flex'>

            <span>
              {number}번 PC
            </span>
            <Typography className="text-gray-600" variant="h6">({clients.length})</Typography>
          </div>
          <div className='flex flex-row gap-1'>
            {countByStatus('IDLE') !== 0 &&

              <Chip color='cyan' value={countByStatus('IDLE')} />
            }
            {countByStatus('RUNNING') !== 0 &&

              <Chip color='blue' value={countByStatus('RUNNING')} />
            }
            {countByStatus('WATCHING') !== 0 &&

              <Chip color='green' value={countByStatus('WATCHING')} />
            }
            {countByStatus('FAIL') !== 0 &&

              <Chip color='gray' value={countByStatus('FAIL')} />
            }
            {countByStatus('ERROR') !== 0 &&

              <Chip color='yellow' value={countByStatus('ERROR')} />
            }
            {countByStatus('TIMEOUT') !== 0 &&

              <Chip color='red' value={countByStatus('TIMEOUT')} />
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