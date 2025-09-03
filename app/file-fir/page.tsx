// Add animations to the FIR filing page

"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import ChatbotButton from "@/components/chatbot-button"
import jsPDF from "jspdf"
import axios from "axios"
import { ethers } from "ethers"
import { getContract } from "@/lib/contractConfig"

export default function FileFIRPage() {
  const [activeTab, setActiveTab] = useState("personal")
  const { toast } = useToast()
  
  // Blockchain integration states
  const [account, setAccount] = useState<string | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [idType, setIdType] = useState("aadhar")
  const [idNumber, setIdNumber] = useState("")

  const [incidentDate, setIncidentDate] = useState("")
  const [incidentTime, setIncidentTime] = useState("")
  const [incidentLocation, setIncidentLocation] = useState("")
  const [incidentDescription, setIncidentDescription] = useState("")
  const [incidentType, setIncidentType] = useState("theft")
  const [witnesses, setWitnesses] = useState("")

  // File upload status state
  const [uploadedFile, setUploadedFile] = useState(null)
  const [isUploaded, setIsUploaded] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
  }

  // Generate a simple hash for demonstration (in production, use crypto-js or similar)
  const generateFileHash = (input: string) => {
    let hash = 0
    if (input.length === 0) return hash.toString(16)
    
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    
    // Convert to a longer hex string to simulate SHA-256
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0')
    return hexHash.repeat(8) // Repeat to make it look like a real hash
  }

  const generatePdf = () => {
    const doc = new jsPDF()
    doc.setFontSize(16)
    doc.text("Online FIR Report", 20, 20)

    doc.setFontSize(12)
    doc.text(`Name: ${firstName} ${lastName}`, 20, 40)
    doc.text(`Email: ${email}`, 20, 50)
    doc.text(`Phone: ${phone}`, 20, 60)
    doc.text(`Address: ${address}`, 20, 70)
    doc.text(`ID: ${idType} - ${idNumber}`, 20, 80)

    doc.text("Incident Details:", 20, 100)
    doc.text(`Date: ${incidentDate}`, 20, 110)
    doc.text(`Time: ${incidentTime}`, 20, 120)
    doc.text(`Location: ${incidentLocation}`, 20, 130)
    doc.text(`Type: ${incidentType}`, 20, 140)
    doc.text(`Description: ${incidentDescription}`, 20, 150)
    doc.text(`Witnesses: ${witnesses}`, 20, 160)

    return doc.output("blob")
  }

  // Connect to MetaMask wallet
  const connectWallet = async () => {
    if (account) return; // Already connected
    
    setIsConnecting(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const accounts = await provider.send("eth_requestAccounts", []);
        setAccount(accounts[0]);
        
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
  
  // Register FIR on blockchain
  const registerFIROnBlockchain = async (cid: string) => {
    if (!window.ethereum || !account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet first to register the FIR on blockchain.",
        variant: "destructive",
      });
      return false;
    }
    
    setIsRegistering(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = getContract(signer);
      
      try {
        const tx = await contract.registerFIR(cid);
        await tx.wait();
        
        toast({
          title: "FIR Registered on Blockchain",
          description: "Your FIR has been permanently registered on the blockchain.",
          variant: "default",
        });
        
        return true;
      } catch (error) {
        console.error("Transaction rejected by user:", error);
        toast({
          title: "Transaction Rejected",
          description: "You rejected the transaction in MetaMask. The FIR was not registered on the blockchain.",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error("Error registering FIR on blockchain:", error);
      toast({
        title: "Registration Failed",
        description: "Failed to register FIR on blockchain. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsRegistering(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLButtonElement>) => {
    e.preventDefault()
    try {
      const pdfBlob = generatePdf()
      const formData = new FormData()
      formData.append("file", pdfBlob, "fir.pdf")

      const ipfsRes = await axios.post("http://localhost:3001/upload", formData)
      const contentHash = ipfsRes.data.ipfsHash
      
      // Store the uploaded file information
      setUploadedFile({
        cid: contentHash,
        id: `${Date.now()}-fir.pdf`,
        size: `${(pdfBlob.size / 1024).toFixed(2)} KB`,
        creationDate: new Date().toLocaleDateString(),
        fileName: "fir.pdf",
        blockchainRegistered: false
      })
      setIsUploaded(true)
      
      // Show success message and switch to status tab
      toast({
        title: "FIR Uploaded Successfully!",
        description: `Your FIR has been uploaded to IPFS with CID: ${contentHash}`,
        variant: "default",
      })
      
      // Switch to status tab to show the uploaded file details
      setActiveTab("status")
    } catch (err) {
      console.error("Upload error:", err)
      toast({
        title: "Upload Failed",
        description: "Failed to upload FIR to IPFS. Please try again.",
        variant: "destructive",
      })
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }
  

  return (
    <div className="flex min-h-screen flex-col">
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
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-2">Online FIR Filing</h1>
              <p className="text-lg text-muted-foreground">
                File a First Information Report online without visiting the police station
              </p>
            </div>

            <Tabs defaultValue="personal" value={activeTab} onValueChange={handleTabChange}>
              <TabsList className="grid w-full grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal Details</TabsTrigger>
                <TabsTrigger value="incident">Incident Details</TabsTrigger>
                <TabsTrigger value="review">Review & Submit</TabsTrigger>
                <TabsTrigger value="status">Status</TabsTrigger>
              </TabsList>

              <TabsContent value="personal">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>Personal Information</CardTitle>
                    <CardDescription>Provide your contact details for the FIR</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                      <motion.div variants={item} className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="first-name">First Name</Label>
                          <Input id="first-name" placeholder="Enter first name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="last-name">Last Name</Label>
                          <Input id="last-name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          placeholder="Enter a valid email address"
                        />
                        {email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid email address</p>
                        )}
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={phone} 
                          onChange={(e) => {
                            // Only allow digits in phone number
                            const value = e.target.value.replace(/\D/g, '');
                            setPhone(value);
                          }} 
                          placeholder="Enter 10-digit phone number"
                        />
                        {phone && (phone.length < 10 || phone.length > 10) && (
                          <p className="text-red-500 text-sm mt-1">Phone number must be exactly 10 digits</p>
                        )}
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="address">Residential Address</Label>
                        <Textarea id="address" placeholder="Enter your full address" value={address} onChange={(e) => setAddress(e.target.value)} />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="id-type">ID Proof Type</Label>
                        <RadioGroup defaultValue="aadhar" onValueChange={setIdType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="aadhar" id="aadhar" />
                            <Label htmlFor="aadhar">Aadhar Card</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pan" id="pan" />
                            <Label htmlFor="pan">PAN Card</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="voter" id="voter" />
                            <Label htmlFor="voter">Voter ID</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="passport" id="passport" />
                            <Label htmlFor="passport">Passport</Label>
                          </div>
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="id-number">ID Number</Label>
                        <Input 
                          id="id-number" 
                          value={idNumber} 
                          onChange={(e) => setIdNumber(e.target.value)} 
                          placeholder={idType === "aadhar" ? "Enter 12-digit Aadhaar Number" : 
                                      idType === "pan" ? "Enter 10-character PAN Number" : 
                                      idType === "voter" ? "Enter Voter ID Number" : 
                                      "Enter Passport Number"} 
                        />
                        {idType === "aadhar" && idNumber && idNumber.length !== 12 && (
                          <p className="text-red-500 text-sm mt-1">Aadhaar number must be exactly 12 digits</p>
                        )}
                        {idType === "pan" && idNumber && idNumber.length !== 10 && (
                          <p className="text-red-500 text-sm mt-1">PAN number must be exactly 10 characters</p>
                        )}
                        {idType === "voter" && idNumber && idNumber.length < 10 && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid Voter ID</p>
                        )}
                        {idType === "passport" && idNumber && idNumber.length < 8 && (
                          <p className="text-red-500 text-sm mt-1">Please enter a valid Passport number</p>
                        )}
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-end bg-primary/5 border-t">
                    <Button 
                      onClick={() => {
                        // Validate ID number before proceeding
                        if (idType === "aadhar" && (idNumber.length !== 12 || !/^\d{12}$/.test(idNumber))) {
                          toast({
                            title: "Invalid Aadhaar Number",
                            description: "Please enter a valid 12-digit Aadhaar number",
                            variant: "destructive",
                          });
                          return;
                        } else if (idType === "pan" && idNumber.length !== 10) {
                          toast({
                            title: "Invalid PAN Number",
                            description: "Please enter a valid 10-character PAN number",
                            variant: "destructive",
                          });
                          return;
                        } else if (idType === "voter" && idNumber.length < 10) {
                          toast({
                            title: "Invalid Voter ID",
                            description: "Please enter a valid Voter ID number",
                            variant: "destructive",
                          });
                          return;
                        } else if (idType === "passport" && idNumber.length < 8) {
                          toast({
                            title: "Invalid Passport Number",
                            description: "Please enter a valid Passport number",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // All validations passed, proceed to next tab
                        setActiveTab("incident");
                      }} 
                      className="btn-blue-gradient"
                    >
                      Next: Incident Details
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="incident">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>Incident Details</CardTitle>
                    <CardDescription>Provide information about the incident</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6 p-6">
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="incident-date">Date of Incident</Label>
                        <Input id="incident-date" type="date" value={incidentDate} onChange={(e) => setIncidentDate(e.target.value)} />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="incident-time">Time of Incident</Label>
                        <Input id="incident-time" type="time" value={incidentTime} onChange={(e) => setIncidentTime(e.target.value)} />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="incident-location">Location of Incident</Label>
                        <Input id="incident-location" value={incidentLocation} onChange={(e) => setIncidentLocation(e.target.value)} />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="incident-description">Detailed Description</Label>
                        <Textarea id="incident-description" value={incidentDescription} onChange={(e) => setIncidentDescription(e.target.value)} />
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label>Type of Incident</Label>
                        <RadioGroup defaultValue="theft" onValueChange={setIncidentType}>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="theft" id="theft" />
                            <Label htmlFor="theft">Theft/Robbery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="assault" id="assault" />
                            <Label htmlFor="assault">Assault/Battery</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fraud" id="fraud" />
                            <Label htmlFor="fraud">Fraud/Cheating</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="property" id="property" />
                            <Label htmlFor="property">Property Dispute</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="cybercrime" id="cybercrime" />
                            <Label htmlFor="cybercrime">Cybercrime</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Other</Label>
                          </div>
                        </RadioGroup>
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="witnesses">Witnesses (if any)</Label>
                        <Textarea id="witnesses" value={witnesses} onChange={(e) => setWitnesses(e.target.value)} placeholder="Enter names and contact details of witnesses"/>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-primary/5 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("personal")} className="btn-outline-gradient">
                      Back
                    </Button>
                    <Button onClick={() => setActiveTab("review")} className="btn-blue-gradient">
                      Next: Review
                    </Button>
                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="review">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle>Review & Submit</CardTitle>
                    <CardDescription>Review your information before final submission</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6">
                      <motion.div variants={item}>
                        <h3 className="font-semibold mb-2">Personal Information</h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <p>Name: {firstName} {lastName}</p>
                          <p>Contact: {email} | {phone}</p>
                          <p>Address: {address}</p>
                          <p>ID: {idType.charAt(0).toUpperCase() + idType.slice(1)} - {idNumber}</p>
                        </div>
                      </motion.div>

                      <motion.div variants={item}>
                        <h3 className="font-semibold mb-2">Incident Details</h3>
                        <div className="bg-muted p-4 rounded-lg">
                          <p>Date & Time: {incidentDate} {incidentTime}</p>
                          <p>Location: {incidentLocation}</p>
                          <p>Type: {incidentType.charAt(0).toUpperCase() + incidentType.slice(1)}</p>
                          <p>Description: {incidentDescription}</p>
                          {witnesses && <p>Witnesses: {witnesses}</p>}
                        </div>
                      </motion.div>

                      <motion.div variants={item} className="space-y-2">
                        <Label htmlFor="declaration">Declaration</Label>
                        <div className="flex items-start space-x-2">
                          <input type="checkbox" id="declaration" className="mt-1" />
                          <Label htmlFor="declaration" className="font-normal text-sm">
                            I hereby declare that the information provided by me is true to the best of my knowledge and
                            belief. I understand that filing a false FIR is punishable under the law.
                          </Label>
                        </div>
                      </motion.div>
                    </motion.div>
                  </CardContent>
                  <CardFooter className="flex justify-between bg-primary/5 border-t">
                    <Button variant="outline" onClick={() => setActiveTab("incident")} className="btn-outline-gradient">
                      Back
                    </Button>
                    <Button 
                      className="btn-blue-gradient" 
                      onClick={(e) => {
                        // Validate all required fields before submission
                        if (!firstName || !lastName || !email || !phone || !address || !idNumber) {
                          toast({
                            title: "Missing Personal Information",
                            description: "Please fill in all personal details",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        }
                        
                        // Validate email format
                        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                          toast({
                            title: "Invalid Email",
                            description: "Please enter a valid email address",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        }
                        
                        // Validate phone number (10 digits)
                        if (phone.length !== 10 || !/^\d{10}$/.test(phone)) {
                          toast({
                            title: "Invalid Phone Number",
                            description: "Phone number must be exactly 10 digits",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        }
                        
                        // Validate ID based on type
                        if (idType === "aadhar" && (idNumber.length !== 12 || !/^\d{12}$/.test(idNumber))) {
                          toast({
                            title: "Invalid Aadhaar Number",
                            description: "Please enter a valid 12-digit Aadhaar number",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        } else if (idType === "pan" && idNumber.length !== 10) {
                          toast({
                            title: "Invalid PAN Number",
                            description: "Please enter a valid 10-character PAN number",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        } else if (idType === "voter" && idNumber.length < 10) {
                          toast({
                            title: "Invalid Voter ID",
                            description: "Please enter a valid Voter ID number",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        } else if (idType === "passport" && idNumber.length < 8) {
                          toast({
                            title: "Invalid Passport Number",
                            description: "Please enter a valid Passport number",
                            variant: "destructive",
                          });
                          setActiveTab("personal");
                          return;
                        }
                        
                        // Validate incident details
                        if (!incidentDate || !incidentTime || !incidentLocation || !incidentDescription) {
                          toast({
                            title: "Missing Incident Information",
                            description: "Please fill in all incident details",
                            variant: "destructive",
                          });
                          setActiveTab("incident");
                          return;
                        }
                        
                        // Check declaration checkbox
                        const declarationCheckbox = document.getElementById("declaration") as HTMLInputElement;
                        if (!declarationCheckbox || !declarationCheckbox.checked) {
                          toast({
                            title: "Declaration Required",
                            description: "Please check the declaration checkbox to proceed",
                            variant: "destructive",
                          });
                          return;
                        }
                        
                        // All validations passed, proceed with upload
                        handleUpload(e);
                      }}
                    >
                      Submit FIR
                    </Button>

                  </CardFooter>
                </Card>
              </TabsContent>

              <TabsContent value="status">
                <Card className="border-none shadow-lg">
                  <CardHeader className="bg-primary/5 border-b">
                    <CardTitle className="flex items-center gap-2">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      FIR Submission Result
                    </CardTitle>
                    <CardDescription>Your FIR has been processed and stored securely</CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    {isUploaded && uploadedFile ? (
                      <motion.div variants={container} initial="hidden" animate="show" className="space-y-8">
                        {/* Success Message Banner */}
                        <motion.div variants={item} className="bg-green-50 border border-green-200 rounded-lg p-4 dark:bg-green-950/30 dark:border-green-800">
                          <div className="flex items-center space-x-3">
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-green-800 dark:text-green-200 font-medium text-lg">
                              FIR submitted successfully! Your report has been securely stored on the blockchain.
                            </span>
                          </div>
                        </motion.div>

                        {/* Key Information Boxes */}
                        <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* IPFS Storage Box */}
                          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-950/30 dark:border-blue-800">
                            <h3 className="text-blue-800 dark:text-blue-200 font-bold text-lg mb-3">IPFS Storage</h3>
                            <div className="bg-white dark:bg-gray-800 rounded p-3 mb-2">
                              <p className="text-blue-600 dark:text-blue-300 font-mono text-sm break-all">
                                {uploadedFile.cid}
                              </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">IPFS CID</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(uploadedFile.cid)
                                toast({
                                  title: "CID Copied!",
                                  description: "IPFS CID copied to clipboard",
                                })
                              }}
                              className="mt-2 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                            >
                              Copy CID
                            </Button>
                          </div>

                          {/* File Hash Box */}
                          <div className="bg-green-50 border border-green-200 rounded-lg p-6 dark:bg-green-950/30 dark:border-green-800">
                            <h3 className="text-green-800 dark:text-green-200 font-bold text-lg mb-3">File Hash</h3>
                            <div className="bg-white dark:bg-gray-800 rounded p-3 mb-2">
                              <p className="text-green-600 dark:text-green-300 font-mono text-sm break-all">
                                {generateFileHash(uploadedFile.cid + uploadedFile.id)}
                              </p>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">SHA-256</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => {
                                const hash = generateFileHash(uploadedFile.cid + uploadedFile.id)
                                navigator.clipboard.writeText(hash)
                                toast({
                                  title: "Hash Copied!",
                                  description: "File hash copied to clipboard",
                                })
                              }}
                              className="mt-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200"
                            >
                              Copy Hash
                            </Button>
                          </div>
                        </motion.div>

                        {/* What happens next section */}
                        <motion.div variants={item}>
                          <h3 className="font-bold text-gray-800 dark:text-gray-200 text-lg mb-4">What happens next?</h3>
                          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
                            <ul className="space-y-3 text-gray-700 dark:text-gray-300">
                              <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Your FIR is now permanently stored on the blockchain</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>The file hash ensures document integrity</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>Police can access and update the status</span>
                              </li>
                              <li className="flex items-start gap-3">
                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                                <span>You can track progress using the FIR ID</span>
                              </li>
                            </ul>
                          </div>
                        </motion.div>

                        {/* Action Buttons */}
                        <motion.div variants={item} className="flex flex-col sm:flex-row gap-4 justify-center">
                          <Button 
                            variant="outline"
                            onClick={() => setActiveTab("personal")}
                            className="btn-outline-gradient flex-1 sm:flex-none"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            File Another FIR
                          </Button>
                          
                          <Button 
                            onClick={() => {
                              const pdfBlob = generatePdf()
                              const url = URL.createObjectURL(pdfBlob)
                              const a = document.createElement('a')
                              a.href = url
                              a.download = `FIR_${firstName}_${lastName}_${new Date().toISOString().split('T')[0]}.pdf`
                              document.body.appendChild(a)
                              a.click()
                              document.body.removeChild(a)
                              URL.revokeObjectURL(url)
                              
                              toast({
                                title: "Receipt Downloaded!",
                                description: "Your FIR receipt has been downloaded successfully",
                              })
                            }}
                            className="btn-blue-gradient flex-1 sm:flex-none"
                          >
                            <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Print Receipt
                          </Button>
                          
                          {!uploadedFile.blockchainRegistered && (
                            <Button 
                              onClick={async () => {
                                const success = await registerFIROnBlockchain(uploadedFile.cid);
                                if (success) {
                                  setUploadedFile({...uploadedFile, blockchainRegistered: true});
                                  toast({
                                    title: "Blockchain Registration Complete",
                                    description: "Your FIR is now permanently registered on the blockchain",
                                    variant: "default",
                                  });
                                }
                              }}
                              disabled={isRegistering || !account}
                              className="bg-blue-600 hover:bg-blue-700 text-white flex-1 sm:flex-none"
                            >
                              {isRegistering ? "Registering..." : "Register on Blockchain"}
                            </Button>
                          )}
                          {uploadedFile.blockchainRegistered && (
                            <Button 
                              disabled
                              className="bg-green-600 text-white flex-1 sm:flex-none cursor-default"
                            >
                              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              Registered on Blockchain
                            </Button>
                          )}
                        </motion.div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center py-12"
                      >
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <h3 className="text-lg font-semibold mb-2">No File Uploaded Yet</h3>
                        <p className="text-muted-foreground mb-4">
                          Complete the form and submit your FIR to see the submission result here.
                        </p>
                        <Button 
                          onClick={() => setActiveTab("review")}
                          className="btn-blue-gradient"
                        >
                          Go to Review & Submit
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <motion.div
              className="mt-12 bg-muted p-6 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <h2 className="text-xl font-bold mb-4">Important Information</h2>
              <ul className="space-y-2 list-disc pl-5">
                <li>Filing a false FIR is a punishable offense under Section 182 of IPC</li>
                <li>You will receive a confirmation email with your FIR number after submission</li>
                <li>You may be contacted by the police for additional information</li>
                <li>For emergency situations, please call 100 immediately</li>
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <ChatbotButton />
    </div>
  )
}

