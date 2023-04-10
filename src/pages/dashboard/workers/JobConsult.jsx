import React, { useState, useEffect } from "react";
import ImageUploader from "./ImageUpLoader";
import TimePicker from "./TimePicker"
import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import { Input } from "@material-tailwind/react";
import moment from 'moment-timezone';



export function JobConsult(props) {
  const { handleModalClose } = props;
  const [idleClientCount, setIdleClientCount] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [title, setTitle] = useState("");
  const [operationInterval, setOperationInterval] = useState();
  const [clientOperationCount, setClientOperationCount] = useState("");

  const [endTime, setEndTime] = useState();
  const [showTimePicker, setShowTimePicker] = useState(false);

  const [img, setImg] = useState();

  const getIdleClientCount = async () => {
    try {
      const response = await fetch(`http://141.164.51.175:225/api/client/IDLE`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      return data.data.content.length;
    } catch (error) {
      console.error('Error fetching workers:', error);
      return [];
    }
  }

  const handleSubmit = () => {
    if (!keyword || !title || !operationInterval || !clientOperationCount) {
      alert("빈칸을 채워주세요");
      return;
    }

    const date = new Date(endTime);
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")} ${date
        .getHours()
        .toString()
        .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date
          .getSeconds()
          .toString()
          .padStart(2, "0")}`;
    console.log();


    console.log("keyword:", keyword);
    console.log("title:", title);
    console.log("interval:", operationInterval);
    console.log("clientOperationCount:", clientOperationCount);
    console.log("endTime:", endTime);
    console.log("endTime:", formattedDate)


    const body = {
      keyword: keyword,
      title: title,
      interval: parseInt(operationInterval),
      endDate: formattedDate
    }
    fetch(`http://141.164.51.175:225/api/command/${clientOperationCount}`, {
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
    setTitle("");
    setOperationInterval("");
    setClientOperationCount("");
  }

  useEffect(() => {
    async function fetchIdleClientCount() {
      console.log('hi')
      const count = await getIdleClientCount();
      setIdleClientCount(count);
    }
    fetchIdleClientCount();

    const intervalId = setInterval(() => {
      fetchIdleClientCount();
    }, 3000); // 5초마다 호출

    return () => {
      clearInterval(intervalId); // 컴포넌트 언마운트 시 인터벌 해제
    };
  }, []);

  return (
    <Card className="mt-8 mb-4 mx-auto lg:mx-4 max-w-4xl">
      <div className="my-6 text-center">
        <h2 className="text-2xl font-bold mb-2">이용 가능한 클라이언트</h2>
        <p className="text-sm font-light text-gray-400">현재  <span className="text-red-600">{idleClientCount}</span> 유휴 대기 중인 클라이언트의 수입니다.</p>
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
            <Card key={'2'} color="transparent" shadow={false} className="flex-grow">
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  키워드
                </Typography>
                <Typography variant="small" className="text-blue-gray-500">
                  영상을 찾기 위해 검색할 키워드를 입력해주세요. 해당 키워드로 유투브에서 영상 리스트를 조회 합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required size="md" label="검색 키워드" className="h-full w-full" value={title} onChange={(e) => setTitle(e.target.value)} />
              </div>
            </Card>
            <Card key={'3'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  작업 간격
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  클라이언트의 접속 간격을 설정합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required type="number" size="md" label="작업 간격" className="h-full w-full" value={operationInterval} onChange={(e) => setOperationInterval(e.target.value)} />
              </div>
            </Card>
            <Card key={'4'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  방송 시청 종료 시간
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  방송 시청을 종료할 시간을 선택합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                {showTimePicker ? (
                  <TimePicker
                    initialTime={new Date()} setEndTime={setEndTime} showTimePicker={showTimePicker} setShowTimePicker={setShowTimePicker}
                  />
                ) : (
                  <Input
                    required
                    size="md"
                    label="시간 선택"
                    className="h-full w-full"
                    value={new Date(endTime).toLocaleString("en-US", {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    })


                    }
                    onClick={() => setShowTimePicker(true)}
                  />
                )}
              </div>
            </Card>
            <Card key={'5'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
              <CardBody className="p-4">
                <Typography variant="h6" color="blue-gray" className="mt-1 mb-2">
                  클라이언트 수
                </Typography>
                <Typography variant="small" className="font-normal text-blue-gray-500">
                  영상 시청을 조회할 클라이언트 수를 설정합니다.
                </Typography>
              </CardBody>
              <div className="flex-grow">
                <Input required size="md" label="클라이언트 수" className="h-full w-full" value={clientOperationCount} onChange={(e) => setClientOperationCount(e.target.value)} />
              </div>
            </Card>
            {/* 이미지 업로드 */}
            {/* <Card key={'4'} color="transparent" shadow={false} style={{ flexGrow: 1 }}>
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
            </Card> */}

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