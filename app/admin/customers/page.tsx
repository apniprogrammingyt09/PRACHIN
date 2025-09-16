"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Search, MoreHorizontal, Mail, Phone, X, ArrowUpDown, Download, UserPlus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { useData } from "@/contexts/data-context"

export default function CustomersPage() {
  const { customers, refreshCustomers, isCustomersCached } = useData()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [sortBy, setSortBy] = useState("name-asc")
  const [filteredCustomers, setFilteredCustomers] = useState<any[]>([])
  const { toast } = useToast()

  useEffect(() => {
    if (!isCustomersCached) {
      refreshCustomers()
    }
  }, [isCustomersCached, refreshCustomers])

  useEffect(() => {
    filterCustomers(searchQuery, statusFilter, sortBy)
  }, [customers, searchQuery, statusFilter, sortBy])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const handleStatusChange = (value: string) => {
    setStatusFilter(value)
  }

  const handleSortChange = (value: string) => {
    setSortBy(value)
  }

  const filterCustomers = (search: string, status: string, sort: string) => {
    let filtered = [...customers]

    // Filter by search
    if (search) {
      const query = search.toLowerCase()
      filtered = filtered.filter(
        (customer) =>
          `${customer.firstName} ${customer.lastName}`.toLowerCase().includes(query) ||
          customer.email.toLowerCase().includes(query) ||
          customer.phone?.includes(query),
      )
    }

    // Filter by status
    if (status !== "All") {
      filtered = filtered.filter((customer) => customer.status === status)
    }

    // Sort customers
    switch (sort) {
      case "name-asc":
        filtered.sort((a, b) => `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`))
        break
      case "name-desc":
        filtered.sort((a, b) => `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`))
        break
      case "orders-asc":
        filtered.sort((a, b) => a.totalOrders - b.totalOrders)
        break
      case "orders-desc":
        filtered.sort((a, b) => b.totalOrders - a.totalOrders)
        break
      case "spent-asc":
        filtered.sort((a, b) => a.totalSpent - b.totalSpent)
        break
      case "spent-desc":
        filtered.sort((a, b) => b.totalSpent - a.totalSpent)
        break
      case "date-asc":
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        break
      case "date-desc":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      default:
        break
    }

    setFilteredCustomers(filtered)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#2D5016]">Customers</h1>
          <p className="text-[#4A7C59]">Manage your customer database</p>
        </div>
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" className="border-green-200 text-[#2D5016] bg-transparent">
            <Download className="h-4 w-4 mr-2" /> Export
          </Button>
          <Button className="bg-[#4A7C59] hover:bg-[#2D5016] text-white">
            <UserPlus className="h-4 w-4 mr-2" /> Add Customer
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59] h-4 w-4" />
              <Input
                placeholder="Search customers by name, email, or phone..."
                value={searchQuery}
                onChange={handleSearch}
                className="pl-9 border-green-200 focus-visible:ring-[#4A7C59]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#4A7C59]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-[180px] border-green-200 focus:ring-[#D4915D]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={handleSortChange}>
                <SelectTrigger className="w-[180px] border-green-200 focus:ring-[#D4915D]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                  <SelectItem value="name-desc">Name (Z-A)</SelectItem>
                  <SelectItem value="orders-desc">Orders (High to Low)</SelectItem>
                  <SelectItem value="orders-asc">Orders (Low to High)</SelectItem>
                  <SelectItem value="spent-desc">Spent (High to Low)</SelectItem>
                  <SelectItem value="spent-asc">Spent (Low to High)</SelectItem>
                  <SelectItem value="date-desc">Join Date (Newest First)</SelectItem>
                  <SelectItem value="date-asc">Join Date (Oldest First)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customers Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-green-50 border-b border-green-200">
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Customer
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Contact</th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Orders
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Total Spent
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">Status</th>
                  <th className="px-4 py-3 text-left text-[#2D5016] font-medium">
                    <div className="flex items-center">
                      Join Date
                      <ArrowUpDown className="ml-1 h-4 w-4" />
                    </div>
                  </th>
                  <th className="w-[80px] px-4 py-3 text-right text-[#2D5016] font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-[#4A7C59]">
                      {customers.length === 0
                        ? "No customers found. Customers will appear here once orders are placed."
                        : "No customers found. Try adjusting your filters."}
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer) => (
                    <motion.tr
                      key={customer._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="border-b border-green-200 last:border-0 hover:bg-green-50"
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-[#2D5016]">
                          {customer.firstName} {customer.lastName}
                        </div>
                        <div className="text-sm text-[#4A7C59]">ID: {customer._id.slice(-8)}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center text-[#4A7C59] text-sm">
                          <Mail className="h-3 w-3 mr-1" /> {customer.email}
                        </div>
                        {customer.phone && (
                          <div className="flex items-center text-[#4A7C59] text-sm mt-1">
                            <Phone className="h-3 w-3 mr-1" /> {customer.phone}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-[#2D5016]">{customer.totalOrders}</td>
                      <td className="px-4 py-3 font-medium text-[#4A7C59]">₹{customer.totalSpent.toFixed(2)}</td>
                      <td className="px-4 py-3">
                        <Badge
                          className={`${
                            customer.status === "active"
                              ? "bg-green-100 text-green-800 hover:bg-green-100"
                              : "bg-gray-100 text-gray-800 hover:bg-gray-100"
                          }`}
                        >
                          {customer.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-[#4A7C59]">{new Date(customer.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Customer</DropdownMenuItem>
                            <DropdownMenuItem>View Orders</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600">Delete Customer</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </motion.tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
