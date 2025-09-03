"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ethers } from "ethers"
import { getContract } from "@/lib/contractConfig"

export default function ManageOfficersPage() {
  const { toast } = useToast()
  
  // Blockchain integration states
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [isOwner, setIsOwner] = useState(false)
  const [officerAddress, setOfficerAddress] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [officers, setOfficers] = useState<string[]>([])
  const [isLoadingOfficers, setIsLoadingOfficers] = useState(false)
  
  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (account) return; // Already connected
    
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        
        // Check if the connected account is the contract owner
        await checkOwnerStatus(accounts[0]);
        
        toast({
          title: "Wallet Connected",
          description: `Connected to wallet: ${accounts[0].substring(0, 6)}...${accounts[0].substring(accounts[0].length - 4)}`,
          variant: "default",
        });
        
        // Load officers if the connected account is the owner
        if (isOwner) {
          loadOfficers();
        }
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
  
  // Check if the connected account is the contract owner
  const checkOwnerStatus = async (address: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        // Try to use the owner() function if it exists
        const contractOwner = await contract.owner();
        const isContractOwner = contractOwner.toLowerCase() === address.toLowerCase();
        setIsOwner(isContractOwner);
        
        if (!isContractOwner) {
          toast({
            title: "Access Restricted",
            description: "Only the contract owner can manage police officers.",
            variant: "destructive",
          });
        } else {
          // Load officers if the connected account is the owner
          loadOfficers();
        }
      } catch (ownerError) {
        console.error("Error with owner() function:", ownerError);
        // Fallback: For testing purposes, you can set a specific address as owner
        // Remove this in production and ensure the contract has an owner() function
        const hardcodedOwner = "0x3033C34AA1b345EAc587E930c777A05683636B1f"; // Same as contract address for testing
        const isHardcodedOwner = hardcodedOwner.toLowerCase() === address.toLowerCase();
        setIsOwner(isHardcodedOwner);
        
        if (isHardcodedOwner) {
          toast({
            title: "Owner Access Granted (Test Mode)",
            description: "You have been granted owner access for testing.",
            variant: "default",
          });
          loadOfficers();
        }
      }
    } catch (error) {
      console.error("Error checking owner status:", error);
      setIsOwner(false);
    }
  };
  
  // Load all police officers
  const loadOfficers = async () => {
    if (!window.ethereum || !account || !isOwner) return;
    
    setIsLoadingOfficers(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        // Try to use the getAllPoliceOfficers function if it exists
        const officersList = await contract.getAllPoliceOfficers();
        setOfficers(officersList);
      } catch (functionError) {
        console.error("Error with getAllPoliceOfficers function:", functionError);
        // For testing purposes, you can set some mock data
        toast({
          title: "Test Mode Active",
          description: "Using mock data for police officers. In production, ensure the contract has getAllPoliceOfficers function.",
          variant: "default",
        });
        // Mock empty list for now - in a real app you might want to use events or other methods to get officers
        setOfficers([]);
      }
    } catch (error) {
      console.error("Error loading police officers:", error);
      toast({
        title: "Loading Failed",
        description: "Failed to load police officers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingOfficers(false);
    }
  };
  
  // Add a police officer
  const addPoliceOfficer = async () => {
    if (!window.ethereum || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to add a police officer.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only the contract owner can add police officers.",
        variant: "destructive",
      });
      return;
    }
    
    if (!officerAddress) {
      toast({
        title: "Missing Address",
        description: "Please enter an Ethereum address.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate Ethereum address format (0x followed by 40 hex characters)
    if (!ethers.isAddress(officerAddress)) {
      toast({
        title: "Invalid Ethereum Address",
        description: "Please enter a valid Ethereum address (0x followed by 40 hexadecimal characters).",
        variant: "destructive",
      });
      return;
    }
    
    // Check if address is already registered as an officer
    if (officers.includes(officerAddress.toLowerCase())) {
      toast({
        title: "Duplicate Officer",
        description: "This address is already registered as a police officer.",
        variant: "destructive",
      });
      return;
    }
    
    setIsAdding(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        const tx = await contract.addPoliceOfficer(officerAddress);
        await tx.wait();
        
        toast({
          title: "Officer Added",
          description: `Police officer ${officerAddress.substring(0, 6)}...${officerAddress.substring(officerAddress.length - 4)} has been added.`,
          variant: "default",
        });
        
        // Refresh the officers list
        loadOfficers();
        setOfficerAddress('');
      } catch (error) {
        console.error("Transaction rejected by user:", error);
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in MetaMask. The officer was not added.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error adding police officer:", error);
      toast({
        title: "Addition Failed",
        description: "Failed to add police officer. The address might already be registered.",
        variant: "destructive",
      });
    } finally {
      setIsAdding(false);
    }
  };
  
  // Remove a police officer
  const removePoliceOfficer = async (address: string) => {
    if (!window.ethereum || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to remove a police officer.",
        variant: "destructive",
      });
      return;
    }
    
    if (!isOwner) {
      toast({
        title: "Access Denied",
        description: "Only the contract owner can remove police officers.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRemoving(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        const tx = await contract.removePoliceOfficer(address);
        await tx.wait();
      
        toast({
          title: "Officer Removed",
          description: `Police officer ${address.substring(0, 6)}...${address.substring(address.length - 4)} has been removed.`,
          variant: "default",
        });
        
        // Refresh the officers list
        loadOfficers();
      } catch (error) {
        console.error("Transaction rejected by user:", error);
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in MetaMask. The officer was not removed.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error removing police officer:", error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove police officer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRemoving(false);
    }
  };
  
  // Format Ethereum address for display
  const formatAddress = (address: string) => {
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
              {isConnecting ? "Connecting..." : account ? `Connected: ${formatAddress(account)}` : "Connect Wallet"}
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
                <CardTitle className="text-2xl font-bold">Manage Police Officers</CardTitle>
                <CardDescription>
                  {isOwner 
                    ? "Add or remove police officers who can update FIR status" 
                    : "Only the contract owner can manage police officers"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {isOwner && (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="officerAddress">Officer Address</Label>
                        <div className="flex space-x-2">
                          <Input
                            id="officerAddress"
                            placeholder="Enter Ethereum address"
                            value={officerAddress}
                            onChange={(e) => setOfficerAddress(e.target.value)}
                            className="flex-1"
                          />
                          <Button 
                            onClick={addPoliceOfficer} 
                            disabled={isAdding || !officerAddress}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            {isAdding ? "Adding..." : "Add Officer"}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-4">Registered Police Officers</h3>
                        {isLoadingOfficers ? (
                          <div className="text-center py-4">Loading officers...</div>
                        ) : officers.length > 0 ? (
                          <div className="space-y-2">
                            {officers.map((officer, index) => (
                              <div key={index} className="flex items-center justify-between p-3 bg-white border rounded-lg">
                                <span>{formatAddress(officer)}</span>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => removePoliceOfficer(officer)}
                                  disabled={isRemoving}
                                >
                                  Remove
                                </Button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-4 text-gray-500">No police officers registered yet.</div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {!account && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-amber-800 font-medium">Wallet Not Connected</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Please connect your wallet to manage police officers.
                      </p>
                    </div>
                  )}
                  
                  {account && !isOwner && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-800 font-medium">Access Restricted</p>
                      <p className="text-sm text-red-700 mt-1">
                        Only the contract owner can manage police officers. Please connect with the owner account.
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