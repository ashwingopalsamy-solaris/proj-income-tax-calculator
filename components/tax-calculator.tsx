"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import TaxResultsTable from "@/components/tax-results-table"
import TaxSlabExplainer from "@/components/tax-slab-explainer"
import SalaryComparison from "@/components/salary-comparison"
import TaxReportDownload from "@/components/tax-report-download"
import { calculateTax } from "@/lib/tax-calculations"
import { formatCurrency, formatLPA } from "@/lib/formatters"
import { motion, AnimatePresence } from "framer-motion"
import { LineChart, IndianRupee, Calculator, Info, TrendingUp, Percent, Briefcase, Award } from "lucide-react"
import HikeImpactTable from "@/components/hike-impact-table"
import { TooltipProvider } from "@/components/ui/tooltip"

export default function TaxCalculator() {
  const [salary, setSalary] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [employerPfIncluded, setEmployerPfIncluded] = useState<boolean>(false)
  const [considerGratuity, setConsiderGratuity] = useState<boolean>(false)
  const [basicPayPercentage, setBasicPayPercentage] = useState<number>(50)
  const [activeTab, setActiveTab] = useState<string>("results")

  const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/,/g, "")
    if (value === "" || /^\d+$/.test(value)) {
      setSalary(value)
      setError("")
    } else {
      setError("Please enter a valid number without commas or special characters")
    }
  }

  const handleBasicPayChange = (value: number[]) => {
    const percentage = value[0]
    if (percentage < 50) {
      setError("Basic Pay Percentage must be 50% or greater")
      setBasicPayPercentage(50)
    } else {
      setBasicPayPercentage(percentage)
      setError("")
    }
  }

  const salaryValue = salary ? Number(salary) : 0
  const taxResults = calculateTax(salaryValue, basicPayPercentage, employerPfIncluded, considerGratuity)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
  }

  return (
      <TooltipProvider>
        <motion.div
            className="max-w-6xl mx-auto space-y-6 px-4 py-6"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Card className="border border-border/40 shadow-sm overflow-hidden bg-gradient-to-br from-background to-muted/30">
              <CardHeader className="pb-2 pt-6 px-6" />
              <CardContent className="p-6 pt-2">
                <div className="space-y-6">
                  <div className="space-y-3">
                    {/* Flex container for label and formatted salary */}
                    <div className="flex items-center justify-between">
                      <div>
                        <Label
                            htmlFor="salary"
                            className="text-sm font-medium text-muted-foreground uppercase tracking-wider"
                        >
                          YOUR CTC (Annual Gross Salary)
                        </Label>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Enter your total annual salary before any deductions
                        </p>
                      </div>
                      {salaryValue > 0 && (
                          <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="flex items-center gap-2 text-sm font-medium"
                          >
                        <span className="px-3 py-1 bg-primary/10 rounded-full text-primary">
                          {formatCurrency(salaryValue)}
                        </span>
                            <span className="text-muted-foreground">({formatLPA(salaryValue)})</span>
                          </motion.div>
                      )}
                    </div>

                    {/* Input field */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        <IndianRupee className="h-4 w-4" />
                      </div>
                      <Input
                          id="salary"
                          type="text"
                          placeholder="e.g. 1200000"
                          value={salary}
                          onChange={handleSalaryChange}
                          className="pl-10 h-12 text-lg transition-all border-border/60 focus-visible:ring-primary/20 rounded-lg"
                      />
                    </div>
                    <AnimatePresence>
                      {error && (
                          <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-sm text-destructive mt-1"
                          >
                            {error}
                          </motion.p>
                      )}
                    </AnimatePresence>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Salary Structure Options */}
                    <div className="space-y-5">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                        SALARY STRUCTURE OPTIONS
                      </h3>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Briefcase className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <Label htmlFor="employer-pf" className="cursor-pointer font-medium">
                                Employer PF
                              </Label>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Include Employer's PF contribution in CTC
                              </p>
                            </div>
                          </div>
                          <Switch
                              id="employer-pf"
                              checked={employerPfIncluded}
                              onCheckedChange={setEmployerPfIncluded}
                              className="data-[state=checked]:bg-primary"
                          />
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                              <Award className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <Label htmlFor="gratuity" className="cursor-pointer font-medium">
                                Gratuity
                              </Label>
                              <p className="text-xs text-muted-foreground mt-0.5">Include Gratuity contribution in CTC</p>
                            </div>
                          </div>
                          <Switch
                              id="gratuity"
                              checked={considerGratuity}
                              onCheckedChange={setConsiderGratuity}
                              className="data-[state=checked]:bg-primary"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Right Column - Basic Pay Configuration */}
                    <div className="flex flex-col h-full">
                      <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-5">
                        BASIC PAY CONFIGURATION
                      </h3>
                      <div className="flex flex-col justify-between flex-1 p-4 rounded-lg border border-border/40 bg-background/50 hover:bg-background/80 transition-colors">
                        {/* Top: Setup Section */}
                        <div className="mb-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
                                <Percent className="h-5 w-5 text-primary" />
                              </div>
                              <div>
                                <Label htmlFor="basic-pay-percentage" className="cursor-pointer font-medium">
                                  Basic Pay Percentage
                                </Label>
                                <p className="text-xs text-muted-foreground mt-0.5">Minimum 50% of gross salary</p>
                              </div>
                            </div>
                            <span className="text-sm font-medium bg-primary/10 px-3 py-1.5 rounded-md text-primary">
                            {basicPayPercentage}%
                          </span>
                          </div>
                        </div>

                        {/* Bottom: Slider Section */}
                        <div>
                          <Slider
                              id="basic-pay-percentage"
                              value={[basicPayPercentage]}
                              onValueChange={handleBasicPayChange}
                              min={50}
                              max={100}
                              step={1}
                              className="py-2"
                          />
                          <div className="flex justify-between text-xs text-muted-foreground mt-2">
                            <span>50%</span>
                            <span>75%</span>
                            <span>100%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <AnimatePresence>
            {salaryValue > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 24 }}
                    className="space-y-6"
                >
                  <Card className="border border-border/40 shadow-sm overflow-hidden">
                    <Tabs defaultValue="results" value={activeTab} onValueChange={setActiveTab} className="w-full">
                      <CardHeader className="pb-0 pt-6 px-6">
                        <TabsList className="grid grid-cols-4 w-full h-auto p-1 bg-muted/50">
                          <TabsTrigger
                              value="results"
                              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <Calculator className="h-4 w-4" />
                            <span className="hidden sm:inline">Salary Breakdown</span>
                          </TabsTrigger>
                          <TabsTrigger
                              value="comparison"
                              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <LineChart className="h-4 w-4" />
                            <span className="hidden sm:inline">Compare Salaries</span>
                          </TabsTrigger>
                          <TabsTrigger
                              value="hike"
                              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <TrendingUp className="h-4 w-4" />
                            <span className="hidden sm:inline">Hike Impact</span>
                          </TabsTrigger>
                          <TabsTrigger
                              value="info"
                              className="flex items-center gap-2 py-3 data-[state=active]:bg-background data-[state=active]:shadow-sm"
                          >
                            <Info className="h-4 w-4" />
                            <span className="hidden sm:inline">Tax Slabs</span>
                          </TabsTrigger>
                        </TabsList>
                      </CardHeader>

                      <CardContent className="p-6">
                        <AnimatePresence mode="wait">
                          <motion.div
                              key={activeTab}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                          >
                            <TabsContent value="results" className="mt-0 data-[state=active]:block">
                              <TaxResultsTable
                                  results={taxResults}
                                  gratuityIncluded={considerGratuity}
                                  employerPfIncluded={employerPfIncluded}
                              />
                            </TabsContent>

                            <TabsContent value="comparison" className="mt-0 data-[state=active]:block">
                              <SalaryComparison employerPfIncluded={employerPfIncluded} />
                            </TabsContent>

                            <TabsContent value="hike" className="mt-0 data-[state=active]:block">
                              <HikeImpactTable baseSalary={salaryValue} employerPfIncluded={employerPfIncluded} />
                            </TabsContent>

                            <TabsContent value="info" className="mt-0 data-[state=active]:block">
                              <TaxSlabExplainer />
                            </TabsContent>
                          </motion.div>
                        </AnimatePresence>
                      </CardContent>
                    </Tabs>
                  </Card>

                  <motion.div
                      className="flex justify-center"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                  >
                    <TaxReportDownload
                        results={taxResults}
                        employerPfIncluded={employerPfIncluded}
                        gratuityIncluded={considerGratuity}
                    />
                  </motion.div>
                </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </TooltipProvider>
  )
}

