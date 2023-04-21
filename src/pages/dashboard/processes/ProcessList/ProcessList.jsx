import React, { useState, useEffect } from "react";
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
    Button
} from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

import { WorkListDataDummy } from "@/data";

export default function TaskList(props) {
    const { handleCreateProcessClick } = props;
    const [filterStatus, setFilterStatus] = useState(null);
    const [processList, setProcessList] = useState([]);
    const navigate = useNavigate()
    // const [workList, setWorkList] = useState("");

    useEffect(() => {
        fetch(`http://141.164.51.175:225/api/process?page=1&size=20 `, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json"
            },
        })
            .then((response) => response.json())
            .then((data) => setProcessList(data.data.content))
            // .then((data) => setWorkList(data.data.content))
            .catch((error) => console.error("Error fetching client count:", error));
    }, []);

    // useEffect(() => {
    //     console.log(WorkListDataDummy);
    // }, []);


    return (
        <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6 flex justify-between items-center">
                <Typography variant="h6" color="white">
                    작업 진행 리스트
                </Typography>
                <Button
                    color="red"
                    // buttonType="link"
                    size="sm"


                    onClick={handleCreateProcessClick} // 추가
                >
                    작업 생성
                </Button>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            {["id",
                                // "연결 클라이언트 수", 
                                "찾는 키워드",
                                // "방송 제목",
                                "시작", "종료",
                                "상태",
                                //  , "변경"
                            ].map((el) => (
                                <th
                                    key={el}
                                    className="border-b border-blue-gray-50 py-3 px-5 text-left"
                                >
                                    <Typography
                                        variant="small"
                                        className="text-[11px] font-bold uppercase text-blue-gray-400"
                                    >
                                        {el ?? ''}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            processList && processList.map(({ createdAt, endDate, recordId, status, title }) =>
                                <tr key={`${recordId}`}
                                    className="cursor-pointer hover:bg-gray-300"
                                    onClick={() => navigate(`${recordId}`)}
                                >
                                    <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {recordId ?? ''}
                                        </Typography>
                                    </td>
                                    <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {title ?? ''}
                                        </Typography>
                                    </td>
                                    {/* <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {searchKeyword ?? ''}
                                        </Typography>
                                    </td> */}
                                    {/* <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {BroadcastTitle ?? ''}
                                        </Typography>
                                    </td> */}
                                    <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {createdAt ?? ''}
                                        </Typography>
                                    </td>
                                    <td className="py-3 px-5">
                                        <Typography className="text-xs font-semibold text-blue-gray-600">
                                            {endDate ?? ''}
                                        </Typography>
                                    </td>
                                    <td className="py-3 px-5">
                                        <Chip
                                            variant="gradient"
                                            color={status === 'RUNNING' ? "blue" : "gray"}
                                            value={status}
                                            className="py-0.5 px-2 text-[11px] font-medium"
                                        />
                                    </td>
                                    {status === 'RUNNING' && // "doing" 상태일 때만 버튼을 표시
                                        <td className="py-3 px-5">

                                            <Button
                                                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs" // 버튼 스타일링 추가
                                                style={{ height: "24px", minWidth: "60px" }} // 버튼 크기 조절
                                                disabled={status !== "doing"} // 버튼의 활성화 여부 조건 추가
                                            >
                                                작업 종료
                                            </Button>
                                        </td>
                                    }
                                </tr>
                            )
                        }
                        {/* {WorkListDataDummy && WorkListDataDummy.map(
                            ({ identifier, recordId, clientCnt, searchKeyword, BroadcastTitle, createdAt, endAt, status }, key) => {
                                const className = `py-3 px-5 ${key === WorkListDataDummy.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;
                                const isDoing = status === "doing";
                                return (
                                    <tr key={`${recordId}`} className="cursor-pointer hover:bg-gray-300">
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {identifier ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {clientCnt ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {searchKeyword ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {BroadcastTitle ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {createdAt ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {endAt ?? ''}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={isDoing ? "blue" : "gray"}
                                                value={status}
                                                className="py-0.5 px-2 text-[11px] font-medium"
                                            />
                                        </td>
                                        {isDoing && // "doing" 상태일 때만 버튼을 표시
                                            <td className={className}>

                                                <Button
                                                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded text-xs" // 버튼 스타일링 추가
                                                    style={{ height: "24px", minWidth: "60px" }} // 버튼 크기 조절
                                                    disabled={status !== "doing"} // 버튼의 활성화 여부 조건 추가
                                                >
                                                    작업 종료
                                                </Button>
                                            </td>
                                        }
                                    </tr>
                                );
                            }
                        )} */}
                    </tbody>
                </table>
            </CardBody>
        </Card>
    )
};