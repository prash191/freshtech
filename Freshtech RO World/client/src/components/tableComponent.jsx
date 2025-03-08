import React, { useState } from "react";
import "../assets/css/table.css";
import Button from "./button";

const Table = ({ columns, data, onEdit, onDelete }) => {
    const [sortField, setSortField] = useState(null);
    const [sortOrder, setSortOrder] = useState("asc");

    const handleSort = (field) => {
        const order = sortField === field && sortOrder === "asc" ? "desc" : "asc";
        setSortField(field);
        setSortOrder(order);
    };

    const sortedData = [...data].sort((a, b) => {
        if (!sortField) return 0;
        return sortOrder === "asc"
            ? a[sortField] > b[sortField]
                ? 1
                : -1
            : a[sortField] < b[sortField]
                ? 1
                : -1;
    });

    return (
        <div className="table-container">
            <table className="custom-table">
                <thead>
                    <tr>
                        {columns.map((col) => (
                            <th key={col.key} onClick={() => handleSort(col.key)}>
                                {col.label}{" "}
                                {sortField === col.key ? (sortOrder === "asc" ? "▲" : "▼") : ""}
                            </th>
                        ))}
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {sortedData.map((row) => (
                        <tr key={row.id}>
                            {columns.map((col) => (
                                <td key={col.key}>{row[col.key]}</td>
                            ))}
                            <td>
                                <Button className="edit-btn" onClick={() => onEdit(row)}>
                                    Edit
                                </Button>
                                <Button className="delete-btn" onClick={() => onDelete(row.id)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;