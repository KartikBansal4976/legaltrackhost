"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ethers } from "ethers"
import { getContract } from "@/lib/contractConfig"

export default function UpdateFIRPage() {
  const { toast } = useToast()
  
  // Blockchain integration states
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isPoliceOfficer, setIsPoliceOfficer] = useState(false)
  const [firId, setFirId] = useState<string>('')
  const [status, setStatus] = useState<string>('UnderInvestigation')
  const [isLoading, setIsLoading] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [firDetails, setFirDetails] = useState<any>(null)
  
  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (account) return; // Already connected
    
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        
        // Check if the connected account is a police officer
        await checkPoliceOfficerStatus(accounts[0]);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to wallet: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          variant: "default",
        });
      } else {
        toast({
          title: "MetaMask Not Found",
          description: "Please install MetaMask browser extension to use blockchain features.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error connecting to wallet:", error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect to your wallet. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };
  
  // Check if the connected account is a police officer
  const checkPoliceOfficerStatus = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      // This assumes your contract has a function to check if an address is a police officer
      const isOfficer = await contract.isPoliceOfficer(address);
      setIsPoliceOfficer(isOfficer);
      
      if (!isOfficer) {
        toast({
          title: "Access Restricted",
          description: "Only registered police officers can update FIR status.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error checking police officer status:", error);
      setIsPoliceOfficer(false);
    }
  };
  
  // Get FIR details from blockchain
  const getFIRDetails = async () => {
    if (!window.ethereum || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to view FIR details.",
        variant: "destructive",
      });
      return;
    }
    
    if (!firId) {
      toast({
        title: "Missing FIR ID",
        description: "Please enter an FIR ID.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate FIR ID format (should be a positive integer)
    if (isNaN(parseInt(firId)) || parseInt(firId) <= 0 || !(/^\d+$/.test(firId))) {
      toast({
        title: "Invalid FIR ID",
        description: "FIR ID must be a positive number.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setFirDetails(null);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        const fir = await contract.getFIR(parseInt(firId));
        
        // Format the FIR details
        const formattedFir = {
          id: parseInt(firId),
          cid: fir.cid,
          status: fir.status,
          complainant: fir.complainant,
          policeOfficer: fir.policeOfficer,
          timestamp: new Date(Number(fir.timestamp) * 1000).toLocaleString(),
        };
        
        setFirDetails(formattedFir);
        setStatus(formattedFir.status);
      } catch (error) {
        console.error("Transaction rejected or failed:", error);
        toast({
          title: "Transaction Failed",
          description: "The transaction was rejected or failed. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching FIR details:", error);
      toast({
        title: "Fetch Failed",
        description: "Failed to fetch FIR details. The FIR might not exist or you may not have permission to view it.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update FIR status
  const updateFIRStatus = async () => {
    if (!window.ethereum || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to update FIR status.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isPoliceOfficer) {
      toast({
        title: "Access Denied",
        description: "Only registered police officers can update FIR status.",
        variant: "destructive",
      });
      return;
    }
    
    if (!firDetails) {
      toast({
        title: "No FIR Selected",
        description: "Please fetch an FIR first before updating its status.",
        variant: "destructive",
      });
      return;
    }
    
    setIsUpdating(true);
    
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        const tx = await contract.updateFIRStatus(firDetails.id, status);
        await tx.wait();
        
        // Update the local FIR details
        setFirDetails({
          ...firDetails,
          status: status
        });
        
        toast({
          title: "Status Updated",
          description: `FIR #${firDetails.id} status has been updated to ${status}.`,
          variant: "default",
        });
      } catch (error) {
        console.error("Transaction rejected by user:", error);
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in MetaMask. The FIR status was not updated.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating FIR status:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update FIR status. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };
  
  // Format Ethereum address for display
  const formatAddress = (address: string) => {
    if (!address || address === '0x0000000000000000000000000000000000000000') {
      return 'Not Assigned';
    }
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1 py-12">
        <div className="container">
          <div className="flex justify-end mb-4 max-w-3xl mx-auto">
            <Button
              onClick={connectWallet}
              disabled={isConnecting || !!account}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isConnecting ? "Connecting..." : account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : "Connect Wallet"}
            </Button>
          </div>
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold">Update FIR Status</CardTitle>
                <CardDescription>
                  {isPoliceOfficer 
                    ? "Update the status of an existing FIR" 
                    : "Only registered police officers can update FIR status"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="firId">FIR ID</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="firId"
                        placeholder="Enter FIR ID"
                        value={firId}
                        onChange={(e) => setFirId(e.target.value)}
                        type="number"
                        min="1"
                        className="flex-1"
                        disabled={!account || !isPoliceOfficer}
                      />
                      <Button 
                        onClick={getFIRDetails} 
                        disabled={isLoading || !account || !isPoliceOfficer}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {isLoading ? "Loading..." : "Fetch FIR"}
                      </Button>
                    </div>
                  </div>
                  
                  {firDetails && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 space-y-4"
                    >
                      <div className="p-4 bg-white border rounded-lg shadow-sm">
                        <h3 className="text-lg font-semibold mb-4">FIR #{firDetails.id} Details</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm font-medium text-gray-500">IPFS CID</p>
                            <p className="font-medium break-all">{firDetails.cid}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Current Status</p>
                            <p className="font-medium">{firDetails.status}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Complainant</p>
                            <p className="font-medium">{formatAddress(firDetails.complainant)}</p>
                          </div>
                          
                          <div>
                            <p className="text-sm font-medium text-gray-500">Police Officer</p>
                            <p className="font-medium">{formatAddress(firDetails.policeOfficer)}</p>
                          </div>
                          
                          <div className="md:col-span-2">
                            <p className="text-sm font-medium text-gray-500">Timestamp</p>
                            <p className="font-medium">{firDetails.timestamp}</p>
                          </div>
                        </div>
                        
                        <div className="mt-6 space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="status">Update Status</Label>
                            <Select
                              value={status}
                              onValueChange={setStatus}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Registered">Registered</SelectItem>
                                <SelectItem value="UnderInvestigation">Under Investigation</SelectItem>
                                <SelectItem value="PendingEvidence">Pending Evidence</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Closed">Closed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Button 
                            onClick={updateFIRStatus} 
                            disabled={isUpdating || !isPoliceOfficer || status === firDetails.status}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isUpdating ? "Updating..." : "Update Status"}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  
                  {!account && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 font-medium">Wallet Not Connected</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Please connect your wallet to update FIR status.
                      </p>
                    </div>
                  )}
                  
                  {account && !isPoliceOfficer && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">Access Restricted</p>
                      <p className="text-sm text-red-700 mt-1">
                        Only registered police officers can update FIR status. Please connect with an authorized account.
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  )
}