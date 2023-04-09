import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUpLoader";
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";



export function JobConsult(props) {
  const { handleModalClose } = props;
  const [keyword, setKeyword] = useState("");
  const [operationInterval, setOperationInterval] = useState();
  const [machineOperationCount, setMachineOperationCount] = useState("");
  const [clientCount, setClientCount] = useState(0);
  const [img, setImg] = useState();

  const handleSubmit = () => {
    if (!keyword || !operationInterval || !machineOperationCount) {
      alert("빈칸을 채워주세요");
      return;
    }

    console.log("keyword:", keyword);
    console.log("interval:", operationInterval);
    console.log("machineOperationCount:", machineOperationCount);
    console.log("input3:", img);

    const body = {
      interval: parseInt(operationInterval),
      keyword: keyword
    }
    fetch(`http://141.164.51.175:225/api/vm/${machineOperationCount}`, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json"
      },
    })
      .then((response) => {
        console.log("img uploaded successfully!");
        inputClear();
        handleModalClose();
      })
      .catch((error) => {
        console.error("Error uploading img:", error);
      });
  }

  const inputClear = () => {
    setKeyword("");
    setOperationInterval("");
    setMachineOperationCount("");
  }

  return (
    <Card className="mt-8 mb-4 mx-auto lg:mx-4 max-w-4xl">
      <div className="my-6 text-center">
        <h2 className="text-2xl font-bold mb-2">이용 가능한 클라이언트</h2>
        <p className="text-sm font-light text-gray-400">현재  <span className="text-red-600">{clientCount}</span> 유휴 대기 중인 클라이언트의 수입니다.</p>
      </div>
      <CardBody className="flex items-center justify-center" >
        <div className="px-4 pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4" style={{ gridAutoRows: "minmax(0, 1fr)" }}>
            <Card key={'1'} color="transparent" shadow={false} className="flex-grow">
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  키워드
                </Typography>
                <Typography variant="small" className="text-blue-gray-500">
                  영상을 찾기 위해 검색할 키워드를 입력해주세요. 해당 키워드로 유투브에서 영상 리스트를 조회 합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required size="md" label="검색 키워드" className="h-full w-full" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
              </div>
            </Card>
            <Card key={'2'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  작업 간격
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  클라이언트의 접속 간격을 설정합니다. 예를 들어 5 로 입력 시, 5초의 간격으로 접속을 진행합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required type="number" size="md" label="작업 간격" className="h-full w-full" value={operationInterval} onChange={(e) => setOperationInterval(e.target.value)} />
              </div>
            </Card>
            <Card key={'3'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  클라이언트 수
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  영상 시청을 조회할 클라이언트 수를 설정합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required size="md" label="클라이언트 수" className="h-full w-full" value={machineOperationCount} onChange={(e) => setMachineOperationCount(e.target.value)} />
              </div>
            </Card>
            <Card key={'4'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  썸네일 이미지 업로드
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  영상 시청을 조회할 이미지를 업로드 합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <ImageUploader className="h-full w-full" img={img} setImg={setImg} />
              </div>
            </Card>
          </div>
        </div>
      </CardBody>
      <div className="mt-4 mb-8 flex justify-center">
        <Button color="blue" size="lg" onClick={handleSubmit}>
          작업시작
        </Button>
      </div>
    </Card>
  );
}

export default JobConsult;