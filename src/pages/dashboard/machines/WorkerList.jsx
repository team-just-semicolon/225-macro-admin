import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import { tableDataDummy } from "@/data";

export default function WorkerList(props) {
    const { handleCreateTaskClick } = props;
    // const [workList, setWorkList] = useState("");

    useEffect(() => {
        fetch(`http://141.164.51.175:225/api/vm?page=2&size=5 `, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => response.json())
            .then((data) => console.log(data.data.content))
            // .then((data) => setWorkList(data.data.content))
            .catch((error) => console.error("Error fetching client count:", error));
    }, []);

    useEffect(() => {
        console.log(tableDataDummy);
    }, []);


    return (
        <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
                <Typography variant="h6" color="white">
                    작업 컴퓨터 리스트
                </Typography>
                <Button
                    color="red"
                    buttonType="link"
                    size="sm"
                    rounded={false}
                    block={false}
                    onClick={handleCreateTaskClick} // 추가
                >
                    작업 생성
                </Button>
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
                        {tableDataDummy && tableDataDummy.map(
                            ({ machineNumber, machineID, createdAt, updatedAt, status, number, ip, mac, clients, online, date }, key) => {
                                const className = `py-3 px-5 ${key === tableDataDummy.length - 1
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
                                                    {machineNumber}
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
            </CardBody>
        </Card>
    )
};