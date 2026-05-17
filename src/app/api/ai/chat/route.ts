import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { products } from '@/data/products';
import { withRetry } from '@/utils/retry';

const SYSTEM_PROMPT = `You are "Glow", the AI Beauty Assistant for Glow Addict by Sayanita — India's smartest beauty platform.

Your personality:
- Warm, friendly, Gen-Z energy (use emojis naturally, not excessively)
- Expert in skincare science, makeup artistry, and beauty ingredients
- Speaks like a knowledgeable best friend who happens to be a dermatologist
- Uses Indian context (skin tones, climate, budget ranges in INR)

Rules:
- Give concise, actionable advice (3-5 key points max)
- When recommending products, describe what to look for (ingredients, type) rather than specific brand names
- Include a short "Pro Tip" at the end when relevant
- If asked about medical conditions, suggest consulting a dermatologist
- Format with bullet points and bold text using **word** syntax
- Keep responses under 200 words

Available product catalog for reference (match recommendations when relevant):
${products.slice(0, 12).map(p => `- ${p.name} (${p.brandName}) — ${p.shortDesc} — ₹${p.salePrice || p.price} — Tags: ${p.tags.join(', ')}`).join('\n')}
`;

export async function POST(req: NextRequest) {
  try {
    const { messages, message } = await req.json();

    const apiKey = process.env.NVIDIA_API_KEY;
    if (!apiKey) {
      // Fallback to smart mock response
      return NextResponse.json(getFallbackResponse(message));
    }

    const client = new OpenAI({
      baseURL: 'https://integrate.api.nvidia.com/v1',
      apiKey,
    });

    // Build conversation history
    const chatHistory: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add previous messages for context
    if (messages && Array.isArray(messages)) {
      for (const m of messages) {
        chatHistory.push({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content,
        });
      }
    }

    // Add current message
    chatHistory.push({ role: 'user', content: message });

    const completion = await withRetry(() => 
      client.chat.completions.create({
        model: 'meta/llama-3.3-70b-instruct',
        messages: chatHistory,
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 800,
      }),
      {
        maxAttempts: 3,
        baseDelayMs: 1000,
        maxDelayMs: 5000,
        jitter: true,
        onRetry: (error, attempt) => {
          console.warn(`OpenAI API attempt ${attempt} failed:`, error);
        }
      }
    );

    const text = completion.choices[0]?.message?.content || '';

    // Match product recommendations from the response
    const recommendedProducts = matchProducts(text);

    return NextResponse.json({
      content: text,
      products: recommendedProducts,
    });
  } catch (error) {
    console.error('AI Chat error:', error);
    return NextResponse.json(
      getFallbackResponse('general'),
      { status: 200 }
    );
  }
}

function matchProducts(aiText: string): typeof products {
  const text = aiText.toLowerCase();
  const matched: typeof products = [];

  const keywordMap: Record<string, string[]> = {
    'vitamin c': ['vitamin-c', 'brightening'],
    'niacinamide': ['niacinamide', 'pore-control'],
    'retinol': ['retinol', 'anti-aging'],
    'sunscreen': ['sunscreen', 'spf'],
    'salicylic': ['salicylic-acid', 'acne'],
    'hyaluronic': ['hydration', 'moisturizer'],
    'cleanser': ['face-wash', 'cleanser'],
    'moisturiz': ['moisturizer', 'hydration'],
    'serum': ['serum'],
    'lipstick': ['lipstick'],
    'lip': ['lip-gloss', 'lipstick'],
    'mascara': ['mascara'],
    'foundation': ['foundation'],
    'highlighter': ['highlighter'],
    'eye cream': ['eye-cream'],
    'hair': ['hair-mask', 'hair-growth'],
    'body': ['body-butter'],
    'perfume': ['perfume'],
    'toner': ['toner', 'exfoliant'],
    'spf': ['sunscreen', 'spf'],
    'acne': ['acne', 'salicylic-acid'],
    'pore': ['pore-control', 'niacinamide'],
    'dark spot': ['brightening', 'vitamin-c'],
    'anti-aging': ['retinol', 'anti-aging'],
    'oil control': ['oil-control', 'niacinamide'],
    'exfoli': ['exfoliant', 'aha', 'bha'],
  };

  for (const [keyword, tags] of Object.entries(keywordMap)) {
    if (text.includes(keyword)) {
      const matches = products.filter(p =>
        p.tags.some((t: string) => tags.includes(t))
      );
      for (const m of matches) {
        if (!matched.find(x => x.id === m.id)) matched.push(m);
      }
    }
  }

  return matched.slice(0, 4);
}

function getFallbackResponse(query: string) {
  const q = (query || '').toLowerCase();

  if (q.includes('dark spot') || q.includes('brighten') || q.includes('pigment')) {
    return {
      content: '✨ For dark spots and pigmentation, I recommend:\n\n• **Vitamin C serum** (15-20%) in the morning for brightening\n• **Niacinamide** (10%) in the evening for tone correction\n• **AHA/BHA exfoliant** 2-3x/week for cell turnover\n• **SPF 50+** daily — non-negotiable!\n\n**Pro Tip:** Layer Vitamin C → Moisturizer → SPF for maximum brightness! ☀️',
      products: products.filter(p => p.concerns.includes('Dark Spots') || p.tags.includes('brightening')).slice(0, 3),
    };
  }
  if (q.includes('oily') || q.includes('acne')) {
    return {
      content: '🧴 For oily, acne-prone skin:\n\n• **Gentle cleanser** with Salicylic Acid (2%)\n• **Niacinamide serum** for oil control & pore minimizing\n• **Lightweight gel moisturizer** — never skip moisture!\n• **SPF 50+** non-comedogenic formula\n\n**Pro Tip:** Don\'t over-cleanse! Stripping oils makes skin produce MORE oil. 💡',
      products: products.filter(p => p.skinTypes.includes('Oily') || p.concerns.includes('Acne')).slice(0, 3),
    };
  }
  if (q.includes('routine') || q.includes('night')) {
    return {
      content: '🌙 Perfect nighttime skincare routine:\n\n**Step 1:** Double cleanse (oil/micellar → face wash)\n**Step 2:** Exfoliating toner (2-3x/week only)\n**Step 3:** Treatment serum (Retinol OR Niacinamide)\n**Step 4:** Eye cream for dark circles\n**Step 5:** Rich moisturizer to seal it all in\n\n**Pro Tip:** Wait 60 seconds between each step for better absorption! ⏰',
      products: products.filter(p => p.categoryName === 'Skincare').slice(0, 4),
    };
  }

  return {
    content: '💕 Great question! Here\'s what I\'d suggest:\n\n• Focus on **ingredients** over brands — look for proven actives\n• Build a **simple routine** first (cleanser → serum → moisturizer → SPF)\n• Always **patch test** new products for 24-48 hours\n• Stay **consistent** — most products take 4-6 weeks to show results\n\nWant me to help with a specific skin concern or routine? 🌟',
    products: products.filter(p => p.ratingAvg >= 4.5).slice(0, 3),
  };
}
