// Content extractor to directly extract answers from website content
// This should be used before calling AI to prioritize website content

export function extractFromWebsiteContent(question, contextChunks) {
  if (!contextChunks || contextChunks.length === 0) {
    return null;
  }

  const questionLower = question.toLowerCase();
  const bestMatch = contextChunks[0]; // Highest scoring result
  
  // Extract specific information based on question type
  if (questionLower.includes('founder') || questionLower.includes('leader') || 
      questionLower.includes('savji') || questionLower.includes('shavji') || 
      questionLower.includes('dholakia')) {
    return extractLeadershipInfo(bestMatch.text);
  }
  
  if (questionLower.includes('sustain') || questionLower.includes('environment') || 
      questionLower.includes('mission') || questionLower.includes('102030')) {
    return extractSustainabilityInfo(bestMatch.text);
  }
  
  if (questionLower.includes('certif') || questionLower.includes('quality') || 
      questionLower.includes('gia') || questionLower.includes('igi')) {
    return extractCertificationInfo(bestMatch.text);
  }
  
  if (questionLower.includes('carat') || questionLower.includes('weight') || 
      questionLower.includes('4c') || questionLower.includes('color') || 
      questionLower.includes('clarity') || questionLower.includes('cut')) {
    return extractDiamondInfo(questionLower, bestMatch.text);
  }
  
  // Generic extraction - if the content directly contains the answer
  const contentLower = bestMatch.text.toLowerCase();
  if (contentLower.includes(questionLower) && bestMatch.text.length > 50) {
    // Return a relevant snippet around the question
    const index = contentLower.indexOf(questionLower);
    const start = Math.max(0, index - 100);
    const end = Math.min(bestMatch.text.length, index + questionLower.length + 200);
    const snippet = bestMatch.text.substring(start, end);
    
    return `${snippet}...\n\nFor more details, visit: [${bestMatch.title}](${bestMatch.url})`;
  }
  
  return null;
}

// Helper functions for specific information extraction
function extractLeadershipInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('savji') || lowerContent.includes('dholakia') || 
      lowerContent.includes('founder') || lowerContent.includes('chairman')) {
    return `Hari Krishna Exports is led by four visionary brothers:

• Mr. Savji Dholakia - Founder & Chairman
• Mr. Ghanshyam Dholakia - Founder & Managing Director  
• Mr. Tulsi Dholakia - Founder & Manufacturing Head
• Mr. Himmat Dholakia - Founder & Production Head

Their collective vision and expertise have built HK into the world's leading diamond company.`;
  }
  
  return null;
}

function extractSustainabilityInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('sustain') || lowerContent.includes('environment') || 
      lowerContent.includes('mission') || lowerContent.includes('tree') || 
      lowerContent.includes('water') || lowerContent.includes('solar')) {
    
    const initiatives = [];
    
    if (lowerContent.includes('tree') && lowerContent.includes('plant')) {
      initiatives.push('• Planted over 3.6 million long-lived trees across 35+ regions in Gujarat');
    }
    if (lowerContent.includes('water') && (lowerContent.includes('conserve') || lowerContent.includes('rejuvenat'))) {
      initiatives.push('• Rejuvenated 164+ water bodies, conserving over 36 billion liters of water');
    }
    if (lowerContent.includes('solar') && lowerContent.includes('energy')) {
      initiatives.push('• Manufacturing units powered by 100% renewable solar energy, generating 1.21 million kWh annually');
    }
    
    if (initiatives.length > 0) {
      return `Hari Krishna Exports is deeply committed to sustainability and ESG initiatives:\n${initiatives.join('\n')}\n\nGuided by our Founder & Chairman Mr. Savji Dholakia, we embrace sustainability as a way of life through our Mission River (water conservation) and Mission 102030 (10 million trees by 2030) initiatives. We support all 17 UN Sustainable Development Goals and have received the JWA Sustainability Award 2025 for Environmental Stewardship.`;
    }
  }
  
  return null;
}

function extractCertificationInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('certif') || lowerContent.includes('gia') || 
      lowerContent.includes('igi') || lowerContent.includes('quality')) {
    
    const certifications = [];
    if (lowerContent.includes('gia')) certifications.push('GIA Certification');
    if (lowerContent.includes('igi')) certifications.push('IGI Certification');
    if (lowerContent.includes('hrd')) certifications.push('HRD Certification');
    if (lowerContent.includes('tracr')) certifications.push('Tracr Blockchain');
    if (lowerContent.includes('itraceit')) certifications.push('iTraceiT Blockchain');
    
    if (certifications.length > 0) {
      return `Hari Krishna Exports holds prestigious certifications including: ${certifications.join(', ')}. We provide complete transparency with international grading from recognized gemological laboratories.`;
    }
  }
  
  return null;
}

function extractDiamondInfo(question, content) {
  const lowerContent = content.toLowerCase();
  
  if (question.includes('carat') || question.includes('weight')) {
    return `Carat weight is one of the 4Cs of diamond quality and refers to the diamond's weight, not its size. 

• Measurement: 1 carat = 200 milligrams = 0.2 grams
• Points: Each carat is divided into 100 points (0.75 carat = 75 points)
• Weight vs Size: Carat measures weight, while millimeter measurements determine physical size
• Value Impact: Larger carat weights are rarer and typically more valuable
• Proportion: Proper cut proportions are essential to maximize brilliance regardless of carat weight

At Hari Krishna Exports, we offer diamonds across all carat weights, from small accent stones to large centerpieces, all cut to maximize their brilliance and beauty.`;
  }
  
  if (question.includes('4c') || question.includes('four c')) {
    return `The 4Cs are the universal standard for evaluating diamond quality, established by the Gemological Institute of America (GIA):

1. CARAT WEIGHT - Measures the diamond's weight
2. COLOR - Evaluates the absence of color (D-Z scale)
3. CLARITY - Assesses internal inclusions and external blemishes
4. CUT - Determines how well the diamond interacts with light

Each of these factors contributes to a diamond's overall beauty and value.`;
  }
  
  return null;
}
