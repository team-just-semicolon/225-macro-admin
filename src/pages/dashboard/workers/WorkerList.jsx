import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Tooltip,
    Button,
} from "@material-tailwind/react";
import {
    ArrowPathIcon
} from "@heroicons/react/24/solid";

import Pagination from "./Pagination";
import ExpandedUI from "./ExpandedUI";
// import { WorkListDataDummy } from "@/data";

export default function WorkerList() {
    const [refreshCount, setRefreshCount] = useState(10)

    const [disconnectedWorkers, setDisconnectedWorkers] = useState([])
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(1000);
    const [contentArray, setContentArray] = useState({})




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
        // console.log(workersWithIndex)
        // let arr = []
        const groupedData = workersWithIndex.reduce((groups, item) => {
            const { workerId } = item;
            if (!groups[workerId]) {
                groups[workerId] = [];
            }
            groups[workerId].push(item);
            return groups;
        }, {});
        // console.log(groupedData)
        // console.log(Object.keys(groupedData))
        const groupedKeys = Object.keys(groupedData)
        let disconnectedWorkers = [];
        for (let i = 1; i < 51; i++) {
            if (groupedKeys.includes(String(i))) {
                // console.log(i, '있음')
            } else {
                // console.log(i, '없음')
                disconnectedWorkers.push(i)
            }
        }
        setDisconnectedWorkers(disconnectedWorkers)
        // console.log(Object.values(groupedData))
        setContentArray(groupedData)
    }
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
                        {Object.keys(contentArray).length}
                    </div>
                    <div>
                        <span className="text-red-500 mr-2">미연결 PC:</span>
                        {disconnectedWorkers.map(worker => <span className="mr-2">{worker}</span>)}
                    </div>

                </div>
                <div className="flex flex-col gap-4">
                    {Object.keys(contentArray).length !== 0 && Object.keys(contentArray).map((workerKey, index) =>
                        <ExpandedUI
                            key={index}
                            number={workerKey}
                            clients={contentArray[workerKey]}
                            fetchWorkers={fetchWorkers}
                        />
                    )}
                </div>
                {/* <Pagination
                    workers={workers}
                    page={page}
                    setPage={setPage}
                /> */}
            </CardBody>
        </Card>
    )
};