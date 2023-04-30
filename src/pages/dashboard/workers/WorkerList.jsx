import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import Pagination from "./Pagination";
import { tableDataDummy } from "@/data";

export default function WorkerList(props) {
    const [workers, setWorkers] = useState();
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(100);

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


    useEffect(() => {
        async function fetchWorkers() {
            const workers = await getWorkers(page, size);
            const workersWithIndex = workers.map((worker, index) => {
                return { ...worker, index: index + 1 };
            });
            setWorkers(workersWithIndex);
        }
        fetchWorkers();
    }, [page, size]);


    // useEffect(() => {
    //     setWorkers(tableDataDummy);
    // }, []);


    return (
        <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
                <Typography variant="h6" color="white">
                    작업 컴퓨터 리스트
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            {["컴퓨터 정보", "연결 일시", "업데이트 시간", "상태"].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {workers && workers.map(
                            ({ index, machineID, createdAt, updatedAt, status, number, ip, mac, clients, online, date }, key) => {
                                const className = `py-3 px-5 ${key === workers.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={`${machineID}`} className="cursor-pointer hover:bg-gray-300">
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className="bg-gray-200 w-8 py-2 px-1 rounded-md text-center"
                                                >
                                                    {index}
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {createdAt}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {updatedAt}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={"blue-gray"}
                                                value={status}
                                                className="py-0.5 px-2 text-[11px] font-medium"
                                            />
                                        </td>
                                    </tr>
                                );
                            }
                        )}
                    </tbody>
                </table>
                <Pagination
                    workers={workers}
                    page={page}
                    setPage={setPage}
                />
            </CardBody>
        </Card>
    )
};