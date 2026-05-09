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

      // 🔴 আপনার নির্বাচিত Google Gemma মডেল 🔴
      const response = await env.AI.run(
        '@cf/google/gemma-4-26b-a4b-it', 
        {
          messages: [{ role: 'user', content: prompt }]
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
