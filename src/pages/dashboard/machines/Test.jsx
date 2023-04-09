import ReactTable from 'react-table'

export default function treeTable() {
    const columns = [{
        Header: 'Name',
        accessor: 'name'
    }, {
        Header: 'Age',
        accessor: 'age'
    }, {
        Header: 'Gender',
        accessor: 'gender'
    }]

    const data = [{
        name: 'John',
        age: 25,
        gender: 'Male',
        children: [
            { name: 'Mary', age: 10, gender: 'Female' },
            { name: 'Tom', age: 5, gender: 'Male' }
        ]
    }, {
        name: 'Jane',
        age: 22,
        gender: 'Female'
    }, {
        name: 'Mike',
        age: 30,
        gender: 'Male'
    }]

    return (
        <ReactTable
            data={data}
            columns={columns}
            className="-striped -highlight"
            SubComponent={row => {
                return (
                    <div>
                        {row.original.children &&
                            <ReactTable
                                data={row.original.children}
                                columns={columns}
                                showPagination={false}
                                className="-striped -highlight"
                            />
                        }
                    </div>
                )
            }}
        />
    )
}
