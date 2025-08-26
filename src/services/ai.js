import OpenAI from 'openai';
import { config } from '../config.js';

const openai = new OpenAI({ apiKey: config.openaiKey });

const SYSTEM_PROMPT = `You are the official AI assistant for Hari Krishna Exports (HK.co) - World's Leading Diamond Company.

COMPANY PROFILE:
- Founded: 1992 by Mr. Savji Dholakia
- Headquarters: Surat, India
- Specialization: Diamond manufacturing and exports
- Scale: One of the largest diamond companies globally with presence in 107+ countries
- Employees: 8000+ skilled professionals
- Manufacturing: World's largest diamond manufacturing unit in Surat

KEY AREAS OF EXPERTISE:
- Natural Diamond Manufacturing and Export
- Diamond Jewellery Crafting
- Sustainability and ESG Initiatives
- Ethical Sourcing and Certifications
- Global Diamond Distribution

CORE VALUES: Trust, Quality, Innovation, Sustainability, Togetherness

IMPORTANT RULES:
1. PROVIDE COMPREHENSIVE ANSWERS using the provided context from HK.co website
2. Include specific details, numbers, and achievements when available
3. For sustainability questions, mention specific initiatives like tree plantation, water conservation, solar energy
4. For leadership questions, provide details about all four founders and their roles
5. For certification questions, list all major certifications (GIA, IGI, HRD, Tracr, iTraceiT)
6. For journey/diamond process questions, explain the 9-step diamond journey
7. Always maintain factual accuracy and professional tone
8. Include relevant URLs when referencing specific pages
9. If information is incomplete, guide users to appropriate website sections

RESPONSE GUIDELINES:
- Provide detailed, informative responses with specific data
- Use proper diamond industry terminology
- Maintain a helpful and professional premium brand voice
- Include numerical data and specific achievements when available
- For complex topics, break information into clear sections
- Always represent HK's commitment to quality, ethics, and sustainability`;

export async function answerWithContext({ question, contextChunks }) {
  try {
    const context = contextChunks.map((c, i) => `# Source ${i + 1} (${(c.title || '').slice(0, 60)}): ${c.url}\n${c.text}`).join('\n\n');

    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      { role: 'user', content: `Context:\n${context}\n\nQuestion: ${question}` }
    ];

    const completion = await openai.chat.completions.create({
      model: config.model,
      messages,
      temperature: 0.2,
      max_tokens: 600
    });

    return completion.choices[0]?.message?.content?.trim() || "I couldn't find company-specific info for that.";
  } catch (error) {
    console.log('OpenAI API failed, providing enhanced fallback response:', error.message);
    console.log('Question:', question);
    console.log('Context chunks count:', contextChunks.length);
    
    // Enhanced fallback: Extract specific information from context
    if (contextChunks.length > 0) {
      const bestMatch = contextChunks[0]; // Highest scoring result
      console.log('Best match URL:', bestMatch.url);
      console.log('Best match title:', bestMatch.title);
      
      const content = bestMatch.text || '';
      const url = bestMatch.url || 'https://www.hk.co';
      const title = bestMatch.title || 'HK.co Website';
      
      // Extract specific information based on common queries
      if (question.toLowerCase().includes('sustain') || question.toLowerCase().includes('environment')) {
        console.log('Sustainability query detected');
        const sustainInfo = extractSustainabilityInfo(content);
        if (sustainInfo) {
          console.log('Sustainability info extracted successfully');
          return `${sustainInfo}\n\nFor more details, visit our sustainability page: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('leader') || question.toLowerCase().includes('founder')) {
        console.log('Leadership query detected');
        const leaderInfo = extractLeadershipInfo(content);
        if (leaderInfo) {
          console.log('Leadership info extracted successfully');
          return `${leaderInfo}\n\nLearn more about our leadership: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('certif') || question.toLowerCase().includes('quality')) {
        console.log('Certification query detected');
        const certInfo = extractCertificationInfo(content);
        if (certInfo) {
          console.log('Certification info extracted successfully');
          return `${certInfo}\n\nSee our certifications: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('mission') || question.toLowerCase().includes('102030')) {
        console.log('Mission 102030 query detected');
        const missionInfo = extractMissionInfo(content);
        if (missionInfo) {
          console.log('Mission info extracted successfully');
          return `${missionInfo}\n\nLearn more about our initiatives: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('solar') || question.toLowerCase().includes('energy')) {
        console.log('Solar energy query detected');
        const solarInfo = extractSolarEnergyInfo(content);
        if (solarInfo) {
          console.log('Solar energy info extracted successfully');
          return `${solarInfo}\n\nLearn more about our sustainability: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('water') || question.toLowerCase().includes('conserve')) {
        console.log('Water conservation query detected');
        const waterInfo = extractWaterConservationInfo(content);
        if (waterInfo) {
          console.log('Water conservation info extracted successfully');
          return `${waterInfo}\n\nLearn more about our water initiatives: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('carat') || question.toLowerCase().includes('weight')) {
        console.log('Carat weight query detected');
        const caratInfo = extractCaratInfo(content);
        if (caratInfo) {
          console.log('Carat info extracted successfully');
          return `${caratInfo}\n\nLearn more about diamond quality: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('color') || question.toLowerCase().includes('grading')) {
        console.log('Color grading query detected');
        const colorInfo = extractColorGradingInfo(content);
        if (colorInfo) {
          console.log('Color grading info extracted successfully');
          return `${colorInfo}\n\nLearn more about diamond grading: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('4c') || question.toLowerCase().includes('four c')) {
        console.log('4Cs query detected');
        const fourCsInfo = extractFourCsInfo(content);
        if (fourCsInfo) {
          console.log('4Cs info extracted successfully');
          return `${fourCsInfo}\n\nLearn more about diamond quality: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('cut') && question.toLowerCase().includes('quality')) {
        console.log('Cut quality query detected');
        const cutInfo = extractCutQualityInfo(content);
        if (cutInfo) {
          console.log('Cut quality info extracted successfully');
          return `${cutInfo}\n\nLearn more about diamond cutting: [${title}](${url})`;
        }
      }
      else if (question.toLowerCase().includes('clarity')) {
        console.log('Clarity query detected');
        const clarityInfo = extractClarityInfo(content);
        if (clarityInfo) {
          console.log('Clarity info extracted successfully');
          return `${clarityInfo}\n\nLearn more about diamond clarity: [${title}](${url})`;
        }
      }
      
      // Generic fallback with context preview
      console.log('Using generic fallback');
      const preview = content.substring(0, 200) + (content.length > 200 ? '...' : '');
      return `Based on our ${title}: ${preview}\n\nFor complete information, visit: [${title}](${url})`;
    }
    
    console.log('No context chunks available');
    return "I can only provide information available on our official HK.co website. Please visit https://www.hk.co for more details.";
  }
}

// Helper functions to extract specific information
function extractSustainabilityInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('sustain') || lowerContent.includes('environment') || lowerContent.includes('esg')) {
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
  
  return "Hari Krishna Exports is committed to comprehensive sustainability across environmental, social, and governance (ESG) initiatives. Our key achievements include planting 3.6+ million trees, rejuvenating 164+ water bodies conserving 36+ billion liters, and running our manufacturing on 100% solar energy. We support all 17 UN Sustainable Development Goals and have received the JWA Sustainability Award 2025.";
}

function extractLeadershipInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('savji') || lowerContent.includes('dholakia') || lowerContent.includes('founder') || lowerContent.includes('chairman')) {
    return `Hari Krishna Exports is led by four visionary brothers:

• Mr. Savji Dholakia - Founder & Chairman
• Mr. Ghanshyam Dholakia - Founder & Managing Director  
• Mr. Tulsi Dholakia - Founder & Manufacturing Head
• Mr. Himmat Dholakia - Founder & Production Head

Their collective vision and expertise have built HK into the world's leading diamond company.`;
  }
  
  return null;
}

function extractCertificationInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('certif') || lowerContent.includes('gia') || lowerContent.includes('igi')) {
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

function extractMissionInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('mission') || lowerContent.includes('102030') || lowerContent.includes('tree plantation')) {
    return `Hari Krishna Exports leads comprehensive environmental initiatives including Mission 102030 (planting 10 million trees by 2030), Mission River (water conservation rejuvenating 164+ water bodies), and operating on 100% solar energy. We are committed to achieving net-zero emissions by 2050 and supporting all 17 UN Sustainable Development Goals.`;
  }
  
  return null;
}

function extractSolarEnergyInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('solar') || lowerContent.includes('energy') || lowerContent.includes('renewable')) {
    return "Hari Krishna Exports operates its manufacturing facilities on 100% renewable solar energy, generating 1.21 million kWh annually. This commitment to clean energy is part of our comprehensive sustainability strategy that includes tree plantation, water conservation, and achieving net-zero emissions by 2050.";
  }
  
  return null;
}

function extractWaterConservationInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('water') || lowerContent.includes('conserve') || lowerContent.includes('rejuvenat')) {
    return "Through our Mission River initiative, Hari Krishna Exports has rejuvenated 164+ water bodies and conserved over 36 billion liters of water. Our water conservation efforts are part of a comprehensive sustainability strategy that includes solar energy, tree plantation, and commitment to net-zero emissions by 2050.";
  }
  
  return null;
}

// Diamond-related extraction functions
function extractCaratInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('carat') || lowerContent.includes('weight') || lowerContent.includes('4c')) {
    return `Carat weight is one of the 4Cs of diamond quality and refers to the diamond's weight, not its size. 

• Measurement: 1 carat = 200 milligrams = 0.2 grams
• Points: Each carat is divided into 100 points (0.75 carat = 75 points)
• Weight vs Size: Carat measures weight, while millimeter measurements determine physical size
• Value Impact: Larger carat weights are rarer and typically more valuable
• Proportion: Proper cut proportions are essential to maximize brilliance regardless of carat weight

At Hari Krishna Exports, we offer diamonds across all carat weights, from small accent stones to large centerpieces, all cut to maximize their brilliance and beauty.`;
  }
  
  return null;
}

function extractColorGradingInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('color') || lowerContent.includes('grading') || lowerContent.includes('4c')) {
    return `Diamond color grading evaluates the absence of color in a diamond, with the most valuable diamonds having little to no color.

• Color Scale: Graded from D (colorless) to Z (light yellow or brown)
• D-F: Colorless range - most rare and valuable
• G-J: Near colorless - excellent value with minimal color detection
• K-M: Faint color - noticeable color to trained eye
• N-Z: Very light to light color - more affordable options

• Importance: Color affects diamond's brilliance and value
• Certification: All Hari Krishna Exports diamonds come with international grading reports from recognized laboratories like GIA and IGI
• Selection: We offer diamonds across the full color spectrum to meet various preferences and budgets`;
  }
  
  return null;
}

function extractFourCsInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('4c') || lowerContent.includes('four c') || lowerContent.includes('quality')) {
    return `The 4Cs are the universal standard for evaluating diamond quality, established by the Gemological Institute of America (GIA):

1. CARAT WEIGHT
   • Measures the diamond's weight (1 carat = 200mg)
   • Larger carats are rarer and typically more valuable
   • Proper proportions maximize brilliance regardless of size

2. COLOR
   • Graded from D (colorless) to Z (light color)
   • D-F: Colorless (most rare and valuable)
   • G-J: Near colorless (excellent value)
   • The less color, the higher the grade

3. CLARITY
   • Measures internal inclusions and external blemishes
   • FL-IF: Flawless to Internally Flawless
   • VVS1-VVS2: Very Very Slightly Included
   • VS1-VS2: Very Slightly Included
   • SI1-SI2: Slightly Included
   • I1-I3: Included

4. CUT
   • Most important factor for brilliance and sparkle
   • Includes proportions, symmetry, and polish
   • Grades: Excellent, Very Good, Good, Fair, Poor
   • Excellent cut maximizes light performance

At Hari Krishna Exports, we provide complete transparency with international grading certificates for all our diamonds, ensuring you know exactly what you're purchasing.`;
  }
  
  return null;
}

function extractCutQualityInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('cut') || lowerContent.includes('brilliance') || lowerContent.includes('sparkle')) {
    return `Cut quality is the most important of the 4Cs as it determines a diamond's brilliance, fire, and scintillation.

• What Cut Measures: How well a diamond's facets interact with light
• Proportions: The angles and relative measurements of the diamond
• Symmetry: The precision of facet alignment and shape
• Polish: The smoothness of the diamond's surface

• Cut Grades:
  - Excellent: Maximum brilliance and fire
  - Very Good: High level of light performance
  - Good: Good sparkle with some light leakage
  - Fair: Moderate brilliance, more affordable
  - Poor: Significant light leakage, less sparkle

• Impact on Beauty: A well-cut diamond appears larger and more brilliant than a poorly cut diamond of the same carat weight
• Hari Krishna Standards: We specialize in Excellent and Very Good cut diamonds to ensure maximum beauty and value`;
  }
  
  return null;
}

function extractClarityInfo(content) {
  const lowerContent = content.toLowerCase();
  
  if (lowerContent.includes('clarity') || lowerContent.includes('inclusion') || lowerContent.includes('blemish')) {
    return `Diamond clarity refers to the absence of internal inclusions and external blemishes.

• Clarity Characteristics:
  - Inclusions: Internal features (crystals, clouds, feathers)
  - Blemishes: External features (scratches, nicks, pits)
  - The fewer and less visible these features, the higher the clarity grade

• Clarity Grades:
  - FL/IF: Flawless/Internally Flawless (no inclusions visible under 10x magnification)
  - VVS1/VVS2: Very Very Slightly Included (extremely difficult to see under 10x)
  - VS1/VS2: Very Slightly Included (difficult to see under 10x)
  - SI1/SI2: Slightly Included (visible under 10x, may be eye-visible)
  - I1/I2/I3: Included (eye-visible inclusions)

• Importance: Clarity affects diamond's purity and value
• Visibility: Most inclusions in VS clarity and above are not visible to the naked eye
• Value: SI clarity diamonds offer excellent value as inclusions are typically not visible without magnification

Hari Krishna Exports provides diamonds across all clarity grades with complete certification transparency.`;
  }
  
  return null;
}
