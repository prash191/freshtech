import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    TableSortLabel,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import "../assets/css/table.css";

const DataTable = ({ columns, data, onEdit, onDelete }) => {
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
        <TableContainer component={Paper}>
            <Table className="custom-table">
                <TableHead>
                    <TableRow>
                        {columns.map((col) => (
                            <TableCell
                                key={col.key}
                                sortDirection={sortField === col.key ? sortOrder : false}
                                className="custom-table-th"
                            >
                                <TableSortLabel
                                    active={sortField === col.key}
                                    direction={sortField === col.key ? sortOrder : "asc"}
                                    onClick={() => handleSort(col.key)}
                                >
                                    {col.label}
                                </TableSortLabel>
                            </TableCell>
                        ))}
                        <TableCell className="custom-table-th">Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedData.map((row) => (
                        <TableRow key={row.id} className="custom-table-tr">
                            {columns.map((col) => (
                                <TableCell key={col.key} className="custom-table-td">
                                    {row[col.key]}
                                </TableCell>
                            ))}
                            <TableCell className="actions-cell">
                                <IconButton
                                    className="edit-btn"
                                    onClick={() => onEdit(row)}
                                    aria-label="edit"
                                >
                                    <Edit />
                                </IconButton>
                                <IconButton
                                    className="delete-btn"
                                    onClick={() => onDelete(row.id)}
                                    aria-label="delete"
                                >
                                    <Delete />
                                </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default DataTable;