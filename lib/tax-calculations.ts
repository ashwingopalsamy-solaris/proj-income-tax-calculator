export interface TaxResults {
  grossSalary: number
  basicPay:number
  standardDeduction: number
  taxableIncome: number
  incomeTax: number
  cess: number
  totalTax: number
  netSalary: number
  employeePF: number
  employerPF: number
  gratuityAmount: number
  professionalTax: number
  totalDeductions: number
  inHandSalary: number
  inHandSalaryPerMonth: number
}

export function calculateTax(
    grossSalary: number,
    basicPayPercentage: number,
    employerPfIncluded = false,
    considerGratuity = false
): TaxResults {
  // Constants
  const STANDARD_DEDUCTION = 75000
  const PF_RATE = 0.12
  const CESS_RATE = 0.04
  const GRATUITY_RATE = 0.0481

  // Ensure Basic Pay is at least 50% of gross salary
  const actualBasicPayPercentage = Math.max(50, basicPayPercentage)
  const basicPay = grossSalary * (actualBasicPayPercentage / 100)

  // Calculate PF deductions
  const employeePF = basicPay * PF_RATE
  const employerPF = basicPay * PF_RATE

  // Calculate gratuity amount if applicable
  const gratuityAmount = considerGratuity ? basicPay * GRATUITY_RATE : 0

  const totalPFDeduction =employerPfIncluded ? employeePF + employerPF : employeePF

  // Calculate net salary (post-tax)
  const netSalary = grossSalary - gratuityAmount - totalPFDeduction

  // Calculate taxable income:
  // Subtract the employeePF from gross salary.
  // Additionally, if gratuity is considered, subtract the gratuity amount as well.
  const taxableIncome = Math.max(
      0,
      grossSalary -
      STANDARD_DEDUCTION
  )

  // Calculate income tax using the slabs
  const incomeTax =
      0.05 * Math.max(0, Math.min(taxableIncome, 800000) - 400000) +
      0.1 * Math.max(0, Math.min(taxableIncome, 1200000) - 800000) +
      0.15 * Math.max(0, Math.min(taxableIncome, 1600000) - 1200000) +
      0.2 * Math.max(0, Math.min(taxableIncome, 2000000) - 1600000) +
      0.25 * Math.max(0, Math.min(taxableIncome, 2400000) - 2000000) +
      0.3 * Math.max(0, taxableIncome - 2400000)

  // Calculate cess
  const cess = incomeTax * CESS_RATE

  const professionalTax = 12*200

  // Calculate total tax
  const totalTax = incomeTax + cess + professionalTax

  const totalDeductions = gratuityAmount + totalPFDeduction

  // Calculate in-hand salary (post-tax and PF)
  // If employer PF is included, deduct both employee and employer PF
  const inHandSalary = netSalary - totalTax

  const inHandSalaryPerMonth = inHandSalary / 12

  return {
    grossSalary,
    basicPay,
    standardDeduction: STANDARD_DEDUCTION,
    taxableIncome,
    incomeTax,
    cess,
    totalTax,
    netSalary,
    employeePF,
    employerPF,
    gratuityAmount,
    professionalTax,
    totalDeductions,
    inHandSalary,
    inHandSalaryPerMonth,
  }
}
