import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Tooltip,
    Button,
    Input
} from "@material-tailwind/react";
import {
    ArrowPathIcon
} from "@heroicons/react/24/solid";
import TimePicker from "../processes/ProcessList/TimePicker"

import Pagination from "./Pagination";
import ExpandedUI from "./ExpandedUI";
// import { WorkListDataDummy } from "@/data";

export default function WorkerList() {
    const [refreshCount, setRefreshCount] = useState(10)
    const [connectedWorkers, setConnectedWorkers] = useState({})
    const [disconnectedWorkers, setDisconnectedWorkers] = useState([])
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [selectedPCType, setSelectedPCType] = useState('all');
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(10000);

    const [prePageDown, setPrePageDown] = useState(0);
    const [keyword, setKeyword] = useState("");
    const [title, setTitle] = useState("");
    const [operationInterval, setOperationInterval] = useState(0);

    const [endTime, setEndTime] = useState(new Date());
    const [showTimePicker, setShowTimePicker] = useState(false);


    useEffect(() => {
        console.log(connectedWorkers)
    }, [connectedWorkers])

    const getWorkers = async (page, size) => {
        try {
            const response = await fetch(`http://141.164.51.175:225/api/client?page=${page}&size=${size}&direction=ASC`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            return data.data.content;
        } catch (error) {
            console.error('Error fetching workers:', error);
            return [];
        }
    }

    async function fetchWorkers() {
        const workers = await getWorkers(page, size);

        const workersWithIndex = workers.map((worker, index) => {
            return { ...worker, index: index + 1 };
        });

        const groupedData = workersWithIndex.reduce((groups, item) => {
            const { workerId } = item;
            if (!groups[workerId]) {
                groups[workerId] = [];
            }
            groups[workerId].push(item);
            return groups;
        }, {});

        const groupedKeys = Object.keys(groupedData);
        let disconnectedWorkers = [];

        for (let i = 1; i < 51; i++) {
            if (groupedKeys.includes(String(i))) {
                // console.log(i, '있음')
            } else {
                // console.log(i, '없음')
                disconnectedWorkers.push(i);
            }
        }

        setDisconnectedWorkers(disconnectedWorkers);
        setConnectedWorkers(groupedData);
    }

    const filterWorkersByPC = (pcType) => {
        setSelectedPCType(pcType); // 새로운 상태 업데이트
        if (pcType === 'all') {
            setFilteredWorkers([]);
        } else {
            const filteredKeys = Object.keys(connectedWorkers).filter((workerKey) => {
                const isDesktop = Number(workerKey) <= 50;
                const isWorkstation = Number(workerKey) > 50;

                if (pcType === 'desktop' && isDesktop) {
                    return true;
                } else if (pcType === 'workstation' && isWorkstation) {
                    return true;
                }

                return false;
            });

            setFilteredWorkers(filteredKeys);
        }
    };




    const handleRefreshClick = React.useCallback(() => {
        fetchWorkers();
        setRefreshCount(10);
    }, []);

    useEffect(() => {
        fetchWorkers();
        const reduceCount = setInterval(() => {
            setRefreshCount((prev) => prev - 1 >= 0 ? prev - 1 : 0);
        }, 1000)

        return () => {
            clearInterval(reduceCount)
        }
    }, []);

    useEffect(() => {
        if (refreshCount === 0) {
            fetchWorkers()
            setRefreshCount(10)
        }
    }, [refreshCount])
    // useEffect(() => {
    //     setWorkers(WorkListDataDummy);
    // }, []);


    return (
        <div>
            {/* <div className="flex flex-col mb-8 bg-white p-2 rounded-sm gap-4">
                <div>
                    <Typography variant="h3" color="blue-gray" className="mt-1 mb-2">
                        문자열 찾기 프리셋 설정
                    </Typography>
                </div>
                <div className="flex flex-row gap-2">
                    <Input
                        required
                        size="md"
                        label="검색 키워드"
                        className="h-full w-full"
                        value={keyword} onChange={(e) => setKeyword(e.target.value)}
                    />
                    <Input
                        required
                        size="md"
                        label="찾을 문자열"
                        className="h-full w-full"
                        value={title} onChange={(e) => setTitle(e.target.value)}
                    />
                    <Input
                        required
                        size="md"
                        label="작업 간격"
                        className="h-full w-full"
                        type="number"
                        value={operationInterval} onChange={(e) => setOperationInterval(e.target.value)}
                    />
                    <Input
                        required
                        size="md"
                        label="프리페이지다운"
                        className="h-full w-full"
                        type="number"
                        value={prePageDown} onChange={(e) => setPrePageDown(e.target.value)}
                    />
                </div>
                <div>
                    <div className="flex-grow">
                        {showTimePicker ? (
                            <TimePicker
                                endTime={endTime} setEndTime={setEndTime} showTimePicker={showTimePicker} setShowTimePicker={setShowTimePicker}
                            />
                        ) : (
                            <Input
                                required
                                readOnly={true}
                                size="md"
                                label="시간 선택"
                                className="h-full w-full"
                                value={new Date(endTime).toLocaleString("en-US", {
                                    year: 'numeric',
                                    month: '2-digit',
                                    day: '2-digit',
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false,
                                    timeZone: 'Asia/Seoul'
                                })
                                }
                                onClick={() => setShowTimePicker(true)}
                            />
                        )}
                    </div>
                </div>
            </div> */}
            <Card>
                <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
                    <Typography variant="h6" color="white">
                        작업 컴퓨터 리스트
                    </Typography>
                    <Tooltip content="클릭 시 클라이언트들의 상태를 즉시 새로고침 합니다.">
                        <Button color='indigo' onClick={handleRefreshClick} className="flex items-center whitespace-nowrap">
                            <ArrowPathIcon className="w-5 h-5 text-inherit" />
                            <span>{`${refreshCount} 초 전`}</span>
                        </Button>
                    </Tooltip>
                </CardHeader>
                <CardBody className=" px-0 pt-0 pb-2">
                    <div className="flex gap-4">
                        <div>
                            <span className="text-red-500 mr-2">총 연결 작업 PC 개수:</span>
                            {Object.keys(connectedWorkers).length}
                        </div>
                        <div>
                            <span className="text-red-500 mr-2">미연결 PC:</span>
                            {disconnectedWorkers.map((worker, index) => <span key={index} className="mr-2">{worker}</span>)}
                        </div>
                        <div>
                            <span className="text-red-500 mr-2">PC 필터링:</span>
                            <select
                                value={selectedPCType} // value 변경
                                onChange={(e) => filterWorkersByPC(e.target.value)}
                                className="bg-white border border-gray-300 rounded px-2 py-1"
                            >
                                <option value="all">전체</option>
                                <option value="desktop">데스크탑</option>
                                <option value="workstation">워크스테이션</option>
                            </select>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        {Object.keys(connectedWorkers).length !== 0 && Object.keys(connectedWorkers).map((workerKey, index) => {
                            if (filteredWorkers.length === 0 || filteredWorkers.includes(workerKey)) {
                                return (
                                    <ExpandedUI
                                        key={index}
                                        number={workerKey}
                                        clients={connectedWorkers[workerKey]}
                                        fetchWorkers={fetchWorkers}
                                        findKeywordProps={{
                                            prePageDown, keyword, title, operationInterval, endTime
                                        }}

                                    />
                                );
                            }
                            return null;
                        })}
                    </div>

                    {/* <Pagination
                        workers={workers}
                        page={page}
                        setPage={setPage}
                    /> */}
                </CardBody>
            </Card>
        </div>
    )
};
