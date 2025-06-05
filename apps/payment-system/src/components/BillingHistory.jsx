import { useState } from 'react'
import { Download, Search, Filter, Calendar, CreditCard, CheckCircle, AlertCircle, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'

export default function BillingHistory() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [transactions] = useState([
    {
      id: 'inv_001',
      date: '2025-01-15',
      description: 'Pro Plan - Monthly Subscription',
      amount: 19.99,
      status: 'paid',
      method: 'Visa •••• 4242',
      invoiceUrl: '#',
      period: 'Jan 15 - Feb 15, 2025'
    },
    {
      id: 'inv_002',
      date: '2024-12-15',
      description: 'Pro Plan - Monthly Subscription',
      amount: 19.99,
      status: 'paid',
      method: 'Visa •••• 4242',
      invoiceUrl: '#',
      period: 'Dec 15 - Jan 15, 2025'
    },
    {
      id: 'inv_003',
      date: '2024-11-15',
      description: 'Pro Plan - Monthly Subscription',
      amount: 19.99,
      status: 'paid',
      method: 'Visa •••• 4242',
      invoiceUrl: '#',
      period: 'Nov 15 - Dec 15, 2024'
    },
    {
      id: 'inv_004',
      date: '2024-10-15',
      description: 'Pro Plan - Monthly Subscription',
      amount: 19.99,
      status: 'failed',
      method: 'Visa •••• 4242',
      invoiceUrl: '#',
      period: 'Oct 15 - Nov 15, 2024'
    },
    {
      id: 'inv_005',
      date: '2024-09-15',
      description: 'Pro Plan - Monthly Subscription',
      amount: 19.99,
      status: 'paid',
      method: 'Visa •••• 4242',
      invoiceUrl: '#',
      period: 'Sep 15 - Oct 15, 2024'
    },
    {
      id: 'inv_006',
      date: '2024-08-15',
      description: 'Team Plan - Monthly Subscription',
      amount: 39.99,
      status: 'paid',
      method: 'Mastercard •••• 8888',
      invoiceUrl: '#',
      period: 'Aug 15 - Sep 15, 2024'
    },
    {
      id: 'inv_007',
      date: '2024-07-15',
      description: 'Team Plan - Monthly Subscription',
      amount: 39.99,
      status: 'paid',
      method: 'Mastercard •••• 8888',
      invoiceUrl: '#',
      period: 'Jul 15 - Aug 15, 2024'
    },
    {
      id: 'inv_008',
      date: '2024-06-15',
      description: 'Pro Plan - Annual Subscription',
      amount: 199.99,
      status: 'paid',
      method: 'Mastercard •••• 8888',
      invoiceUrl: '#',
      period: 'Jun 15, 2024 - Jun 15, 2025'
    }
  ])

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const getStatusBadge = (status) => {
    const variants = {
      paid: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800'
    }
    
    return (
      <Badge className={variants[status] || variants.paid}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    )
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter
    
    let matchesDate = true
    if (dateFilter !== 'all') {
      const transactionDate = new Date(transaction.date)
      const now = new Date()
      
      switch (dateFilter) {
        case 'last30':
          matchesDate = (now - transactionDate) / (1000 * 60 * 60 * 24) <= 30
          break
        case 'last90':
          matchesDate = (now - transactionDate) / (1000 * 60 * 60 * 24) <= 90
          break
        case 'lastyear':
          matchesDate = (now - transactionDate) / (1000 * 60 * 60 * 24) <= 365
          break
      }
    }
    
    return matchesSearch && matchesStatus && matchesDate
  })

  const totalPaid = transactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0)

  const handleDownloadInvoice = (invoiceId) => {
    // In a real app, this would download the actual invoice
    console.log(`Downloading invoice: ${invoiceId}`)
  }

  const handleDownloadAll = () => {
    // In a real app, this would download all invoices as a ZIP
    console.log('Downloading all invoices')
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Billing History</h2>
          <p className="text-gray-600">View and download your invoices and payment history</p>
        </div>
        <Button onClick={handleDownloadAll}>
          <Download className="h-4 w-4 mr-2" />
          Download All
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalPaid.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">
              Across {transactions.filter(t => t.status === 'paid').length} successful payments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$19.99</div>
            <p className="text-xs text-muted-foreground">
              Pro Plan subscription
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Payment</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Feb 15</div>
            <p className="text-xs text-muted-foreground">
              $19.99 for Pro Plan
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>
            Search and filter your billing history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by description or invoice ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="last30">Last 30 Days</SelectItem>
                <SelectItem value="last90">Last 90 Days</SelectItem>
                <SelectItem value="lastyear">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>
            {filteredTransactions.length} of {transactions.length} transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{transaction.id}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString()}
                    </TableCell>
                    <TableCell>{transaction.description}</TableCell>
                    <TableCell className="text-sm text-gray-600">
                      {transaction.period}
                    </TableCell>
                    <TableCell>{transaction.method}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        {getStatusBadge(transaction.status)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ${transaction.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction.id)}
                        disabled={transaction.status !== 'paid'}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Failed Payments Alert */}
      {transactions.some(t => t.status === 'failed') && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-red-800">Failed Payment Detected</h3>
                <p className="text-sm text-red-700 mt-1">
                  You have {transactions.filter(t => t.status === 'failed').length} failed payment(s). 
                  Please update your payment method to avoid service interruption.
                </p>
                <div className="mt-3 flex space-x-3">
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    Update Payment Method
                  </Button>
                  <Button size="sm" variant="outline" className="border-red-300 text-red-700 hover:bg-red-100">
                    Retry Payment
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tax Information */}
      <Card>
        <CardHeader>
          <CardTitle>Tax Information</CardTitle>
          <CardDescription>
            Download tax documents and statements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">2024 Tax Summary</h4>
                <p className="text-sm text-gray-600">Annual summary of all payments and taxes</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">2023 Tax Summary</h4>
                <p className="text-sm text-gray-600">Annual summary of all payments and taxes</p>
              </div>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

