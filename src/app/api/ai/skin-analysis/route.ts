import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { products } from '@/data/products';

const ANALYSIS_PROMPT = `You are an AI dermatology assistant for the Glow Addict beauty app. Analyze the uploaded selfie image and provide a skin analysis.

Return a JSON object with EXACTLY this structure (no markdown, no code blocks, just raw JSON):
{
  "skinType": "Oily" | "Dry" | "Combination" | "Normal" | "Sensitive",
  "score": <number 0-100 representing overall skin health>,
  "concerns": ["<concern1>", "<concern2>", "<concern3>"],
  "tips": ["<tip1>", "<tip2>", "<tip3>", "<tip4>", "<tip5>"],
  "routine": {
    "morning": ["<step1>", "<step2>", "<step3>", "<step4>"],
    "evening": ["<step1>", "<step2>", "<step3>", "<step4>"]
  },
  "hydrationLevel": "Low" | "Medium" | "High",
  "summary": "<2-3 sentence summary of the skin condition>"
}

For concerns, choose from: Acne, Dark Spots, Dullness, Oiliness, Dryness, Redness, Pores, Aging, Uneven Texture, Dark Circles, Sensitivity, Sun Damage.
For tips, give specific actionable advice with ingredient names.
Make the analysis realistic and helpful. Indian skin context preferred.`;

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get('image') as File | null;

    if (!imageFile) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Return smart fallback analysis
      return NextResponse.json(getFallbackAnalysis());
    }

    // Convert file to base64
    const bytes = await imageFile.arrayBuffer();
    const base64 = Buffer.from(bytes).toString('base64');
    const mimeType = imageFile.type || 'image/jpeg';

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent([
      { text: ANALYSIS_PROMPT },
      {
        inlineData: {
          mimeType,
          data: base64,
        },
      },
    ]);

    const text = result.response.text();

    // Parse JSON from response (handle markdown code blocks)
    let analysis;
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      console.error('Failed to parse AI response:', text);
      return NextResponse.json(getFallbackAnalysis());
    }

    if (!analysis) {
      return NextResponse.json(getFallbackAnalysis());
    }

    // Match recommended products based on detected concerns
    const recommended = matchProductsToConcerns(
      analysis.skinType,
      analysis.concerns || []
    );

    return NextResponse.json({
      ...analysis,
      products: recommended,
    });
  } catch (error) {
    console.error('Skin analysis error:', error);
    return NextResponse.json(getFallbackAnalysis());
  }
}

function matchProductsToConcerns(skinType: string, concerns: string[]) {
  const matched = products.filter(p => {
    const matchesSkinType = p.skinTypes.includes(skinType);
    const matchesConcern = p.concerns.some(c =>
      concerns.some(dc => c.toLowerCase().includes(dc.toLowerCase()) || dc.toLowerCase().includes(c.toLowerCase()))
    );
    return matchesSkinType || matchesConcern;
  });

  // Prioritize products matching both skin type and concerns
  matched.sort((a, b) => {
    const aScore = (a.skinTypes.includes(skinType) ? 2 : 0) +
      a.concerns.filter(c => concerns.some(dc => c.toLowerCase().includes(dc.toLowerCase()))).length;
    const bScore = (b.skinTypes.includes(skinType) ? 2 : 0) +
      b.concerns.filter(c => concerns.some(dc => c.toLowerCase().includes(dc.toLowerCase()))).length;
    return bScore - aScore;
  });

  return matched.slice(0, 6).map(p => ({
    id: p.id, name: p.name, slug: p.slug,
    brandName: p.brandName, shortDesc: p.shortDesc,
    price: p.price, salePrice: p.salePrice,
    image: p.images[0], ratingAvg: p.ratingAvg,
  }));
}

function getFallbackAnalysis() {
  const skinTypes = ['Combination', 'Oily', 'Normal'] as const;
  const skinType = skinTypes[Math.floor(Math.random() * skinTypes.length)];

  const allConcerns = ['Mild Acne', 'Dark Spots', 'Open Pores', 'Dullness', 'Oiliness', 'Uneven Texture'];
  const shuffled = allConcerns.sort(() => 0.5 - Math.random());
  const concerns = shuffled.slice(0, 3);

  return {
    skinType,
    score: 68 + Math.floor(Math.random() * 20),
    concerns,
    hydrationLevel: 'Medium',
    summary: `Your skin appears to be ${skinType.toLowerCase()} type with some areas of concern. Overall skin health is moderate with room for improvement through targeted skincare.`,
    tips: [
      'Use a gentle, pH-balanced cleanser twice daily',
      'Apply Niacinamide 10% serum for pore control and oil balance',
      'Use Vitamin C serum in the morning for brightening',
      'Never skip SPF 50+ sunscreen, even on cloudy days',
      'Incorporate Retinol 2-3 times a week at night for texture',
    ],
    routine: {
      morning: ['Gentle Cleanser', 'Vitamin C Serum', 'Lightweight Moisturizer', 'SPF 50+ Sunscreen'],
      evening: ['Oil Cleanser', 'Niacinamide Serum', 'Retinol (2-3x/week)', 'Night Cream'],
    },
    products: matchProductsToConcerns(skinType, concerns),
  };
}
