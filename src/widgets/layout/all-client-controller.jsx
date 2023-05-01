import { Button, Typography } from "@material-tailwind/react";

export function AllClientController() {
  const sendToAllClient = async (method) => {
    try {
      const res = await fetch('http://141.164.51.175:225/api/client', {
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
    </div>
  );
}

AllClientController.displayName = "/src/widgets/layout/all-client-controller.jsx";

export default AllClientController;
