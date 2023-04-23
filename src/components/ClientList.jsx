import React from 'react'
import { Chip, Button, Tooltip, Typography } from '@material-tailwind/react'
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

export default function ClientList({ clientList = CONST_CLIENTS }) {

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
      <div className="flex gap-1 items-center">
        <Chip color='cyan' value='대기중' />
        <Chip color='blue' value='동작중' />
        <Chip color='green' value='시청중' />
        <Chip color='yellow' value='연결에러' />
        <Chip color='gray' value='재실행대기' />
        <Chip color='red' value='찾기실패' />
        <div className='flex flex-1 justify-end'>
          <Tooltip content="문자열 찾기에 실패한 모든 클라이언트에게 수동 재실행 명령을 보내줍니다.">
            <Button>수동 재실행</Button>
          </Tooltip>
        </div>
      </div>
      <Typography variant="h6">
        클라이언트 상태
      </Typography>
      <div className='flex gap-1'>
        {clientList.length && clientList.map(client => {
          const chipColor = getChipColor(client.commandStatus)
          if (chipColor === 'error') console.error('unavailable status')

          return <Chip
            key={client.id}
            color={chipColor}
            value={client.id}
          />
        })}
      </div>
    </div>
  )
}