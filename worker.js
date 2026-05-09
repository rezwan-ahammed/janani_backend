export default {
  async fetch(request, env) {
    const ALLOWED_ORIGIN = "*"; 
    const corsHeaders = {
      "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    };

    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: corsHeaders });

    try {
      const body = await request.json();
      const { prompt } = body;

      // 🔴 এখানে আপনার দেওয়া সঠিক মডেলের নামটি বসানো হয়েছে 🔴
      const response = await env.AI.run(
        'anthropic/claude-haiku-4.5', 
        {
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 1024,
        },
        { gateway: { id: 'default' } }
      );

      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Server Error", details: error.message }), { 
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } 
      });
    }
  }
};
