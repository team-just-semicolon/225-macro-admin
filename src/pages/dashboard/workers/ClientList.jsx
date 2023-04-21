import {
    Card,
    CardHeader,
    CardBody,
    Typography,
    Chip,
} from "@material-tailwind/react";

import { authorsTableData } from "@/data";

export default function ClientList() {
    return (
        <Card>
            <CardHeader variant="gradient" color="blue" className="mb-8 p-6">
                <Typography variant="h6" color="white">
                    클라이언트 정보
                </Typography>
            </CardHeader>
            <CardBody className="overflow-x-scroll px-0 pt-0 pb-2">
                <table className="w-full min-w-[640px] table-auto">
                    <thead>
                        <tr>
                            {["아이디", "vpn", "상태"].map((el) => (
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
                        {authorsTableData && authorsTableData.map(
                            ({ number, ip, online, date }, key) => {
                                const className = `py-3 px-5 ${key === authorsTableData.length - 1
                                    ? ""
                                    : "border-b border-blue-gray-50"
                                    }`;

                                return (
                                    <tr key={`${ip}-${key}`}>
                                        <td className={className}>
                                            <div className="flex items-center gap-4">
                                                {/* <Avatar src={img} alt={name} size="sm" /> */}
                                                <div
                                                    className="bg-gray-200 w-8 py-2 px-1 rounded-md text-center"
                                                >
                                                    {number}
                                                </div>
                                                <div>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-semibold"
                                                    >
                                                        {ip}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={className}>
                                            <Typography className="text-xs font-semibold text-blue-gray-600">
                                                {date}
                                            </Typography>
                                        </td>
                                        <td className={className}>
                                            <Chip
                                                variant="gradient"
                                                color={online ? "green" : "blue-gray"}
                                                value={online ? "online" : "offline"}
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
}