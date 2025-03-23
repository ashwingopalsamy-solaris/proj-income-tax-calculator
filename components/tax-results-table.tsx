import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TaxResults } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { cn } from "@/lib/utils"
import {Calculator} from "lucide-react";

interface TaxResultsTableProps {
    results: TaxResults
    gratuityIncluded?: boolean
    employerPfIncluded?: boolean
}

// Animation variants
const rowVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: 10, transition: { duration: 0.2 } }
};

const cardVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: "easeInOut" } },
};

const TaxResultsTable: React.FC<TaxResultsTableProps> = ({ results, gratuityIncluded = false, employerPfIncluded = false }) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // Dynamic card description based on the two toggles
    let cardDescription = "";
    if (!employerPfIncluded && !gratuityIncluded) {
        cardDescription = "Breakdown with Employer PF included in CTC (12% of Basic Pay)";
    } else if (!employerPfIncluded && gratuityIncluded) {
        cardDescription = "Breakdown with Gratuity included in CTC (4.81% of Basic Pay)";
    } else if (employerPfIncluded && !gratuityIncluded) {
        cardDescription = "Breakdown with both Employer PF and Employee PF included in CTC (24% of Basic Pay)";
    } else if (employerPfIncluded && gratuityIncluded) {
        cardDescription = "Breakdown with both Employer PF and Employee PF included in CTC (24% of Basic Pay) and Gratuity included in CTC (4.81% of Basic Pay)";
    }

    // Base rows that are always shown
    const baseRows = [
        { label: "Gross Salary", value: results.grossSalary, isHighlighted: true, type: 'salary' },
        { label: "Taxable Income (Gross Salary - Standard Deduction)", value: results.taxableIncome, type: 'taxable' },
        { label: "Basic Pay", value: results.basicPay, isHighlighted: true, type: 'salary' },
    ];

    // PF related rows
    const pfRows = employerPfIncluded
        ? [
            { label: "Employee PF Deduction (6%)", value: results.employeePF, type: 'deduction' },
            { label: "Employer PF Deduction (6%)", value: results.employeePF, type: 'deduction' },
            { label: "Total PF Deduction (12%)", value: results.employeePF * 2, isHighlighted: false, type: 'deduction' },
        ]
        : [{ label: "Employee PF Deduction (6%)", value: results.employeePF, type: 'deduction' }];

    const gratuityRow = gratuityIncluded
        ? [
            { label: "Gratuity Deduction (4.81%)", value: results.gratuityAmount, isHighlighted: false, type: 'deduction' },
        ]
        : [];

    const netSalaryRow = [
        { label: "Net Salary (After Deductions)", value: results.netSalary, isHighlighted: true, type: 'salary' },
    ]

    const taxRow = [
        { label: "Income Tax", value: results.incomeTax, type: 'tax' },
        { label: "Health & Education CESS (4%)", value: results.cess, type: 'tax' },
        { label: "Professional Tax", value: results.professionalTax, type: 'tax' },
        { label: "Total Tax", value: results.totalTax, isHighlighted: true, type: 'tax' },
    ]

    // Final row
    const finalRow = [
        { label: "In-hand Salary Per Year", value: results.inHandSalary, isHighlighted: true, isFinal: true, type: 'salary' },
    ];

    // Combine all rows
    const rows = [...baseRows, ...pfRows, ...gratuityRow, ...netSalaryRow, ...taxRow, ...finalRow];

    if (!isMounted) {
        return null; // Or a placeholder
    }

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            className="w-full"
        >
            <Card className="border border-border/40 shadow-lg rounded-xl transition-all duration-300
                        bg-card text-card-foreground dark:bg-card dark:text-card-foreground">
                <CardHeader className="pb-4 border-b border-border/50">
                    <div className="flex items-center gap-2">
                        <Calculator className="h-6 w-6 text-primary"/>
                        <CardTitle className="text-2xl font-bold tracking-tight text-title
                                    dark:text-title">
                            Salary Breakdown
                        </CardTitle>
                    </div>
                    <CardDescription className="text-sm text-muted-foreground pt-2
                                            dark:text-muted-foreground">
                        {cardDescription}
                    </CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="rounded-lg overflow-hidden border border-border/50">
                        <Table>
                            <TableHeader className="bg-muted/50 dark:bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-[50%] font-semibold text-foreground
                                                    dark:text-foreground">Component</TableHead>
                                    <TableHead className="font-semibold text-foreground
                                                    dark:text-foreground">Amount (₹)</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground
                                                    dark:text-foreground">Per Month</TableHead>
                                    <TableHead className="text-right font-semibold text-foreground
                                                    dark:text-foreground">Per Year</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <AnimatePresence>
                                    {rows.map((row, index) => (
                                        <motion.tr
                                            key={row.label}
                                            variants={rowVariants}
                                            initial="hidden"
                                            animate="visible"
                                            exit="exit"
                                            className={cn(
                                                "transition-colors duration-200",
                                                row.isHighlighted
                                                    ? "bg-accent/50 font-semibold text-accent-foreground dark:bg-accent/50 dark:text-accent-foreground"
                                                    : "",
                                                row.isFinal ? "text-primary dark:text-primary-foreground" : "",
                                                row.type === 'deduction' ? "text-red-500 dark:text-red-400" : "",
                                                row.type === 'tax' ? "text-blue-500 dark:text-blue-400" : ""
                                            )}
                                        >
                                            <TableCell className="py-3 text-foreground dark:text-foreground">{row.label}</TableCell>
                                            <TableCell className="py-3 text-foreground dark:text-foreground">{formatCurrency(row.value)}</TableCell>
                                            <TableCell className="py-3 text-right text-foreground dark:text-foreground">{formatCurrency(row.value / 12)}</TableCell>
                                            <TableCell className="py-3 text-right text-foreground dark:text-foreground">{formatLPA(row.value)}</TableCell>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    );
};

export default TaxResultsTable;

