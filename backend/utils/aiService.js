const axios = require('axios');

/**
 * Generate itinerary via Groq API
 * This service calls the Groq Chat Completions endpoint using Llama3-8b.
 * It enforces a strict, budget-based, destination-specific JSON schema.
 */
const generateItinerary = async (params) => {
  const {
    destination,
    numberOfDays,
    budget,
    budgetCateg,
    travelType,
    interests,
    startDate,
    endDate
  } = params;

  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey || apiKey.includes('gsk_your_default_groq_api_key_placeholder') || apiKey.trim() === '') {
    throw new Error('GROQ_API_KEY is not configured in the backend .env file. Please add a valid Groq API Key to start generating itineraries.');
  }

  // Set detailed budget tier directives for the AI
  let budgetDirectives = '';
  if (budgetCateg === 'Low') {
    budgetDirectives = `
      - Lodging: Suggest actual budget accommodations, hostels, or low-cost guesthouses located in ${destination} (e.g. popular budget hosteling districts).
      - Transportation: Recommend public transportation options specific to ${destination} (e.g. Metro lines, public buses, rail cards, or walking routes) with actual transit network names.
      - Food: Recommend budget street food markets, local bakeries, or cheap-eat districts in ${destination} (e.g., specific food lanes or student areas).
      - Activities: Recommend free or very low-cost specific attractions, parks, and sights (e.g., free museum days, public viewpoints, and free walking tours).
      - Estimated Expenses: Keep the daily costs minimal and well within the budget limit.
    `;
  } else if (budgetCateg === 'Medium') {
    budgetDirectives = `
      - Lodging: Suggest real, moderately-priced 3-star hotels or highly-rated guest houses in central neighborhoods of ${destination}.
      - Transportation: Recommend standard local transit networks combined with occasional ride-hailing services or taxis.
      - Food: Suggest popular local cafes, mid-range bistros, and authentic family restaurants in ${destination} (specify real names or districts).
      - Activities: Recommend standard paid attractions (e.g., museum general tickets, city passes, specific sightseeing cruises) with actual names.
      - Estimated Expenses: Balance the cost allocations realistically.
    `;
  } else { // Luxury
    budgetDirectives = `
      - Lodging: Suggest real luxury 5-star hotels, premium boutique hotels, or luxury resorts in the best districts of ${destination}.
      - Transportation: Recommend private drivers, luxury car rentals, or private airport transfers.
      - Food: Suggest fine dining, Michelin-starred restaurants, famous chefs, and gourmet food tasting events in ${destination} (specify real names).
      - Activities: Recommend private tours, exclusive skip-the-line VIP tickets, private yacht charters, or private tastings with actual names.
      - Estimated Expenses: Provide premium activity suggestions.
    `;
  }

  const prompt = `
    You are an expert AI Travel Planner. Generate a detailed, professional, and personalized travel itinerary based on these details:
    - Destination: ${destination}
    - Duration: ${numberOfDays} Days (from ${startDate} to ${endDate})
    - Total Budget Limit: $${budget}
    - Budget Category: ${budgetCateg} (Enforce strict cost-matching for this budget tier!)
    - Travel Group Type: ${travelType}
    - Traveler Interests: ${interests.join(', ')}

    Strict Rules for Generation:
    1. NEVER use generic placeholder-style text like "local landmarks", "standard museums", "scenic spots", "cozy local bistro", or "popular diner".
    2. ALWAYS use real, destination-specific places, attractions, neighborhoods, streets, and transit options.
    3. If the destination is Paris, you must suggest actual locations like the Eiffel Tower, the Louvre Museum, Montmartre, Seine River Cruise, Notre-Dame Cathedral, Luxembourg Gardens, etc.
    4. For food recommendations, suggest actual restaurants/cafes by name, or famous dining areas/streets (e.g., Latin Quarter, Rue Cler, Montmartre) instead of using fake names.
    5. Each day must include a specific Morning activity, Afternoon activity, and Evening activity with actual place names.
    6. Include a realistic budget breakdown (Stay, Food, Transport, Activities) that sums up to the estimated total cost.

    Ensure your reply is a valid, raw JSON object (and nothing else). Do not wrap the JSON in Markdown backticks (\`\`\`json ... \`\`\`). The JSON must adhere strictly to this schema:
    {
      "destination": "${destination}",
      "numberOfDays": ${numberOfDays},
      "budgetCateg": "${budgetCateg}",
      "totalTripBudget": ${budget},
      "estimatedTotalCost": <number, sum of stay, food, transport, activities. Must be close to or slightly below budget if possible>,
      "budgetBreakdown": {
        "stay": <number, total estimated stay expense>,
        "food": <number, total estimated food expense>,
        "transport": <number, total estimated transportation expense>,
        "activities": <number, total estimated activities expense>
      },
      "days": [
        {
          "day": 1,
          "title": "Specific Day Theme (e.g., Historic Wonders of Montmartre)",
          "morning": {
            "activity": "Morning visit to [Specific Real Place Name] (e.g., Louvre Museum)",
            "details": "Details about morning plans, transit instructions, and booking details"
          },
          "afternoon": {
            "activity": "Afternoon walk at [Specific Real Area Name] (e.g., Tuileries Gardens)",
            "details": "Details about afternoon plans, routes, or what to see"
          },
          "evening": {
            "activity": "Evening dinner at [Specific Real Restaurant or dining street] (e.g., Le Procope)",
            "details": "Details about evening dining, sunset views, or nearby nightlife"
          },
          "placesToVisit": ["Specific Real Place 1", "Specific Real Place 2"],
          "foodRecommendations": ["Specific Real Restaurant/Cafe Name 1 or specific dining area", "Specific Real Restaurant/Cafe Name 2"],
          "estimatedDailyExpense": <number, estimated total expense for this day>
        }
      ],
      "costSuggestions": [
        "Specifically suggest how the traveler can save money on this trip based on the destination (e.g. buy a Paris Museum Pass)",
        "Another specific cost saving tip for this location"
      ],
      "travelTips": [
        "Helpful travel tip for this destination (e.g. validate Metro tickets immediately)",
        "Safety, local customs, or packing tip for this location"
      ]
    }
  `;

  try {
    const response = await axios.post(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        model: 'qwen/qwen3.8-27b',
        messages: [
          {
            role: 'system',
            content: 'You are a professional travel agency API. You only respond with raw, valid JSON. No conversational text, no markdown wrappers, no introductory or trailing text.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' }
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        timeout: 25000 // 25s timeout for API
      }
    );

    const content = response.data.choices[0].message.content.trim();
    const parsedItinerary = JSON.parse(content);
    return parsedItinerary;

  } catch (error) {
    console.error('Error generating itinerary from Groq API:', error.message);
    if (error.response) {
      console.error('Groq Response Data:', error.response.data);
    }
    
    // Throw error directly instead of falling back to fake generic templates
    let displayMessage = error.message;
    if (error.response?.data?.error?.message) {
      displayMessage = error.response.data.error.message;
    }
    throw new Error(`AI generation failed: ${displayMessage}`);
  }
};

module.exports = {
  generateItinerary
};
