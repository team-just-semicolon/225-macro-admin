import React, { useState, useEffect } from "react";

export default function Pagination(props) {
    const { processList, page, setPage } = props;

    return (
        <div className="flex justify-end my-4 pr-4">
            <nav className="inline-flex">
                <button
                    onClick={() => setPage(page - 1)}
                    disabled={processList?.first}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-l-md bg-blue-100 text-blue-500 hover:bg-blue-200"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M5.293 10l4.147-4.146a.502.502 0 01.708 0l.708.708a.502.502 0 010 .708l-3.146 3.147 3.146 3.146a.502.502 0 010 .708l-.708.708a.502.502 0 01-.708 0L5.293 10z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
                {Array.from(Array(processList?.totalPages).keys()).map((n) => (
                    <button
                        key={n}
                        onClick={() => setPage(n)}
                        className={`inline-flex items-center justify-center w-8 h-8 border border-blue-500 ${n === page ? "bg-blue-500 text-white" : "bg-blue-100 text-blue-500 hover:bg-blue-200 hover:text-blue-500"}`}
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={() => setPage(page + 1)}
                    disabled={processList?.last}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-r-md bg-blue-100 text-blue-500 hover:bg-blue-200"
                >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M14.707 10l-4.147 4.146a.502.502 0 01-.708 0l-.708-.708a.502.502 0 010-.708l3.146-3.147-3.146-3.146a.502.502 0 010-.708l.708-.708a.502.502 0 01.708 0L14.707 10z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </nav>
        </div>
    )
}