import { NextResponse } from "next/server"

// Comprehensive IPC sections database for prediction
const ipcSectionsDatabase = {
  "IPC 378": {
    description: "Theft",
    punishment: "Imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    relevance: "Involves dishonestly taking movable property out of the possession of any person without their consent."
  },
  "IPC 379": {
    description: "Punishment for theft",
    punishment: "Imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    relevance: "Standard punishment for theft offenses."
  },
  "IPC 380": {
    description: "Theft in dwelling house",
    punishment: "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    relevance: "Theft committed in a dwelling house or building used for custody of property."
  },
  "IPC 390": {
    description: "Robbery",
    punishment: "Imprisonment for life, or with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine.",
    relevance: "Theft or extortion committed with violence or threat of violence."
  },
  "IPC 392": {
    description: "Punishment for robbery",
    punishment: "Imprisonment for life, or with rigorous imprisonment for a term which may extend to ten years, and shall also be liable to fine.",
    relevance: "Standard punishment for robbery offenses."
  },
  "IPC 302": {
    description: "Murder",
    punishment: "Death, or imprisonment for life, and shall also be liable to fine.",
    relevance: "Causing death with intention to cause death or bodily injury likely to cause death."
  },
  "IPC 304": {
    description: "Culpable homicide not amounting to murder",
    punishment: "Imprisonment for life, or imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    relevance: "Causing death without intention but with knowledge that the act is likely to cause death."
  },
  "IPC 351": {
    description: "Assault",
    punishment: "Imprisonment of either description for a term which may extend to three months, or with fine which may extend to five hundred rupees, or with both.",
    relevance: "Making any gesture or preparation intending or knowing it to be likely that such gesture or preparation will cause any person present to apprehend that he will be subjected to criminal force."
  },
  "IPC 354": {
    description: "Assault or criminal force to woman with intent to outrage her modesty",
    punishment: "Imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    relevance: "Assault or use of criminal force against a woman with intent to outrage her modesty."
  },
  "IPC 420": {
    description: "Cheating and dishonestly inducing delivery of property",
    punishment: "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    relevance: "Cheating and dishonestly inducing any person to deliver any property or valuable security."
  },
  "IPC 415": {
    description: "Cheating",
    punishment: "Varies based on the specific circumstances of the cheating.",
    relevance: "Whoever, by deceiving any person, fraudulently or dishonestly induces that person to deliver any property or valuable security."
  },
  "IPC 406": {
    description: "Punishment for criminal breach of trust",
    punishment: "Imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    relevance: "Criminal breach of trust by a person entrusted with property or dominion over property."
  },
  "IPC 425": {
    description: "Mischief",
    punishment: "Imprisonment of either description for a term which may extend to three months, or with fine, or with both.",
    relevance: "Causing destruction of any property or any change in it which destroys or diminishes its value or utility."
  },
  "IPC 120B": {
    description: "Punishment of criminal conspiracy",
    punishment: "Same as that provided for the abetment of the offence which is the object of the conspiracy.",
    relevance: "When two or more persons agree to do or cause to be done an illegal act or an act which is not illegal by illegal means."
  },
  "IPC 34": {
    description: "Acts done by several persons in furtherance of common intention",
    punishment: "Each person is liable for the act in the same manner as if it were done by him alone.",
    relevance: "When a criminal act is done by several persons in furtherance of the common intention of all."
  },
  "IPC 463": {
    description: "Forgery",
    punishment: "Imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    relevance: "Making a false document or electronic record with intent to cause damage or injury."
  },
  "IPC 441": {
    description: "Criminal trespass",
    punishment: "Imprisonment of either description for a term which may extend to three months, or with fine which may extend to five hundred rupees, or with both.",
    relevance: "Entering into or upon property in the possession of another with intent to commit an offence or to intimidate, insult or annoy any person in possession of such property."
  },
  "IPC 319": {
    description: "Hurt",
    punishment: "Imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.",
    relevance: "Causing bodily pain, disease or infirmity to any person."
  },
  "IPC 323": {
    description: "Voluntarily causing hurt",
    punishment: "Imprisonment of either description for a term which may extend to one year, or with fine which may extend to one thousand rupees, or with both.",
    relevance: "Voluntarily causing hurt to any person."
  },
  "IPC 359": {
    description: "Kidnapping",
    punishment: "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
    relevance: "Taking or enticing away any minor or person of unsound mind out of the keeping of the lawful guardian."
  },
  "IPC 375": {
    description: "Rape",
    punishment: "Imprisonment for life, or with imprisonment of either description for a term which may extend to ten years, and shall also be liable to fine.",
    relevance: "Sexual intercourse with a woman against her will or without her consent."
  },
  "IPC 499": {
    description: "Defamation",
    punishment: "Simple imprisonment for a term which may extend to two years, or with fine, or with both.",
    relevance: "Making or publishing any imputation concerning any person intending to harm, or knowing or having reason to believe that such imputation will harm, the reputation of such person."
  },
  "IPC 383": {
    description: "Extortion",
    punishment: "Imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
    relevance: "Intentionally putting any person in fear of any injury to that person or any other person, and thereby dishonestly inducing that person to deliver any property or valuable security."
  },
  "IPC 124A": {
    description: "Sedition",
    punishment: "Imprisonment for life, or with imprisonment which may extend to three years, and shall also be liable to fine.",
    relevance: "Whoever, by words, either spoken or written, or by signs, or by visible representation, or otherwise, brings or attempts to bring into hatred or contempt, or excites or attempts to excite disaffection towards the Government established by law."
  },
  "IPC 304B": {
    description: "Dowry death",
    punishment: "Imprisonment for life, or with imprisonment for a term which may extend to ten years, and shall also be liable to fine.",
    relevance: "Where the death of a woman is caused by any burns or bodily injury or occurs otherwise than under normal circumstances within seven years of her marriage."
  },
  "IPC 498A": {
    description: "Cruelty by husband or relatives of husband",
    punishment: "Imprisonment for a term which may extend to three years, and shall also be liable to fine.",
    relevance: "Subjecting a woman to cruelty by her husband or any relative of her husband."
  },
  "IPC 304A": {
    description: "Causing death by negligence",
    punishment: "Imprisonment of either description for a term which may extend to two years, or with fine, or with both.",
    relevance: "Causing the death of any person by doing any rash or negligent act not amounting to culpable homicide."
  },
  "IPC 279": {
    description: "Rash driving or riding on a public way",
    punishment: "Imprisonment of either description for a term which may extend to six months, or with fine which may extend to one thousand rupees, or with both.",
    relevance: "Driving or riding any vehicle on a public way in a manner so rash or negligent as to endanger human life or likely to cause hurt or injury to any other person."
  }
}

// Enhanced keyword-based prediction function with context analysis
function predictIPCSections(description: string) {
  // Enhanced keyword mapping with context and synonyms
  const keywordContexts = {
    // Theft and property crimes
    theft: { sections: ["IPC 378", "IPC 379", "IPC 380"], weight: 3, context: "property crime" },
    steal: { sections: ["IPC 378", "IPC 379", "IPC 380"], weight: 3, context: "property crime" },
    stolen: { sections: ["IPC 378", "IPC 379", "IPC 380"], weight: 3, context: "property crime" },
    robbery: { sections: ["IPC 390", "IPC 392", "IPC 394"], weight: 4, context: "violent property crime" },
    rob: { sections: ["IPC 390", "IPC 392", "IPC 394"], weight: 4, context: "violent property crime" },
    
    // Violence and assault
    murder: { sections: ["IPC 302", "IPC 304", "IPC 300"], weight: 5, context: "homicide" },
    kill: { sections: ["IPC 302", "IPC 304", "IPC 300"], weight: 5, context: "homicide" },
    death: { sections: ["IPC 302", "IPC 304", "IPC 300"], weight: 4, context: "homicide" },
    assault: { sections: ["IPC 351", "IPC 352", "IPC 354"], weight: 3, context: "physical violence" },
    attack: { sections: ["IPC 351", "IPC 352", "IPC 354"], weight: 3, context: "physical violence" },
    hit: { sections: ["IPC 319", "IPC 323", "IPC 324"], weight: 2, context: "physical violence" },
    hurt: { sections: ["IPC 319", "IPC 323", "IPC 324"], weight: 2, context: "physical violence" },
    injury: { sections: ["IPC 319", "IPC 323", "IPC 324"], weight: 2, context: "physical violence" },
    
    // Fraud and deception
    fraud: { sections: ["IPC 420", "IPC 415", "IPC 406"], weight: 3, context: "deception" },
    cheat: { sections: ["IPC 420", "IPC 415", "IPC 417"], weight: 3, context: "deception" },
    cheating: { sections: ["IPC 420", "IPC 415", "IPC 417"], weight: 3, context: "deception" },
    deceive: { sections: ["IPC 420", "IPC 415", "IPC 417"], weight: 3, context: "deception" },
    fake: { sections: ["IPC 463", "IPC 464", "IPC 465"], weight: 2, context: "forgery" },
    forgery: { sections: ["IPC 463", "IPC 464", "IPC 465"], weight: 3, context: "forgery" },
    
    // Property damage
    damage: { sections: ["IPC 425", "IPC 426", "IPC 427"], weight: 2, context: "property damage" },
    destroy: { sections: ["IPC 425", "IPC 426", "IPC 427"], weight: 2, context: "property damage" },
    vandalism: { sections: ["IPC 425", "IPC 426", "IPC 427"], weight: 2, context: "property damage" },
    
    // Sexual offenses
    rape: { sections: ["IPC 375", "IPC 376", "IPC 376A"], weight: 5, context: "sexual violence" },
    molest: { sections: ["IPC 354", "IPC 509"], weight: 4, context: "sexual harassment" },
    harassment: { sections: ["IPC 354", "IPC 509"], weight: 3, context: "sexual harassment" },
    
    // Kidnapping and abduction
    kidnap: { sections: ["IPC 359", "IPC 360", "IPC 363"], weight: 4, context: "abduction" },
    abduction: { sections: ["IPC 362", "IPC 363", "IPC 366"], weight: 4, context: "abduction" },
    
    // Threats and intimidation
    threat: { sections: ["IPC 503", "IPC 506", "IPC 507"], weight: 2, context: "intimidation" },
    threaten: { sections: ["IPC 503", "IPC 506", "IPC 507"], weight: 2, context: "intimidation" },
    intimidate: { sections: ["IPC 503", "IPC 506", "IPC 507"], weight: 2, context: "intimidation" },
    
    // Conspiracy and group crimes
    conspiracy: { sections: ["IPC 120A", "IPC 120B"], weight: 3, context: "group crime" },
    plan: { sections: ["IPC 120A", "IPC 120B"], weight: 2, context: "group crime" },
    together: { sections: ["IPC 34", "IPC 149"], weight: 2, context: "group crime" },
    group: { sections: ["IPC 34", "IPC 149"], weight: 2, context: "group crime" },
    
    // Traffic and negligence
    accident: { sections: ["IPC 304A", "IPC 279"], weight: 2, context: "negligence" },
    rash: { sections: ["IPC 304A", "IPC 279"], weight: 2, context: "negligence" },
    negligent: { sections: ["IPC 304A", "IPC 279"], weight: 2, context: "negligence" },
    driving: { sections: ["IPC 279", "IPC 304A"], weight: 2, context: "traffic" },
    
    // Dowry and domestic violence
    dowry: { sections: ["IPC 304B", "IPC 498A"], weight: 4, context: "domestic violence" },
    cruelty: { sections: ["IPC 498A", "IPC 323", "IPC 324"], weight: 3, context: "domestic violence" },
    domestic: { sections: ["IPC 498A", "IPC 323", "IPC 324"], weight: 3, context: "domestic violence" },
    
    // Defamation and reputation
    defame: { sections: ["IPC 499", "IPC 500", "IPC 501"], weight: 2, context: "reputation" },
    insult: { sections: ["IPC 504", "IPC 509"], weight: 2, context: "reputation" },
    abuse: { sections: ["IPC 504", "IPC 509"], weight: 2, context: "reputation" },
    
    // Extortion and coercion
    extort: { sections: ["IPC 383", "IPC 384", "IPC 385"], weight: 3, context: "coercion" },
    blackmail: { sections: ["IPC 383", "IPC 384", "IPC 385"], weight: 3, context: "coercion" },
    
    // Trespass and property invasion
    trespass: { sections: ["IPC 441", "IPC 447", "IPC 448"], weight: 2, context: "property invasion" },
    enter: { sections: ["IPC 441", "IPC 447", "IPC 448"], weight: 1, context: "property invasion" },
    unauthorized: { sections: ["IPC 441", "IPC 447", "IPC 448"], weight: 2, context: "property invasion" }
  }

  const lowerDescription = description.toLowerCase()
  const sectionScores = {}
  const contextMatches = {}

  // Analyze description for keywords and context
  Object.entries(keywordContexts).forEach(([keyword, data]) => {
    if (lowerDescription.includes(keyword)) {
      data.sections.forEach((section) => {
        // Calculate weighted score based on keyword importance and context
        const score = data.weight * (sectionScores[section] || 0 + 1)
        sectionScores[section] = score
        
        // Track context for better relevance scoring
        if (!contextMatches[section]) {
          contextMatches[section] = new Set()
        }
        contextMatches[section].add(data.context)
      })
    }
  })

  // Sort sections by score (most relevant first)
  const sortedSections = Object.entries(sectionScores)
    .sort((a, b) => b[1] - a[1])
    .map(([section]) => section)

  // Get the top 3-5 most relevant sections
  const topSections = sortedSections.slice(0, 5)

  // If no keywords matched, analyze the description for general patterns
  if (topSections.length === 0) {
    return analyzeGeneralPatterns(description)
  }

  // Create detailed results with dynamic confidence scoring
  const results = topSections.map((section, index) => {
    const sectionData = ipcSectionsDatabase[section]
    
    if (sectionData) {
      // Calculate confidence based on score, position, and context relevance
      const baseConfidence = Math.max(60, 95 - (index * 10))
      const contextBonus = contextMatches[section] ? Math.min(10, contextMatches[section].size * 3) : 0
      const finalConfidence = Math.min(100, baseConfidence + contextBonus)
      
      return {
        section: section,
        description: sectionData.description,
        confidence: finalConfidence,
        punishment: sectionData.punishment,
        relevance: generateRelevanceText(section, description, sectionData.relevance)
      }
    } else {
      // Fallback for sections not in our database
      return {
        section: section,
        description: `${section} of the Indian Penal Code`,
        confidence: Math.max(60, 85 - (index * 15)),
        punishment: "Punishment as prescribed by law for this offense.",
        relevance: "This section appears relevant based on the description provided."
      }
    }
  })

  return results
}

// Helper function to analyze general patterns when no specific keywords match
function analyzeGeneralPatterns(description: string) {
  const lowerDesc = description.toLowerCase()
  
  // Check for general crime indicators
  if (lowerDesc.includes("police") || lowerDesc.includes("complaint") || lowerDesc.includes("report")) {
    return [
      {
        section: "IPC 420",
        description: "Cheating and dishonestly inducing delivery of property",
        confidence: 70,
        punishment: "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
        relevance: "Based on the general nature of your complaint, this section may be applicable. Please consult a legal professional for specific advice."
      },
      {
        section: "IPC 406",
        description: "Punishment for criminal breach of trust",
        confidence: 65,
        punishment: "Imprisonment of either description for a term which may extend to three years, or with fine, or with both.",
        relevance: "This section covers various forms of criminal misconduct. Legal consultation is recommended for accurate assessment."
      }
    ]
  }
  
  // Default fallback with lower confidence
  return [
    {
      section: "IPC 420",
      description: "Cheating and dishonestly inducing delivery of property",
      confidence: 50,
      punishment: "Imprisonment of either description for a term which may extend to seven years, and shall also be liable to fine.",
      relevance: "This is a general section that may apply. For accurate legal advice, please consult with a qualified legal professional."
    }
  ]
}

// Helper function to generate more contextual relevance text
function generateRelevanceText(section: string, description: string, baseRelevance: string) {
  const lowerDesc = description.toLowerCase()
  
  // Add specific context based on the description
  if (lowerDesc.includes("money") || lowerDesc.includes("cash") || lowerDesc.includes("payment")) {
    return `${baseRelevance} The involvement of financial transactions or monetary value strengthens the applicability of this section.`
  }
  
  if (lowerDesc.includes("phone") || lowerDesc.includes("call") || lowerDesc.includes("message")) {
    return `${baseRelevance} The use of communication devices or digital means may be relevant to the circumstances described.`
  }
  
  if (lowerDesc.includes("family") || lowerDesc.includes("spouse") || lowerDesc.includes("marriage")) {
    return `${baseRelevance} The domestic or familial context of the incident may affect the severity and applicability of this section.`
  }
  
  if (lowerDesc.includes("work") || lowerDesc.includes("office") || lowerDesc.includes("business")) {
    return `${baseRelevance} The professional or workplace context may be relevant to understanding the circumstances.`
  }
  
  return baseRelevance
}

export async function POST(request: Request) {
  try {
    const { description } = await request.json()

    if (!description) {
      return NextResponse.json({ error: "Description is required" }, { status: 400 })
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Get predictions based on the description
    const predictions = predictIPCSections(description)

    return NextResponse.json({ predictions })
  } catch (error) {
    console.error("Prediction error:", error)
    return NextResponse.json({ error: "Failed to process prediction" }, { status: 500 })
  }
}

