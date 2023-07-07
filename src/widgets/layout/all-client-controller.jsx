import { Button, Typography } from "@material-tailwind/react";

export function AllClientController() {
  const sendToAllClient = async (method) => {
    try {
      const res = await fetch('http://158.247.252.131:225/api/client', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          method, commandId: 0
        })
      })
      console.log('메세지 전송 완료', res)
    } catch (e) {
      console.error('error occured while sending request', e)
    }
  }

  const handleStatusChange = async (status) => {
    try {
      await fetch(`http://158.247.252.131:225/api/client`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "status": status,
          "commandId": 0
        })
      })
    } catch (e) {
      console.error(e)
    }
  }
  return (
    <div className="flex flex-col border border-gray-600 rounded-lg p-4">
      <Typography variant="paragraph">
        <span className="font-bold text-red-500">주의!</span> 모든 클라이언트를 대상으로 명령을 내리는 버튼입니다.
      </Typography>
      <div className="flex gap-4 mt-4">
        <Button className="flex-1 bg-gray-500"
          onClick={() => sendToAllClient('clearCache')}
        >
          캐시 지우기
        </Button>
        <Button className="flex-1 bg-gray-500"
          onClick={() => sendToAllClient('moveToMain')}
        >
          메인으로 이동
        </Button>
        <Button className="flex-1 bg-gray-500"
          onClick={() => sendToAllClient('refresh')}
        >
          렌더러 새로고침
        </Button>
        <Button className="flex-1 bg-gray-500"
          onClick={() => sendToAllClient('reboot')}
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
  );
}

AllClientController.displayName = "/src/widgets/layout/all-client-controller.jsx";

export default AllClientController;
